import { cn } from "@/utils/cn";
import { FloatingMenu, useCurrentEditor } from "@tiptap/react";
import { useRef } from "react";

export default function FloatingMenuBox() {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <FloatingMenu
      editor={editor}
      tippyOptions={{ placement: "right-end", duration: [300, 100] }}
    >
      <div className="flex flex-col w-36 items-stretch bg-grayscale-13 rounded shadow">
        <p className="py-2 text-center text-sm font-medium">블록 종류</p>
        <FloatingOption
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="제목 [대]"
        />
        <FloatingOption
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="제목 [중]"
        />
        <FloatingOption
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="제목 [소]"
        />
        <FloatingOption
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="기호 목록"
        />
        <FloatingOption
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="번호 목록"
        />
        <ImageOption
          onChange={(base64) =>
            editor.chain().focus().setImage({ src: base64 }).run()
          }
        />
      </div>
    </FloatingMenu>
  );
}

const FloatingOption = ({
  title,
  isActive,
  className,
  onClick,
}: {
  title: string;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-w-10 py-3 text-center",
        isActive
          ? "bg-main-2 text-grayscale-14 hover:bg-main-3"
          : "hover:bg-grayscale-11",
        className
      )}
    >
      {title}
    </button>
  );
};

const ImageOption = ({ onChange }: { onChange: (base64: string) => void }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        onChange(base64 as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <FloatingOption
        title="이미지"
        onClick={() => inputRef.current?.click()}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden" // input을 화면에서 숨김
      />
    </>
  );
};
