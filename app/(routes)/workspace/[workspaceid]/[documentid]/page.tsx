"use client";
import DocumentEditorSection from "@/components/DocumentEditorSection";
import SideNav from "@/components/SideNav";
import React from "react";

function WorkspaceDocument({
  params,
}: {
  params: { workspaceid: string; documentid: string };
}) {
  return (
    <div>
      {/* Side Nav */}
      <div className="">
        <SideNav params={params} />
      </div>

      {/* Document */}
      <div className="md:ml-72">
        <DocumentEditorSection params={params} />
      </div>
    </div>
  );
}

export default WorkspaceDocument;
