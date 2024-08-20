import { UserButton } from "@clerk/nextjs";
import React from "react";
import Header from "../../../components/Header";
import WorkspaceList from "@/components/WorkspaceList";

function Dashboard() {
  return (
    <div>
      <Header />
      <WorkspaceList />
    </div>
  );
}

export default Dashboard;
