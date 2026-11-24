import {it,expect} from 'vitest';
import {search} from '../services/search';
it('searches canonical title and conceptual text',()=>{
 expect(search('Irrationality').some(x=>x.id==='LAW-01')).toBe(true);
 expect(search('confirmation bias').some(x=>x.id==='CON-0001')).toBe(true);
 expect(search('nonsense')).toEqual([]);
});
