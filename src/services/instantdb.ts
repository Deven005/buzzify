import { db } from "../App";
import { id } from "@instantdb/react";

export interface MessageType {
  to: string;
  message: string;
  contactID1: string;
  contactID2: string;
  from?: string;
  timestamp?: string;
}

export const sendMessage = async (message: MessageType) => {
  // try {
  console.log("message: ", message);

  message.from = localStorage.getItem("userID") ?? "";
  message.timestamp = new Date().toISOString();
  const res = await db.transact(db.tx.messages[id()].update(message));
  await db.transact(
    db.tx.contacts[message.contactID1].update({
      lastMessage: message.message,
    })
  );
  await db.transact(
    db.tx.contacts[message.contactID2].update({
      lastMessage: message.message,
    })
  );
  console.log("res: send message: ", res);
  // } catch (error) {
  //   console.error(error);
  // }
};

export const addContact = async (
  otherUserID: string,
  otherUserDocId: string,
  currentUserDocId: string,
  currentUserUid: string
) => {
  // const contactID = id();
  const res = await db.transact(
    db.tx.contacts[currentUserDocId].update({
      userID: localStorage.getItem("userID") ?? "",
      otherUserID: otherUserID,
      id: currentUserDocId,
      createdAt: Date.now(),
    })
  );
  await db.transact(
    db.tx.contacts[currentUserDocId].link({
      users: otherUserDocId,
    })
  );
  // const otherContactID = id();
  const res1 = await db.transact(
    db.tx.contacts[otherUserDocId].update({
      otherUserID: localStorage.getItem("userID") ?? "",
      userID: otherUserID,
      id: otherUserDocId,
      createdAt: Date.now(),
    })
  );
  await db.transact(
    db.tx.contacts[otherUserDocId].link({
      users: currentUserDocId,
    })
  );

  console.log("res: add contact: ", res);
  console.log("res1: add contact: ", res1);
  return { currentUserDocId, otherUserDocId };
};
