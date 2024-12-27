import { useState, useEffect } from "react";
import {
  getContactsFromDB,
  getMessagesFromDB,
  saveMessageToDB,
  saveContactsToDB,
} from "../services/indexedDB";

export const useIndexedDB = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchContactsFromDB = async () => {
      const storedContacts = await getContactsFromDB();
      if (storedContacts.length) {
        setContacts(storedContacts);
      }
    };
    fetchContactsFromDB();
  }, []);

  const fetchMessagesForContact = async (contactId: string) => {
    const storedMessages = await getMessagesFromDB(contactId);
    setMessages(storedMessages);
  };

  const saveMessage = async (message: any) => {
    await saveMessageToDB(message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const saveContacts = async (contacts: any[]) => {
    await saveContactsToDB(contacts);
    setContacts(contacts);
  };

  return {
    contacts,
    messages,
    fetchMessagesForContact,
    saveMessage,
    saveContacts,
  };
};
