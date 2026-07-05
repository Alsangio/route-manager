import React from 'react';
import { db } from '../../../db';
import { routes, propertyStops } from '../../../db/schema';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ClientRoutePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const routeId = parseInt(params.id, 10);
  
  if (isNaN(routeId)) notFound();

  const [route] = await db.select().from(routes).where(eq(routes.id, routeId)).limit(1);
  if (!route) notFound();

  const stops = await db.select().from(propertyStops).where(eq(propertyStops.routeId, routeId)).orderBy(asc(propertyStops.visitOrder));

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20 font-sans">
      <div className="bg-indigo-600 text-white pt-12 pb-16 px-6 rounded-b-[2rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-medium uppercase tracking-widest mb-2">Your Property Tour</p>
          <h1 className="text-3xl font-bold mb-2">Hello, {route.clientName}</h1>
          <p className="text-indigo-100 opacity-90 text-lg">
            {new Date(route.showingDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-8 space-y-4 relative z-20">
        {stops.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 shadow-sm text-center text-neutral-500 border border-neutral-100">
            Your tour stops are being prepared. Check back shortly.
          </div>
        ) : (
          stops.map((stop, index) => {
            const wazeUrl = stop.gpsCoordinates 
              ? `https://waze.com/ul?ll=${stop.gpsCoordinates.replace(/\s+/g, '')}&navigate=yes`
              : `https://waze.com/ul?q=${encodeURIComponent(stop.address)}&navigate=yes`;
            
            return (
              <div key={stop.id} className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 relative overflow-hidden">
                {stop.isVisited && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl shadow-sm">
                    VISITED
                  </div>
                )}
                
                <div className="flex gap-4 mb-5 pt-2">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-xl shadow-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 leading-tight mb-1 pr-12">{stop.address}</h3>
                    {stop.estimatedArrival && (
                      <p className="text-sm text-neutral-500">Est. Arrival: {stop.estimatedArrival}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <a 
                    href={wazeUrl} 
                    className="block w-full text-center py-3.5 rounded-xl bg-neutral-900 text-white font-medium shadow-md hover:bg-neutral-800 active:scale-[0.98] transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Drive to Property
                  </a>
                  {stop.crmListingUrl && (
                    <Link
                      href={stop.crmListingUrl}
                      className="block w-full text-center py-3.5 rounded-xl bg-indigo-50 text-indigo-700 font-medium border border-indigo-100 shadow-sm hover:bg-indigo-100 active:scale-[0.98] transition-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Listing
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
