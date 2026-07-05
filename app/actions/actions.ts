'use server';

import { db } from '../../db';
import { routes, propertyStops } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createRoute(formData: FormData): Promise<void> {
  const clientName = formData.get('clientName') as string;
  const showingDate = formData.get('showingDate') as string;
  const status = (formData.get('status') as string) || 'pending';

  if (!clientName || !showingDate) {
    throw new Error('Missing required fields');
  }

  try {
    await db.insert(routes).values({
      clientName,
      showingDate,
      status,
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Error creating route:', error);
  }
}

export async function deleteStop(stopId: number, routeId: number): Promise<void> {
  try {
    await db.delete(propertyStops).where(eq(propertyStops.id, stopId));
    revalidatePath(`/admin/${routeId}`);
    revalidatePath(`/client/${routeId}`);
  } catch (error) {
    console.error('Error deleting stop:', error);
  }
}

export async function deleteRoute(routeId: number): Promise<void> {
  try {
    await db.delete(routes).where(eq(routes.id, routeId));
  } catch (error) {
    console.error('Error deleting route:', error);
    return;
  }
  redirect('/');
}
