// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../config/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth);
      navigate("/auth"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="bg-base-100 shadow-lg sticky top-0 z-10 w-full">
      <div className="flex justify-between p-2">
        <Link className="text-xl font-bold m-3" to="/">
          Buzzify
        </Link>
        <div>
          <Link to="/users" className="btn btn-outline mr-4 text-white">
            Users
          </Link>
          <Link to="/profile" className="btn btn-outline mr-4 text-white">
            Profile
          </Link>
          <button onClick={handleLogout} className="btn btn-outline text-white">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
