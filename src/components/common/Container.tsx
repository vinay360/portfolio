import { cn } from "@/lib/utils";

export default function Container({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("container mx-auto max-w-2xl px-4", className)} {...props}>
      {children}
    </div>
  );
}
