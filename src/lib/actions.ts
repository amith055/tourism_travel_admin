'use server';

import { revalidatePath } from 'next/cache';

// In a real app, you'd interact with your database here.
// For this demo, we'll just log the action and simulate a delay.
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function approveSubmission(submissionId: string, formData: FormData) {
  await delay(1000);
  console.log(`Approving submission ${submissionId}`);
  // Example: Move from 'touristplacesverify' to 'touristplaces' in Firestore
  revalidatePath('/submissions');
  revalidatePath('/tourist-places');
  revalidatePath('/dashboard');
  return { success: true, message: `Submission ${submissionId} approved.` };
}

export async function rejectSubmission(submissionId: string, formData: FormData) {
  await delay(1000);
  console.log(`Rejecting submission ${submissionId}`);
  // Example: Delete from 'touristplacesverify' in Firestore
  revalidatePath('/submissions');
  revalidatePath('/dashboard');
  return { success: true, message: `Submission ${submissionId} rejected.` };
}

export async function deleteItem(itemId: string, itemType: 'place' | 'event') {
    await delay(1000);
    console.log(`Deleting ${itemType} ${itemId}`);
    // Example: Delete from 'touristplaces' or 'culturalfest' in Firestore
    if (itemType === 'place') {
        revalidatePath('/tourist-places');
    } else {
        revalidatePath('/cultural-events');
    }
    revalidatePath('/dashboard');
    return { success: true, message: `${itemType} ${itemId} deleted.` };
}
