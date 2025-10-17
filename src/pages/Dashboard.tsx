// src/pages/Dashboard.tsx
import Sidebar from "../components/Sidebar";
import BroadcastForm from "../components/BroadcastForm";
import UsersTable from "../components/UserTable";
import QuestionsTable from "../components/QuestionTable";
import { useState } from "react";

export default function Dashboard() {
  const [tab, setTab] = useState("broadcast");

  return (
    <div className="flex h-screen">
      <Sidebar tab={tab} setTab={setTab} />
      <div className="flex-1 p-6 bg-gray-50 overflow-auto">
        {tab === "broadcast" && <BroadcastForm />}
        {tab === "users" && <UsersTable />}
        {tab === "questions" && <QuestionsTable />}
      </div>
    </div>
  );
}

