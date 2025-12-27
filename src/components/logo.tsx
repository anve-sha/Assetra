import { cn } from "@/lib/utils";

const HardHatIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
  </svg>
);

export function AssetraLogo({ size = 'sm', withText = true }: { size?: 'sm' | 'lg', withText?: boolean }) {
  const isLg = size === 'lg';

  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "flex items-center justify-center text-primary-foreground rounded-[10px] [background:linear-gradient(180deg,#4e80ee_0%,#3563c2_100%)]",
        isLg ? "w-14 h-14 p-3" : "w-8 h-8 p-1.5"
      )}>
        <HardHatIcon className={cn(isLg ? "w-8 h-8" : "w-5 h-5")} />
      </div>
      {withText && (
        <h1 className="text-xl font-bold hidden sm:block text-foreground">Assetra</h1>
      )}
    </div>
  );
}
