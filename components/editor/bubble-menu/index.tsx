import { BubbleMenu, useCurrentEditor } from "@tiptap/react";
import { Bold, Italic, Underline } from "lucide-react";
import { useCallback } from "react";
import BubbleOption from "./option";
import ImageOption from "./image";
import { TextColorOption, HighlightOption } from "./color-option";
import { LinkOption } from "./link-option";

export default function BubbleMenuBox() {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return;
  }

  return (
    <BubbleMenu
      editor={editor}
      // tippyOptions={{
      //   hideOnClick: "toggle",
      // }}
    >
      <div className="flex items-center gap-1.5 bg-white shadow rounded p-1.5">
        {editor.getAttributes("image").src ? (
          <>
            <ImageOption
              onChange={(base64) =>
                editor.chain().focus().setImage({ src: base64 }).run()
              }
            />
            <BubbleOption
              onClick={() => editor.chain().focus().deleteSelection().run()}
            >
              삭제
            </BubbleOption>
          </>
        ) : (
          <>
            <BubbleOption
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor?.isActive("bold")}
              className={"font-bold"}
            >
              <Bold className="w-5 h-5" />
            </BubbleOption>
            <BubbleOption
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor?.isActive("italic")}
              className={"italic"}
            >
              <Italic className="w-5 h-5" />
            </BubbleOption>
            <BubbleOption
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor?.isActive("underline")}
              className={"underline underline-offset-2"}
            >
              <Underline className="w-5 h-5" />
            </BubbleOption>

            <div className="w-0.5 h-6 mx-1 bg-slate-200"></div>
            <TextColorOption
              currentColor={editor.getAttributes("textStyle").color}
              onSelect={(color) => {
                if (color) {
                  editor.chain().focus().setColor(color).run();
                } else {
                  editor.chain().focus().unsetColor().run();
                }
              }}
            />
            <HighlightOption
              currentColor={editor.getAttributes("highlight").color}
              onSelect={(color) => {
                if (color) {
                  editor.chain().focus().setHighlight({ color }).run();
                } else {
                  editor.chain().focus().unsetHighlight().run();
                }
              }}
            />
            <div className="w-0.5 h-6 mx-1 bg-slate-200"></div>
            <LinkOption
              defaultValue={editor?.getAttributes("link").href}
              onSetLink={(link) => {
                if (editor.isActive("link") && link === "") {
                  editor.chain().focus().unsetLink().run();
                } else {
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .setLink({ href: link })
                    .run();
                }
              }}
            />
          </>
        )}
      </div>
    </BubbleMenu>
  );
}
