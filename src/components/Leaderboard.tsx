import { cn } from "@/lib/utils";

interface Player {
  id: string;
  name: string;
  score: number;
}

interface LeaderboardProps {
  players: Player[];
  maxVisible?: number;
  className?: string;
}

const medals = ["🥇", "🥈", "🥉"];

export function Leaderboard({ players, maxVisible = 8, className }: LeaderboardProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score).slice(0, maxVisible);

  if (sorted.length === 0) {
    return (
      <div className={cn("text-center text-muted-foreground py-4", className)}>
        <p className="text-lg">Waiting for players...</p>
        <p className="text-sm mt-1">Scan the QR code to join!</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {sorted.map((player, i) => (
        <div
          key={player.id}
          className={cn(
            "flex items-center justify-between px-4 py-2.5 rounded-xl animate-slide-up",
            i === 0 ? "bg-gradient-primary text-primary-foreground glow-primary" :
            i === 1 ? "bg-secondary border border-border" :
            i === 2 ? "bg-secondary border border-border" :
            "bg-muted"
          )}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl w-8 text-center">
              {medals[i] || `#${i + 1}`}
            </span>
            <span className={cn("font-bold", i === 0 ? "text-primary-foreground" : "text-foreground")}>
              {player.name}
            </span>
          </div>
          <span className={cn("font-bold text-lg", i === 0 ? "text-primary-foreground" : "text-gradient-primary")}>
            {player.score}
          </span>
        </div>
      ))}
    </div>
  );
}
