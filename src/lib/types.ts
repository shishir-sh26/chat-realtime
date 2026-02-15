export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface PostData {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: number;
  userId: string;
  authorName: string;
}

export interface Room {
  id: string;
  name: string;
  createdAt: number;
  createdBy: string;
  description?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAt: number;
}
 
