import { supabase } from "./supabaseClient";

export type Rating = {
  id: string;
  viewpoint_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

// Alle Bewertungen für einen bestimmten Aussichtspunkt abrufen
export async function getRatings(viewpointId: string): Promise<Rating[]> {
  const { data, error } = await supabase
    .from("viewpoint_reviews")
    .select("*")
    .eq("viewpoint_id", viewpointId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fehler beim Abrufen der Bewertungen:", error);
    return [];
  }

  return data || [];
}

// Neue Bewertung hinzufügen
export async function addRating(
  viewpointId: string,
  userName: string,
  rating: number,
  comment: string
): Promise<Rating | null> {
  const { data, error } = await supabase
    .from("viewpoint_reviews")
    .insert([
      {
        viewpoint_id: viewpointId,
        user_name: userName,
        rating,
        comment,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Hinzufügen der Bewertung:", error);
    return null;
  }

  return data;
}
