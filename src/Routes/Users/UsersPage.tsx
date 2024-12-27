import { useState } from "react";
import { db } from "../../App";
import { addContact, sendMessage } from "../../services/instantdb";

export type UserType = {
  creationTime: string;
  displayName: string;
  email: string;
  lastSignInTime: string;
  operationType: string;
  providerId: string;
  signInMethod: string;
  uid: string;
};

const UsersPage = () => {
  const [messages, setMessages] = useState<{ [key: string]: string }>({});

  const { isLoading, error, data } = db.useQuery({
    users: {},
    contacts: {
      $: {
        where: {
          or: [
            { userID: localStorage.getItem("userID") ?? "" },
            { otherUserID: localStorage.getItem("userID") ?? "" },
          ],
        },
      },
    },
  });

  const users = data?.users;
  const contacts = data?.contacts;

  // Handle sending message
  const handleMessageChange = (uid: string, message: string) => {
    setMessages((prevMessages) => ({ ...prevMessages, [uid]: message }));
  };

  const handleSendMessage = async (
    otherUserUid: string,
    otherUserDocId: string
  ) => {
    if (isLoading) {
      return;
    }
    const message = messages[otherUserUid];
    if (message) {
      setMessages((prevMessages) => ({ ...prevMessages, [otherUserUid]: "" })); // Clear message field
    }

    const matchingContacts = contacts!.filter(
      (contact) =>
        contact.userID === (localStorage.getItem("userID") ?? "") &&
        contact.otherUserID === otherUserUid
    );

    const currentUser =
      users!.filter((user) => user.uid === localStorage.getItem("userID"))[0] ??
      [];

    if (matchingContacts.length === 0) {
      console.log("No Contact Found!");
      await addContact(
        otherUserUid,
        otherUserDocId,
        currentUser!.id,
        currentUser.uid
      );
    }

    await sendMessage({
      to: otherUserUid,
      message: message,
      contactID1: currentUser!.id,
      contactID2: otherUserDocId,
    });
  };

  return isLoading ? (
    <p>Loading</p>
  ) : error ? (
    <p>{error.message}</p>
  ) : (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Users Information</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users &&
          users
            .filter((user) => user.uid !== localStorage.getItem("userID"))
            .map((user) => (
              <div
                key={user.uid}
                className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center transition-all duration-300 ease-in-out hover:scale-105"
              >
                <div className="w-32 h-32 mb-4 flex items-center justify-center bg-gray-200 rounded-full">
                  {user.displayName ? (
                    <span className="text-2xl text-center text-white">
                      {user.displayName.charAt(0)}
                    </span>
                  ) : (
                    <span className="text-2xl text-center text-gray-500">
                      No Name
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold">
                  {user.displayName || "Unknown User"}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                <div className="flex flex-col w-full mt-4">
                  <input
                    type="text"
                    className="input input-bordered w-full mb-2"
                    placeholder="Type a message..."
                    value={messages[user.uid] || ""}
                    onChange={(e) =>
                      handleMessageChange(user.uid, e.target.value)
                    }
                  />
                  <button
                    onClick={() => handleSendMessage(user.uid, user.id)}
                    className="btn btn-primary w-full"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default UsersPage;
