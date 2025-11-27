import { useEffect, useState } from "react";
import api from "../api";

const emptyForm = {
  title: "",
  description: "",
  imageUrl: "",
  startingPrice: "",
  endTime: ""
};

const AdminAuctionForm = ({ auction, onDone }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (auction) {
      setForm({
        title: auction.title || "",
        description: auction.description || "",
        imageUrl: auction.imageUrl || "",
        startingPrice: auction.startingPrice || "",
        endTime: auction.endTime
          ? new Date(auction.endTime).toISOString().slice(0, 16)
          : ""
      });
    } else {
      setForm(emptyForm);
    }
  }, [auction]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        startingPrice: Number(form.startingPrice),
        endTime: new Date(form.endTime)
      };

      if (auction) {
        await api.put(`/auctions/${auction._id}`, payload);
      } else {
        await api.post("/auctions", payload);
      }

      setForm(emptyForm);
      onDone && onDone();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving auction");
    }
  };

  return (
    <div className="admin-form">
      <h3>{auction ? "Edit Auction" : "Create Auction"}</h3>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
        />
        <input
          name="startingPrice"
          type="number"
          placeholder="Starting Price"
          value={form.startingPrice}
          onChange={handleChange}
          required
        />
        <label>End Date & Time</label>
        <input
          name="endTime"
          type="datetime-local"
          value={form.endTime}
          onChange={handleChange}
          required
        />
        <button type="submit">{auction ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default AdminAuctionForm;
