import { Contact, Settings } from "lucide-react";
import React from "react";

const SidebarHeader: React.FC = () => {
  return (
    <div className="p-4 bg-sky-500 text-white flex items-center justify-between">
      <h1 className="text-xl font-bold">Messages</h1>
      <div className="flex space-x-3">
        <button className="p-2 rounded-full cursor-pointers">
          <Contact className="size-[16px]" />
        </button>
        <button className="p-2 rounded-full cursor-pointers">
          <Settings className="size-[16px]" />
        </button>
      </div>
    </div>
  );
};

export default SidebarHeader;
