const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Auction API running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/auctions", require("./routes/auctionRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
