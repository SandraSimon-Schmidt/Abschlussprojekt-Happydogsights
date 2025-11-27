'use client'

import { useEffect, useRef, useState } from 'react'

interface MapProps {
  latitude: number
  longitude: number
  zoom?: number
  markers?: Array<{
    lat: number
    lng: number
    title: string
    type: 'viewpoint' | 'pension'
    id: string
  }>
}

export function Map({ latitude, longitude, zoom = 13, markers = [] }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isClient, setIsClient] = useState(false)

  // Stelle sicher, dass Leaflet nur auf dem Client geladen wird
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !mapRef.current) return

    // Dynamischer Import von Leaflet, damit SSR nicht bricht
    import('leaflet').then(L => {
      import('leaflet/dist/leaflet.css')

      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([latitude, longitude], zoom)
        return
      }

      const map = L.map(mapRef.current).setView([latitude, longitude], zoom)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      // Custom icons
      const viewpointIcon = new L.Icon({
        iconUrl:
          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMyMjc0MjQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTBjMCA3LTkgMTMtOSAxM3MtOS02LTktMTNhOSA5IDAgMCAxIDE4IDB6Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIvPjwvc3ZnPg==',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      })

      const pensionIcon = new L.Icon({
        iconUrl:
          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNlYTg3OTAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTBjMCA3LTkgMTMtOSAxM3MtOS02LTktMTNhOSA5IDAgMCAxIDE4IDB6Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIvPjwvc3ZnPg==',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      })

      markers.forEach(marker => {
        const icon = marker.type === 'viewpoint' ? viewpointIcon : pensionIcon
        L.marker([marker.lat, marker.lng], { icon })
          .bindPopup(
            `<strong>${marker.title}</strong><br/><small>${
              marker.type === 'viewpoint' ? 'Aussichtspunkt' : 'Hundepension'
            }</small>`
          )
          .addTo(map)
      })

      mapInstanceRef.current = map
    })
  }, [isClient, latitude, longitude, zoom, markers])

  return <div ref={mapRef} className="w-full h-full rounded-lg" />
}
