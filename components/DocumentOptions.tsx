import { Link2Icon, MoreVertical, PenBox, Trash2 } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentData } from "./SideNav";

interface DocumentOptionsProps {
  doc: DocumentData;
  deleteDocument: (docId: string) => void;
}

function DocumentOptions({ doc, deleteDocument }: DocumentOptionsProps) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="flex gap-2">
            <Link2Icon className="size-4" />
            Share Link
          </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-2">
            <PenBox className="size-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-2 text-red-500"
            onClick={() => deleteDocument(doc?.id)}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default DocumentOptions;
