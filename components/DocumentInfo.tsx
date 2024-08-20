"use client";
import React, { useEffect, useState } from "react";
import CoverPicker from "./CoverPicker";
import Image from "next/image";
import EmojiPickerComponent from "./EmojiPickerComponent";
import { SmilePlus } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { DocumentData } from "./SideNav";
import { toast } from "sonner";

interface DocumentInfoProps {
  params: {
    workspaceid: string;
    documentid: string;
  };
}

function DocumentInfo({ params }: DocumentInfoProps) {
  const [coverImage, setCoverImage] = useState("/cover.png");
  const [emoji, setEmoji] = useState("");
  const [documentInfo, setDocumentInfo] = useState<DocumentData | null>(null);

  useEffect(() => {
    params && getDocumentInfo();
  }, [params]);

  const getDocumentInfo = async () => {
    const docRef = doc(db, "WorkspaceDocuments", params?.documentid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
      setDocumentInfo(docSnap.data() as DocumentData);
      setEmoji(docSnap.data()?.emoji || "");
      setCoverImage(docSnap.data()?.coverImage || "/cover.png");
    }
  };

  const updateDocumentInfo = async (key: string, value: string) => {
    const docRef = doc(db, "WorkspaceDocuments", params?.documentid);
    await updateDoc(docRef, {
      [key]: value,
    });

    toast("Document Updated!");
  };

  return (
    <div>
      {/* Cover */}
      <CoverPicker
        setNewCover={(v) => {
          setCoverImage(v);
          updateDocumentInfo("coverImage", v);
        }}
      >
        <div className="relative group cursor-pointer">
          <h2 className="hidden absolute p-4 size-full justify-center items-center group-hover:flex">
            Change Cover
          </h2>
          <div className="group-hover:opacity-40">
            <Image
              src={coverImage}
              width={400}
              height={400}
              alt="Cover image"
              className="w-full h-[200px] object-cover rounded-t-xl"
              priority
            />
          </div>
        </div>
      </CoverPicker>

      {/* Emoji picker */}
      <div className="absolute ml-10 px-20 mt-[-40px] cursor-pointer">
        <EmojiPickerComponent
          setEmojiIcon={(v) => {
            setEmoji(v);
            updateDocumentInfo("emoji", v);
          }}
        >
          <div className="bg-[#ffffffb0] p-4 rounded-full">
            {emoji ? (
              <span className="text-4xl">{emoji}</span>
            ) : (
              <SmilePlus className="size-10 text-gray-500" />
            )}
          </div>
        </EmojiPickerComponent>
      </div>

      {/* File name */}
      <div className="mt-10 p-10 px-20 ml-10">
        <input
          type="text"
          placeholder="Untitled Document"
          defaultValue={documentInfo?.documentName}
          className="font-bold text-4xl outline-none"
          onBlur={(event) =>
            updateDocumentInfo("documentName", event.target.value)
          }
        />
      </div>
    </div>
  );
}

export default DocumentInfo;
