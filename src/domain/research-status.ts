import { z } from 'zod';
export const Provenance = z.enum(['directly_inspected','independently_verified','secondary_source_account','editorial_synthesis','unverified']);
export const Evidence = z.enum(['supported','mixed','limited','contested','not_assessed']);
export const Coverage = z.enum(['fully_reviewed','partially_reviewed','provisional','awaiting_review','blocked']);
export type CoverageStatus = z.infer<typeof Coverage>;
export const labelCoverage: Record<CoverageStatus,string> = {
  fully_reviewed:'Fully reviewed', partially_reviewed:'Partial review', provisional:'Provisional', awaiting_review:'Awaiting research', blocked:'Blocked'
};
