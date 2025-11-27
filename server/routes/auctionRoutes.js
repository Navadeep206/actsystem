const express = require("express");
const Auction = require("../models/Auction");
const { auth, adminOnly } = require("../middleware/auth");

const router = express.Router();

// PUBLIC: list all open auctions
router.get("/", async (req, res) => {
  try {
    const auctions = await Auction.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name");
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUBLIC: get one auction
router.get("/:id", async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate(
      "bids.user",
      "name"
    );
    if (!auction) return res.status(404).json({ message: "Not found" });
    res.json(auction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: create auction
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const { title, description, imageUrl, startingPrice, endTime } = req.body;

    const auction = await Auction.create({
      title,
      description,
      imageUrl,
      startingPrice,
      currentPrice: startingPrice,
      endTime,
      createdBy: req.user._id
    });

    res.status(201).json(auction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: update auction
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const { title, description, imageUrl, startingPrice, endTime, status } =
      req.body;

    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Not found" });

    auction.title = title ?? auction.title;
    auction.description = description ?? auction.description;
    auction.imageUrl = imageUrl ?? auction.imageUrl;
    // startingPrice should not change after bids in real life, but you can allow/forbid
    auction.startingPrice = startingPrice ?? auction.startingPrice;
    auction.endTime = endTime ?? auction.endTime;
    if (status) auction.status = status;

    await auction.save();
    res.json(auction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: delete auction
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const auction = await Auction.findByIdAndDelete(req.params.id);
    if (!auction) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Auction deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: mark as completed
router.patch("/:id/complete", auth, adminOnly, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Not found" });

    auction.status = "COMPLETED";
    await auction.save();
    res.json(auction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// USER: place bid
router.post("/:id/bid", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Not found" });

    if (auction.status !== "OPEN")
      return res.status(400).json({ message: "Auction not open" });

    const now = new Date();
    if (now > auction.endTime)
      return res.status(400).json({ message: "Auction has ended" });

    const minAllowed =
      (auction.currentPrice || auction.startingPrice) + 1; // you can change step

    if (amount < minAllowed) {
      return res.status(400).json({
        message: `Bid must be at least ${minAllowed}`
      });
    }

    auction.currentPrice = amount;
    auction.bids.push({ user: req.user._id, amount });

    await auction.save();
    await auction.populate("bids.user", "name");

    res.json(auction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
