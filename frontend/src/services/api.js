export async function checkSingleSampling(data) {
  const res = await fetch("/api/sampling/single", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function checkDoubleSampling(data) {
  const res = await fetch("/api/sampling/double", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function getRecords() {
  const res = await fetch("/api/sampling/records");
  return res.json();
}

export async function getOCCurveSingle({ sampleSize, acceptanceNumber }) {
  const res = await fetch("/api/sampling/oc-curve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sampleSize, acceptanceNumber }),
  });
  return res.json();
}

export async function getOCCurveDouble({ n1, c1, r1, n2, c2 }) {
  const res = await fetch("/api/sampling/oc-curve-double", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ n1, c1, r1, n2, c2 }),
  });
  return res.json();
}