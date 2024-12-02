import { BubbleMenu, useCurrentEditor } from "@tiptap/react";
import BubbleOption from "./option";
import ImageOption from "./image";
import { TextColorOption, HighlightOption } from "./color-option";
import { LinkOption } from "./link-option";
import Icon from "@/components/ui/icon";

export default function BubbleMenuBox() {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return;
  }

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        maxWidth: "none",
      }}
    >
      <div className="flex items-center gap-1.5 bg-white shadow rounded p-1.5 border border-slate-200">
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
              <Icon name="trash" className="w-5 h-5" />
            </BubbleOption>
          </>
        ) : (
          <>
            {/* 텍스트 스타일 */}
            <BubbleOption
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor?.isActive("bold")}
              className={"font-bold"}
            >
              <Icon name="bold" className="w-5 h-5" />
            </BubbleOption>
            <BubbleOption
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor?.isActive("italic")}
              className={"italic"}
            >
              <Icon name="italic" className="w-5 h-5" />
            </BubbleOption>
            <BubbleOption
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor?.isActive("underline")}
              className={"underline underline-offset-2"}
            >
              <Icon name="underline" className="w-5 h-5" />
            </BubbleOption>
            <div className="w-0.5 h-6 mx-1 bg-slate-200"></div>
            {/* 텍스트 정렬 */}
            <BubbleOption
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive("textAlign", { align: "left" })}
            >
              <Icon name="align-left" className="w-5 h-5" />
            </BubbleOption>
            <BubbleOption
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              isActive={editor.isActive("textAlign", { align: "center" })}
            >
              <Icon name="align-center" className="w-5 h-5" />
            </BubbleOption>
            <BubbleOption
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive("textAlign", { align: "right" })}
            >
              <Icon name="align-right" className="w-5 h-5" />
            </BubbleOption>
            <div className="w-0.5 h-6 mx-1 bg-slate-200"></div>
            {/* 텍스트 색상 */}
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
            {/* 링크 */}
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
