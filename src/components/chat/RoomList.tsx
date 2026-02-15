import React, { useEffect, useState } from "react";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import type { Room } from "../../lib/types";
import { Plus, Hash, MessageSquare } from "lucide-react";

interface RoomListProps {
  onSelectRoom: (room: Room) => void;
  selectedRoomId?: string;
}

const RoomList: React.FC<RoomListProps> = ({ onSelectRoom, selectedRoomId }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "rooms"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Room[];
      setRooms(roomsData);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, "rooms"), {
        name: newRoomName,
        createdAt: Date.now(),
        createdBy: auth.currentUser.uid,
      });
      setNewRoomName("");
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div className="w-80 border-r border-white/10 flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <MessageSquare size={20} className="text-blue-400" />
          Rooms
        </h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-blue-400"
          title="Create Room"
        >
          <Plus size={20} />
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateRoom} className="p-4 border-b border-white/10 bg-white/5">
          <input
            type="text"
            placeholder="Room name..."
            className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500 mb-2"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-xs font-bold rounded hover:bg-blue-500 transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1 bg-white/10 text-xs font-bold rounded hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room)}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
              selectedRoomId === room.id
                ? "bg-blue-600/20 text-white border border-blue-500/30"
                : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
            }`}
          >
            <Hash size={18} className={selectedRoomId === room.id ? "text-blue-400" : "text-gray-600"} />
            <span className="font-medium truncate">{room.name}</span>
          </button>
        ))}
        {rooms.length === 0 && (
          <div className="text-center text-gray-500 py-8 text-sm">
            No rooms yet. Create one!
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;
