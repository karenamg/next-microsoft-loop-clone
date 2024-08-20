import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";

function DocumentHeader() {
  return (
    <div className="flex justify-between items-center p-4 px-7 shadow-md">
      <div></div>

      <OrganizationSwitcher />

      <div className="flex gap-3">
        <Button>Share</Button>
        <UserButton />
      </div>
    </div>
  );
}

export default DocumentHeader;
