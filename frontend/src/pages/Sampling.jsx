import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { checkSingleSampling, checkDoubleSampling } from "../services/api";

function SingleForm({ onSubmit }) {
  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    margin: "12px 0",
    border: "2px solid #e0e0e0",
    borderRadius: "12px",
    fontSize: "16px",
    boxSizing: "border-box",
    display: "block",
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.9)",
    outline: "none"
  };

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="modern-card"
      style={{ 
        marginTop: "30px",
        maxWidth: "500px",
        margin: "30px auto",
        padding: "40px",
        background: "rgba(255, 255, 255, 0.98)"
      }}
      onFocus={(e) => {
        if (e.target.tagName === 'INPUT') {
          e.target.style.borderColor = "#667eea";
          e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
        }
      }}
      onBlur={(e) => {
        if (e.target.tagName === 'INPUT') {
          e.target.style.borderColor = "#e0e0e0";
          e.target.style.boxShadow = "none";
        }
      }}
    >
      <h3 style={{ 
        marginBottom: "30px", 
        color: "#333",
        fontSize: "1.75rem",
        fontWeight: 700,
        textAlign: "center"
      }}>
        Single Sampling Form
      </h3>
      
      <input 
        type="number" 
        name="lotSize" 
        placeholder="Lot Size (N)" 
        required 
        style={inputStyle}
      />
      <input 
        type="number" 
        name="sampleSize" 
        placeholder="Sample Size (n)" 
        required 
        style={inputStyle}
      />
      <input 
        type="number" 
        name="acceptanceNumber" 
        placeholder="Acceptance Number (c)" 
        required 
        style={inputStyle}
      />
      <input 
        type="number" 
        name="defectsObserved" 
        placeholder="Defects Observed (d)" 
        required 
        style={inputStyle}
      />
      <button 
        type="submit"
        className="modern-button"
        style={{
          width: "100%",
          padding: "16px",
          marginTop: "20px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        Check Single Plan
      </button>
    </motion.form>
  );
}

function DoubleForm({ onSubmit }) {
  const [showStage2, setShowStage2] = useState(false);

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    margin: "12px 0",
    border: "2px solid #e0e0e0",
    borderRadius: "12px",
    fontSize: "16px",
    boxSizing: "border-box",
    display: "block",
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.9)",
    outline: "none"
  };

  const stageStyle = {
    border: "2px solid #667eea",
    borderRadius: "16px",
    padding: "25px",
    margin: "20px 0",
    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.1)"
  };

  const handleStage1Change = (e) => {
    // Check if all stage 1 fields are filled
    const form = e.target.form;
    const d1Input = form.querySelector('[name="d1"]');
    const c1Input = form.querySelector('[name="c1"]');
    const r1Input = form.querySelector('[name="r1"]');
    
    if (d1Input && c1Input && r1Input) {
      const d1 = d1Input.value;
      const c1 = c1Input.value;
      const r1 = r1Input.value;
      
      if (d1 && c1 && r1) {
        const defects = Number(d1);
        const accept = Number(c1);
        const reject = Number(r1);
        
        // Show stage 2 if d1 > c1 and d1 < r1 (inconclusive)
        if (defects > accept && defects < reject) {
          setShowStage2(true);
        } else {
          setShowStage2(false);
        }
      }
    }
  };

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="modern-card"
      style={{ 
        marginTop: "30px",
        maxWidth: "550px",
        margin: "30px auto",
        padding: "40px",
        background: "rgba(255, 255, 255, 0.98)"
      }}
      onFocus={(e) => {
        if (e.target.tagName === 'INPUT') {
          e.target.style.borderColor = "#667eea";
          e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
        }
      }}
      onBlur={(e) => {
        if (e.target.tagName === 'INPUT') {
          e.target.style.borderColor = "#e0e0e0";
          e.target.style.boxShadow = "none";
        }
      }}
    >
      <h3 style={{ 
        marginBottom: "30px", 
        color: "#333", 
        textAlign: "center",
        fontSize: "1.75rem",
        fontWeight: 700
      }}>
        Double Sampling Form
      </h3>

      {/* Lot Size */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
          Lot Size (N)
        </label>
        <input 
          type="number" 
          name="lotSize" 
          placeholder="Enter lot size" 
          required 
          style={inputStyle}
        />
      </div>
      
      {/* Stage 1 */}
      <div style={stageStyle}>
        <h4 style={{ 
          margin: "0 0 20px 0", 
          color: "#667eea", 
          textAlign: "center",
          fontSize: "1.3rem",
          fontWeight: 700
        }}>
          Stage 1
        </h4>
        <input 
          type="number" 
          name="n1" 
          placeholder="Sample Size 1 (n1)" 
          required 
          style={inputStyle}
        />
        <input 
          type="number" 
          name="c1" 
          placeholder="Acceptance Number 1 (c1)" 
          required 
          style={inputStyle}
          onChange={handleStage1Change}
        />
        <input 
          type="number" 
          name="r1" 
          placeholder="Rejection Number 1 (r1)" 
          required 
          style={inputStyle}
          onChange={handleStage1Change}
        />
        <input 
          type="number" 
          name="d1" 
          placeholder="Defects Observed in Stage 1 (d1)" 
          required 
          style={inputStyle}
          onChange={handleStage1Change}
        />
      </div>

      {/* Stage 2 - Only show if stage 1 is inconclusive */}
      {showStage2 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          style={{
            ...stageStyle,
            borderColor: "#10b981",
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)"
          }}
        >
          <h4 style={{ 
            margin: "0 0 20px 0", 
            color: "#10b981", 
            textAlign: "center",
            fontSize: "1.3rem",
            fontWeight: 700
          }}>
            Stage 2 (Required - Stage 1 was inconclusive)
          </h4>
          <input 
            type="number" 
            name="n2" 
            placeholder="Sample Size 2 (n2)" 
            required={showStage2}
            style={inputStyle}
          />
          <input 
            type="number" 
            name="c2" 
            placeholder="Acceptance Number 2 (c2)" 
            required={showStage2}
            style={inputStyle}
          />
          <input 
            type="number" 
            name="r2" 
            placeholder="Rejection Number 2 (r2)" 
            required={showStage2}
            style={inputStyle}
          />
          <input 
            type="number" 
            name="d2" 
            placeholder="Defects Observed in Stage 2 (d2)" 
            required={showStage2}
            style={inputStyle}
          />
        </motion.div>
      )}

      <button 
        type="submit"
        className="modern-button"
        style={{
          width: "100%",
          padding: "16px",
          marginTop: "25px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        Check Double Plan
      </button>
    </motion.form>
  );
}

export default function Sampling() {
  const navigate = useNavigate();
  const [planType, setPlanType] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target).entries());

    let response;
    if (planType === "Single") {
      response = await checkSingleSampling(formData);
    } else if (planType === "Double") {
      response = await checkDoubleSampling(formData);
    }

    setResult(response?.decision || "⚠️ Error in decision");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        textAlign: "center", 
        padding: "40px 20px",
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
        ← Back to Home
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
          marginTop: "20px"
        }}
      >
        Choose Sampling Plan
      </motion.h2>

      {/* Cards */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: "30px", 
        marginTop: "40px",
        flexWrap: "wrap",
        maxWidth: "800px",
        margin: "40px auto"
      }}>
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPlanType("Single")}
          className="modern-card"
          style={{
            padding: "40px 30px",
            border: planType === "Single" ? "3px solid #667eea" : "2px solid transparent",
            borderRadius: "20px",
            minWidth: "250px",
            flex: "1 1 250px",
            cursor: "pointer",
            background: planType === "Single" 
              ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
              : "rgba(255, 255, 255, 0.95)",
            transition: "all 0.3s ease"
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📊</div>
          <h3 style={{ 
            fontSize: "1.5rem", 
            fontWeight: 700, 
            color: "#333",
            marginBottom: "10px"
          }}>
            Single Sampling
          </h3>
          <p style={{ color: "#666", lineHeight: 1.6 }}>
            Simple accept/reject decision in one stage
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPlanType("Double")}
          className="modern-card"
          style={{
            padding: "40px 30px",
            border: planType === "Double" ? "3px solid #667eea" : "2px solid transparent",
            borderRadius: "20px",
            minWidth: "250px",
            flex: "1 1 250px",
            cursor: "pointer",
            background: planType === "Double" 
              ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
              : "rgba(255, 255, 255, 0.95)",
            transition: "all 0.3s ease"
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📈</div>
          <h3 style={{ 
            fontSize: "1.5rem", 
            fontWeight: 700, 
            color: "#333",
            marginBottom: "10px"
          }}>
            Double Sampling
          </h3>
          <p style={{ color: "#666", lineHeight: 1.6 }}>
            Two-stage inspection for better accuracy
          </p>
        </motion.div>
      </div>

      {/* Dynamic Forms */}
      <AnimatePresence mode="wait">
        {planType === "Single" && <SingleForm key="single" onSubmit={handleSubmit} />}
        {planType === "Double" && <DoubleForm key="double" onSubmit={handleSubmit} />}
      </AnimatePresence>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="modern-card"
          style={{ 
            marginTop: "40px", 
            fontSize: "1.25rem", 
            fontWeight: 700,
            padding: "30px",
            background: result.includes("Accept") 
              ? "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)"
              : "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)",
            color: result.includes("Accept") ? "#10b981" : "#ef4444",
            border: `3px solid ${result.includes("Accept") ? "#10b981" : "#ef4444"}`,
            borderRadius: "20px",
            maxWidth: "500px",
            margin: "40px auto"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            <span style={{ fontSize: "2rem" }}>
              {result.includes("Accept") ? "✅" : "❌"}
            </span>
            <span>{result}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
