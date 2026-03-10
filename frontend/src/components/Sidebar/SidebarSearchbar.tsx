import { Search } from "lucide-react";
import React from "react";

const SidebarSearchbar: React.FC = () => {
  return (
    <div className="p-4 relative bg-sky-500">
      <input
        type="text"
        placeholder="Search conversations..."
        className="w-full text-sm bg-white text-white placeholder-gray-500 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <Search className="absolute size-[17px] text-blue-200 left-[30px] top-[50%] -translate-y-[50%]" />
    </div>
  );
};

export default SidebarSearchbar;
