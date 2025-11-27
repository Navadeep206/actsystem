import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AuctionsList from "./pages/AuctionList";
import AuctionDetail from "./pages/AuctionDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [view, setView] = useState("home"); // home, login, signup, auctionDetail, admin
  const [selectedAuctionId, setSelectedAuctionId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user && (view === "admin" || view === "auctionDetail")) {
      // just a simple guard
    }
  }, [user, view]);

  const openAuction = (id) => {
    setSelectedAuctionId(id);
    setView("auctionDetail");
  };

  const goHome = () => {
    setSelectedAuctionId(null);
    setView("home");
  };

  return (
    <div className="app-container">
      <Navbar
        view={view}
        setView={setView}
        goHome={goHome}
      />
      <div className="content">
        {view === "home" && <AuctionsList openAuction={openAuction} />}
        {view === "auctionDetail" && selectedAuctionId && (
          <AuctionDetail auctionId={selectedAuctionId} />
        )}
        {view === "login" && <Login onSuccess={goHome} />}
        {view === "signup" && <Signup onSuccess={goHome} />}
        {view === "admin" && user?.role === "admin" && <AdminDashboard />}
        {view === "admin" && !user && <p>Please login as admin.</p>}
      </div>
    </div>
  );
}

export default App;
