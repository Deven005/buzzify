import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { firebaseAuth } from "../config/firebaseConfig";
import ContactList from "../components/ContactList";
import ChatWindow from "../components/ChatWindow";

function Dashboard() {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null
  );
  const [selectedOtherContactId, setSelectedOtherContactId] = useState<
    string | null
  >(null);
  const [selectedOtherUserUid, setSelectedOtherUserUid] = useState<
    string | null
  >(null);
  const [otherUserDisplayName, setOtherUserDisplayName] = useState<string>("");
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // Check if the user is logged in
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate("/auth"); // Redirect to login if no user is authenticated
      }
    });
    // setSelectedContactId(localStorage.getItem("selectedContactId"));
    // setSelectedOtherContactId(localStorage.getItem("selectedOtherContactId"));
    // setSelectedOtherUserUid(localStorage.getItem("selectedOtherUserUid"));

    return () => unsubscribe();
  }, [navigate]);

  // Handle contact selection
  const handleSelectContact = async (
    contactId: string,
    otherContactId: string,
    otherUserUid: string,
    otherUserDisplayName: string
  ) => {
    setSelectedContactId(contactId);
    setSelectedOtherContactId(otherContactId);
    setSelectedOtherUserUid(otherUserUid);
    setOtherUserDisplayName(otherUserDisplayName);

    // localStorage.setItem("selectedContactId", contactId);
    // localStorage.setItem("selectedOtherContactId", otherContactId);
    // localStorage.setItem("selectedOtherUserUid", otherUserUid);
  };

  return (
    <div className="flex flex-col bg-white h-[88vh]">
      <div
        className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 p-4"
        style={{ height: "calc(100vh - 4rem)" }} // Adjust for navbar height (assumed to be 4rem)
      >
        {/* Left Column: Contact List */}
        <div className="col-span-1 md:col-span-1 bg-gray-100 p-4 rounded-lg shadow-md h-full overflow-auto">
          <ContactList onSelectContact={handleSelectContact} />
        </div>

        {/* Right Column: Chat Window */}
        <div className="col-span-1 md:col-span-3 bg-white p-4 rounded-lg shadow-md h-full overflow-auto">
          {selectedContactId ? (
            <ChatWindow
              contactId={selectedContactId}
              selectedOtherContactId={selectedOtherContactId ?? ""}
              selectedOtherUserUid={selectedOtherUserUid ?? ""}
              currentUserUid={user?.uid ?? ""}
              otherUserDisplayName={otherUserDisplayName}
            />
          ) : (
            <p>Select a contact to start chatting</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
