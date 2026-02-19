import { supabase } from "@/integrations/supabase/client";

export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function createRoom(): Promise<string> {
  const code = generateRoomCode();
  const { error } = await supabase.from("game_rooms").insert({
    code,
    current_puzzle_index: 0,
    status: "waiting",
  });
  if (error) throw error;
  return code;
}

export async function getRoomByCode(code: string) {
  const { data, error } = await supabase
    .from("game_rooms")
    .select("*")
    .eq("code", code)
    .single();
  if (error) throw error;
  return data;
}

export async function updateRoomStatus(code: string, status: string, puzzleIndex?: number) {
  const update: Record<string, unknown> = { status };
  if (puzzleIndex !== undefined) update.current_puzzle_index = puzzleIndex;
  const { error } = await supabase.from("game_rooms").update(update).eq("code", code);
  if (error) throw error;
}

export async function joinRoom(code: string, name: string): Promise<string> {
  const { data, error } = await supabase
    .from("players")
    .insert({ room_code: code, name })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function submitAnswer(
  roomCode: string,
  playerId: string,
  playerName: string,
  puzzleIndex: number,
  answer: string,
  isCorrect: boolean
) {
  const { error } = await supabase.from("answers").insert({
    room_code: roomCode,
    player_id: playerId,
    player_name: playerName,
    puzzle_index: puzzleIndex,
    answer,
    is_correct: isCorrect,
  });
  if (error) throw error;

  if (isCorrect) {
    const { data: existing } = await supabase
      .from("players")
      .select("score")
      .eq("id", playerId)
      .single();
    if (existing) {
      await supabase
        .from("players")
        .update({ score: existing.score + 100 })
        .eq("id", playerId);
    }
  }
}

export async function getPlayers(roomCode: string) {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("room_code", roomCode)
    .order("score", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getAnswersForPuzzle(roomCode: string, puzzleIndex: number) {
  const { data, error } = await supabase
    .from("answers")
    .select("*")
    .eq("room_code", roomCode)
    .eq("puzzle_index", puzzleIndex);
  if (error) throw error;
  return data || [];
}
