import { cn } from "@/utils/cn";
import {
  ChartColumnBig,
  LibraryBig,
  UsersRound,
  ChevronDown,
  ChevronUp,
  Search,
  FilePen,
  Plus,
  ImagePlus,
  Trash2,
  ArrowLeft,
  Tag,
  X,
  Link,
  Palette,
  Highlighter,
} from "lucide-react";

const icons = {
  "chart-column": ChartColumnBig,
  library: LibraryBig,
  users: UsersRound,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
  search: Search,
  "file-pen": FilePen,
  plus: Plus,
  "image-plus": ImagePlus,
  trash: Trash2,
  "arrow-left": ArrowLeft,
  tag: Tag,
  close: X,
  link: Link,
  palette: Palette,
  highlighter: Highlighter,
};

export type IconType = keyof typeof icons;

export default function Icon({
  name,
  className,
  onClick,
}: {
  name: IconType;
  className?: string;
  onClick?: () => void;
}) {
  const IconData = icons[name];

  return <IconData className={cn("w-5 h-5", className)} onClick={onClick} />;
}
