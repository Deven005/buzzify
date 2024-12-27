import { useState } from "react";
import { sendMessage } from "../services/instantdb";

export const useInstantDB = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const sendMessageToDB = async (message: any) => {
    await sendMessage(message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return { contacts, setContacts, messages, sendMessageToDB };
};
