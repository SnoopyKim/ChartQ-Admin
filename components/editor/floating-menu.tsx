import { cn } from "@/utils/cn";
import { FloatingMenu, useCurrentEditor } from "@tiptap/react";
import { useRef } from "react";
import Icon, { IconType } from "../ui/icon";
import { toast } from "@/hooks/use-toast";

export default function FloatingMenuBox() {
  const { editor } = useCurrentEditor();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (editor && file) {
      if (!["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
        toast({
          variant: "error",
          title: file.type + "형식은 업로드할 수 없습니다.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        editor.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  if (!editor) {
    return null;
  }

  return (
    <>
      <FloatingMenu
        editor={editor}
        tippyOptions={{
          placement: "bottom-start",
          offset: [15, 5],
          duration: [300, 100],
        }}
      >
        <div className="flex flex-col gap-1 p-2 w-36 items-stretch bg-white rounded shadow border border-slate-200">
          <p className="pl-1 text-sm text-slate-900 font-medium">블록 종류</p>
          <FloatingOption
            icon="heading1"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            title="제목 1"
          />
          <FloatingOption
            icon="heading2"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            title="제목 2"
          />
          <FloatingOption
            icon="heading3"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            title="제목 3"
          />
          <FloatingOption
            icon="list"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="기호 목록"
          />
          <FloatingOption
            icon="list-ordered"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="번호 목록"
          />
          <FloatingOption
            icon="image"
            title="이미지"
            onClick={() => inputRef.current?.click()}
          />
        </div>
      </FloatingMenu>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden" // input을 화면에서 숨김
      />
    </>
  );
}

const FloatingOption = ({
  title,
  icon,
  isActive,
  onClick,
}: {
  title: string;
  icon: IconType;
  isActive?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 py-1 px-2 rounded",
        isActive
          ? "bg-slate-100 text-slate-900"
          : "text-slate-600 hover:bg-slate-100"
      )}
    >
      <Icon name={icon} className="w-5 h-5" />
      {title}
    </div>
  );
};
