'use server';

import { db } from '../../db';
import { routes } from '../../db/schema';
import { revalidatePath } from 'next/cache';

export async function createRoute(formData: FormData) {
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
    return { success: true };
  } catch (error) {
    console.error('Error creating route:', error);
    return { success: false, error: 'Failed to create route' };
  }
}
