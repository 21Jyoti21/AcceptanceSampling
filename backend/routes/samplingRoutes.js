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
  const { sampleSize, acceptanceNumber } = req.body;

  let points = [];
  for (let p = 0; p <= 0.2; p += 0.01) { // up to 20% defective
    let Pa = 0;
    for (let i = 0; i <= acceptanceNumber; i++) {
      const comb = factorial(sampleSize) / (factorial(i) * factorial(sampleSize - i));
      Pa += comb * Math.pow(p, i) * Math.pow(1 - p, sampleSize - i);
    }
    points.push({ defectRate: p, probAccept: Pa });
  }

  res.json(points);
});

// --- Enhanced OC Curve for Double Sampling ---
router.post("/oc-curve-double", (req, res) => {
  const { n1, c1, r1, n2, c2 } = req.body;

  let points = [];
  for (let p = 0; p <= 0.2; p += 0.01) {
    let Pa = 0;
    
    // Stage 1: Accept immediately if d1 <= c1
    for (let d1 = 0; d1 <= c1; d1++) {
      const prob1 = binomialProb(n1, d1, p);
      Pa += prob1;
    }
    
    // Stage 2: Go to second stage if c1 < d1 < r1
    for (let d1 = c1 + 1; d1 < r1; d1++) {
      const prob1 = binomialProb(n1, d1, p);
      
      // In stage 2, accept if total defects <= c2
      for (let d2 = 0; d2 <= (c2 - d1); d2++) {
        const prob2 = binomialProb(n2, d2, p);
        Pa += prob1 * prob2;
      }
    }
    
    points.push({ defectRate: p, probAccept: Pa });
  }

  res.json(points);
});

// Helper functions
function factorial(num) {
  if (num === 0 || num === 1) return 1;
  return num * factorial(num - 1);
}

function binomialProb(n, k, p) {
  if (k > n) return 0;
  const comb = factorial(n) / (factorial(k) * factorial(n - k));
  return comb * Math.pow(p, k) * Math.pow(1 - p, n - k);
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
