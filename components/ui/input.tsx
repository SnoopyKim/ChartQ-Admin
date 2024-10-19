import { cn } from "@/utils/cn";
import Icon, { IconType } from "./icon";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: IconType;
}

export function Input({ icon, className, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name={icon} className="h-4 w-4 text-slate-500" />
        </div>
      )}
      <input
        {...props}
        className={cn(
          "block w-full px-3 py-2 border rounded-md border-slate-300 shadow-sm focus:border-primary",
          icon ? "pl-10" : "pl-3",
          className
        )}
      />
    </div>
  );
}
