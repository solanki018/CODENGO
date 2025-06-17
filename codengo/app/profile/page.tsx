'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEdit } from "react-icons/fa";

export default function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "", phone: "", about: "", techStack: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);

  // Fetch user data from MongoDB
const fetchUser = async () => {
  try {
    const res = await axios.get("/api/users/me");
    const fetched = res.data.user;

    // Patch with defaults if any field is missing
    setUser({
      name: fetched.name || "",
      email: fetched.email || "",
      phone: fetched.phone || "",
      about: fetched.about || "",
      techStack: fetched.techStack || "",
    });
  } catch (err) {
    toast.error("Failed to load user info");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchUser();
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) setProfileImage(storedImage);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileImage(base64);
        localStorage.setItem("profileImage", base64);
        setShowImageOptions(false);
        toast.success("Profile image updated");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    localStorage.removeItem("profileImage");
    setShowImageOptions(false);
    toast.success("Profile image removed");
  };

  const handleSave = async () => {
    try {
      await axios.put("/api/users/profile", user);
      toast.success("Profile updated!");
      setEditing(false);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;

  return (
  <div className="min-h-screen w-full bg-black text-white px-6 py-12 flex justify-center items-start">
    <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10">
      
      {/* Left Profile Picture Section */}
      <div className="w-full md:w-1/3 flex flex-col items-center">
        <div className="w-48 h-48 rounded-full border border-zinc-600 overflow-hidden shadow-md">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500">
              No Image
            </div>
          )}
        </div>

        <button
          onClick={() => setShowImageOptions(!showImageOptions)}
          className="mt-4 px-4 py-1 bg-zinc-800 text-white text-sm rounded hover:bg-zinc-700 border border-zinc-700"
        >
          Edit Picture
        </button>

        {showImageOptions && (
          <div className="mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-md shadow-sm">
            <label className="block px-4 py-2 text-sm hover:bg-zinc-800 cursor-pointer">
              Change Image
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            <button
              onClick={handleRemoveImage}
              className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800"
            >
              Remove Image
            </button>
          </div>
        )}
      </div>

      {/* Right Info Section */}
      <div className="w-full md:w-2/3 space-y-5">
        {editing ? (
          <>
            <CustomInput label="Name" value={user.name} onChange={(val: string) => setUser({ ...user, name: val })} />
            <CustomInput label="Email" type="email" value={user.email} onChange={(val: string) => setUser({ ...user, email: val })} />
            <CustomInput label="Phone" value={user.phone} onChange={(val: string) => setUser({ ...user, phone: val })} />
            <CustomTextarea label="About" value={user.about} onChange={(val: string) => setUser({ ...user, about: val })} />
            <CustomInput label="Tech Stack" value={user.techStack} onChange={(val: string) => setUser({ ...user, techStack: val })} />
            <button
              onClick={handleSave}
              className="w-full py-2 mt-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded transition"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <DetailRow label="Name" value={user.name} />
            <DetailRow label="Email" value={user.email} />
            <DetailRow label="Phone" value={user.phone} />
            <DetailRow label="About" value={user.about} />
            <DetailRow label="Tech Stack" value={user.techStack} />
            <button
              onClick={() => setEditing(true)}
              className="w-full mt-6 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded text-white"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);

}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-zinc-800 pb-2">
      <span className="text-zinc-500">{label}</span>
      <span className="text-right text-zinc-200">{value || "N/A"}</span>
    </div>
  );
}

function CustomInput({ label, type = "text", value, onChange }: any) {
  return (
    <input
      type={type}
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white border border-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600"
    />
  );
}

function CustomTextarea({ label, value, onChange }: any) {
  return (
    <textarea
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white border border-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600"
    />
  );
}

