'use client';

import React, { useState } from 'react';
import { toggleVisitedStatus, updateStop, reorderStop } from '../../actions/stop';
import { deleteStop } from '../../actions/actions';

type Stop = {
  id: number;
  routeId: number;
  address: string;
  crmListingUrl: string | null;
  privateBrokerNotes: string | null;
  coBrokerName: string | null;
  gpsCoordinates: string | null;
  isVisited: boolean;
  visitOrder: number;
};

export default function PropertyStopCard({ stop, index, routeId, isFirst, isLast }: { stop: Stop, index: number, routeId: number, isFirst: boolean, isLast: boolean }) {
  const [isEditing, setIsEditing] = useState(false);

  const wazeUrl = stop.gpsCoordinates 
    ? `https://waze.com/ul?ll=${stop.gpsCoordinates.replace(/[()\s]/g, '')}&navigate=yes`
    : `https://waze.com/ul?q=${encodeURIComponent(stop.address)}&navigate=yes`;

  if (isEditing) {
    return (
      <div className="bg-neutral-900 border border-indigo-500/50 rounded-2xl p-6 transition-all shadow-[0_0_20px_rgba(79,70,229,0.1)]">
        <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-4">
          <h3 className="text-xl font-semibold text-white">Edit Stop Details</h3>
          <button onClick={() => setIsEditing(false)} className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
            Cancel
          </button>
        </div>
        <form action={async (formData) => {
          const res = await updateStop(stop.id, routeId, formData);
          if (res.success) setIsEditing(false);
        }} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5 font-medium">Property Address</label>
            <input type="text" name="address" defaultValue={stop.address} required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5 font-medium">CRM Listing URL (Optional)</label>
            <input type="url" name="crmListingUrl" defaultValue={stop.crmListingUrl || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5 font-medium">Co-Broker Name (Optional)</label>
            <input type="text" name="coBrokerName" defaultValue={stop.coBrokerName || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5 font-medium">GPS Coordinates (lat, lng) (Optional)</label>
            <input type="text" name="gpsCoordinates" defaultValue={stop.gpsCoordinates || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" placeholder="e.g. 40.7128, -74.0060" />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5 font-medium">Private Broker Notes (Optional)</label>
            <textarea name="privateBrokerNotes" defaultValue={stop.privateBrokerNotes || ''} rows={4} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-amber-500 transition-all"></textarea>
          </div>
          <div className="flex justify-end mt-2">
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)]">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`bg-neutral-900 border ${stop.isVisited ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'border-neutral-800'} rounded-2xl p-6 transition-all group`}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div className="flex gap-4 flex-1">
          <div className="w-10 h-10 shrink-0 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/20">
            {index + 1}
          </div>
          <div>
            <h3 className="text-xl font-medium text-white leading-snug">{stop.address}</h3>
            {stop.crmListingUrl && (
              <a href={stop.crmListingUrl} target="_blank" rel="noreferrer" className="text-sm text-indigo-400 hover:text-indigo-300 underline mt-1.5 inline-block font-medium">
                View in CRM
              </a>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0 shrink-0 self-start w-full sm:w-auto">
          <div className="flex bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
            <button 
              disabled={isFirst}
              onClick={() => reorderStop(stop.id, routeId, 'up')}
              className="px-2 py-2 text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Move Up"
            >
              ↑
            </button>
            <div className="w-px bg-neutral-700"></div>
            <button 
              disabled={isLast}
              onClick={() => reorderStop(stop.id, routeId, 'down')}
              className="px-2 py-2 text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Move Down"
            >
              ↓
            </button>
          </div>
          <a 
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 md:px-4 rounded-lg text-xs md:text-sm font-medium transition-colors bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 whitespace-nowrap"
          >
            Drive
          </a>
          <button 
            onClick={() => setIsEditing(true)} 
            className="px-3 py-2 md:px-4 rounded-lg text-xs md:text-sm font-medium transition-colors bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700 whitespace-nowrap"
          >
            Edit
          </button>
          <form action={deleteStop.bind(null, stop.id, routeId)}>
            <button type="submit" className="px-3 py-2 md:px-4 rounded-lg text-xs md:text-sm font-medium transition-colors bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 whitespace-nowrap">
              Delete
            </button>
          </form>
          <form action={toggleVisitedStatus.bind(null, stop.id, stop.isVisited, routeId)}>
            <button type="submit" className={`px-3 py-2 md:px-4 rounded-lg text-xs md:text-sm font-medium transition-colors border whitespace-nowrap ${stop.isVisited ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700 hover:text-white'}`}>
              {stop.isVisited ? '✓ Visited' : 'Mark Visited'}
            </button>
          </form>
        </div>
      </div>
      {(stop.privateBrokerNotes || stop.coBrokerName || stop.gpsCoordinates) && (
        <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex flex-col gap-3">
          {stop.coBrokerName && (
            <div>
              <p className="text-xs text-amber-500/70 font-bold uppercase tracking-wider mb-1">Co-Broker</p>
              <p className="text-amber-100/90 text-sm font-medium">{stop.coBrokerName}</p>
            </div>
          )}
          {stop.gpsCoordinates && (
            <div>
              <p className="text-xs text-amber-500/70 font-bold uppercase tracking-wider mb-1">GPS Coordinates</p>
              <p className="text-amber-100/90 text-sm font-medium font-mono">{stop.gpsCoordinates}</p>
            </div>
          )}
          {stop.privateBrokerNotes && (
            <div>
              <p className="text-xs text-amber-500/70 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Private Broker Notes
              </p>
              <p className="text-amber-100/90 text-sm whitespace-pre-wrap leading-relaxed">{stop.privateBrokerNotes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
