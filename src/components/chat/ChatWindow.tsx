import React, { useEffect, useState, useRef } from "react";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import type { Room, Message } from "../../lib/types";
import { Send } from "lucide-react";

interface ChatWindowProps {
  room: Room;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ room }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const dummyDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, "rooms", room.id, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(msgs);
      setTimeout(() => dummyDiv.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    return () => unsubscribe();
  }, [room.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, "rooms", room.id, "messages"), {
        text: newMessage,
        createdAt: Date.now(),
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName || "Anonymous",
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <span className="text-gray-400">#</span> {room.name}
        </h2>
        {room.description && <p className="text-xs text-gray-500">{room.description}</p>}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === auth.currentUser?.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white/10 text-gray-200 rounded-bl-none"
                }`}
              >
                {!isMe && (
                  <p className="text-[10px] text-gray-400 mb-1 font-bold">{msg.senderName}</p>
                )}
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={dummyDiv} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5">
        <div className="relative">
          <input
            type="text"
            placeholder={`Message #${room.name}`}
            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
