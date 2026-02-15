import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, auth } from "../lib/firebase";
import { Upload, CheckCircle, XCircle } from "lucide-react";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setDownloadURL(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !auth.currentUser) return;

    setUploading(true);
    setError(null);

    try {
      const storageRef = ref(storage, `uploads/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setDownloadURL(url);
    } catch (err) {
      console.error("Upload failed", err);
      setError("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Upload Files</h2>
      
      <div className="glass p-10 rounded-2xl text-center">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
        />
        
        <label 
          htmlFor="file-upload"
          className="cursor-pointer block border-2 border-dashed border-white/20 rounded-xl p-10 hover:bg-white/5 transition-all group"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <div>
              <p className="text-lg font-medium text-white">
                {file ? file.name : "Click to select a file"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Any file up to 10MB"}
              </p>
            </div>
          </div>
        </label>

        {downloadURL && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3 text-green-300">
            <CheckCircle size={20} />
            <span>Upload successful!</span>
            <a href={downloadURL} target="_blank" rel="noopener noreferrer" className="ml-auto underline hover:text-white">
              View File
            </a>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-300">
            <XCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="mt-8 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
