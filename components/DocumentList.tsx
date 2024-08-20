import React from "react";
import { DocumentData } from "./SideNav";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DocumentOptions from "./DocumentOptions";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { toast } from "sonner";

interface DocumentListProps {
  documentList: DocumentData[];
  params: {
    workspaceid: string;
    documentid: string;
  };
}

function DocumentList({ documentList, params }: DocumentListProps) {
  const router = useRouter();

  const deleteDocument = async (docId: string) => {
    await deleteDoc(doc(db, "WorkspaceDocuments", docId));
    await deleteDoc(doc(db, "DocumentOutput", docId));
    toast("Document deleted!");
  };

  return (
    <div>
      {documentList.map((doc, index) => (
        <div
          key={index}
          onClick={() =>
            router.push("/workspace/" + params?.workspaceid + "/" + doc?.id)
          }
          className={`flex justify-between items-center mt-3 p-2 px-3 hover:bg-gray-200 rounded-lg cursor-pointer ${
            doc.id == params?.documentid && "bg-white"
          }`}
        >
          <div className="flex gap-2 items-center">
            {!doc.emoji && (
              <Image
                src="/loopdocument.svg"
                width={20}
                height={20}
                alt="Loop document"
              />
            )}
            <h2>
              {doc?.emoji} {doc.documentName}
            </h2>
          </div>
          <DocumentOptions
            doc={doc}
            deleteDocument={(docId: string) => deleteDocument(docId)}
          />
        </div>
      ))}
    </div>
  );
}

export default DocumentList;
