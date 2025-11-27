import { useEffect, useState } from "react";
import api from "../api";
import AuctionCard from "../components/AuctionCard";

const AuctionsList = ({ openAuction }) => {
  const [auctions, setAuctions] = useState([]);

  const fetchAuctions = async () => {
    try {
      const res = await api.get("/auctions");
      setAuctions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  return (
    <div>
      <h2>Active Auctions</h2>
      <div className="auction-grid">
        {auctions.map((a) => (
          <AuctionCard
            key={a._id}
            auction={a}
            onClick={() => openAuction(a._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AuctionsList;
