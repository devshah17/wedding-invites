import type { FamilySide } from '@/types/family';

/**
 * Family profiles and lineages for both the Groom (Shah Family) and Bride (Sikligar Family).
 */

export const groomFamily: FamilySide = {
  side: 'groom',
  title: "Groom's Family",
  familyName: 'Shah Family',
  message:
    'With boundless gratitude to the Almighty and our ancestors, we warmly invite you to join our family celebrations as our beloved son Dev embarks upon this sacred new journey of life with Vishakha. Your loving presence and blessings are our greatest treasure.',
  members: [
    {
      name: 'Shri Kaushikkumar Natvarlal Shah',
      relation: 'Father',
      order: 1,
    },
    {
      name: 'Smt. Geetaben Kaushikkumar Shah',
      relation: 'Mother',
      order: 2,
    },
    {
      name: 'Shah Family & Relatives',
      relation: 'Near & Dear Ones',
      order: 3,
    },
  ],
};

export const brideFamily: FamilySide = {
  side: 'bride',
  title: "Bride's Family",
  familyName: 'Sikligar Family',
  message:
    'From her first steps to this cherished threshold of marriage, our dearest Vishakha has brought eternal warmth and happiness into our lives. As she unites her life and destiny with Dev, we cordially invite you to shower the couple with your choicest blessings.',
  members: [
    {
      name: 'Shri Praveen Sikligar',
      relation: 'Father',
      order: 1,
    },
    {
      name: 'Smt. Chandaben Praveenkumar Sikligar',
      relation: 'Mother',
      order: 2,
    },
    {
      name: 'Sikligar Family & Relatives',
      relation: 'Near & Dear Ones',
      order: 3,
    },
  ],
};

export const familySides: Record<'groom' | 'bride', FamilySide> = {
  groom: groomFamily,
  bride: brideFamily,
};

export const families: FamilySide[] = [groomFamily, brideFamily];

export default families;
