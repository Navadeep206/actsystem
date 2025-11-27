import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import AdminAuctionForm from "./AdminAuctionForm";

const AdminDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [editing, setEditing] = useState(null);
  const { user } = useAuth();

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

  const handleCreated = () => {
    setEditing(null);
    fetchAuctions();
  };

  const handleEdit = (auction) => {
    setEditing(auction);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this auction?")) return;
    await api.delete(`/auctions/${id}`);
    fetchAuctions();
  };

  const handleComplete = async (id) => {
    await api.patch(`/auctions/${id}/complete`);
    fetchAuctions();
  };

  if (!user || user.role !== "admin") return <p>Not authorized</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <AdminAuctionForm auction={editing} onDone={handleCreated} />

      <h3>All Auctions</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Start</th>
            <th>Current</th>
            <th>End Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {auctions.map((a) => (
            <tr key={a._id}>
              <td>{a.title}</td>
              <td>₹{a.startingPrice}</td>
              <td>₹{a.currentPrice}</td>
              <td>{new Date(a.endTime).toLocaleString()}</td>
              <td>{a.status}</td>
              <td>
                <button onClick={() => handleEdit(a)}>Edit</button>
                <button onClick={() => handleDelete(a._id)}>Delete</button>
                {a.status !== "COMPLETED" && (
                  <button onClick={() => handleComplete(a._id)}>
                    Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
