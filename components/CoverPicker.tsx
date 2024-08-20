import React, { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import CoverOptions from "@/shared/CoverOptions";
import Image from "next/image";
import { Button } from "./ui/button";

interface CoverPickerProps {
  children: ReactNode;
  setNewCover: (cover: string) => void;
}

function CoverPicker({ children, setNewCover }: CoverPickerProps) {
  const [selectedCover, setSelectedCover] = useState("");
  return (
    <Dialog>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Cover</DialogTitle>
          <DialogDescription>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-3">
              {CoverOptions.map((cover, index) => (
                <div
                  onClick={() => setSelectedCover(cover?.imageUrl)}
                  className={`${
                    selectedCover == cover?.imageUrl &&
                    "border-primary border-2"
                  } p-1 rounded-md`}
                  key={index}
                >
                  <Image
                    src={cover?.imageUrl}
                    width={200}
                    height={140}
                    alt="Cover option"
                    className="h-[70px] w-full rounded-md object-cover"
                  />
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={() => setNewCover(selectedCover)}>
              Update
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CoverPicker;
