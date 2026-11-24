export const entityTypes = ['law','concept','historical_case','claim','source','source_reference','research_finding','exercise','learning_path'] as const;
export type EntityType = (typeof entityTypes)[number];
export const entityRoutes: Partial<Record<EntityType,string>> = {
  law:'/laws/', concept:'/atlas/', historical_case:'/cases/', claim:'/evidence/', source:'/sources/', research_finding:'/evidence/findings/', exercise:'/academy/exercise/', learning_path:'/academy/path/'
};
export function entityUrl(type: EntityType, id: string): string {return (entityRoutes[type] || '/network?entity=') + id;}
