"use client";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import Icon from "@/components/ui/icon";
import { useDialog } from "@/hooks/use-dialog";
import { toast } from "@/hooks/use-toast";
import { addTag, deleteTag, getTagList } from "@/services/tag";
import Tag from "@/types/tag";
import { useEffect, useState } from "react";

export default function TagPage() {
  const { openDialog } = useDialog();
  const [tags, setTags] = useState<Tag[]>([]);
  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await getTagList();
      if (error) {
        toast({
          variant: "error",
          title: "태그 조회 실패",
          description: error.message,
        });
      } else {
        setTags(data || []);
      }
    };
    fetchTags();
  }, []);

  const handleDeleteTag = async (id: string) => {
    const isConfirmed = await openDialog({
      title: "태그 삭제",
      description: "정말로 태그를 삭제하시겠습니까?",
    });
    if (!isConfirmed) return;

    const { error } = await deleteTag(id);
    if (error) {
      toast({
        variant: "error",
        title: "태그 삭제 실패",
        description: error.message,
      });
    } else {
      setTags(tags.filter((tag) => tag.id !== id));
      toast({
        variant: "success",
        description: "태그가 성공적으로 삭제되었습니다",
      });
    }
  };

  const handleAddTag = (newTag: Tag) => {
    setTags([...tags, newTag]);
  };

  return (
    <div className="container">
      <h2>태그 관리</h2>
      <div className="flex gap-2 flex-wrap mt-4">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant="outline"
            className="flex gap-1 items-center text-base"
          >
            <span>{tag.name}</span>
            <Icon
              name="close"
              className="w-4 h-4 text-red-500 cursor-pointer"
              onClick={() => handleDeleteTag(tag.id)}
            />
          </Badge>
        ))}
        <NewTagDialog onAdd={handleAddTag} />
      </div>
    </div>
  );
}

const NewTagDialog = ({ onAdd }: { onAdd: (newTag: Tag) => void }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const addNewTag = async () => {
    const { data, error } = await addTag(name);
    if (error || !data) {
      toast({
        variant: "error",
        title: "태그 추가 실패",
        description: error.message,
      });
    } else {
      onAdd(data);
      setOpen(false);
      setName("");
      toast({
        variant: "success",
        description: "태그가 성공적으로 추가되었습니다",
      });
    }
  };

  return (
    <>
      <Badge
        className="flex gap-1 items-center text-base cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Icon name="plus" className="w-5 h-5" /> <span>태그 추가</span>
      </Badge>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>태그 추가</DialogTitle>
            {/* <DialogDescription></DialogDescription> */}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                태그 이름
              </Label>
              <Input
                id="name"
                defaultValue="Pedro Duarte"
                className="col-span-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={addNewTag}>추가</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
