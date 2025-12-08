"use client";

import { useState, use } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { states, viewpointsByState } from "@/data/viewpoints";
import { Search, MapPin, Github, Mail, MapIcon, Heart } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Map = dynamic(() => import("@/components/map").then((mod) => mod.Map), {
  ssr: false,
});

const translations = {
  de: {
    title: "Happy Dog Sights 🐶",
    subtitle: "Schöne Ausblicke & Hundepensionen",
    heroTitle: "Entdecke Deutschlands schönste Aussichtspunkte,<br /> perfekt für dich <br />und deinen Hund",
    heroDesc: "Über 320 Aussichtspunkte in 16 Bundesländern mit <br />Informationen zu Hundepensionen in der Nähe.",
    searchPlaceholder: "Schnellsuche...",
    mapTitle: "Alle Aussichtspunkte auf einen Blick",
    mapDesc: "Erkunde interaktiv über",
    mapDesc2: "Aussichtspunkte in ganz Deutschland",
    noResults: "Keine Bundesländer gefunden",
    quiz: "Testen Sie ihr Wissen?",
    quizBtn: "Deutschlands Landeshauptstädte",
    footerAbout: "Über Happy Dog Sights",
    footerAboutDesc: "Entdecke die schönsten Aussichtspunkte in Deutschland und finde zuverlässige Hundepensionen in deiner Nähe.",
    footerLinks: "Links",
    footerContact: "Kontakt",
    footerSocial: "Social Media",
    footerCopyright: "© 2024 Happy Dog Sights. Alle Rechte vorbehalten.",
    footerMadeWith: "Mit ❤️ für Hundeliebhaber gemacht",
  },
  en: {
    title: "Happy Dog Sights 🐶",
    subtitle: "Beautiful Views & Dog Kennels",
    heroTitle: "Discover Germany's most beautiful viewpoints,<br /> perfect for you<br /> and your dog",
    heroDesc: "Over 320 viewpoints in 16 federal states with <br />information about dog kennels nearby.",
    searchPlaceholder: "Quick search...",
    mapTitle: "All viewpoints at a glance",
    mapDesc: "Explore interactively over",
    mapDesc2: "viewpoints throughout Germany",
    noResults: "No states found",
    quiz: "Test your knowledge?",
    quizBtn: "German State Capitals",
    footerAbout: "About Happy Dog Sights",
    footerAboutDesc: "Discover the most beautiful viewpoints in Germany and find reliable dog kennels near you.",
    footerLinks: "Links",
    footerContact: "Contact",
    footerSocial: "Social Media",
    footerCopyright: "© 2024 Happy Dog Sights. All rights reserved.",
    footerMadeWith: "Made with ❤️ for dog lovers",
  },
};

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const [searchQuery, setSearchQuery] = useState("");
  const t = translations[locale as keyof typeof translations] || translations.de;

  const filteredStates = states.filter(
    (state) =>
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              {t.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant={locale === 'de' ? "default" : "outline"} 
              size="sm"
              asChild
            >
              <Link href="/de">DE</Link>
            </Button>
            <Button 
              variant={locale === 'en' ? "default" : "outline"} 
              size="sm"
              asChild
            >
              <Link href="/en">EN</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
<section className="relative w-full h-[320px] sm:h-[420px] lg:h-[720px] overflow-hidden">
  <img
    src="/HDS.jpg"
    alt="Hero"
    className="absolute inset-0 w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-black/40" />
  
  <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 
                  flex flex-col justify-start pt-10 sm:pt-16 lg:pt-24">

    <div className="max-w-xl">
      <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-white mb-4 drop-shadow-md">
        <span dangerouslySetInnerHTML={{ __html: t.heroTitle }} />
        
      </h2>
      <p className="text-base sm:text-lg text-gray-100 mb-6 drop-shadow">
        <span dangerouslySetInnerHTML={{ __html: t.heroDesc }} />
      </p>

                {/* Search Bar im Hero */}
                <div className="max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 bg-white/95 backdrop-blur text-foreground"
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
                <Link key={state.name} href={`/${locale}/bundesland/${state.name}`}>
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
                            {viewpointsByState[state.name]?.length || 0}
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
                <p className="text-lg text-muted-foreground">{t.noResults}</p>
              </div>
            )}
          </section>

          {/* Map Overview */}
          <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t.mapTitle}
                </CardTitle>
                <p className="text-muted-foreground">
                  {t.mapDesc} {Object.values(viewpointsByState).flat().length} {t.mapDesc2}
                </p>
              </CardHeader>
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

          {/* Spiel-Button */}
          <section className="bg-secondary/10 border-t border-border py-12">
            <div className="flex flex-col items-center gap-4">
              <span className="text-lg font-medium text-foreground">{t.quiz}</span>
              <a
                href="https://bundeslaender-game-16ak.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-around px-6 py-4 bg-yellow-400 border-4 border-black rounded-[15px] shadow-[4px_6px_0px_black] overflow-hidden font-semibold text-black cursor-pointer transition-all duration-250 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_3px_0px_black] active:filter active:saturate-75"
              >
                <span className="relative z-10">{t.quizBtn}</span>
                <span className="absolute inset-0 bg-pink-400 -translate-x-full transition-transform duration-250 ease-in-out hover:translate-x-0 z-0"></span>
                <span className="ml-4 flex items-center justify-center w-10 h-10 bg-pink-400 border-4 border-black rounded-full relative overflow-hidden transition-transform duration-250 hover:translate-x-1 active:translate-x-2 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-secondary/20 border-t border-border mt-16">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* About Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <MapIcon className="w-5 h-5" />
                  Happy Dog Sights
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t.footerAboutDesc}
                </p>
              </div>

              {/* Links Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">{t.footerLinks}</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href={`/${locale}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {locale === 'de' ? 'Startseite' : 'Home'}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${locale}/bundesland/Baden-Württemberg`} className="text-muted-foreground hover:text-primary transition-colors">
                      {locale === 'de' ? 'Bundesländer' : 'States'}
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      {locale === 'de' ? 'Datenschutz' : 'Privacy'}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      {locale === 'de' ? 'Impressum' : 'Imprint'}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">{t.footerContact}</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <a href="mailto:info@happydogsights.de" className="hover:text-primary transition-colors">
                      info@happydogsights.de
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">{t.footerSocial}</h4>
                <div className="flex gap-3">
                  <a
                    href="https://github.com/Miichiiii/HappyDogSights"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                  >
                    <Heart className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>{t.footerCopyright}</p>
              <p>{t.footerMadeWith}</p>
            </div>
          </div>
        </footer>
      </div>
  );
}