import { useHostGame } from "@/hooks/useHostGame";
import { QRDisplay } from "@/components/QRDisplay";
import { EmojiPuzzleDisplay } from "@/components/EmojiPuzzleDisplay";
import { Leaderboard } from "@/components/Leaderboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLAYER_URL_BASE = window.location.origin + "/play";

export default function HostScreen() {
  const {
    roomCode,
    status,
    currentPuzzleIndex,
    currentPuzzle,
    players,
    answers,
    timeLeft,
    isLoading,
    showHint,
    totalPuzzles,
    startGame,
    beginPlaying,
    revealAnswer,
    nextPuzzle,
    resetGame,
  } = useHostGame();

  const playerUrl = roomCode ? `${PLAYER_URL_BASE}/${roomCode}` : "";
  const correctCount = answers.filter((a) => a.is_correct).length;

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Dark top border strip */}
      <div className="h-1.5 w-full" style={{ background: "#1a1a2e" }} />

      {/* Birthday Banner */}
      <div className="w-full py-2 px-4 flex items-center justify-center gap-3 overflow-hidden relative" style={{ background: "linear-gradient(135deg, hsl(214 72% 20%), hsl(207 80% 32%))" }}>
        <span className="text-lg animate-float" style={{ animationDelay: "0s" }}>🎂</span>
        <span className="text-lg animate-float" style={{ animationDelay: "0.3s" }}>🎉</span>
        <p className="text-center text-sm font-bold tracking-widest uppercase" style={{ fontFamily: "'Orbitron', monospace", color: "hsl(207 90% 80%)" }}>
          🎊 Happy Birthday MLSA MIET 🎊
        </p>
        <span className="text-lg animate-float" style={{ animationDelay: "0.6s" }}>🎉</span>
        <span className="text-lg animate-float" style={{ animationDelay: "0.9s" }}>🎂</span>
        {/* Sparkle confetti dots */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {["✨","⭐","🌟","✨","⭐"].map((s, i) => (
            <span key={i} className="absolute text-xs opacity-60 animate-float" style={{ left: `${10 + i * 20}%`, top: "50%", animationDelay: `${i * 0.4}s`, transform: "translateY(-50%)" }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔬</span>
          <div>
            <h1 className="text-xl text-gradient-primary leading-none" style={{ fontFamily: "'Orbitron', monospace", letterSpacing: "0.05em" }}>MLSA MIET</h1>
            <p className="text-xs text-muted-foreground tracking-wider">Emoji Engineering · Host Dashboard</p>
          </div>
        </div>
        {roomCode && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{players.length} player{players.length !== 1 ? "s" : ""}</span>
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
          </div>
        )}
      </header>

      {/* IDLE: Start screen */}
      {status === "idle" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4 py-12">
          <div className="text-center space-y-3">
            <div className="text-8xl mb-4 animate-float">🤖🧠</div>
            <h2 className="text-5xl md:text-7xl text-gradient-primary">Emoji Engineering</h2>
            <p className="text-xl text-muted-foreground max-w-lg">
              Guess the engineering & tech terms from emoji clues!
              Students join on their phones.
            </p>
          </div>

          {/* Example puzzles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
            {[
              { emojis: ["🤖", "🧠"], answer: "Artificial Intelligence" },
              { emojis: ["☁️", "💾"], answer: "Cloud Storage" },
              { emojis: ["🐛", "🔍"], answer: "Debugging" },
              { emojis: ["🔒", "🔑"], answer: "Encryption" },
            ].map((ex, i) => (
              <div key={i} className="bg-gradient-card border border-border rounded-2xl p-4 flex items-center gap-3">
                <span className="text-3xl">{ex.emojis.join(" + ")}</span>
                <div>
                  <span className="text-muted-foreground text-xs">→</span>
                  <p className="font-bold text-sm text-gradient-primary">{ex.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={startGame}
            disabled={isLoading}
            size="lg"
            className="bg-gradient-primary text-primary-foreground text-xl px-12 py-6 rounded-2xl glow-primary hover:scale-105 transition-transform font-bold"
          >
            {isLoading ? "Creating Room..." : "🚀 Start New Game"}
          </Button>
          <p className="text-muted-foreground text-sm">{totalPuzzles} puzzles ready!</p>
        </div>
      )}

      {/* WAITING: Lobby */}
      {status === "waiting" && (
        <div className="flex-1 grid md:grid-cols-2 gap-8 p-6">
          {/* Left: QR + code */}
          <div className="flex flex-col items-center justify-center gap-6 bg-gradient-card border border-border rounded-3xl p-8">
            <h2 className="text-2xl text-center text-muted-foreground">Students: scan to join!</h2>
            <QRDisplay url={playerUrl} roomCode={roomCode} />
            <p className="text-muted-foreground text-sm text-center">
              Or go to <span className="text-accent font-bold">{PLAYER_URL_BASE}/{roomCode}</span>
            </p>
          </div>

          {/* Right: Players + start */}
          <div className="flex flex-col gap-4">
            <div className="bg-gradient-card border border-border rounded-3xl p-6 flex-1">
              <h3 className="text-xl mb-4 text-muted-foreground">
                Players Joined ({players.length})
              </h3>
              {players.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-5xl mb-3">👀</div>
                  <p>Waiting for players to join...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {players.map((p, i) => (
                    <div key={p.id} className="bg-secondary rounded-xl px-3 py-2 flex items-center gap-2 animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      <span className="text-xl">👤</span>
                      <span className="font-semibold truncate">{p.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={beginPlaying}
              disabled={players.length === 0}
              size="lg"
              className="bg-gradient-primary text-primary-foreground text-lg px-8 py-4 rounded-2xl glow-primary hover:scale-105 transition-transform font-bold"
            >
              ▶ Start Game ({players.length} players)
            </Button>
          </div>
        </div>
      )}

      {/* PLAYING: Puzzle display */}
      {(status === "playing" || status === "reveal") && currentPuzzle && (
        <div className="flex-1 flex gap-6 p-6">
          {/* Main puzzle area */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Progress + timer */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Puzzle {currentPuzzleIndex + 1} / {totalPuzzles}
              </span>
              <span className={cn(
                "text-4xl font-bold tabular-nums",
                timeLeft <= 10 ? "text-[hsl(var(--destructive))] animate-pulse" : "text-gradient-primary"
              )}>
                {status === "playing" ? `⏱ ${timeLeft}s` : "⏱ 0s"}
              </span>
              <span className="bg-secondary px-3 py-1 rounded-full text-sm">
                {currentPuzzle.category}
              </span>
            </div>

            {/* Puzzle */}
            <div className="flex-1 flex flex-col items-center justify-center bg-gradient-card border border-border rounded-3xl p-8">
              <EmojiPuzzleDisplay
                emojis={currentPuzzle.emojis}
                revealed={status === "reveal"}
                answer={currentPuzzle.answer}
              />

              {showHint && status === "playing" && (
                <div className="mt-6 bg-secondary border border-border rounded-xl px-6 py-3 animate-slide-up">
                  <p className="text-muted-foreground text-sm">💡 Hint:</p>
                  <p className="font-semibold">{currentPuzzle.hint}</p>
                </div>
              )}
            </div>

            {/* Answers received */}
            {answers.length > 0 && (
              <div className="bg-gradient-card border border-border rounded-2xl p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Answers received: {answers.length} · Correct: {correctCount} 🎯
                </p>
                <div className="flex flex-wrap gap-2">
                  {answers.map((a) => (
                    <span
                      key={a.id}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        a.is_correct
                          ? "bg-gradient-correct text-white"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {a.is_correct ? "✅" : "❌"} {a.player_name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Host controls */}
            <div className="flex gap-3">
              {status === "playing" && (
                <Button
                  onClick={revealAnswer}
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded-xl"
                >
                  👁 Reveal Answer
                </Button>
              )}
              {status === "reveal" && (
                <Button
                  onClick={nextPuzzle}
                  className="bg-gradient-primary text-primary-foreground rounded-xl glow-primary font-bold"
                >
                  {currentPuzzleIndex + 1 >= totalPuzzles ? "🏁 Finish Game" : "Next Puzzle ▶"}
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar: leaderboard + QR */}
          <div className="w-64 flex flex-col gap-4">
            <div className="bg-gradient-card border border-border rounded-3xl p-4">
              <h3 className="text-lg mb-3">🏆 Leaderboard</h3>
              <Leaderboard players={players} maxVisible={6} />
            </div>
            <div className="bg-gradient-card border border-border rounded-3xl p-4 flex flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground">Join via QR</p>
              <QRDisplay url={playerUrl} roomCode={roomCode} />
            </div>
          </div>
        </div>
      )}

      {/* FINISHED */}
      {status === "finished" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 p-6">
          <div className="text-center space-y-2">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-5xl text-gradient-primary">Game Over!</h2>
            <p className="text-xl text-muted-foreground">Final Leaderboard</p>
          </div>
          <div className="w-full max-w-md bg-gradient-card border border-border rounded-3xl p-6">
            <Leaderboard players={players} maxVisible={10} />
          </div>
          <Button
            onClick={resetGame}
            className="bg-gradient-primary text-primary-foreground text-lg px-10 py-4 rounded-2xl glow-primary font-bold"
          >
            🔄 Play Again
          </Button>
        </div>
      )}
    </div>
  );
}
