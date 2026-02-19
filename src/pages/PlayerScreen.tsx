import { useParams } from "react-router-dom";
import { usePlayerGame } from "@/hooks/usePlayerGame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function PlayerScreen() {
  const { code } = useParams<{ code: string }>();
  const roomCode = (code || "").toUpperCase();

  const {
    playerName,
    setPlayerName,
    status,
    currentPuzzle,
    currentPuzzleIndex,
    answer,
    setAnswer,
    score,
    isCorrect,
    revealedAnswer,
    error,
    isLoading,
    join,
    submit,
  } = usePlayerGame(roomCode);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (status === "join") join();
      else if (status === "playing") submit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Dark top border strip */}
      <div className="h-1.5 w-full" style={{ background: "#1a1a2e" }} />

      {/* Birthday Banner */}
      <div className="w-full py-1.5 px-4 flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, hsl(214 72% 20%), hsl(207 80% 32%))" }}>
        <span className="text-sm">🎂</span>
        <p className="text-center text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'Orbitron', monospace", color: "hsl(207 90% 80%)" }}>
          🎊 Happy Birthday MLSA MIET 🎊
        </p>
        <span className="text-sm">🎂</span>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔬</span>
          <div>
            <p className="font-bold text-sm leading-none text-gradient-primary" style={{ fontFamily: "'Orbitron', monospace", letterSpacing: "0.05em" }}>MLSA MIET</p>
            <p className="text-xs text-muted-foreground">Room: {roomCode}</p>
          </div>
        </div>
        {status !== "join" && (
          <div className="bg-gradient-primary rounded-full px-3 py-1">
            <span className="text-primary-foreground font-bold text-sm">⭐ {score} pts</span>
          </div>
        )}
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-6">

        {/* JOIN screen */}
        {status === "join" && (
          <div className="w-full max-w-sm space-y-6 animate-slide-up">
            <div className="text-center">
              <div className="text-6xl mb-3">👋</div>
              <h2 className="text-3xl text-gradient-primary">Join Game!</h2>
              <p className="text-muted-foreground mt-1">Room: <span className="font-bold text-foreground">{roomCode}</span></p>
            </div>
            <div className="space-y-3">
              <Input
                placeholder="Your name..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-center text-lg py-6 bg-secondary border-border rounded-2xl"
                autoFocus
                maxLength={20}
              />
              {error && (
                <p className="text-[hsl(var(--destructive))] text-center text-sm">{error}</p>
              )}
              <Button
                onClick={join}
                disabled={isLoading || !playerName.trim()}
                className="w-full bg-gradient-primary text-primary-foreground text-lg py-6 rounded-2xl glow-primary font-bold"
              >
                {isLoading ? "Joining..." : "🚀 Join!"}
              </Button>
            </div>
          </div>
        )}

        {/* LOBBY */}
        {status === "lobby" && (
          <div className="text-center space-y-4 animate-bounce-in">
            <div className="text-7xl animate-float">⏳</div>
            <h2 className="text-3xl text-gradient-primary">You're in!</h2>
            <p className="text-xl font-bold">Hey, <span className="text-gradient-accent">{playerName}</span>! 👋</p>
            <p className="text-muted-foreground">Waiting for the host to start the game...</p>
            <div className="bg-gradient-card border border-border rounded-2xl px-6 py-4 text-sm text-muted-foreground">
              Look at the main screen for the emoji puzzles!
            </div>
          </div>
        )}

        {/* PLAYING */}
        {status === "playing" && currentPuzzle && (
          <div className="w-full max-w-sm space-y-6 animate-slide-up">
            {/* Puzzle emojis */}
            <div className="bg-gradient-card border border-border rounded-3xl p-6">
              <p className="text-center text-sm text-muted-foreground mb-4">
                Puzzle {currentPuzzleIndex + 1} · {currentPuzzle.category}
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap text-5xl">
                {currentPuzzle.emojis.map((emoji, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span>{emoji}</span>
                    {i < currentPuzzle.emojis.length - 1 && (
                      <span className="text-xl text-muted-foreground">+</span>
                    )}
                  </span>
                ))}
                <span className="text-xl text-muted-foreground">= ?</span>
              </div>
            </div>

            {/* Answer input */}
            <div className="space-y-3">
              <Input
                placeholder="Type your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-center text-lg py-6 bg-secondary border-border rounded-2xl"
                autoFocus
              />
              <Button
                onClick={submit}
                disabled={!answer.trim()}
                className="w-full bg-gradient-primary text-primary-foreground text-lg py-6 rounded-2xl glow-primary font-bold"
              >
                ✅ Submit Answer
              </Button>
            </div>
          </div>
        )}

        {/* ANSWERED - waiting for host to reveal */}
        {status === "answered" && (
          <div className="text-center space-y-4 animate-bounce-in">
            {isCorrect === true && (
              <>
                <div className="text-8xl">🎉</div>
                <h2 className="text-4xl text-gradient-primary">Answer Submitted!</h2>
                <div className="bg-gradient-correct rounded-2xl px-6 py-4 glow-success">
                  <p className="text-white text-xl font-bold">Looks correct! 🎯</p>
                </div>
              </>
            )}
            {isCorrect === false && (
              <>
                <div className="text-8xl">😅</div>
                <h2 className="text-4xl">Submitted!</h2>
              </>
            )}
            <p className="text-muted-foreground text-sm animate-float">⏳ Waiting for host to reveal answer...</p>
            <div className="bg-gradient-primary rounded-full px-4 py-2 inline-block">
              <span className="text-primary-foreground font-bold">⭐ {score} points</span>
            </div>
          </div>
        )}

        {/* REVEAL - host revealed the answer */}
        {status === "reveal" && (
          <div className="text-center space-y-4 animate-bounce-in">
            {isCorrect === true ? (
              <>
                <div className="text-8xl">🎉</div>
                <h2 className="text-4xl text-gradient-primary">Correct!</h2>
                <div className="bg-gradient-correct rounded-2xl px-6 py-4 glow-success">
                  <p className="text-white text-xl font-bold">+100 points! 🏆</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-8xl">😅</div>
                <h2 className="text-4xl">Nice try!</h2>
                <p className="text-muted-foreground">The answer was:</p>
                <div className="bg-gradient-card border border-border rounded-2xl px-6 py-4 glow-accent">
                  <p className="text-2xl font-bold text-gradient-accent">
                    {revealedAnswer}
                  </p>
                </div>
              </>
            )}
            <p className="text-muted-foreground text-sm">Waiting for next puzzle...</p>
            <div className="bg-gradient-primary rounded-full px-4 py-2 inline-block">
              <span className="text-primary-foreground font-bold">⭐ {score} points</span>
            </div>
          </div>
        )}

        {/* FINISHED */}
        {status === "finished" && (
          <div className="text-center space-y-4 animate-bounce-in">
            <div className="text-8xl">🏁</div>
            <h2 className="text-4xl text-gradient-primary">Game Over!</h2>
            <p className="text-xl text-muted-foreground">Your final score:</p>
            <div className={cn(
              "rounded-3xl px-10 py-6",
              score >= 300 ? "bg-gradient-primary glow-primary" : "bg-gradient-card border border-border"
            )}>
              <p className={cn("text-5xl font-bold", score >= 300 ? "text-primary-foreground" : "text-gradient-primary")}>
                ⭐ {score}
              </p>
              <p className={cn("text-lg mt-1", score >= 300 ? "text-primary-foreground" : "text-muted-foreground")}>
                {score >= 500 ? "Engineering Genius! 🧠" :
                 score >= 300 ? "Tech Star! 🌟" :
                 score >= 100 ? "Good effort! 👍" : "Keep learning! 📚"}
              </p>
            </div>
            <p className="text-muted-foreground text-sm">Check the main screen for the full leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
}
