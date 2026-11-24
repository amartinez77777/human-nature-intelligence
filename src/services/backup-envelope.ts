/** JSON transport gate shared by import code and dependency-free regression tests. */
export function extractBackupProgress(text:string):unknown{
 if(!text.trim())throw Error('Backup is empty.');
 if(text.length>1_000_000)throw Error('Backup exceeds the 1 MB safety limit.');
 let data:unknown;try{data=JSON.parse(text);}catch{throw Error('File is not valid JSON.');}
 if(typeof data!=='object'||data===null||Array.isArray(data)||!('format' in data)||data.format!=='hni-progress'||!('progress' in data))
  throw Error('Not an HNI progress export. Research datasets cannot be imported here.');
 return data.progress;
}
