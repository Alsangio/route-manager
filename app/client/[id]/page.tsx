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
      <div className="bg-white pt-12 pb-16 px-6 rounded-b-[2.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden border-b border-neutral-200/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <p className="text-neutral-400 text-xs tracking-widest font-bold mb-2 uppercase">Your Property Tour with María Virginia</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 mb-1">Hello, {route.clientName}</h1>
          <p className="text-neutral-500 font-medium text-lg">
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
              ? `https://waze.com/ul?ll=${stop.gpsCoordinates.replace(/[()\s]/g, '')}&navigate=yes`
              : `https://waze.com/ul?q=${encodeURIComponent(stop.address)}&navigate=yes`;
            
            return (
              <div key={stop.id} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-200/60 relative overflow-hidden">
                {stop.isVisited && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl shadow-sm">
                    VISITED
                  </div>
                )}
                
                <div className="flex gap-4 mb-6 pt-2">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl shadow-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-800 leading-tight mb-1 pr-12 flex items-start gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 mt-0.5 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {stop.address}
                    </h3>
                    {stop.estimatedArrival && (
                      <p className="text-sm font-medium text-neutral-500 ml-6">Est. Arrival: {stop.estimatedArrival}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <a 
                    href={wazeUrl} 
                    className="flex items-center justify-center gap-2 w-full text-center py-3.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-500 active:scale-[0.98] transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                    Drive to Property
                  </a>
                  {stop.crmListingUrl && (
                    <Link
                      href={stop.crmListingUrl}
                      className="block w-full text-center py-3.5 rounded-xl border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 font-medium shadow-sm active:scale-[0.98] transition-all"
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
