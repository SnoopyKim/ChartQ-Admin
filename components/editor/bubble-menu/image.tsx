import { useRef } from "react";
import BubbleOption from "./option";

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
      <BubbleOption onClick={() => inputRef.current?.click()}>
        변경
      </BubbleOption>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};

export default ImageOption;
