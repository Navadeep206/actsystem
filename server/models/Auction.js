const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const auctionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    startingPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["OPEN", "COMPLETED"],
      default: "OPEN"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    bids: [bidSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auction", auctionSchema);
