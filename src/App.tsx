import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { firebaseAuth } from "./config/firebaseConfig";
import Navbar from "./components/Navbar";
import { User } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import Auth from "./Routes/Auth/Auth";
import Dashboard from "./Routes/Dashboard";
import ProfilePage from "./Routes/Profile/ProfilePage";
import { init } from "@instantdb/react";
import UsersPage from "./Routes/Users/UsersPage";
import NotFoundPage from "./Routes/NotFoundPage";
import Loading from "./components/Loading";
import {
  getFCMToken,
  listenForMessages,
  requestNotificationPermission,
  unsubscribeFromMessages,
} from "./utils/notifications";
import { showToast } from "./utils/utils";

export const db = init({
  appId: "5d91657d-fbc9-498f-be82-ebbc5316a739",
  devtool: true,
});

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false once user state is determined
    });

    const setupNotifications = async () => {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted) {
        const token = await getFCMToken();
        if (token) {
          // setFcmToken(token);
        }
      }

      // Listen for incoming messages while the app is in the foreground
      listenForMessages((payload) => {
        // setMessage(payload);
        showToast({ type: "s", message: "New message received!" }); // Show a toast when a message is received
      });
    };

    setupNotifications();
    return () => {
      unsubscribe();
      unsubscribeFromMessages();
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <ToastContainer />
      <Router>
        {/* Main layout */}
        <div className="flex flex-col h-screen">
          {/* Show Navbar only if user is authenticated */}
          {user && <Navbar />}

          {/* Main content */}
          <div className="flex-1 overflow-auto min-h-fit">
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<Auth />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={user ? <Dashboard /> : <Navigate to="/auth" />}
              />
              <Route
                path="/users"
                element={user ? <UsersPage /> : <Navigate to="/auth" />}
              />
              <Route
                path="/profile"
                element={user ? <ProfilePage /> : <Navigate to="/auth" />}
              />

              {/* Redirect all unmatched routes to Auth if not authenticated */}
              <Route
                path="*"
                element={user ? <NotFoundPage /> : <Navigate to="/auth" />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
