import { openDB } from "idb";

const dbPromise = openDB("buzzify-db", 1, {
  upgrade(db) {
    db.createObjectStore("messages", { keyPath: "id", autoIncrement: true });
    db.createObjectStore("contacts", { keyPath: "id", autoIncrement: true });
    db.createObjectStore("localUser", { keyPath: "id", autoIncrement: true });
  },
});

export const saveMessageToDB = async (message: any) => {
  const db = await dbPromise;
  await db.put("messages", message);
};

export const getMessagesFromDB = async (contactId: string) => {
  const db = await dbPromise;
  const messages = await db.getAllFromIndex("messages", "contactId", contactId);
  return messages;
};

export const saveContactsToDB = async (contacts: any[]) => {
  const db = await dbPromise;
  const tx = db.transaction("contacts", "readwrite");
  const store = tx.objectStore("contacts");
  contacts.forEach((contact) => store.put(contact));
  await tx.done;
};

export const getContactsFromDB = async () => {
  const db = await dbPromise;
  const contacts = await db.getAll("contacts");
  return contacts;
};

export const saveLocalUserToDB = async (localUser: any) => {
  const db = await dbPromise;
  await db.put("localUser", localUser);
};

export const getLocalUserFromDB = async () => {
  const db = await dbPromise;
  const localUser = await db.getAll("localUser");
  return localUser;
};
