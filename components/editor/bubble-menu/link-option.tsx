import { Link, X } from "lucide-react";
import BubbleOption from "./option";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/shadcn/button";

export const LinkOption = ({
  defaultValue,
  onSetLink,
}: {
  defaultValue: string;
  onSetLink: (link: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState(defaultValue);

  useEffect(() => {
    setLink(defaultValue);
  }, [defaultValue]);

  return (
    <>
      <BubbleOption onClick={() => setOpen(true)} isActive={!!defaultValue}>
        <Link className="w-5 h-5" />
      </BubbleOption>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>링크 설정</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Input
              id="link"
              defaultValue={defaultValue}
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <Button
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-red-500"
              onClick={() => setLink("")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={() => onSetLink(link)}>확인</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
