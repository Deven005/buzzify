import { toast } from "react-toastify";
import { firebaseAuth } from "../config/firebaseConfig";

type ToastType = "s" | "e" | "i" | "w" | "r"; // Added 'r' for rejected API call

interface ToastParams {
  type: ToastType; // 's' for success, 'e' for error, 'i' for info, 'w' for warning, 'r' for rejected
  message: string; // The message to show
}

const showToast = ({ type, message }: ToastParams) => {
  // Map the type to corresponding Toastify method
  switch (type) {
    case "s":
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      break;
    case "e":
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      break;
    case "i":
      toast.info(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      break;
    case "w":
      toast.warning(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      break;
    case "r":
      toast.error(`Request failed: ${message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      break;
    default:
      console.warn("Invalid toast type");
  }
};

const clearIndexedDB = async () => {
  if (window.indexedDB) {
    const request = window.indexedDB.deleteDatabase("buzzify-db"); // Replace with your database name
    request.onsuccess = () => {
      console.log("IndexedDB cleared");
    };
    request.onerror = (e) => {
      console.error("Error clearing IndexedDB", e);
    };
  }
};

const logout = async () => {
  try {
    // Sign out from Firebase Authentication
    await firebaseAuth.signOut();

    // Clear user data from localStorage
    localStorage.clear();

    // Clear IndexedDB data
    await clearIndexedDB();

    // Show a success message after logging out
    showToast({ type: "s", message: "Successfully logged out" });
  } catch (error) {
    console.error("Logout error", error);
    showToast({ type: "e", message: "Logout failed. Please try again." });
  }
};

export { showToast, logout };
