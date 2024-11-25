"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// dynamic import로 SSR 문제 해결
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }, { size: ["small", false, "large"] }],
    ["bold", "italic", "underline", "strike"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    ["link", "image"],
    ["clean"],
  ],
};

const PostEditor = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (content: string) => void;
}) => {
  return (
    <ReactQuill
      theme="snow"
      value={content} // value 타입 지정 (string)
      onChange={onChange} // onChange는 상태 설정 함수
      modules={quillModules} // 툴바 모듈 설정
    />
  );
};

export default PostEditor;
