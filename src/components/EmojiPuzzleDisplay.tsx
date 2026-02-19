import { cn } from "@/lib/utils";

interface EmojiPuzzleDisplayProps {
  emojis: string[];
  revealed?: boolean;
  answer?: string;
  className?: string;
}

export function EmojiPuzzleDisplay({ emojis, revealed, answer, className }: EmojiPuzzleDisplayProps) {
  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {/* Emoji row */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {emojis.map((emoji, i) => (
          <span key={i} className="flex items-center gap-3">
            <span
              className="text-7xl md:text-8xl animate-bounce-in drop-shadow-xl"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {emoji}
            </span>
            {i < emojis.length - 1 && (
              <span className="text-3xl text-muted-foreground font-bold">+</span>
            )}
          </span>
        ))}
        <span className="text-3xl text-muted-foreground font-bold mx-2">= ?</span>
      </div>

      {/* Revealed answer */}
      {revealed && answer && (
        <div className="animate-bounce-in bg-gradient-correct rounded-2xl px-8 py-4 glow-success">
          <p className="text-3xl md:text-4xl font-bold text-white text-center">{answer}</p>
        </div>
      )}
    </div>
  );
}
