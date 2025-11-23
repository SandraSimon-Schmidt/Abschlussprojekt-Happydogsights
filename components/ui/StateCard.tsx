'use client'

import Link from 'next/link'
import { viewpointsByState } from '@/data/viewpoints'

interface StateCardProps {
  name: string
  displayName: string
}

export default function StateCard({ name, displayName }: StateCardProps) {
  const count = viewpointsByState[name]?.length || 0

  return (
    <Link href={`/bundesland/${name}`}>
      <div className="product-card w-full rounded-md shadow-xl overflow-hidden relative cursor-pointer py-8 px-6 bg-white flex flex-col items-center justify-center gap-3 transition-all duration-300 group">
        
        {/* Text Overlay */}
        <div className="para uppercase text-center leading-none z-40">
          <p
            style={{ WebkitTextStroke: '1px rgb(207, 205, 205)', WebkitTextFillColor: 'transparent' }}
            className="z-10 font-bold text-lg -mb-5 tracking-wider text-gray-500"
          >
            {displayName}
          </p>
          <p className="font-bold text-xl tracking-wider text-[#495c48] z-30">{displayName}</p>
        </div>

        {/* Bild */}
        <div className="w-[180px] aspect-square relative z-20 overflow-hidden rounded-md group-hover:scale-105 transition-transform duration-300">
          <img
            src={`/images/states/${name}.png`}
            alt={displayName}
            className="w-full h-full object-cover"
          />

          {/* Tooltip */}
          <div className="tooltips absolute top-0 left-0 -translate-x-[150%] p-2 flex flex-col items-start gap-2 transition-all duration-300 group-hover:-translate-x-full">
            <p className="text-[#7b956a] font-semibold text-lg uppercase opacity-0 group-hover:opacity-100 transition-all duration-500">
              {count} Aussichtspunkte
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
