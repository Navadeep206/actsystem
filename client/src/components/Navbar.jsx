import { useAuth } from "../context/AuthContext";

const Navbar = ({ view, setView, goHome }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-left" onClick={goHome}>
        <span className="logo">🎯 Auction Hub</span>
      </div>
      <div className="nav-right">
        {user && (
          <span className="nav-user">
            👤 {user.name} • {user.role === "admin" ? "👑 Admin" : "User"}
          </span>
        )}
        {!user && (
          <>
            <button onClick={() => setView("login")}>🔐 Login</button>
            <button onClick={() => setView("signup")}>📝 Sign Up</button>
          </>
        )}
        {user && user.role === "admin" && (
          <button onClick={() => setView("admin")}>⚙️ Admin</button>
        )}
        {user && <button onClick={logout}>🚪 Logout</button>}
      </div>
    </nav>
  );
};

export default Navbar;
