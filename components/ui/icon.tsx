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
  Image,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Replace,
  Puzzle,
  LoaderCircle,
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
  list: List,
  "list-ordered": ListOrdered,
  image: Image,
  heading1: Heading1,
  heading2: Heading2,
  heading3: Heading3,
  "align-center": AlignCenter,
  "align-left": AlignLeft,
  "align-right": AlignRight,
  bold: Bold,
  italic: Italic,
  underline: Underline,
  replace: Replace,
  puzzle: Puzzle,
  loading: LoaderCircle,
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
