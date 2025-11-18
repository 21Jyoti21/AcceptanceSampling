import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getRecords } from "../services/api";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { FileText, Download, Filter, Home } from "lucide-react";

export default function Results() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchData() {
      const data = await getRecords();
      setRecords(data);
    }
    fetchData();
  }, []);

  // Filtered Records
  const filtered = filter === "All" ? records : records.filter(r => r.planType === filter);

  // Download CSV
  const downloadCSV = () => {
    const csv = Papa.unparse(
      filtered.map(r => ({
        Plan: r.planType,
        LotSize: r.lotSize,
        SampleSize: r.sampleSize || r.n1,
        AcceptanceNo: r.acceptanceNumber || r.c1,
        Defects: r.defectsObserved,
        Decision: r.decision,
        Date: new Date(r.date).toLocaleString(),
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "sampling-results.csv");
  };

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
        <FileText size={40} color="#667eea" /> Sampling History
      </motion.h2>

      {/* Filter Buttons */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="modern-card"
        style={{ 
          margin: "20px auto 40px",
          maxWidth: "800px",
          padding: "25px",
          background: "rgba(255, 255, 255, 0.98)",
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "10px",
          marginRight: "10px"
        }}>
          <Filter size={20} color="#667eea" />
          <span style={{ fontWeight: 600, color: "#333" }}>Filter:</span>
        </div>
        {["All", "Single", "Double"].map(type => (
          <motion.button
            key={type}
            onClick={() => setFilter(type)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "12px 24px",
              background: filter === type 
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "rgba(255, 255, 255, 0.9)",
              color: filter === type ? "white" : "#667eea",
              border: `2px solid ${filter === type ? "transparent" : "#667eea"}`,
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: 600,
              transition: "all 0.3s ease",
              boxShadow: filter === type ? "0 4px 15px rgba(102, 126, 234, 0.4)" : "none"
            }}
          >
            {type}
          </motion.button>
        ))}

        <motion.button
          onClick={downloadCSV}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="modern-button"
          style={{
            marginLeft: "auto",
            padding: "12px 24px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
          }}
        >
          <Download size={18} /> Download CSV
        </motion.button>
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="modern-card"
          style={{
            margin: "40px auto",
            maxWidth: "600px",
            padding: "60px 40px",
            background: "rgba(255, 255, 255, 0.98)"
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📭</div>
          <h3 style={{ 
            fontSize: "1.5rem", 
            fontWeight: 700, 
            color: "#333",
            marginBottom: "15px"
          }}>
            No Records Found
          </h3>
          <p style={{ color: "#666", fontSize: "1.1rem", marginBottom: "30px" }}>
            Start creating sampling plans to see your history here!
          </p>
          <motion.button
            onClick={() => navigate("/sampling")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="modern-button"
            style={{
              padding: "14px 28px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
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
            margin: "20px auto",
            maxWidth: "1400px",
            padding: "30px",
            background: "rgba(255, 255, 255, 0.98)",
            overflowX: "auto"
          }}
        >
          <div style={{ 
            marginBottom: "25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h3 style={{ 
              fontSize: "1.3rem", 
              fontWeight: 700, 
              color: "#333"
            }}>
              Results ({filtered.length} {filtered.length === 1 ? 'record' : 'records'})
            </h3>
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0",
              borderRadius: "12px",
              overflow: "hidden"
            }}
          >
            <thead>
              <tr style={{ 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white"
              }}>
                <th style={{...cell, padding: "18px 16px", textAlign: "left", fontWeight: 700}}>Plan</th>
                <th style={{...cell, padding: "18px 16px", textAlign: "left", fontWeight: 700}}>Lot Size</th>
                <th style={{...cell, padding: "18px 16px", textAlign: "left", fontWeight: 700}}>Sample Size</th>
                <th style={{...cell, padding: "18px 16px", textAlign: "left", fontWeight: 700}}>Acceptance No</th>
                <th style={{...cell, padding: "18px 16px", textAlign: "left", fontWeight: 700}}>Defects</th>
                <th style={{...cell, padding: "18px 16px", textAlign: "left", fontWeight: 700}}>Decision</th>
                <th style={{...cell, padding: "18px 16px", textAlign: "left", fontWeight: 700}}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rec, index) => (
                <motion.tr
                  key={rec._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    background: index % 2 === 0 ? "rgba(255, 255, 255, 1)" : "rgba(102, 126, 234, 0.02)",
                    transition: "background 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? "rgba(255, 255, 255, 1)" : "rgba(102, 126, 234, 0.02)"}
                >
                  <td style={{...cell, padding: "16px"}}>
                    <span style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      background: rec.planType === "Single" 
                        ? "rgba(102, 126, 234, 0.1)"
                        : "rgba(16, 185, 129, 0.1)",
                      color: rec.planType === "Single" ? "#667eea" : "#10b981"
                    }}>
                      {rec.planType}
                    </span>
                  </td>
                  <td style={{...cell, padding: "16px", color: "#333"}}>{rec.lotSize}</td>
                  <td style={{...cell, padding: "16px", color: "#333"}}>{rec.sampleSize || rec.n1}</td>
                  <td style={{...cell, padding: "16px", color: "#333"}}>{rec.acceptanceNumber || rec.c1}</td>
                  <td style={{...cell, padding: "16px", color: "#333", fontWeight: 600}}>{rec.defectsObserved}</td>
                  <td style={{...cell, padding: "16px"}}>
                    <span style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      background: rec.decision.includes("Accept")
                        ? "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)"
                        : "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)",
                      color: rec.decision.includes("Accept") ? "#10b981" : "#ef4444",
                      border: `2px solid ${rec.decision.includes("Accept") ? "#10b981" : "#ef4444"}`
                    }}>
                      {rec.decision.includes("Accept") ? "✅ " : "❌ "}{rec.decision}
                    </span>
                  </td>
                  <td style={{...cell, padding: "16px", color: "#666", fontSize: "0.9rem"}}>
                    {new Date(rec.date).toLocaleString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}

const cell = {
  border: "none",
};
