import type React from "react";
import ChatPlaceholder from "./ChatPlaceholder";
import { useConversationStore } from "../../store/conversationStore";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatWindow: React.FC = () => {
  const { selectedConversation } = useConversationStore();

  return (
    <div className="min-h-screen w-full bg-white flex flex-col justify-between">
      {selectedConversation && <ChatHeader />}
      {selectedConversation && <MessageList />}
      {selectedConversation && <MessageInput />}
      {!selectedConversation && <ChatPlaceholder />}
    </div>
  );
};

export default ChatWindow;
