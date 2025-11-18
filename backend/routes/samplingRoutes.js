const express = require("express");
const Inspection = require("../models/Inspection");

const router = express.Router();

// --- Single Sampling ---
router.post("/single", async (req, res) => {
  const { lotSize, sampleSize, acceptanceNumber, defectsObserved } = req.body;

  let decision = defectsObserved <= acceptanceNumber ? "Accept Lot ✅" : "Reject Lot ❌";

  const newInspection = new Inspection({
    planType: "Single",
    lotSize,
    sampleSize,
    acceptanceNumber,
    defectsObserved,
    decision
  });

  await newInspection.save();
  res.json({ decision });
});

// --- Double Sampling ---
router.post("/double", async (req, res) => {
  const { lotSize, n1, c1, r1, d1, n2, c2, r2, d2 } = req.body;

  // Convert to numbers and handle empty values
  const lotSizeNum = Number(lotSize);
  const n1Num = Number(n1);
  const c1Num = Number(c1);
  const r1Num = Number(r1);
  const d1Num = Number(d1) || 0;
  const n2Num = Number(n2) || 0;
  const c2Num = Number(c2) || 0;
  const r2Num = Number(r2) || 0;
  const d2Num = Number(d2) || 0;

  let decision = "";
  let stage2Required = false;
  
  // Stage 1 decision
  if (d1Num <= c1Num) {
    decision = "Accept Lot ✅";
  } else if (d1Num >= r1Num) {
    decision = "Reject Lot ❌";
  } else {
    // Stage 2 required
    stage2Required = true;
    const totalDefects = d1Num + d2Num;
    decision = totalDefects <= c2Num ? "Accept Lot ✅" : "Reject Lot ❌";
  }

  // Calculate combined sample size and defect rate for OC curve
  const totalSampleSize = stage2Required ? n1Num + n2Num : n1Num;
  const totalDefects = stage2Required ? d1Num + d2Num : d1Num;

  const newInspection = new Inspection({
    planType: "Double",
    lotSize: lotSizeNum,
    n1: n1Num, 
    c1: c1Num, 
    r1: r1Num, 
    d1: d1Num, 
    n2: n2Num, 
    c2: c2Num, 
    r2: r2Num, 
    d2: d2Num,
    // Add these fields for OC curve compatibility
    sampleSize: totalSampleSize,
    defectsObserved: totalDefects,
    stage2Required,
    decision
  });

  await newInspection.save();
  res.json({ decision });
});

// --- Get all stored inspections ---
router.get("/records", async (req, res) => {
  const records = await Inspection.find().sort({ date: -1 });
  res.json(records);
});

// --- OC Curve (Works for both Single and Double Sampling) ---
router.post("/oc-curve", (req, res) => {
  try {
    const { sampleSize, acceptanceNumber } = req.body;

    if (!sampleSize || acceptanceNumber === undefined || acceptanceNumber === null) {
      return res.status(400).json({ error: "Missing required parameters: sampleSize and acceptanceNumber" });
    }

    const n = Number(sampleSize);
    const c = Number(acceptanceNumber);

    if (isNaN(n) || isNaN(c) || n <= 0 || c < 0 || c > n) {
      return res.status(400).json({ error: "Invalid parameters: sampleSize must be positive and acceptanceNumber must be between 0 and sampleSize" });
    }

    let points = [];
    for (let p = 0; p <= 0.2; p += 0.01) { // up to 20% defective
      try {
        let Pa = 0;
        for (let i = 0; i <= c; i++) {
          Pa += binomialProb(n, i, p);
        }
        points.push({ defectRate: p, probAccept: Pa });
      } catch (err) {
        console.error(`Error calculating point for p=${p}:`, err);
        // Skip this point if calculation fails
      }
    }

    res.json(points);
  } catch (error) {
    console.error("Error in OC curve calculation:", error);
    res.status(500).json({ error: "Error calculating OC curve: " + error.message });
  }
});

// --- Enhanced OC Curve for Double Sampling ---
router.post("/oc-curve-double", (req, res) => {
  try {
    const { n1, c1, r1, n2, c2 } = req.body;

    if (!n1 || c1 === undefined || r1 === undefined || !n2 || c2 === undefined) {
      return res.status(400).json({ error: "Missing required parameters: n1, c1, r1, n2, c2" });
    }

    const n1Num = Number(n1);
    const c1Num = Number(c1);
    const r1Num = Number(r1);
    const n2Num = Number(n2);
    const c2Num = Number(c2);

    if (isNaN(n1Num) || isNaN(c1Num) || isNaN(r1Num) || isNaN(n2Num) || isNaN(c2Num) ||
        n1Num <= 0 || n2Num <= 0 || c1Num < 0 || c2Num < 0 || r1Num <= c1Num) {
      return res.status(400).json({ error: "Invalid parameters for double sampling plan" });
    }

    let points = [];
    for (let p = 0; p <= 0.2; p += 0.01) {
      try {
        let Pa = 0;
        
        // Stage 1: Accept immediately if d1 <= c1
        for (let d1 = 0; d1 <= c1Num; d1++) {
          const prob1 = binomialProb(n1Num, d1, p);
          Pa += prob1;
        }
        
        // Stage 2: Go to second stage if c1 < d1 < r1
        for (let d1 = c1Num + 1; d1 < r1Num; d1++) {
          const prob1 = binomialProb(n1Num, d1, p);
          
          // In stage 2, accept if total defects <= c2
          for (let d2 = 0; d2 <= (c2Num - d1); d2++) {
            if (d2 >= 0) { // Ensure d2 is non-negative
              const prob2 = binomialProb(n2Num, d2, p);
              Pa += prob1 * prob2;
            }
          }
        }
        
        points.push({ defectRate: p, probAccept: Pa });
      } catch (err) {
        console.error(`Error calculating point for p=${p}:`, err);
        // Skip this point if calculation fails
      }
    }

    res.json(points);
  } catch (error) {
    console.error("Error in double OC curve calculation:", error);
    res.status(500).json({ error: "Error calculating double OC curve: " + error.message });
  }
});

// Helper functions - Use iterative factorial to avoid stack overflow
function factorial(num) {
  if (num === 0 || num === 1) return 1;
  if (num > 170) {
    // For very large numbers, use Stirling's approximation or return Infinity
    // JavaScript's Number.MAX_VALUE limit
    throw new Error("Factorial too large for calculation");
  }
  let result = 1;
  for (let i = 2; i <= num; i++) {
    result *= i;
    if (!isFinite(result)) {
      throw new Error("Factorial calculation overflow");
    }
  }
  return result;
}

function binomialProb(n, k, p) {
  if (k > n) return 0;
  if (n > 170 || k > 170 || (n - k) > 170) {
    // Use logarithms for large numbers to avoid overflow
    return Math.exp(
      logFactorial(n) - logFactorial(k) - logFactorial(n - k) +
      k * Math.log(p) + (n - k) * Math.log(1 - p)
    );
  }
  const comb = factorial(n) / (factorial(k) * factorial(n - k));
  return comb * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

function logFactorial(n) {
  if (n <= 1) return 0;
  let sum = 0;
  for (let i = 2; i <= n; i++) {
    sum += Math.log(i);
  }
  return sum;
}

module.exports = router;

// const express = require("express");
// const Inspection = require("../models/Inspection");

// const router = express.Router();

// // --- Single Sampling ---
// router.post("/single", async (req, res) => {
//   const { lotSize, sampleSize, acceptanceNumber, defectsObserved } = req.body;

//   let decision = defectsObserved <= acceptanceNumber ? "Accept Lot ✅" : "Reject Lot ❌";

//   const newInspection = new Inspection({
//     planType: "Single",
//     lotSize,
//     sampleSize,
//     acceptanceNumber,
//     defectsObserved,
//     decision
//   });

//   await newInspection.save();
//   res.json({ decision });
// });

// // --- Double Sampling ---
// router.post("/double", async (req, res) => {
//   const { lotSize, n1, c1, r1, d1, n2, c2, r2, d2 } = req.body;

//   let decision = "";
//   if (d1 <= c1) decision = "Accept Lot ✅";
//   else if (d1 >= r1) decision = "Reject Lot ❌";
//   else decision = (d1 + d2) <= c2 ? "Accept Lot ✅" : "Reject Lot ❌";

//   const newInspection = new Inspection({
//     planType: "Double",
//     lotSize,
//     n1, c1, r1, d1, n2, c2, r2, d2,
//     decision
//   });

//   await newInspection.save();
//   res.json({ decision });
// });

// // --- Get all stored inspections ---
// router.get("/records", async (req, res) => {
//   const records = await Inspection.find().sort({ date: -1 });
//   res.json(records);
// });

// // --- OC Curve (Single Sampling only for now) ---
// router.post("/oc-curve", (req, res) => {
//   const { sampleSize, acceptanceNumber } = req.body;

//   let points = [];
//   for (let p = 0; p <= 0.2; p += 0.01) { // up to 20% defective
//     let Pa = 0;
//     for (let i = 0; i <= acceptanceNumber; i++) {
//       const comb = factorial(sampleSize) / (factorial(i) * factorial(sampleSize - i));
//       Pa += comb * Math.pow(p, i) * Math.pow(1 - p, sampleSize - i);
//     }
//     points.push({ defectRate: p, probAccept: Pa });
//   }

//   res.json(points);
// });

// // helper factorial function
// function factorial(num) {
//   if (num === 0 || num === 1) return 1;
//   return num * factorial(num - 1);
// }

// module.exports = router;
