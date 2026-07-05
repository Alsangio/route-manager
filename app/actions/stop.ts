'use server';

import { db } from '../../db';
import { propertyStops } from '../../db/schema';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function addStop(routeId: number, formData: FormData): Promise<void> {
  const address = formData.get('address') as string;
  const crmListingUrl = formData.get('crmListingUrl') as string;
  const privateBrokerNotes = formData.get('privateBrokerNotes') as string;
  const coBrokerName = formData.get('coBrokerName') as string;

  if (!address) {
    throw new Error('Address is required');
  }

  const existingStops = await db.select().from(propertyStops).where(eq(propertyStops.routeId, routeId));
  const maxOrder = existingStops.reduce((max, stop) => Math.max(max, stop.visitOrder), 0);

  try {
    await db.insert(propertyStops).values({
      routeId,
      address,
      crmListingUrl,
      privateBrokerNotes,
      coBrokerName,
      visitOrder: maxOrder + 1,
    });
    
    revalidatePath(`/admin/${routeId}`);
    revalidatePath(`/client/${routeId}`);
  } catch (error) {
    console.error('Error adding stop:', error);
  }
}

export async function toggleVisitedStatus(stopId: number, currentStatus: boolean, routeId: number): Promise<void> {
  try {
    await db.update(propertyStops)
      .set({ isVisited: !currentStatus })
      .where(eq(propertyStops.id, stopId));
      
    revalidatePath(`/admin/${routeId}`);
    revalidatePath(`/client/${routeId}`);
  } catch (error) {
    console.error('Error toggling visited status:', error);
  }
}

export async function updateStop(stopId: number, routeId: number, formData: FormData) {
  const address = formData.get('address') as string;
  const crmListingUrl = formData.get('crmListingUrl') as string;
  const privateBrokerNotes = formData.get('privateBrokerNotes') as string;
  const coBrokerName = formData.get('coBrokerName') as string;

  if (!address) {
    throw new Error('Address is required');
  }

  try {
    await db.update(propertyStops)
      .set({
        address,
        crmListingUrl,
        privateBrokerNotes,
        coBrokerName,
      })
      .where(eq(propertyStops.id, stopId));
      
    revalidatePath(`/admin/${routeId}`);
    revalidatePath(`/client/${routeId}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating stop:', error);
    return { success: false, error: 'Failed to update property stop' };
  }
}

export async function reorderStop(stopId: number, routeId: number, direction: 'up' | 'down') {
  try {
    const stops = await db.select().from(propertyStops).where(eq(propertyStops.routeId, routeId)).orderBy(asc(propertyStops.visitOrder));
    
    const currentIndex = stops.findIndex(s => s.id === stopId);
    if (currentIndex === -1) throw new Error('Stop not found');
    
    if (direction === 'up' && currentIndex > 0) {
      const currentStop = stops[currentIndex];
      const prevStop = stops[currentIndex - 1];
      
      await db.update(propertyStops).set({ visitOrder: prevStop.visitOrder }).where(eq(propertyStops.id, currentStop.id));
      await db.update(propertyStops).set({ visitOrder: currentStop.visitOrder }).where(eq(propertyStops.id, prevStop.id));
    } else if (direction === 'down' && currentIndex < stops.length - 1) {
      const currentStop = stops[currentIndex];
      const nextStop = stops[currentIndex + 1];
      
      await db.update(propertyStops).set({ visitOrder: nextStop.visitOrder }).where(eq(propertyStops.id, currentStop.id));
      await db.update(propertyStops).set({ visitOrder: currentStop.visitOrder }).where(eq(propertyStops.id, nextStop.id));
    }
    
    revalidatePath(`/admin/${routeId}`);
    revalidatePath(`/client/${routeId}`);
    return { success: true };
  } catch (error) {
    console.error('Error reordering stop:', error);
    return { success: false, error: 'Failed to reorder stop' };
  }
}
