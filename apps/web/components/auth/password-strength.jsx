import { cn } from "@/lib/utils";
import { passwordScore } from "@/lib/validate";

const LABEL = ["", "Lemah", "Cukup", "Bagus", "Kuat"];

export function PasswordStrength({ value }) {
  const s = passwordScore(value);
  if (!s) return null;

  return (
    <div className="mt-2 flex items-center gap-3" aria-live="polite">
      <div className="grid flex-1 grid-cols-4 gap-1" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 rounded-full transition-colors duration-200",
              i <= s ? "bg-[#6B68C6]" : "bg-[#181B25] border border-[#242838]/60"
            )}
          />
        ))}
      </div>
      <span className="w-12 text-xs text-[#A5AAC0]">{LABEL[s]}</span>
    </div>
  );
}
