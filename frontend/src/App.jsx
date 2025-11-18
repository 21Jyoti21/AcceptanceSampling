import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sampling from "./pages/Sampling";
import Results from "./pages/Results";
import OCcurve from "./pages/OCcurve";

// Inside <Routes>
<Route path="/oc-curve" element={<OCcurve />} />

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sampling" element={<Sampling />} />
        <Route path="/results" element={<Results />} />
        <Route path="/oc-curve" element={<OCcurve />} />
      </Routes>
    </Router>
  );
}

export default App;
