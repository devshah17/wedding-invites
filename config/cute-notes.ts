/**
 * Curated Cute & Warm Personal Notes for Personalized Invitations
 * Designed for Dev & Vishakha's Royal Wedding Celebrations.
 */

export const CUTE_INVITATION_NOTES: string[] = [
  "Our big day wouldn't be as magical or complete without your warm smile, blessings, and killer dance moves!",
  "Pack your best traditional outfit and dancing shoes—you've got a front-row seat to our happily ever after!",
  "Having you celebrate our love story means the world to us. Get ready for endless sweets, music, and joyful memories!",
  "True friendship and family warmth are the greatest blessings. We can't wait to share these auspicious moments with you!",
  "Get ready to shower us with lots of flower petals, hearty laughter, and your sweetest love as we tie the knot!",
  "Save your appetite for a royal feast and your heart for big hugs—our wedding celebration is incomplete without you!",
];

export function getRandomCuteNote(): string {
  const index = Math.floor(Math.random() * CUTE_INVITATION_NOTES.length);
  return CUTE_INVITATION_NOTES[index];
}
