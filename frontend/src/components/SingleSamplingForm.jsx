import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkSampling } from "../services/api";

export default function SingleSamplingForm() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await checkSampling(inputs, "/single");
      navigate("/results", { state: { decision: response.decision } });
    } catch (err) {
      setError("Error: Could not get result");
    }
  };

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

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "block",
          width: "100%"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          Single Sampling Plan
        </h2>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Lot Size (N)
          </label>
          <input
            type="number"
            name="lotSize"
            placeholder="Enter lot size"
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Sample Size (n)
          </label>
          <input
            type="number"
            name="sampleSize"
            placeholder="Enter sample size"
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Acceptance Number (c)
          </label>
          <input
            type="number"
            name="acceptanceNumber"
            placeholder="Enter acceptance number"
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Defects Observed (d)
          </label>
          <input
            type="number"
            name="defectsObserved"
            placeholder="Enter defects observed"
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

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
          Check Single Sampling Plan
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