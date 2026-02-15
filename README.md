# AlphaApp - High-End Real-time React Application

A modern, scalable social platform built with **React**, **Vite**, **TypeScript**, and **Firebase**. Features a premium "Glassmorphism" UI, real-time chat, and secure data handling.

## 🚀 Features

- **Authentication**: Secure Email/Password login & signup with Firebase Auth.
- **Real-time Dashboard**: Live feed of posts using Firestore.
- **Group Chat**: Real-time chat rooms with instant messaging.
- **File Storage**: Drag-and-drop file uploads via Firebase Storage.
- **Modern UI**: Fully responsive Glassmorphism design using Tailwind CSS.
- **Security**: Protected routes and environment variable configuration.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Backend**: Firebase (Auth, Firestore, Storage)

## 📦 Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/shishir-sh26/chat-realtime.git
    cd chat-realtime
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env` file in the root directory with your Firebase credentials:

    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the App**:
    ```bash
    npm run dev
    ```

## 🔒 Security Rules

To secure your specific database, set up these rules in your Firebase Console:

**Firestore**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read, write: if request.auth != null;
    }
    match /rooms/{roomId} {
      allow read, write: if request.auth != null;
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

**Storage**:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
