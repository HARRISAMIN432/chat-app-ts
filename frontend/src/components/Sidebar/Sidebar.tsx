import type React from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarSearchbar from "./SidebarSearchbar";
import Conversations from "./Conversations";
import UserProfile from "./UserProfile";

const Sidebar: React.FC = () => {
  return (
    <div className="min-h-screen bg-white border-r border-gray-200 flex flex-col justify-between">
      <SidebarHeader />
      <SidebarSearchbar />
      <Conversations />
      <UserProfile />
    </div>
  );
};

export default Sidebar;
