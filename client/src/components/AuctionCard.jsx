const AuctionCard = ({ auction, onClick }) => {
  const end = new Date(auction.endTime);
  const now = new Date();
  const isOver = now > end || auction.status === "COMPLETED";
  const timeLeft = end - now;
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  const getStatusBadge = () => {
    if (isOver) return "closed";
    if (hoursLeft < 1) return "ending";
    return "open";
  };

  const getStatusText = () => {
    if (isOver) return "CLOSED";
    if (hoursLeft < 1) return "ENDING SOON";
    return "OPEN";
  };

  return (
    <div className="auction-card" onClick={onClick}>
      <div className="auction-card-image-container">
        {auction.imageUrl ? (
          <img src={auction.imageUrl} alt={auction.title} className="auction-img" />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: "14px" }}>
            No Image
          </div>
        )}
        <div className={`auction-card-badge ${getStatusBadge()}`}>
          {getStatusText()}
        </div>
      </div>

      <div className="auction-card-content">
        <h3 className="auction-card-title">{auction.title}</h3>
        <p className="auction-card-desc">{auction.description?.slice(0, 60)}...</p>

        <div className="auction-card-prices">
          <div className="price-info">
            <span className="price-label">Starting</span>
            <span className="price-value">₹{auction.startingPrice.toLocaleString()}</span>
          </div>
          <div className="price-info">
            <span className="price-label">Current Bid</span>
            <span className="price-value">₹{auction.currentPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="auction-card-footer">
          <span className="time-remaining">
            ⏱️ {isOver ? "Ended" : `${hoursLeft}h ${minutesLeft}m left`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
