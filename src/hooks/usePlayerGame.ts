import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { joinRoom, submitAnswer } from "@/lib/gameService";
import { puzzles } from "@/data/puzzles";

type PlayerStatus = "join" | "lobby" | "playing" | "answered" | "reveal" | "finished";

/** Simple Levenshtein distance for fuzzy matching */
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

/** Accept if exact OR within allowed typos (1 typo per 5 chars, max 2) */
function isCloseEnough(userAnswer: string, correct: string): boolean {
  const u = userAnswer.trim().toLowerCase();
  const c = correct.trim().toLowerCase();
  if (u === c) return true;
  const allowedDistance = Math.min(2, Math.floor(c.length / 5));
  return levenshtein(u, c) <= allowedDistance;
}

export function usePlayerGame(roomCode: string) {
  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [status, setStatus] = useState<PlayerStatus>("join");
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roomStatus, setRoomStatus] = useState<string>("waiting");
  const [answeredPuzzles, setAnsweredPuzzles] = useState<Set<number>>(new Set());
  const [revealedAnswer, setRevealedAnswer] = useState<string | null>(null);

  const currentPuzzle = puzzles[currentPuzzleIndex];

  const refreshScore = useCallback(async (pid: string) => {
    const { data } = await supabase.from("players").select("score").eq("id", pid).single();
    if (data) setScore(data.score);
  }, []);

  const join = async () => {
    if (!playerName.trim()) { setError("Enter your name!"); return; }
    setIsLoading(true);
    setError("");
    try {
      const { data: room } = await supabase.from("game_rooms").select("*").eq("code", roomCode).single();
      if (!room) { setError("Room not found. Check the code!"); return; }
      if (room.status === "finished") { setError("This game has ended."); return; }
      const pid = await joinRoom(roomCode, playerName.trim());
      setPlayerId(pid);
      setStatus("lobby");
    } catch {
      setError("Could not join. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const submit = async () => {
    if (!answer.trim() || !playerId || !playerName) return;
    if (answeredPuzzles.has(currentPuzzleIndex)) return;

    const correct =
      isCloseEnough(answer, currentPuzzle.answer) ||
      (currentPuzzle.alternateAnswers || []).some((a) => isCloseEnough(answer, a));

    setIsCorrect(correct);
    setAnsweredPuzzles((prev) => new Set(prev).add(currentPuzzleIndex));
    setStatus("answered");
    // Do NOT reveal the answer here — wait for host to reveal

    await submitAnswer(roomCode, playerId, playerName, currentPuzzleIndex, answer.trim(), correct);
    await refreshScore(playerId);
  };

  // Realtime listen to room changes
  useEffect(() => {
    if (!roomCode) return;
    const channel = supabase
      .channel(`room-${roomCode}-player`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "game_rooms", filter: `code=eq.${roomCode}` },
        (payload) => {
          const room = payload.new as { status: string; current_puzzle_index: number };
          setRoomStatus(room.status);

          if (room.status === "reveal") {
            // Host revealed answer — show it to players
            setRevealedAnswer(puzzles[room.current_puzzle_index]?.answer ?? null);
            setStatus((prev) => (prev === "answered" || prev === "playing" ? "reveal" : prev));
          } else if (room.status === "playing") {
            setCurrentPuzzleIndex(room.current_puzzle_index);
            setAnswer("");
            setIsCorrect(null);
            setRevealedAnswer(null);
            if (!answeredPuzzles.has(room.current_puzzle_index)) {
              setStatus("playing");
            } else {
              setStatus("answered");
            }
          } else if (room.status === "finished") {
            setStatus("finished");
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomCode, answeredPuzzles]);

  // When game starts (room goes to playing) from lobby
  useEffect(() => {
    if (roomStatus === "playing" && status === "lobby") {
      setStatus("playing");
    }
  }, [roomStatus, status]);

  return {
    playerName,
    setPlayerName,
    playerId,
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
  };
}
