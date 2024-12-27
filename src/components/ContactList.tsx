import React from "react";
import { db } from "../App";
import Loading from "./Loading";

interface UserType {
  id: string;
  displayName: string;
  uid: string;
}

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  users: UserType[];
}

interface ContactListProps {
  onSelectContact: (
    contactId: string,
    otherContactId: string,
    otherUserUid: string,
    otherUserDisplayName: string
  ) => void;
}

const query = {
  contacts: {
    $: {
      where: {
        userID: localStorage.getItem("userID") ?? "",
      },
    },
    users: {},
  },
};
const ContactList: React.FC<ContactListProps> = ({ onSelectContact }) => {
  const { isLoading, error, data } = db.useQuery(query);
  if (isLoading) {
    return <Loading />;
  } else if (error) {
    return <div>Error querying data: {error.message}</div>;
  }
  const { contacts }: any = data;

  return (
    <div className="overflow-y-auto p-4">
      <h2 className="text-gray-800">Contacts</h2>
      <ul className="space-y-4">
        {contacts.map((contact: Contact) => (
          <li
            key={contact.id}
            className="p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
            onClick={() =>
              onSelectContact(
                contact.id,
                contact.users[0]?.id,
                contact.users[0]?.uid,
                contact.users[0]?.displayName
              )
            }
          >
            <div className="font-semibold">{contact.users[0]?.displayName}</div>
            <div className="text-sm text-gray-500 truncate max-w-[10rem]">
              {contact.lastMessage ?? "No message"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
