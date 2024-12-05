import { useRef } from "react";
import BubbleOption from "./option";
import Icon from "@/components/ui/icon";
import { toast } from "@/hooks/use-toast";

const ImageOption = ({ onChange }: { onChange: (base64: string) => void }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
        toast({
          variant: "error",
          title: file.type + "형식은 업로드할 수 없습니다.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        onChange(base64 as string);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };
  return (
    <>
      <BubbleOption onClick={() => inputRef.current?.click()}>
        <Icon name="replace" className="w-5 h-5" />
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
