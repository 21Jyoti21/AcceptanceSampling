import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkSampling } from "../services/api";

export default function DoubleSamplingForm() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await checkSampling(inputs, "/double");
      navigate("/results", { state: { decision: response.decision } });
    } catch (err) {
      setError("Error: Could not get result");
    }
  };

  // Stage 2 logic for Double Sampling
  const showStage2 =
    inputs.d1 !== undefined &&
    inputs.c1 !== undefined &&
    inputs.r1 !== undefined &&
    inputs.d1 !== "" &&
    inputs.c1 !== "" &&
    inputs.r1 !== "" &&
    Number(inputs.d1) > Number(inputs.c1) &&
    Number(inputs.d1) < Number(inputs.r1);

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
    boxSizing: "border-box",
    marginBottom: "15px",
    display: "block"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#333"
  };

  return (
    <div style={{ maxWidth: "450px", margin: "40px auto", padding: "20px" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "block",
          width: "100%"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          Double Sampling Plan
        </h2>

        {/* Lot Size */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Lot Size (N)</label>
          <input
            type="number"
            name="lotSize"
            placeholder="Enter lot size"
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* Stage 1 */}
        <div style={{
          border: "2px solid #007bff",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "25px",
          backgroundColor: "#f8f9ff"
        }}>
          <h3 style={{ 
            margin: "0 0 20px 0", 
            color: "#007bff",
            textAlign: "center"
          }}>
            Stage 1
          </h3>

          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>Sample Size (n1)</label>
            <input
              type="number"
              name="n1"
              placeholder="Enter sample size for stage 1"
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>Acceptance Number (c1)</label>
            <input
              type="number"
              name="c1"
              placeholder="Enter acceptance number for stage 1"
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>Rejection Number (r1)</label>
            <input
              type="number"
              name="r1"
              placeholder="Enter rejection number for stage 1"
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "0" }}>
            <label style={labelStyle}>Defects Observed (d1)</label>
            <input
              type="number"
              name="d1"
              placeholder="Enter defects observed in stage 1"
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
        </div>

        {/* Stage 2: Only show if Stage 1 is inconclusive */}
        {showStage2 && (
          <div style={{
            border: "2px solid #28a745",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "25px",
            backgroundColor: "#f8fff8"
          }}>
            <h3 style={{ 
              margin: "0 0 20px 0", 
              color: "#28a745",
              textAlign: "center"
            }}>
              Stage 2 (Required)
            </h3>

            <div style={{ marginBottom: "15px" }}>
              <label style={labelStyle}>Sample Size (n2)</label>
              <input
                type="number"
                name="n2"
                placeholder="Enter sample size for stage 2"
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={labelStyle}>Acceptance Number (c2)</label>
              <input
                type="number"
                name="c2"
                placeholder="Enter acceptance number for stage 2"
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={labelStyle}>Rejection Number (r2)</label>
              <input
                type="number"
                name="r2"
                placeholder="Enter rejection number for stage 2"
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "0" }}>
              <label style={labelStyle}>Defects Observed (d2)</label>
              <input
                type="number"
                name="d2"
                placeholder="Enter defects observed in stage 2"
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
            marginTop: "20px"
          }}
        >
          Check Double Sampling Plan
        </button>

        {error && (
          <div style={{ 
            color: "red", 
            marginTop: "15px", 
            textAlign: "center",
            padding: "10px",
            backgroundColor: "#fee",
            borderRadius: "4px",
            border: "1px solid #fcc"
          }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}