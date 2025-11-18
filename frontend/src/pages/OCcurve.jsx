import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getRecords, getOCCurveSingle, getOCCurveDouble } from "../services/api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, Home, BarChart3 } from "lucide-react";

export default function OCcurve() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [planFilter, setPlanFilter] = useState("All"); // "All", "Single", "Double"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const records = await getRecords();

        console.log("Total records fetched:", records.length);
        console.log("Sample record:", records[0]);

        // Extract unique sampling plans
        const singlePlans = new Map();
        const doublePlans = new Map();

        records.forEach(r => {
          if (r.planType === "Single") {
            // Check for sampleSize and acceptanceNumber in various possible field names
            const sampleSize = r.sampleSize || r.n || r.n1;
            const acceptanceNumber = r.acceptanceNumber !== undefined && r.acceptanceNumber !== null 
              ? r.acceptanceNumber 
              : (r.c !== undefined ? r.c : (r.c1 !== undefined ? r.c1 : null));
            
            if (sampleSize && acceptanceNumber !== null && acceptanceNumber !== undefined) {
              const key = `${sampleSize}-${acceptanceNumber}`;
              if (!singlePlans.has(key)) {
                singlePlans.set(key, {
                  sampleSize: Number(sampleSize),
                  acceptanceNumber: Number(acceptanceNumber)
                });
              }
            }
          } 
          else if (r.planType === "Double") {
            // For double sampling, check all required fields
            const n1 = r.n1;
            const c1 = r.c1;
            const r1 = r.r1;
            const n2 = r.n2;
            const c2 = r.c2;
            
            if (n1 && c1 !== undefined && c1 !== null && r1 !== undefined && r1 !== null && 
                n2 && c2 !== undefined && c2 !== null) {
              const key = `${n1}-${c1}-${r1}-${n2}-${c2}`;
              if (!doublePlans.has(key)) {
                doublePlans.set(key, {
                  n1: Number(n1),
                  c1: Number(c1),
                  r1: Number(r1),
                  n2: Number(n2),
                  c2: Number(c2)
                });
              }
            }
          }
        });

        console.log("Single plans found:", singlePlans.size);
        console.log("Double plans found:", doublePlans.size);

        // Check if we have any plans to process
        if (singlePlans.size === 0 && doublePlans.size === 0) {
          console.warn("No valid sampling plans found in records");
          setData([]);
          setLoading(false);
          return;
        }

        // Calculate OC curves for all unique plans
        const singleCurves = [];
        const doubleCurves = [];

        // Process all single sampling plans and average them if multiple
        if (singlePlans.size > 0) {
          try {
            const allSinglePoints = await Promise.all(
              Array.from(singlePlans.values()).map(async (plan) => {
                try {
                  return await getOCCurveSingle(plan);
                } catch (error) {
                  console.error("Error calculating single OC curve for plan:", plan, error);
                  return [];
                }
              })
            );

            // Combine all single curves into one average curve
            const validSinglePoints = allSinglePoints.filter(curve => curve && curve.length > 0);
            if (validSinglePoints.length > 0) {
              const maxLength = Math.max(...validSinglePoints.map(curve => curve.length));
              for (let i = 0; i < maxLength; i++) {
                let sumProb = 0;
                let count = 0;
                validSinglePoints.forEach(curve => {
                  if (curve[i]) {
                    sumProb += curve[i].probAccept;
                    count++;
                  }
                });
                if (count > 0) {
                  singleCurves.push({
                    defectRate: validSinglePoints[0][i]?.defectRate || i * 0.01,
                    probAccept: sumProb / count
                  });
                }
              }
            }
          } catch (error) {
            console.error("Error processing single curves:", error);
          }
        }

        // Process all double sampling plans and average them if multiple
        if (doublePlans.size > 0) {
          try {
            const allDoublePoints = await Promise.all(
              Array.from(doublePlans.values()).map(async (plan) => {
                try {
                  return await getOCCurveDouble(plan);
                } catch (error) {
                  console.error("Error calculating double OC curve for plan:", plan, error);
                  return [];
                }
              })
            );

            // Combine all double curves into one average curve
            const validDoublePoints = allDoublePoints.filter(curve => curve && curve.length > 0);
            if (validDoublePoints.length > 0) {
              const maxLength = Math.max(...validDoublePoints.map(curve => curve.length));
              for (let i = 0; i < maxLength; i++) {
                let sumProb = 0;
                let count = 0;
                validDoublePoints.forEach(curve => {
                  if (curve[i]) {
                    sumProb += curve[i].probAccept;
                    count++;
                  }
                });
                if (count > 0) {
                  doubleCurves.push({
                    defectRate: validDoublePoints[0][i]?.defectRate || i * 0.01,
                    probAccept: sumProb / count
                  });
                }
              }
            }
          } catch (error) {
            console.error("Error processing double curves:", error);
          }
        }

        // Merge single and double curves by defect rate
        const allDefectRates = new Set([
          ...singleCurves.map(d => d.defectRate),
          ...doubleCurves.map(d => d.defectRate)
        ]);

        const combinedData = Array.from(allDefectRates)
          .sort((a, b) => a - b)
          .map(rate => {
            const singlePoint = singleCurves.find(d => Math.abs(d.defectRate - rate) < 0.001);
            const doublePoint = doubleCurves.find(d => Math.abs(d.defectRate - rate) < 0.001);
            
            return {
              defectRate: rate,
              singleProbAccept: singlePoint ? singlePoint.probAccept : null,
              doubleProbAccept: doublePoint ? doublePoint.probAccept : null
            };
          });

        if (combinedData.length === 0) {
          console.warn("No OC curve data generated from plans");
        } else {
          console.log("OC curve data generated:", combinedData.length, "points");
        }

        setData(combinedData);
      } catch (error) {
        console.error("Error fetching OC curve data:", error);
        console.error("Error details:", error.message, error.stack);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter data based on selected plan type
  const getFilteredData = () => {
    if (planFilter === "Single") {
      return data.map(d => ({ defectRate: d.defectRate, probAccept: d.singleProbAccept }))
                 .filter(d => d.probAccept !== null);
    } else if (planFilter === "Double") {
      return data.map(d => ({ defectRate: d.defectRate, probAccept: d.doubleProbAccept }))
                 .filter(d => d.probAccept !== null);
    }
    return data; // Return all data for combined view
  };

  const filteredData = getFilteredData();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ 
        padding: "40px 20px", 
        textAlign: "center",
        minHeight: "100vh",
        position: "relative"
      }}
    >
      {/* Back Button */}
      <motion.button
        onClick={() => navigate("/")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          padding: "12px 20px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          color: "#667eea",
          border: "2px solid #667eea",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.3s ease",
          zIndex: 10
        }}
      >
        <Home size={18} /> Back to Home
      </motion.button>

      <motion.h2 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ 
          marginBottom: "40px", 
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)", 
          fontWeight: 800,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px"
        }}
      >
        <TrendingUp size={40} color="#667eea" /> OC Curve Analysis
      </motion.h2>

      {/* Plan Filter */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="modern-card"
        style={{ 
          margin: "0 auto 40px",
          maxWidth: "600px",
          padding: "25px",
          background: "rgba(255, 255, 255, 0.98)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <BarChart3 size={20} color="#667eea" />
          <label style={{ fontWeight: 600, color: "#333", fontSize: "1rem" }}>
            View:
          </label>
        </div>
        <select 
          value={planFilter} 
          onChange={(e) => setPlanFilter(e.target.value)}
          style={{
            padding: "12px 20px",
            borderRadius: "12px",
            border: "2px solid #667eea",
            fontSize: "16px",
            fontWeight: 500,
            background: "white",
            color: "#333",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.3s ease",
            minWidth: "250px"
          }}
          onFocus={(e) => e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"}
          onBlur={(e) => e.target.style.boxShadow = "none"}
        >
          <option value="All">Both Plans (Comparison)</option>
          <option value="Single">Single Sampling Only</option>
          <option value="Double">Double Sampling Only</option>
        </select>
      </motion.div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="modern-card"
          style={{
            padding: "60px 40px",
            margin: "40px auto",
            maxWidth: "600px",
            background: "rgba(255, 255, 255, 0.98)"
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "20px" }}>⏳</div>
          <h3 style={{ 
            color: "#333", 
            fontSize: "1.3rem",
            fontWeight: 700
          }}>
            Calculating OC Curves...
          </h3>
        </motion.div>
      ) : data.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="modern-card"
          style={{
            padding: "60px 40px",
            margin: "40px auto",
            maxWidth: "600px",
            background: "rgba(255, 255, 255, 0.98)"
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "25px" }}>📊</div>
          <h3 style={{ 
            color: "#333", 
            marginBottom: "20px",
            fontSize: "1.5rem",
            fontWeight: 700
          }}>
            No Data Available
          </h3>
          <p style={{ 
            color: "#666", 
            fontSize: "1.1rem", 
            marginBottom: "35px",
            lineHeight: 1.6
          }}>
            Run some sampling plans first to see the OC curve analysis!
          </p>
          <motion.button
            onClick={() => navigate("/sampling")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="modern-button"
            style={{
              padding: "14px 28px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              fontSize: "16px"
            }}
          >
            Start Sampling →
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="modern-card"
          style={{
            padding: "40px",
            margin: "20px auto",
            maxWidth: "1200px",
            background: "rgba(255, 255, 255, 0.98)"
          }}
        >
          <h3 style={{ 
            marginBottom: "15px", 
            color: "#333",
            fontSize: "1.8rem",
            fontWeight: 700
          }}>
            Operating Characteristic Curve
          </h3>
          <p style={{ 
            color: "#666", 
            marginBottom: "40px",
            fontSize: "1.1rem"
          }}>
            Based on historical sampling results
          </p>
          
          <ResponsiveContainer width="100%" height={550}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="defectRate" 
                label={{ value: "Fraction Defective (p)", position: "insideBottom", offset: -5 }} 
                type="number"
                scale="linear"
                domain={[0, 'dataMax']}
                tickFormatter={(value) => (value * 100).toFixed(0) + '%'}
              />
              <YAxis 
                domain={[0, 1]} 
                label={{ value: "Probability of Acceptance", angle: -90, position: "insideLeft" }} 
              />
              <Tooltip 
                formatter={(value, name) => [
                  value !== null && value !== undefined ? value.toFixed(3) : "N/A", 
                  name === "singleProbAccept" ? "Single Sampling" : 
                  name === "doubleProbAccept" ? "Double Sampling" : "P(Accept)"
                ]}
                labelFormatter={(value) => `Fraction Defective: ${(value * 100).toFixed(2)}%`}
              />
              
              {planFilter === "All" && (
                <>
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="singleProbAccept" 
                    stroke="#007bff" 
                    strokeWidth={3}
                    dot={{ fill: "#007bff", strokeWidth: 2, r: 4 }}
                    name="Single Sampling"
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="doubleProbAccept" 
                    stroke="#28a745" 
                    strokeWidth={3}
                    dot={{ fill: "#28a745", strokeWidth: 2, r: 4 }}
                    name="Double Sampling"
                    connectNulls={false}
                  />
                </>
              )}
              
              {planFilter !== "All" && (
                <Line 
                  type="monotone" 
                  dataKey="probAccept" 
                  stroke={planFilter === "Single" ? "#007bff" : "#28a745"}
                  strokeWidth={3}
                  dot={{ fill: planFilter === "Single" ? "#007bff" : "#28a745", strokeWidth: 2, r: 5 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="modern-card"
            style={{ 
              marginTop: "40px", 
              textAlign: "left", 
              maxWidth: "900px", 
              margin: "40px auto 0",
              padding: "30px",
              background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
              borderRadius: "16px"
            }}
          >
            <h4 style={{ 
              color: "#333", 
              marginBottom: "20px",
              fontSize: "1.3rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <BarChart3 size={24} color="#667eea" /> Understanding the OC Curve
            </h4>
            <ul style={{ 
              color: "#666", 
              lineHeight: "1.8",
              fontSize: "1rem",
              listStyle: "none",
              padding: 0
            }}>
              <li style={{ marginBottom: "12px", paddingLeft: "25px", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#667eea", fontWeight: 700 }}>•</span>
                <strong style={{ color: "#333" }}>X-axis:</strong> True fraction defective (p) in the lot (theoretical lot quality)
              </li>
              <li style={{ marginBottom: "12px", paddingLeft: "25px", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#667eea", fontWeight: 700 }}>•</span>
                <strong style={{ color: "#333" }}>Y-axis:</strong> Probability of accepting the lot P(a) (theoretical acceptance probability)
              </li>
              <li style={{ marginBottom: "12px", paddingLeft: "25px", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#667eea", fontWeight: 700 }}>•</span>
                <strong style={{ color: "#333" }}>Curve shape:</strong> Should drop from P(a)=1.0 (perfect lot) to P(a)=0.0 (very defective lot) as fraction defective increases
              </li>
              <li style={{ marginBottom: "12px", paddingLeft: "25px", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#667eea", fontWeight: 700 }}>•</span>
                <strong style={{ color: "#333" }}>Note:</strong> These are theoretical curves calculated from your sampling plan parameters using binomial probability
              </li>
              {planFilter === "All" && (
                <>
                  <li style={{ marginBottom: "12px", paddingLeft: "25px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "#667eea", fontWeight: 700 }}>•</span>
                    <strong style={{ color: "#667eea" }}>Blue line:</strong> Single sampling plan performance
                  </li>
                  <li style={{ marginBottom: "12px", paddingLeft: "25px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "#10b981", fontWeight: 700 }}>•</span>
                    <strong style={{ color: "#10b981" }}>Green line:</strong> Double sampling plan performance
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
