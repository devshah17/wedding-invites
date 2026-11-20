/**
 * Family & Lineage Types
 * Types representing both groom and bride sides of the family, lineage, and blessings.
 */

export interface FamilyMember {
  name: string;
  relation: string;
  order: number;
}

export interface FamilySide {
  side: 'groom' | 'bride';
  title: string;
  familyName: string;
  members: FamilyMember[];
  message: string;
}
