import React from "react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
}) => {
  // Handle the Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      onSend();
    }
  };

  return (
    <div className="message-input flex items-center space-x-3 mt-4 p-3 bg-gray-100 rounded-lg shadow-lg">
      {/* Input Field */}
      <input
        type="text"
        className="input input-bordered input-lg flex-1 rounded-full shadow-sm focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
      />

      {/* Send Button */}
      <button
        className="btn btn-primary rounded-full px-6 py-3 text-white font-semibold text-sm shadow-lg hover:bg-blue-600 transition-all duration-200 ease-in-out disabled:bg-gray-400"
        onClick={onSend}
        disabled={!value.trim()}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
