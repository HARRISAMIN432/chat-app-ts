import { Contact, Settings } from "lucide-react";
import React, { useState } from "react";
import AddConversationModal from "./AddConversationModal";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="p-4 bg-sky-500 text-white flex items-center justify-between">
      <h1 className="text-xl font-bold">Messages</h1>
      <div className="flex space-x-3">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-full cursor-pointers"
        >
          <Contact className="size-[16px]" />
        </button>
        <button className="p-2 rounded-full cursor-pointers">
          <Settings className="size-[16px]" />
        </button>
      </div>
      <AddConversationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default Header;
