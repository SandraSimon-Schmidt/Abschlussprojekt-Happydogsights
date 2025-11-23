"use client";

import { useState, use } from "react";
import Link from "next/link";
import { viewpointsByState } from "@/data/viewpoints";
import { ReviewSection } from "@/components/review-section";
import { SimpleMap } from "@/components/simple-map";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, ExternalLink, ChevronLeft, Heart } from "lucide-react";
import { dogPensionsByViewpoint } from "@/data/dog-pensions";

const sampleReviews = [
  {
    id: "1",
    author: "Max Müller",
    rating: 5,
    date: "15. Nov 2024",
    comment: "Atemberaubender Ausblick! Definitiv einen Besuch wert.",
    helpful: 24,
  },
  {
    id: "2",
    author: "Anna Schmidt",
    rating: 4,
    date: "10. Nov 2024",
    comment: "Schöne Gegend, könnte etwas sauberer sein",
    helpful: 8,
  },
  {
    id: "3",
    author: "Peter Weber",
    rating: 5,
    date: "5. Nov 2024",
    comment: "Mit meinem Hund war es perfekt. Viel Platz zum Laufen!",
    helpful: 15,
  },
];

export default function ViewpointPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [isFavorite, setIsFavorite] = useState(false);

  let viewpoint = null;
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

  if (!viewpoint) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Aussichtspunkt nicht gefunden
          </h1>
          <Link href="/">
            <Button>Zur Startseite</Button>
          </Link>
        </div>
      </div>
    );
  }

  const mapViewpoints = [
    viewpoint,
    ...pensions.map((p, idx) => ({
      id: `pension-${idx}`,
      name: p.name,
      city: p.name,
      lat: viewpoint.lat + (Math.random() - 0.5) * 0.05,
      lng: viewpoint.lng + (Math.random() - 0.5) * 0.05,
    })),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
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
              <h1 className="text-3xl font-bold text-primary">
                {viewpoint.name}
              </h1>
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
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
              />
            </Button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Über diesen Aussichtspunkt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground/80">{viewpoint.description}  {/* Website-Button */}
  {viewpoint.href && (
    <Button variant="link" size="sm" asChild className="mt-4" >
      <a href={viewpoint.href} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="w-3 h-3 mr-1" />
        Weitere Informationen
      </a>
    </Button>
  )} </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/5 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Breite</p>
                    <p className="font-mono text-primary">
                      {viewpoint.lat.toFixed(4)}
                    </p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Länge</p>
                    <p className="font-mono text-primary">
                      {viewpoint.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ReviewSection
              reviews={sampleReviews}
              averageRating={4.8}
              totalReviews={42}
              onSubmitReview={(rating, comment) => {
                console.log("Review submitted:", { rating, comment });
              }}
            />

            <Card>
              <CardHeader>
                <CardTitle>Hundepensionen in der Nähe</CardTitle>
                <CardDescription>
                  {pensions.length} Pensionen gefunden
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pensions.length > 0 ? (
                  pensions.map((pension) => (
                    <div
                      key={pension.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {pension.name}
                          </h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {pension.distance} km entfernt
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-foreground/70 mb-3">
                        {pension.description}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`tel:${pension.phone}`}>
                            <Phone className="w-3 h-3 mr-1" />
                            Anrufen
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={pension.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Website
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    Keine Hundepensionen gefunden
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Standort & Umgebung</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleMap
                  viewpoints={mapViewpoints}
                  title="Aussichtspunkt & Pensionen"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
