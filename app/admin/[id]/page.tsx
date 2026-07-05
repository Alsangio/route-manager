import React from 'react';
import { db } from '../../../db';
import { routes, propertyStops } from '../../../db/schema';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { addStop } from '../../actions/stop';
import Link from 'next/link';
import PropertyStopCard from './PropertyStopCard';
import ShareButton from './ShareButton';

export default async function AdminRoutePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const routeId = parseInt(params.id, 10);
  
  if (isNaN(routeId)) notFound();

  const [route] = await db.select().from(routes).where(eq(routes.id, routeId)).limit(1);
  if (!route) notFound();

  const stops = await db.select().from(propertyStops).where(eq(propertyStops.routeId, routeId)).orderBy(asc(propertyStops.visitOrder));

  const handleAddStop = addStop.bind(null, routeId);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                <span aria-hidden="true">&larr;</span> Back to Dashboard
              </Link>
            </div>
            <p className="text-indigo-400 font-medium mb-1">Admin Dashboard</p>
            <h1 className="text-4xl font-bold">{route.clientName}&apos;s Route</h1>
            <p className="text-neutral-400 mt-2">Showing Date: {new Date(route.showingDate).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <Link href={`/client/${routeId}`} className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors border border-neutral-700" target="_blank">
              Preview Client View
            </Link>
            <ShareButton routeId={routeId} />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Property Stops</h2>
            {stops.length === 0 ? (
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-400">
                No stops added yet. Add the first property to this route.
              </div>
            ) : (
              stops.map((stop, index) => (
                <PropertyStopCard 
                  key={stop.id} 
                  stop={stop} 
                  index={index} 
                  routeId={routeId} 
                  isFirst={index === 0} 
                  isLast={index === stops.length - 1} 
                />
              ))
            )}
          </div>

          <div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sticky top-8">
              <h3 className="text-xl font-semibold mb-6">Add New Stop</h3>
              <form action={handleAddStop} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1.5">Property Address</label>
                  <input type="text" name="address" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" placeholder="123 Main St..." />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1.5">CRM Listing URL (Optional)</label>
                  <input type="url" name="crmListingUrl" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1.5">Co-Broker Name (Optional)</label>
                  <input type="text" name="coBrokerName" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Jane Smith..." />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1.5">Private Broker Notes (Optional)</label>
                  <textarea name="privateBrokerNotes" rows={4} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500" placeholder="Lockbox code, seller quirks..."></textarea>
                </div>
                <button type="submit" className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-colors">
                  Add Property Stop
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
