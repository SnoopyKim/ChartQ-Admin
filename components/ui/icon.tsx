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
};

export type IconType = keyof typeof icons;

export default function Icon({
  name,
  className,
}: {
  name: IconType;
  className?: string;
}) {
  const IconData = icons[name];

  return <IconData className={cn("w-5 h-5", className)} />;
}
