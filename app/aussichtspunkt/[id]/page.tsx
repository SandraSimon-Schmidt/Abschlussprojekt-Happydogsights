"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { viewpointsByState } from "@/data/viewpoints";
import { Map } from "@/components/map";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink, ChevronLeft, Heart } from "lucide-react";
import { dogPensionsByViewpoint } from "@/data/dog-pensions";
import { ViewpointReviews } from "@/components/ViewpointReviews";
import { getRatings } from "@/lib/ratings";
import { Viewpoint } from "@/data/viewpoints";


interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}
export default function ViewpointPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewsCard, setShowReviewsCard] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);


  let viewpoint: Viewpoint | null = null;
  let stateKey = "";

  for (const [state, viewpoints] of Object.entries(viewpointsByState)) {
    const found = viewpoints.find((v) => v.id === id);
    if (found) {
      viewpoint = found;
      stateKey = state;
      break;
    }
  }

  const pensions = dogPensionsByViewpoint[id] || [];

  // Bewertungen beim Laden
  useEffect(() => {
    async function fetchRatings() {
      if (!viewpoint) return;
      const data = await getRatings(viewpoint.id);
      setReviews(data);
    }
    fetchRatings();
  }, [viewpoint]);

  if (!viewpoint) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Aussichtspunkt nicht gefunden</h1>
          <Link href="/">
            <Button>Zur Startseite</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href={`/bundesland/${stateKey}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Zurück zu {stateKey}
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">{viewpoint.name}</h1>
              <p className="text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {viewpoint.city}
              </p>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-accent" : ""}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </header>

      {/* Inhalt */}
      <section className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Linke Spalte */}
          <div className="lg:col-span-2 space-y-6">
            {/* Beschreibung */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Über diesen Aussichtspunkt</CardTitle>
                <CardDescription>
                  <p className="mt-1 mb-4 text-foreground/80 leading-relaxed">{viewpoint.description}</p>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Informationen aufklappbar */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex justify-between items-center"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  <span>Informationen zum Aussichtspunkt</span>
                  <span className="text-muted-foreground">{showInfo ? "▲" : "▼"}</span>
                </Button>

                {showInfo && (
                  <div className="mt-2 pl-8 pt-3 pb-3 border rounded-lg bg-muted/50 flex items-center gap-6">
                    <p className="text-sm text-muted-foreground m-0">
                      Länge: {viewpoint.lat}
                    </p>
                    <p className="text-sm text-muted-foreground m-0">
                      Breite: {viewpoint.lng}
                    </p>
                    <Button
                      variant="link"
                      className="flex items-center font-semibold p-0 ml-4"
                      asChild
                    >
                     <a href={viewpoint.href} target="_blank" rel="noopener noreferrer">
    <ExternalLink className="w-4 h-4 mr-1" /> {/* Icon vor dem Text */}
    Webseite zum Aussichtspunkt
  </a>
                    </Button>
                  </div>
                )}

                {/* Aufklappbarer Bereich Bewertungen */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex justify-between items-center"
                  onClick={() => setShowReviewsCard(!showReviewsCard)}
                >
                  <span>
                    Bewertungen & Rezension
                    {reviews.length > 0 &&
                      ` – ⭐ ${(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}`}
                  </span>
                  <span className="text-muted-foreground">{showReviewsCard ? "▲" : "▼"}</span>
                </Button>

                {showReviewsCard && (
                  <ViewpointReviews
                    {...({ reviews, setReviews, viewpointId: viewpoint.id } as any)}
                  />
                )}
              </CardContent>
            </Card>

            {/* Hundepensionen */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Hundepensionen in der Nähe</CardTitle>
                <CardDescription className="mt-1 mb-4">{pensions.length} Pensionen gefunden</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pensions.length > 0 ? (
                  pensions.map((pension) => {
                    const [open, setOpen] = useState(false);
                    return (
                      <div key={pension.id} className="w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full flex justify-between items-center mb-2"
                          onClick={() => setOpen(!open)}
                        >
                          <span>{pension.name}</span>
                          <span>{open ? "▲" : "▼"}</span>
                        </Button>
                        {open && (
                          <div className="mt-2 pl-8 pt-3 pb-3 border rounded-lg bg-muted/50 space-y-2">
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              {pension.distance} km entfernt
                            </p>
                            <p className="text-sm text-foreground/70">{pension.description}</p>
                            <div className="flex gap-2">
                              <Button variant="link" size="sm" asChild>
                                         <a href={`tel:${pension.phone}`}>{/*telefon-icon eingefügt*/}<svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.13.9.38 1.78.74 2.61a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.47-.47a2 2 0 0 1 2.11-.45c.83.36 1.71.61 2.61.74A2 2 0 0 1 22 16.92z"/>
              </svg>Anrufen</a>
                              </Button>
                              <Button variant="link" size="sm" asChild>
                             <a href={pension.website} target="_blank" rel="noopener noreferrer">
    <ExternalLink className="w-4 h-4 mr-1" />
    Website
  </a>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground">Keine Hundepensionen gefunden</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Rechte Spalte */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Standort & Umgebung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-96">
                  <Map
                    latitude={viewpoint.lat}
                    longitude={viewpoint.lng}
                    zoom={13}
                    markers={[{ lat: viewpoint.lat, lng: viewpoint.lng, title: viewpoint.name, type: "viewpoint", id: viewpoint.id }]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
