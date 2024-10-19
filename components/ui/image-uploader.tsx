"use client";

import { useState, useRef } from "react";
import Icon from "./icon";

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
  const [preview, setPreview] = useState<string | undefined>(defaultValue);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {labelText}
      </label>
      <div
        className={`relative border-dashed border-2 ${
          preview ? "border-transparent p-0" : "border-gray-400 p-4"
        } rounded-lg h-64 flex justify-center items-center cursor-pointer`}
        onClick={handleClick}
      >
        {preview ? (
          <img
            src={preview}
            alt="Uploaded Image"
            className="max-h-full max-w-full object-contain hover:opacity-75"
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
