"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { addImageToStorage, updateStudy } from "@/services/study";

// dynamic import로 SSR 문제 해결
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const PostEditor = ({
  studyId,
  defaultValue,
}: {
  studyId: string;
  defaultValue: string;
}) => {
  console.log("Editor defaultValue: ", defaultValue);
  const [content, setContent] = useState<string>(defaultValue); // 상태 타입을 명시적으로 설정

  // 저장할 때 호출되는 함수
  const savePost = async () => {
    let htmlContent = content; // 현재 HTML 내용

    // Base64 이미지 찾기
    const base64Images = htmlContent.match(
      /<img[^>]+src="data:image\/[^">]+">/g
    );

    if (base64Images) {
      // 모든 Base64 이미지를 업로드하고 URL로 변환
      for (let i = 0; i < base64Images.length; i++) {
        const imgTag = base64Images[i];
        const base64Data = imgTag.match(/src="([^"]+)"/)![1];
        const file = base64ToFile(base64Data); // Base64를 파일로 변환

        const { data: imageUrl, error } = await addImageToStorage(
          "study",
          file,
          `${studyId}/content-${i}.png`
        );
        if (error || !imageUrl) {
          return;
        }
        // HTML 내용에서 Base64 이미지를 업로드된 URL로 교체
        htmlContent = htmlContent.replace(base64Data, imageUrl);
      }
    }

    // 이미지 URL로 교체된 HTML 저장
    const result = await updateStudy({ id: studyId, content: htmlContent });

    if (!result) {
      console.error("Error saving post:");
    } else {
      console.log("Post saved successfully:");
    }
  };

  // Base64 문자열을 File 객체로 변환하는 함수
  const base64ToFile = (base64: string, filename = "image.png") => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={content} // value 타입 지정 (string)
        onChange={setContent} // onChange는 상태 설정 함수
        modules={modules} // 툴바 모듈 설정
      />
      <button onClick={savePost}>Save Post</button>
    </div>
  );
};

export default PostEditor;
