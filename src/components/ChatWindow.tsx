import { useState } from "react";
import { useInstantDB } from "../hooks/useInstantDB";
import { useIndexedDB } from "../hooks/useIndexedDB";
import MessageInput from "./MessageInput";
import Message from "./Message";
import { db } from "../App";
import Loading from "./Loading";

interface ChatProps {
  contactId: string;
  selectedOtherContactId: string;
  selectedOtherUserUid: string;
  currentUserUid: string;
  otherUserDisplayName: string;
}

const ChatWindow = ({
  contactId,
  selectedOtherContactId,
  selectedOtherUserUid,
  currentUserUid,
  otherUserDisplayName,
}: ChatProps) => {
  const { sendMessageToDB } = useInstantDB();
  const { saveMessage } = useIndexedDB();
  const [newMessage, setNewMessage] = useState("");

  const query = {
    messages: {
      $: {
        where: {
          and: [
            { or: [{ from: selectedOtherUserUid }, { from: currentUserUid }] },
            { or: [{ to: selectedOtherUserUid }, { to: currentUserUid }] },
          ],
        },
      },
    },
  };
  const { isLoading, error, data } = db.useQuery(query);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <div>Error querying data: {error.message}</div>;
  }
  const { messages }: any = data;
  console.log("messages: ", messages);

  const handleSendMessage = () => {
    const message = {
      to: selectedOtherUserUid,
      message: newMessage,
      contactID1: contactId,
      contactID2: selectedOtherContactId,
    };
    console.log("handle message: ", contactId);

    sendMessageToDB(message);
    saveMessage(message);
    setNewMessage("");
  };

  return (
    <div className="chat-window flex flex-col p-4 h-full">
      <div className="messages flex-1 overflow-y-auto space-y-2">
        {messages.map((msg: any, index: number) => (
          <Message
            key={index}
            message={msg}
            currentUserUid={currentUserUid}
            otherUserDisplayName={otherUserDisplayName}
          />
        ))}
      </div>
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default ChatWindow;
