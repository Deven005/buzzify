import { MessageType } from "../services/instantdb";

interface MessageProps {
  message: MessageType;
  currentUserUid: string;
  otherUserDisplayName: string;
}

const Message = ({
  message,
  currentUserUid,
  otherUserDisplayName,
}: MessageProps) => {
  return (
    <div className="flex mb-4 space-x-3 items-start">
      {/* Avatar for other user */}
      {message.from !== currentUserUid && (
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {/* Placeholder Avatar - can replace "A" with user's actual initials */}
            {otherUserDisplayName.charAt(0).toLocaleUpperCase()}
          </div>
        </div>
      )}

      {/* Message Container */}
      <div
        className={`message p-1 rounded-lg min-w-[10%] max-w-[75%] transition-all duration-300 transform ${
          message.from === currentUserUid
            ? "bg-blue-600 text-white self-end ml-auto rounded-br-none hover:bg-blue-500"
            : "bg-gray-100 text-gray-800 self-start mr-auto rounded-bl-none hover:bg-gray-200"
        } shadow-md flex flex-col relative`}
      >
        {/* Message Text */}
        <p className="text-sm sm:text-base break-words">
          {message.message ?? "Empty message!"}
        </p>
        <p className="pb-4"></p>
        {/* Timestamp */}
        <span
          className={`text-xs absolute bottom-1 right-2 ${
            message.from === currentUserUid ? "text-white" : "text-gray-500"
          }`}
        >
          {new Date(message.timestamp ?? "").toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default Message;
