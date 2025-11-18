const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const samplingRoutes = require("./routes/samplingRoutes");

dotenv.config();
const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/sampling", samplingRoutes);

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("✅ Acceptance Sampling API is running");
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
