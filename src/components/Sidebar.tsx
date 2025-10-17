// src/components/Sidebar.tsx
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  tab: string;
  setTab: (tab: string) => void;
}

export default function Sidebar({ tab, setTab }: SidebarProps) {
  const { logout } = useAuth();
  return (
    <div className="w-60 bg-white border-r p-4 flex flex-col">
      <button className={`mb-2 ${tab === "broadcast" ? "font-bold" : ""}`} onClick={() => setTab("broadcast")}>Broadcast</button>
      <button className={`mb-2 ${tab === "users" ? "font-bold" : ""}`} onClick={() => setTab("users")}>Users</button>
      <button className={`mb-2 ${tab === "questions" ? "font-bold" : ""}`} onClick={() => setTab("questions")}>Questions</button>
      <button className="mt-auto text-red-500" onClick={logout}>Logout</button>
    </div>
  );
}
