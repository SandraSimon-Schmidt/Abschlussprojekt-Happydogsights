"use client";

import { useState, use } from "react";
import Link from "next/link";
import { viewpointsByState, states } from "@/data/viewpoints";
import { StateMap } from "@/components/state-map";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, ChevronLeft, Star } from "lucide-react";

export default function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = use(params);
  const [searchQuery, setSearchQuery] = useState("");
  const decodedState = decodeURIComponent(state);

  const stateInfo = states.find((s) => s.name === decodedState);
  const viewpoints = viewpointsByState[decodedState] || [];

  const filteredViewpoints = viewpoints.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!stateInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bundesland nicht gefunden</h1>
          <Link href="/">
            <Button>Zurück zur Startseite</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Zurück
          </Link>
          <h1 className="text-2xl font-bold text-primary">
            {stateInfo.displayName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {stateInfo.description}
          </p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <StateMap viewpoints={viewpoints} />
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <Input
            placeholder="Nach Aussichtspunkt suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 bg-white"
          />
        </div>

        {/* Viewpoints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredViewpoints.map((viewpoint) => (
            <Link key={viewpoint.id} href={`/aussichtspunkt/${viewpoint.id}`}>
              <Card className="h-full hover:shadow-lg hover:border-primary transition-all cursor-pointer group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-primary group-hover:text-accent transition-colors line-clamp-2">
                    {viewpoint.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {viewpoint.city}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70 line-clamp-3 mb-4">
                    {viewpoint.description}
                  </p>
                 
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredViewpoints.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Keine Aussichtspunkte gefunden
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
