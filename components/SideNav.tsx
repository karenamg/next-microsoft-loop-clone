import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import { Bell, Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "@/components/ui/progress";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import DocumentList from "./DocumentList";
import uuid4 from "uuid4";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface SideNavProps {
  params: {
    workspaceid: string;
    documentid: string;
  };
}

export type DocumentData = {
  workspaceId: number;
  createdBy: string;
  id: string;
  coverImage: string;
  emoji: string;
  documentName: string;
  documentOutput: [];
};

const MAX_FILE = 5;

function SideNav({ params }: SideNavProps) {
  const [documentList, setDocumentList] = useState<DocumentData[]>([]);
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const getDocumentList = () => {
    const q = query(
      collection(db, "WorkspaceDocuments"),
      where("workspaceId", "==", Number(params?.workspaceid))
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setDocumentList([]);
      querySnapshot.forEach((doc) => {
        setDocumentList((documentList) => [
          ...documentList,
          doc.data() as DocumentData,
        ]);
      });
    });
  };

  useEffect(() => {
    params && getDocumentList();
  }, [params, getDocumentList]);

  const createNewDocument = async () => {
    if (documentList?.length >= MAX_FILE) {
      toast("Upgrade to add new file", {
        description:
          "You reach max file, please upgrad for unlimited file creation",
        action: {
          label: "Upgrade",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    setLoading(true);
    const docId = uuid4();
    setDocumentList([]);

    await setDoc(doc(db, "WorkspaceDocuments", docId.toString()), {
      workspaceId: Number(params?.workspaceid),
      createdBy: user?.primaryEmailAddress?.emailAddress,
      coverImage: null,
      emoji: null,
      id: docId,
      documentName: "Untitled Document",
      documentOutput: [],
    });

    await setDoc(doc(db, "DocumentOutput", docId.toString()), {
      docId: docId,
      output: [],
    });

    setLoading(false);
    router.replace("/workspace/" + params?.workspaceid + "/" + docId);
  };

  return (
    <div className="h-screen md:w-72 hidden md:block fixed bg-blue-50 p-5 shadow-md">
      <div className="flex justify-between items-center">
        <Logo />
        <Bell className="size-5 text-gray-500" />
      </div>

      <hr className="my-5" />

      <div className="">
        <div className="flex justify-between items-center">
          <h2 className="font-medium">Workspace Name</h2>
          <Button size="sm" onClick={createNewDocument}>
            {loading ? <Loader2Icon className="size-4 animate-spin" /> : "+"}
          </Button>
        </div>
      </div>

      {/* Document List */}
      <DocumentList documentList={documentList} params={params} />

      {/* Progress Bar */}
      <div className="absolute bottom-10 w-[85%]">
        <Progress value={(documentList?.length / MAX_FILE) * 100} />
        <h2 className="text-sm font-light my-2">
          <strong>{documentList?.length}</strong> out of{" "}
          <strong>{MAX_FILE}</strong> files used
        </h2>
        <h2 className="text-sm font-light">
          Upgrade your plan for unlimited access
        </h2>
      </div>
    </div>
  );
}

export default SideNav;
