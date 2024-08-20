"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2Icon, SmilePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import CoverPicker from "@/components/CoverPicker";
import EmojiPickerComponent from "@/components/EmojiPickerComponent";
import { db } from "@/config/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import uuid4 from "uuid4";

function CreateWorkspace() {
  const [coverImage, setCoverImage] = useState("/cover.png");
  const [workspaceName, setWorkspaceName] = useState("");
  const [emoji, setEmoji] = useState("");
  const { user } = useUser();
  const { orgId } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onCreateWorkspace = async () => {
    setLoading(true);
    const workspaceId = Date.now();

    const result = await setDoc(doc(db, "Workspace", workspaceId.toString()), {
      workspaceName: workspaceName,
      emoji: emoji,
      coverImage: coverImage,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      id: workspaceId,
      orgId: orgId ? orgId : user?.primaryEmailAddress?.emailAddress,
    });

    const docId = uuid4();

    await setDoc(doc(db, "WorkspaceDocuments", docId.toString()), {
      workspaceId: workspaceId,
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
    router.replace("/workspace/" + workspaceId + "/" + docId);
  };
  return (
    <div className="p-10 md:px-36 lg:px-64 xl:px-96 py-28">
      <div className="shadow-2xl rounded-xl">
        {/* Cover image */}
        <CoverPicker setNewCover={(v) => setCoverImage(v)}>
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
                className="w-full h-[180px] object-cover rounded-t-xl"
                priority
              />
            </div>
          </div>
        </CoverPicker>

        {/* Input section */}
        <div className="p-12">
          <h2 className="font-medium text-xl">Create a new workspace</h2>
          <p className="text-sm mt-2">
            This is a shared space where you can collaborate with your team. You
            can always rename it later.
          </p>

          <div className="flex mt-8 gap-2 items-center">
            <EmojiPickerComponent setEmojiIcon={(v) => setEmoji(v)}>
              <Button variant={"outline"}>
                {emoji ? emoji : <SmilePlus />}
              </Button>
            </EmojiPickerComponent>

            <Input
              placeholder="Workspace Name"
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-6 mt-7">
            <Button
              disabled={!workspaceName?.length || loading}
              onClick={onCreateWorkspace}
            >
              Create {loading && <Loader2Icon className="animate-spin ml-2" />}
            </Button>
            <Button variant={"outline"}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkspace;
