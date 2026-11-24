import {Link} from 'react-router-dom';
import {claims,researchFindings} from '../../services/repository';
import {summarizePerspectives} from '../../services/perspective-model';
import {FactList} from './UI';
/** Distinguish author attribution, alternatives, independently evaluated evidence and limits. */
export default function ResearchPerspectives({claimIds,competing,inferenceLimits}:{claimIds:string[];competing:string[];inferenceLimits:string[]}){
 const model=summarizePerspectives(claimIds,claims,researchFindings);
 return <section className="perspectives" aria-labelledby="perspectives-title">
  <div className="perspectives-heading"><span className="eyebrow">SOURCE & INTERPRETATION</span><h2 id="perspectives-title">Four perspectives on this material</h2><p>Attribution, alternatives, empirical assessment and inference limits are independent questions.</p></div>
  <div className="perspectives-grid">
   <div className="perspective-cell"><span className="perspective-number">01 / AUTHOR'S ACCOUNT</span><h3>What Greene argues</h3>{model.claims.length?<ul className="perspective-claims">{model.claims.map(c=><li key={c.id}><p>{c.statement}</p><Link to={`/evidence/${c.id}`}>Inspect {c.id} and its sources</Link></li>)}</ul>:<p className="muted">No attributed claim is linked yet.</p>}{model.missingClaimIds.length>0&&<p role="status">Missing claim references: {model.missingClaimIds.join(', ')}</p>}</div>
   <div className="perspective-cell"><span className="perspective-number">02 / COMPETING LENSES</span><h3>What else might explain it?</h3><FactList items={competing} empty="Competing explanations have not been reviewed."/></div>
   <div className="perspective-cell"><span className="perspective-number">03 / EVIDENCE</span><h3>What has been independently assessed?</h3><p className="perspective-evidence">{model.evidenceLabel}</p>{model.findings.length?<ul className="fact-list">{model.findings.map(f=><li key={f.id}>{f.finding}</li>)}</ul>:<p>Book passages establish the author's argument, not independent scientific support. Stage 07 is reserved for critical empirical research.</p>}</div>
   <div className="perspective-cell"><span className="perspective-number">04 / INFERENCE LIMITS</span><h3>What cannot be concluded?</h3><FactList items={inferenceLimits} empty="No inference limits have been authored yet; avoid confident conclusions."/></div>
  </div>
 </section>;
}
