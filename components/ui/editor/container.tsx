"use client";

import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorProvider, BubbleMenu, FloatingMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorMenu from "./menu";

const extensions = [StarterKit, Color, Underline, TextStyle];

export default function EditorContainer() {
  return (
    <EditorProvider
      slotBefore={<EditorMenu />}
      extensions={extensions}
      immediatelyRender={false}
    >
      <FloatingMenu editor={null}>Bubble Menu!</FloatingMenu>
      <BubbleMenu editor={null}>Bubble Menu!</BubbleMenu>
    </EditorProvider>
  );
}
