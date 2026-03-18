import { Send } from "lucide-react";
import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useConversationStore } from "../../store/conversationStore";
import { useSocketContext } from "../../contexts/SocketContext";

const MessageInput: React.FC = () => {
  const { user } = useAuthStore();
  const { selectedConversation } = useConversationStore();
  const { socket } = useSocketContext();
  const [message, setMessage] = useState("");

  if (!selectedConversation) return;

  const handleSendMessage = () => {
    if (message.trim() === "" || !user || !socket) return;
    socket.emit("conversation:send-message", {
      conversationId: selectedConversation.conversationId,
      userId: user.id,
      friendId: selectedConversation.friend.id,
      content: message,
    });
    setMessage("");
  };

  return (
    <div className="p-4 border border-gray-200 bg-white">
      <div className="flex items-center">
        <div className="flex-1">
          <textarea
            placeholder="Type a message..."
            className="w-full text-sm bg-gray-100 rounded-full py-3 px-4 focus:outline:none focus:ring-2 focus:ring-sky-500 resize-none"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
        </div>
        <div className="ml-3">
          <button
            type="button"
            className="bg-sky-500 text-white rounded-full size-10 flex items-center justify-center hover:bg-sky-600 cursor-pointer"
            onClick={handleSendMessage}
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
