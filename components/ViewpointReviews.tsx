"use client";

import { useState, useEffect } from "react";
import { addRating, getRatings, Rating } from "@/lib/ratings";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

type ViewpointReviewsProps = {
  viewpointId: string;
};

export function ViewpointReviews({ viewpointId }: ViewpointReviewsProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [showView, setShowView] = useState<"view" | "write">("view");
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [ratingValue, setRatingValue] = useState(1);

  // Bewertungen laden
  const fetchRatings = async () => {
    const data = await getRatings(viewpointId);
    setRatings(data);
  };

  useEffect(() => {
    fetchRatings();
  }, [viewpointId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRating(viewpointId, userName, ratingValue, comment);
    setUserName("");
    setComment("");
    setRatingValue(1);
    await fetchRatings();
    setShowView("view"); // nach Absenden wieder Ansicht
  };

  // Durchschnitt berechnen
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
      : 0;

  return (
    <div className="mt-4">
      <div className="flex space-x-2 mb-4">
        <Button
          variant={showView === "view" ? "default" : "outline"}
          onClick={() => setShowView("view")}
        >
          Bewertungen ansehen
        </Button>
        <Button
          variant={showView === "write" ? "default" : "outline"}
          onClick={() => setShowView("write")}
        >
          Bewertung schreiben
        </Button>
      </div>

      {showView === "view" && (
        <div>
          <div className="mb-2 font-semibold">
            Durchschnittliche Bewertung: {averageRating.toFixed(1)}{" "}
            <Star className="inline-block w-4 h-4 text-yellow-500" />
          </div>
          {ratings.length === 0 && <p>Noch keine Bewertungen.</p>}
          {ratings.map((r) => (
            <div key={r.id} className="border-b py-2">
              <div className="font-semibold">{r.user_name}</div>
              <div>
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="inline-block w-4 h-4 text-yellow-500" />
                ))}
              </div>
              <div>{r.comment}</div>
            </div>
          ))}
        </div>
      )}

      {showView === "write" && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            placeholder="Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <textarea
            placeholder="Kommentar"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <div>
            Bewertung:
            <select
              value={ratingValue}
              onChange={(e) => setRatingValue(Number(e.target.value))}
              className="ml-2 border rounded p-1"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit">Abschicken</Button>
        </form>
      )}
    </div>
  );
}
