import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { PostData } from "../lib/types";
import { Clock, User } from "lucide-react";

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PostData[];
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-400 mt-20">Loading dashboard...</div>;
  }

  return (
    <div>
       <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Recent Activity
        </h2>
        <div className="text-sm text-gray-400">
          {posts.length} Posts
        </div>
      </div>

      <div className="grid gap-6">
        {posts.length === 0 ? (
          <div className="glass p-8 rounded-2xl text-center text-gray-400">
            No posts yet. Start by creating one!
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="glass p-6 rounded-2xl hover:bg-white/5 transition-all group">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                {post.content}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{post.authorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
