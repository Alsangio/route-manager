import React from 'react';
import { createRoute } from './actions/route';
import { db } from '../db';
import { routes } from '../db/schema';
import { desc } from 'drizzle-orm';

export default async function Home() {
  const recentRoutes = await db.select().from(routes).orderBy(desc(routes.id)).limit(5);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center p-8 overflow-y-auto relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="z-10 flex flex-col items-center text-center space-y-8 max-w-3xl mt-12 w-full pb-20">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm text-sm font-medium text-neutral-300 shadow-sm transition-all hover:bg-neutral-800/50">
          ✨ Database & Next.js Setup Complete
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-neutral-500 bg-clip-text text-transparent">
          Route Manager
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl font-light">
          Your premium real estate route planning platform is ready. Start building powerful mapping and scheduling experiences today.
        </p>

        {/* Form Section */}
        <div className="mt-12 w-full max-w-md bg-neutral-900/60 p-8 rounded-3xl border border-neutral-800/50 backdrop-blur-xl shadow-2xl relative overflow-hidden text-left">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
          <h2 className="text-2xl font-semibold mb-6 text-white relative z-10">Create New Route</h2>
          <form action={createRoute} className="flex flex-col gap-5 relative z-10">
            <div className="flex flex-col gap-2">
              <label htmlFor="clientName" className="text-sm text-neutral-400 font-medium">Client Name</label>
              <input type="text" id="clientName" name="clientName" placeholder="e.g. John Doe" required className="bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="showingDate" className="text-sm text-neutral-400 font-medium">Showing Date</label>
              <input type="date" id="showingDate" name="showingDate" required style={{ colorScheme: 'dark' }} className="bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="status" className="text-sm text-neutral-400 font-medium">Status</label>
              <select id="status" name="status" className="bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button type="submit" className="mt-2 px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] active:scale-[0.98] cursor-pointer">
              Create Route
            </button>
          </form>
        </div>

        {/* Recent Routes List */}
        {recentRoutes.length > 0 && (
          <div className="w-full max-w-3xl mt-12 text-left">
            <h3 className="text-xl font-semibold mb-6 text-white px-2">Recent Routes</h3>
            <div className="grid gap-4">
              {recentRoutes.map(route => (
                <a key={route.id} href={`/admin/${route.id}`} className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-5 flex items-center justify-between backdrop-blur-sm hover:bg-neutral-800/60 transition-all hover:border-indigo-500/30 group cursor-pointer block">
                  <div>
                    <h4 className="text-lg font-medium text-white group-hover:text-indigo-400 transition-colors">{route.clientName}</h4>
                    <p className="text-sm text-neutral-400 mt-1">{new Date(route.showingDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      route.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      route.status === 'active' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {route.status}
                    </div>
                    <span className="text-neutral-600 group-hover:text-indigo-400 transition-colors">→</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Decorative Grid */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik02MCAwaC0xdjYwaDFWMHoiIGZpbGw9IiMzMzMiIGZpbGwtb3BhY2l0eT0iLjIiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8cGF0aCBkPSJNMCA1OWg2MHYxaC02MHoiIGZpbGw9IiMzMzMiIGZpbGwtb3BhY2l0eT0iLjIiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] pointer-events-none opacity-40 z-0"></div>
    </div>
  );
}
