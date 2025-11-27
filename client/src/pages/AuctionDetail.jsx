import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const AuctionDetail = ({ auctionId }) => {
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();

  const fetchAuction = async () => {
    try {
      const res = await api.get(`/auctions/${auctionId}`);
      setAuction(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAuction();
    const interval = setInterval(fetchAuction, 5000);
    return () => clearInterval(interval);
  }, [auctionId]);

  if (!auction) return <div style={{ textAlign: "center", padding: "40px" }}>⏳ Loading...</div>;

  const end = new Date(auction.endTime);
  const now = new Date();
  const isOver = now > end || auction.status === "COMPLETED";
  const timeLeft = end - now;
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  const minNextBid = (auction.currentPrice || auction.startingPrice) + 1;

  const handleBid = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("Please login to place a bid.");
      return;
    }

    try {
      const res = await api.post(`/auctions/${auction._id}/bid`, {
        amount: Number(bidAmount)
      });
      setAuction(res.data);
      setBidAmount("");
      setSuccess("✅ Bid placed successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place bid");
    }
  };

  return (
    <div className="auction-detail">
      <div className="auction-detail-header">
        <div>
          {auction.imageUrl ? (
            <img src={auction.imageUrl} alt={auction.title} className="auction-img-large" />
          ) : (
            <div style={{ width: "100%", height: "300px", background: "#e0e0e0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: "16px" }}>
              No Image Available
            </div>
          )}
        </div>

        <div className="auction-info">
          <h2>{auction.title}</h2>
          <p style={{ color: "#666", fontSize: "15px", lineHeight: "1.6", marginBottom: "20px" }}>
            {auction.description}
          </p>

          <div className={`auction-status ${isOver ? "closed" : "open"}`}>
            {isOver ? "🔒 AUCTION CLOSED" : "🔓 AUCTION OPEN"}
          </div>

          <div className="auction-detail-prices">
            <div className="detail-price">
              <span className="detail-price-label">Starting Price</span>
              <span className="detail-price-value">₹{auction.startingPrice.toLocaleString()}</span>
            </div>
            <div className="detail-price">
              <span className="detail-price-label">Current Bid</span>
              <span className="detail-price-value">₹{auction.currentPrice.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ background: "#f8f9fa", padding: "16px", borderRadius: "8px", marginBottom: "20px" }}>
            <div style={{ fontSize: "13px", color: "#999", marginBottom: "8px", textTransform: "uppercase" }}>Time Remaining</div>
            <div style={{ fontSize: "22px", fontWeight: "700", color: "#667eea" }}>
              {isOver ? "Auction Ended" : `${daysLeft}d ${hoursLeft}h ${minutesLeft}m`}
            </div>
          </div>

          {!isOver && (
            <form onSubmit={handleBid} className="bid-form">
              {error && <div className="error">{error}</div>}
              {success && <div style={{ color: "#27ae60", padding: "12px", background: "#d5f4e6", borderRadius: "6px", marginBottom: "12px", border: "1px solid #27ae60" }}>{success}</div>}
              <input
                type="number"
                min={minNextBid}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Enter bid amount (minimum ₹${minNextBid.toLocaleString()})`}
                required
              />
              <button type="submit" style={{ width: "100%" }}>
                💰 Place Bid
              </button>
            </form>
          )}

          <div style={{ fontSize: "13px", color: "#999", marginTop: "16px" }}>
            <strong>By {auction.createdBy?.name}</strong> • Listed on {new Date(auction.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="bid-history">
        <h3>📊 Bid History ({auction.bids.length} bids)</h3>
        {auction.bids.length === 0 ? (
          <p style={{ color: "#999", fontSize: "14px", padding: "20px", textAlign: "center", background: "#f8f9fa", borderRadius: "8px" }}>
            No bids yet. Be the first to bid!
          </p>
        ) : (
          <ul className="bid-list">
            {auction.bids
              .slice()
              .reverse()
              .map((b, index) => (
                <li key={index}>
                  <span className="bid-amount">₹{b.amount.toLocaleString()}</span> by <strong>{b.user?.name || "User"}</strong>
                  <br />
                  <span style={{ fontSize: "12px", color: "#999" }}>
                    {new Date(b.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AuctionDetail;
