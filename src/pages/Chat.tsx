import React, { useState } from "react";
import RoomList from "../components/chat/RoomList";
import ChatWindow from "../components/chat/ChatWindow";
import type { Room } from "../lib/types";
import { MessageSquare } from "lucide-react";

const Chat: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  return (
    <div className="glass rounded-2xl flex overflow-hidden h-[calc(100vh-6rem)] relative">
       {/* Background Gradients - localized just for the chat area if needed, 
           but we already have global ones in Layout. Adding specific ones for visual flair inside the glass. */}
      
      <RoomList 
        onSelectRoom={setSelectedRoom} 
        selectedRoomId={selectedRoom?.id} 
      />

      {selectedRoom ? (
        <ChatWindow room={selectedRoom} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <MessageSquare size={40} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Select a Room</h3>
          <p className="max-w-md">
            Choose a room from the sidebar or create a new one to start chatting with your friends in real-time!
          </p>
        </div>
      )}
    </div>
  );
};

export default Chat;
