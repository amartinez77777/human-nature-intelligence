import { z } from 'zod';
export const RelationshipType=z.enum(['illustrates','explores','supports','contradicts','complements','qualifies','extends','alternative_to','related_to','shared_foundation']);
