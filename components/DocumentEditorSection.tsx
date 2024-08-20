import React from "react";
import DocumentHeader from "./DocumentHeader";
import DocumentInfo from "./DocumentInfo";
import RichDocumentEditor from "./RichDocumentEditor";

interface DocumentEditorSectionProps {
  params: {
    workspaceid: string;
    documentid: string;
  };
}

function DocumentEditorSection({ params }: DocumentEditorSectionProps) {
  return (
    <div>
      {/* Header */}
      <DocumentHeader />

      {/* Document info */}
      <DocumentInfo params={params} />

      {/* Rich text editor */}
      <RichDocumentEditor />
    </div>
  );
}

export default DocumentEditorSection;
