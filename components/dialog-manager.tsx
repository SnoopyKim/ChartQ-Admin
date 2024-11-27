"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/shadcn/dialog"; // shadcn Dialog 컴포넌트
import { Button } from "@/components/shadcn/button";
import { useDialog } from "@/hooks/use-dialog";

export default function DialogManager() {
  const { isOpen, title, description, resolve, closeDialog } = useDialog();

  const handleConfirm = () => {
    resolve?.(true); // Resolve with true
    closeDialog();
  };

  const handleCancel = () => {
    resolve?.(false); // Resolve with false
    closeDialog();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button onClick={handleConfirm}>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
