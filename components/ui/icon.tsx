import { cn } from "@/utils/cn";
import { ChartColumnBig, LibraryBig, UsersRound } from "lucide-react";

const icons = {
  "chart-column": ChartColumnBig,
  library: LibraryBig,
  users: UsersRound,
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