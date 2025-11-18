import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, FileText, TrendingUp, Sparkles } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: "absolute",
        top: "-50%",
        right: "-50%",
        width: "800px",
        height: "800px",
        background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        zIndex: 0
      }} />
      <div style={{
        position: "absolute",
        bottom: "-30%",
        left: "-30%",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        zIndex: 0
      }} />

      {/* Main Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: "900px",
          width: "100%"
        }}
      >
        {/* Hero Section */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="modern-card"
          style={{
            marginBottom: "40px",
            background: "rgba(255, 255, 255, 0.98)",
          }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            style={{ display: "inline-block", marginBottom: "20px" }}
          >
            <Sparkles size={64} color="#667eea" />
          </motion.div>
          
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "20px",
            lineHeight: 1.2
          }}>
            Acceptance Sampling App
          </h1>
          
          <p style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: "#666",
            marginBottom: "40px",
            lineHeight: 1.6
          }}>
            Automate Single & Double Sampling Plans with Advanced Quality Control Analytics
          </p>
        </motion.div>

        {/* Action Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "30px",
          width: "100%",
          marginTop: "30px"
        }}>
          {/* Start Sampling Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="modern-card"
            onClick={() => navigate("/sampling")}
            style={{
              cursor: "pointer",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "40px 30px",
              textAlign: "center"
            }}
          >
            <BarChart3 size={48} style={{ marginBottom: "20px" }} />
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "15px" }}>
              Start Sampling
            </h3>
            <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
              Create and execute single or double sampling plans for quality control
            </p>
          </motion.div>

          {/* View Results Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="modern-card"
            onClick={() => navigate("/results")}
            style={{
              cursor: "pointer",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "40px 30px",
              textAlign: "center"
            }}
          >
            <FileText size={48} style={{ marginBottom: "20px" }} />
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "15px" }}>
              View Results
            </h3>
            <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
              Browse your sampling history and export data for analysis
            </p>
          </motion.div>

          {/* OC Curve Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="modern-card"
            onClick={() => navigate("/oc-curve")}
            style={{
              cursor: "pointer",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "40px 30px",
              textAlign: "center"
            }}
          >
            <TrendingUp size={48} style={{ marginBottom: "20px" }} />
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "15px" }}>
              OC Curve
            </h3>
            <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
              Visualize operating characteristic curves and analyze plan performance
            </p>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="modern-card"
          style={{
            marginTop: "50px",
            background: "rgba(255, 255, 255, 0.95)"
          }}
        >
          <h3 style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#333",
            marginBottom: "25px"
          }}>
            Key Features
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "25px",
            textAlign: "left"
          }}>
            <div>
              <h4 style={{ color: "#667eea", fontWeight: 600, marginBottom: "8px" }}>
                ✓ Single Sampling
              </h4>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>
                Quick and efficient single-stage sampling plans
              </p>
            </div>
            <div>
              <h4 style={{ color: "#667eea", fontWeight: 600, marginBottom: "8px" }}>
                ✓ Double Sampling
              </h4>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>
                Two-stage sampling for better accuracy
              </p>
            </div>
            <div>
              <h4 style={{ color: "#667eea", fontWeight: 600, marginBottom: "8px" }}>
                ✓ Data Analytics
              </h4>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>
                Comprehensive reporting and visualization
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
