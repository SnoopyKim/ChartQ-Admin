"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuGroup,
} from "@/components/shadcn/dropdown-menu";
import Icon from "@/components/ui/icon";
import { useState } from "react";

const colors = [
  {
    label: "기본",
    text: {
      color: "#000",
      style: "text-[#000]",
    },
    highlight: {
      color: "#00000000",
      style: "bg-[#FFFFFF00]",
    },
  },
  {
    label: "회색",
    text: {
      color: "#777",
      style: "text-[#777]",
    },
    highlight: {
      color: "#77777725",
      style: "bg-[#77777725]",
    },
  },
  {
    label: "빨간색",
    text: {
      color: "#C62828",
      style: "text-[#C62828]",
    },
    highlight: {
      color: "#C6282825",
      style: "bg-[#C6282825]",
    },
  },
  {
    label: "주황색",
    text: {
      color: "#FF6B35",
      style: "text-[#FF6B35]",
    },
    highlight: {
      color: "#FF6B3525",
      style: "bg-[#FF6B3525]",
    },
  },
  {
    label: "노란색",
    text: {
      color: "#D1B000",
      style: "text-[#D1B000]",
    },
    highlight: {
      color: "#D1B00025",
      style: "bg-[#D1B00025]",
    },
  },
  {
    label: "초록색",
    text: {
      color: "#4F8A25",
      style: "text-[#4F8A25]",
    },
    highlight: {
      color: "#4F8A1025",
      style: "bg-[#4F8A1025]",
    },
  },
  {
    label: "파란색",
    text: {
      color: "#1F6FBE",
      style: "text-[#1F6FBE]",
    },
    highlight: {
      color: "#1F6FBE25",
      style: "bg-[#1F6FBE25]",
    },
  },
  {
    label: "보라색",
    text: {
      color: "#6A0DAD",
      style: "text-[#6A0DAD]",
    },
    highlight: {
      color: "#6A0DAD25",
      style: "bg-[#6A0DAD25]",
    },
  },
  {
    label: "분홍색",
    text: {
      color: "#D474A2",
      style: "text-[#D474A2]",
    },
    highlight: {
      color: "#D474A225",
      style: "bg-[#D474A225]",
    },
  },
  {
    label: "갈색",
    text: {
      color: "#6B4226",
      style: "text-[#6B4226]",
    },
    highlight: {
      color: "#6B422625",
      style: "bg-[#6B422625]",
    },
  },
];

export const TextColorOption = ({
  currentColor,
  onSelect = () => {},
}: {
  currentColor: string;
  onSelect?: (color: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <button
        type="button"
        className="p-2 hover:bg-slate-50 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon
          name="palette"
          className={`w-5 h-5 ${
            colors.find((c) => c.text.color === currentColor)?.text.style
          }`}
        />
      </button>
      <DropdownMenuTrigger className="absolute bottom-0 right-[8.5rem] w-0 h-0"></DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" sideOffset={10} align="start">
        <DropdownMenuLabel>글자색</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {colors.map((color) => (
            <DropdownMenuItem
              key={color.label}
              className={`${color.text.style}`}
              onSelect={() =>
                onSelect(color.label === "기본" ? "" : color.text.color)
              }
            >
              {color.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const HighlightOption = ({
  currentColor,
  onSelect,
}: {
  currentColor: string;
  onSelect: (color: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <button
        type="button"
        className="p-2 hover:bg-slate-50 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon
          name="highlighter"
          className={`w-5 h-5 ${
            colors.find((c) => c.highlight.color === currentColor)?.text.style
          }`}
        />
      </button>
      <DropdownMenuTrigger className="absolute bottom-0 right-[5.75rem] w-0 h-0"></DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" sideOffset={10} align="start">
        <DropdownMenuLabel>배경색</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {colors.map((color) => (
            <DropdownMenuItem
              key={color.label}
              onSelect={() =>
                onSelect(color.label === "기본" ? "" : color.highlight.color)
              }
            >
              <span
                className={`${color.text.style} ${color.highlight.style} px-2`}
              >
                {color.label}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
