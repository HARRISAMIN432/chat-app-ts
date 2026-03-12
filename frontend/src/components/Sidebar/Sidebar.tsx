import type React from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarSearchbar from "./SidebarSearchbar";
import Conversations from "./Conversations";
import UserProfile from "./UserProfile";
import { ConversationsProvider } from "../../contexts/ConversationsContext";

const Sidebar: React.FC = () => {
  return (
    <ConversationsProvider>
      <div className="min-h-screen bg-white border-r border-gray-200 flex flex-col">
        <SidebarHeader />
        <SidebarSearchbar />
        <Conversations />

        <div className="mt-auto">
          <UserProfile />
        </div>
      </div>
    </ConversationsProvider>
  );
};

export default Sidebar;
