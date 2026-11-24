import { rawDataset } from '../src/services/repository';
import {validateDataset} from '../src/domain/validator';
const result=validateDataset(rawDataset);
for(const entry of [...result.errors,...result.warnings])console.log(`${entry.severity.toUpperCase()} [${entry.code}] ${entry.path}: ${entry.message}`);
console.log(`HNI data validation: ${result.errors.length} errors, ${result.warnings.length} editorial warnings`);
if(!result.valid)process.exitCode=1;
