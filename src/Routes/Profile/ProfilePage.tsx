import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../../config/firebaseConfig";
import { logout, showToast } from "../../utils/utils";
import { updateProfile } from "firebase/auth";
import { db } from "../../App";
import Loading from "../../components/Loading";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  // const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // for image preview
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/auth");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // setNewImage(file);
      const imageUrl = URL.createObjectURL(file); // Create a temporary URL for image preview
      setPreviewImage(imageUrl); // Set the preview image
      handleUploadProfilePicture(file);
    }
  };

  const handleUploadProfilePicture = async (file: File) => {
    console.log("file: ", file);
    console.log("user: ", user);

    if (file && user) {
      try {
        setLoading(true);
        await db.storage.upload(
          `profile_pictures/${user.uid}/${user.uid}.png`,
          file
        );
        const photoURL = await db.storage.getDownloadUrl(
          `profile_pictures/${user.uid}/${user.uid}.png`
        );
        await updateProfile(user, { photoURL });
        setUser((prevUser) =>
          prevUser ? { ...prevUser, photoURL } : prevUser
        );
        showToast({
          type: "s",
          message: "Profile picture updated successfully!",
        });
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        showToast({ type: "e", message: "Failed to update profile picture." });
      } finally {
        setLoading(false);
      }
    } else {
      showToast({ type: "i", message: "Please select an image." });
    }
  };

  if (!user || loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Profile</h2>

          <div className="flex justify-center mb-6">
            <label htmlFor="file-input" className="cursor-pointer">
              {/* Display selected image if any, otherwise show current photo */}
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="User Avatar"
                  className="rounded-full w-32 h-32 object-cover border-2 border-primary"
                />
              ) : user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User Avatar"
                  className="rounded-full w-32 h-32 object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-white text-2xl">
                  {user.displayName?.charAt(0).toUpperCase()}
                </div>
              )}
              <input
                id="file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="mb-4">
            <p className="font-semibold">Display Name:</p>
            <p>{user.displayName || "Not Set"}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Email:</p>
            <p>{user.email}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">UID:</p>
            <p>{user.uid}</p>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-primary w-full mt-4"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
