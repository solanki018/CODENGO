'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "", // UI field → mapped to username
    email: "",
    phone: "",
    about: "",
    techStack: "",
    profileImage: null as string | null,
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showImageOptions, setShowImageOptions] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/me");
        const fetched = res.data.user;

        setUser({
          name: fetched.username || "",
          email: fetched.email || "",
          phone: fetched.phone || "",
          about: fetched.about || "",
          techStack: fetched.techStack || "",
          profileImage: fetched.profileImage || null,
        });
      } catch {
        toast.error("Failed to load user info");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUser(prev => ({ ...prev, profileImage: base64 }));
        toast.success("Profile image updated");
        setShowImageOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUser(prev => ({ ...prev, profileImage: null }));
    toast.success("Image removed");
    setShowImageOptions(false);
  };

  const handleSave = async () => {
    try {
      const updateData = {
        name: user.name,
        phone: user.phone,
        about: user.about,
        techStack: user.techStack,
        profileImage: user.profileImage,
      };

      await axios.put("/api/users/profile", updateData);
      toast.success("Profile updated");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <div className="text-white text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10">
        {/* Profile Picture */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="w-48 h-48 rounded-full border border-zinc-600 overflow-hidden shadow-md">
            {user.profileImage ? (
              <img src={user.profileImage} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500">No Image</div>
            )}
          </div>

          <button
            onClick={() => setShowImageOptions(!showImageOptions)}
            className="mt-4 px-4 py-1 bg-zinc-800 text-sm rounded border border-zinc-700 hover:bg-zinc-700"
          >
            Edit Picture
          </button>

          {showImageOptions && (
            <div className="mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-md shadow-sm">
              <label className="block px-4 py-2 text-sm hover:bg-zinc-800 cursor-pointer">
                Change Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <button onClick={handleRemoveImage} className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800">
                Remove Image
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="w-full md:w-2/3 space-y-5">
          {editing ? (
            <>
              <CustomInput label="Name" value={user.name} onChange={(val: string) => setUser({ ...user, name: val })} />
              <CustomInput label="Email" value={user.email} disabled />
              <CustomInput label="Phone" value={user.phone} onChange={(val: string) => setUser({ ...user, phone: val })} />
              <CustomTextarea label="About" value={user.about} onChange={(val: string) => setUser({ ...user, about: val })} />
              <CustomInput label="Tech Stack" value={user.techStack} onChange={(val: string) => setUser({ ...user, techStack: val })} />
              <button onClick={handleSave} className="w-full py-2 mt-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded">
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
              <button onClick={() => setEditing(true)} className="w-full mt-6 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded">
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

function CustomInput({ label, value, onChange, disabled = false }: any) {
  return (
    <input
      type="text"
      placeholder={label}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className={`w-full px-4 py-2 rounded-md bg-zinc-800 text-white border border-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    />
  );
}

function CustomTextarea({ label, value, onChange }: any) {
  return (
    <textarea
      placeholder={label}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      rows={3}
      className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white border border-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600"
    />
  );
}
