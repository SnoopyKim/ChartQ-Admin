"use client";

import { useState, useRef, useEffect } from "react";
import Icon from "./icon";
import { Label } from "../shadcn/label";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  labelText?: string;
  defaultValue?: string;
  onFileSelect: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  labelText = "Upload Image",
  defaultValue,
  onFileSelect,
}) => {
  const [preview, setPreview] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (defaultValue) {
      setPreview(defaultValue);
    }
  }, [defaultValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
        toast({
          variant: "error",
          title: file.type + "형식은 업로드할 수 없습니다.",
        });
        e.target.value = "";
        return;
      }
      const newPreviewUrl = URL.createObjectURL(file);
      setPreview(newPreviewUrl);
      onFileSelect(file);
    } else {
      onFileSelect(null);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <Label>
        {labelText}
        <span className="ml-2 text-xs text-gray-500">png, jpeg, gif</span>
      </Label>
      <div
        className={`relative mt-2 border-dashed border-2 ${
          preview ? "border-transparent p-0" : "border-gray-400 p-4"
        } rounded-lg h-64 flex justify-center items-center cursor-pointer`}
        onClick={handleClick}
      >
        {preview ? (
          <Image
            src={preview}
            fill
            alt="Uploaded Image"
            className="object-contain hover:opacity-75"
          />
        ) : (
          <div className="flex flex-col items-center">
            <Icon name="image-plus" className="w-12 h-12 text-gray-500" />
            <p className="text-gray-500 mt-2">이미지를 업로드하세요</p>
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
