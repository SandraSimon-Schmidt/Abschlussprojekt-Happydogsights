"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { states, viewpointsByState } from "@/data/viewpoints";
import { Search, MapPin } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

// Dynamically import Map component with SSR disabled
const Map = dynamic(() => import("@/components/map").then((mod) => mod.Map), {
  ssr: false,
});

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredStates = states.filter(
    (state) =>
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    const point = Object.entries(viewpointsByState)
      .flatMap(([state, points]) => points.map((p) => ({ ...p, state })))
      .find((p) => p.name.toLowerCase().includes(query.toLowerCase()));

    if (point) {
      router.push(`/bundesland/${point.state}#${point.id}`);
      return;
    }

    const state = states.find(
      (s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.displayName.toLowerCase().includes(query.toLowerCase())
    );

    if (state) {
      router.push(`/bundesland/${state.name}`);
      return;
    }

    alert("Keine Ergebnisse gefunden");
  };

  return (
    <>
      {/* Google Search Console Verification */}
      <head>
        <meta name="google-site-verification" content="0a4wpwADiKXC23RSf4h1g2f_jPYnh8HAQ-DCPvszJkI" />
      </head>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Happy Dog Sights 🐶</h1>
              <p className="text-sm text-muted-foreground">
                Schöne Ausblicke & Hundepensionen
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">DE</Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative w-full min-h-[320px] sm:min-h-[420px] lg:min-h-[860px] h-auto overflow-hidden">
          <img
            src="/HDS-2.jpg"
            alt="Hero Bild"
            className="absolute inset-0 w-full h-full object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-9xl mx-auto h-full px-16 sm:px-6 lg:px-8 flex flex-col justify-start pt-20">
            <div className="max-w-xl0 pl-25">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-50 drop-shadow-md">
                Entdecke Deutschlands schönste Aussichtspunkte,<br />
                <br />
                perfekt für dich<br />
                <br />
                und deinen Hund
              </h2>
              <p className="text-base sm:text-lg text-gray-100 mb-6 drop-shadow">
                Über 300 Aussichtspunkte in 16 Bundesländern mit <br />
                Informationen zu Hundepensionen in der Nähe.
              </p>

              {/* Search Bar */}
              <div className="max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Schnellsuche..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch(searchQuery);
                    }}
                    className="pl-10 h-12 bg-white/95 backdrop-blur text-foreground border border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* States Grid */}
        <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredStates.map((state) => (
              <Link key={state.name} href={`/bundesland/${state.name}`}>
                <Card className="h-full hover:shadow-xl hover:border-primary transition-all cursor-pointer group">
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <img
                      src={state.image}
                      alt={state.displayName}
                      className="w-full h-40 object-contain rounded-md mb-4 bg-gray-100"
                    />
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span>
                          {viewpointsByState[state.name]?.length || 0} Aussichtspunkte
                        </span>
                      </div>
                      <p className="text-sm text-foreground/70">{state.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {filteredStates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Keine Bundesländer gefunden</p>
            </div>
          )}
        </section>

        {/* Map Section */}
        <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <Card>
            <CardContent>
              <div className="w-full h-[600px] rounded-lg overflow-hidden">
                <Map
                  latitude={51.1657}
                  longitude={10.4515}
                  zoom={6}
                  markers={Object.entries(viewpointsByState).flatMap(([state, viewpoints]) =>
                    viewpoints.map((v) => ({
                      lat: v.lat,
                      lng: v.lng,
                      title: v.name,
                      type: "viewpoint" as const,
                      id: v.id,
                    }))
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Spiel-Button Section */}
        <section className="bg-secondary/10 border-t border-border py-12">
          <div className="flex flex-col items-center gap-4">
            <span className="text-lg font-medium text-foreground">
              Testen Sie ihr Wissen?
            </span>
            <a
              href="https://bundeslaender-game-16ak.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center justify-around px-6 py-4 bg-yellow-400 border-4 border-black rounded-[15px] shadow-[4px_6px_0px_black] overflow-hidden font-semibold text-black cursor-pointer transition-all duration-250 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_3px_0px_black] active:filter active:saturate-75"
            >
              <span className="relative z-10">Deutschlands Landeshauptstädte</span>
              <span className="absolute inset-0 bg-pink-400 -translate-x-full transition-transform duration-250 ease-in-out hover:translate-x-0 z-0"></span>
              <span className="ml-4 flex items-center justify-center w-10 h-10 bg-pink-400 border-4 border-black rounded-full relative overflow-hidden transition-transform duration-250 hover:translate-x-1 active:translate-x-2 z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-primary/5 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2025 Aussichtspunkte.de. Alle Rechte vorbehalten.</p>
            <nav className="flex gap-6">
              <Link href="#" className="hover:text-foreground transition-colors">Datenschutz</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Impressum</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Kontakt</Link>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
