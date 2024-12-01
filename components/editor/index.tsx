"use client";

import { EditorProvider } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import HardBreak from "@tiptap/extension-hard-break";
import Image from "@tiptap/extension-image";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import "./editor.css";
import FloatingMenuBox from "./floating-menu";
import BubbleMenuBox from "./bubble-menu";

const PostEditor = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (content: string) => void;
}) => {
  return (
    <EditorProvider
      extensions={extensions}
      content={content}
      immediatelyRender={false}
      autofocus="end"
      editorProps={{
        attributes: {
          class: "focus:outline-none border-t border-gray-300 pt-4 min-h-96",
        },
      }}
    >
      <div>
        <FloatingMenuBox />
        <BubbleMenuBox />
      </div>
    </EditorProvider>
  );
};

export default PostEditor;

const extensions = [
  Document,
  Paragraph,
  Text,
  Heading,
  BulletList,
  OrderedList,
  ListItem,
  HardBreak,
  Image,
  Bold,
  Italic,
  Underline,
  Color,
  TextStyle,
  Link,
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
];
