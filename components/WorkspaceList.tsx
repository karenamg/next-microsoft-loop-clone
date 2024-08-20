"use client";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { AlignLeft, LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function WorkspaceList() {
  const { user } = useUser();
  const [workspaceList, setWorkspaceList] = useState([]);

  return (
    <div className="my-10 p-10 md:px-24 lg:px-36 xl:px-52">
      <div className="flex justify-between">
        <h2 className="font-bold text-2xl">Hello, {user?.fullName}</h2>

        <Link href={"/create-workspace"}>
          <Button>+</Button>
        </Link>
      </div>

      <div className="flex mt-10 justify-between">
        <h2 className="font-medium text-primary">Workspaces</h2>
        <div className="flex gap-2">
          <LayoutGrid />
          <AlignLeft />
        </div>
      </div>

      {workspaceList?.length == 0 ? (
        <div className="flex flex-col justify-center items-center my-10">
          <Image
            src="/workspace.png"
            width={200}
            height={200}
            alt="workspace"
          />

          <h2>Create a new workspace</h2>

          <Link href={"/create-workspace"}>
            <Button className="my-3">+ New Workspace</Button>
          </Link>
        </div>
      ) : (
        <div>Workspace List</div>
      )}
    </div>
  );
}

export default WorkspaceList;
