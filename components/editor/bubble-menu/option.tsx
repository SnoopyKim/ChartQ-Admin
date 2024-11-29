import { cn } from "@/utils/cn";

const BubbleOption = ({
  isActive,
  className,
  onClick,
  children,
}: {
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-2 rounded",
        isActive
          ? "bg-slate-100 text-slate-800"
          : "text-slate-500 hover:bg-slate-50",
        className
      )}
    >
      {children}
    </button>
  );
};

export default BubbleOption;
