"use client";

import { useState } from "react";
import { Rating, addRating } from "@/lib/ratings";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface ViewpointReviewsProps {
  reviews: Rating[];
  setReviews: (reviews: Rating[]) => void;
  viewpointId: string;
}

export function ViewpointReviews({ reviews, setReviews, viewpointId }: ViewpointReviewsProps) {
  const [showList, setShowList] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    if (!userName || !comment || rating === 0) return;
    const newRating = await addRating(viewpointId, userName, rating, comment);
    if (newRating) {
      setReviews([newRating, ...reviews]);
      setUserName("");
      setComment("");
      setRating(0);
      setShowForm(false);
      setShowList(true);
    }
  };

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
  const ratingCounts = [5,4,3,2,1].map(star => reviews.filter(r => r.rating === star).length);
  const getPercent = (count: number) => totalReviews === 0 ? 0 : (count / totalReviews) * 100;

  return (
    <div className="space-y-4">
      {/* Zwei Buttons */}
      <div className="flex gap-2">
        <Button onClick={() => { setShowList(!showList); setShowForm(false); }}>
          Alle Bewertungen ansehen
        </Button>
        <Button onClick={() => { setShowForm(!showForm); setShowList(false); }}>
          Eigene Bewertung schreiben
        </Button>
      </div>

      {/* Balkendiagramm & Liste */}
      {showList && (
        <div className="space-y-2">
          {/* Durchschnitt */}
          <div className="flex items-center gap-2">
            <span className="font-semibold">Durchschnitt: </span>
            <span>{avgRating.toFixed(1)} / 5</span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? "text-yellow-500" : "text-gray-300"}`} />
              ))}
            </div>
          </div>

          {/* Statistik Balkendiagramm */}
          <div className="space-y-1">
            { [5,4,3,2,1].map((star, idx) => (
              <div key={star} className="flex items-center gap-2">
                <span className="w-10 text-sm">{star} Sterne</span>
                <div className="flex-1 h-3 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-3 bg-yellow-500"
                    style={{ width: `${getPercent(ratingCounts[idx])}%` }}
                  />
                </div>
                <span className="w-6 text-right text-sm">{ratingCounts[idx]}</span>
              </div>
            )) }
          </div>

          {/* Liste aller Bewertungen */}
          <div className="space-y-2 border-t pt-2">
            {reviews.map(r => (
              <div key={r.id} className="border-b pb-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < r.rating ? "text-yellow-500" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold">{r.user_name}</p>
                <p className="text-sm">{r.comment}</p>
                <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formular für neue Bewertung */}
      {showForm && (
        <div className="space-y-2 border-t pt-2">
          <input
            type="text"
            placeholder="Name"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            className="w-full border p-1 rounded"
          />
          <textarea
            placeholder="Kommentar"
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="w-full border p-1 rounded"
          />
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 cursor-pointer ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
          <Button onClick={handleSubmit}>Bewertung absenden</Button>
        </div>
      )}
    </div>
  );
}
