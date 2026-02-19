import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { createRoom, updateRoomStatus, getPlayers, getAnswersForPuzzle } from "@/lib/gameService";
import { puzzles } from "@/data/puzzles";

export interface Player {
  id: string;
  name: string;
  score: number;
  room_code: string;
}

export interface Answer {
  id: string;
  player_name: string;
  answer: string;
  is_correct: boolean;
  player_id: string;
}

export function useHostGame() {
  const [roomCode, setRoomCode] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "waiting" | "playing" | "reveal" | "finished">("idle");
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentPuzzle = puzzles[currentPuzzleIndex];

  const refreshPlayers = useCallback(async (code: string) => {
    const data = await getPlayers(code);
    setPlayers(data as Player[]);
  }, []);

  const refreshAnswers = useCallback(async (code: string, puzzleIdx: number) => {
    const data = await getAnswersForPuzzle(code, puzzleIdx);
    setAnswers(data as Answer[]);
  }, []);

  const startGame = async () => {
    setIsLoading(true);
    try {
      const code = await createRoom();
      setRoomCode(code);
      setStatus("waiting");
      setCurrentPuzzleIndex(0);
      setPlayers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const beginPlaying = async () => {
    if (!roomCode) return;
    await updateRoomStatus(roomCode, "playing", 0);
    setStatus("playing");
    setTimeLeft(30);
    setShowHint(false);
    setAnswers([]);
  };

  const revealAnswer = () => {
    setStatus("reveal");
  };

  const nextPuzzle = async () => {
    const next = currentPuzzleIndex + 1;
    if (next >= puzzles.length) {
      await updateRoomStatus(roomCode, "finished");
      setStatus("finished");
    } else {
      setStatus("playing");
      setTimeLeft(30);
      setShowHint(false);
      setAnswers([]);
      setCurrentPuzzleIndex(next);
      await updateRoomStatus(roomCode, "playing", next);
    }
  };

  const resetGame = () => {
    setRoomCode("");
    setStatus("idle");
    setCurrentPuzzleIndex(0);
    setPlayers([]);
    setAnswers([]);
  };

  // Realtime subscriptions
  useEffect(() => {
    if (!roomCode) return;

    const playersChannel = supabase
      .channel(`players-${roomCode}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "players", filter: `room_code=eq.${roomCode}` }, () => {
        refreshPlayers(roomCode);
      })
      .subscribe();

    const answersChannel = supabase
      .channel(`answers-${roomCode}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "answers", filter: `room_code=eq.${roomCode}` }, () => {
        refreshAnswers(roomCode, currentPuzzleIndex);
      })
      .subscribe();

    refreshPlayers(roomCode);

    return () => {
      supabase.removeChannel(playersChannel);
      supabase.removeChannel(answersChannel);
    };
  }, [roomCode, currentPuzzleIndex, refreshPlayers, refreshAnswers]);

  // Refresh answers when puzzle changes
  useEffect(() => {
    if (roomCode && status === "playing") {
      refreshAnswers(roomCode, currentPuzzleIndex);
    }
  }, [currentPuzzleIndex, roomCode, status, refreshAnswers]);

  // Timer countdown
  useEffect(() => {
    if (status !== "playing") return;
    if (timeLeft <= 0) return; // Timer stops at 0, host must manually reveal
    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
      if (timeLeft === 20) setShowHint(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [status, timeLeft]);

  return {
    roomCode,
    status,
    currentPuzzleIndex,
    currentPuzzle,
    players,
    answers,
    timeLeft,
    isLoading,
    showHint,
    totalPuzzles: puzzles.length,
    startGame,
    beginPlaying,
    revealAnswer,
    nextPuzzle,
    resetGame,
  };
}
