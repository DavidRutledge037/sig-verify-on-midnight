import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs/promises';

const execAsync = promisify(exec);

async function compileCircuit() {
  try {
    console.log('Compiling Signature Circuit...');

    // Create circuits build directory if it doesn't exist
    const buildDir = path.join(process.cwd(), 'public', 'circuits');
    await fs.mkdir(buildDir, { recursive: true });

    // Path to circuit
    const circuitPath = path.join(
      process.cwd(),
      'src',
      'contracts',
      'signatures',
      'signature_circuit.compact'
    );

    // Compile circuit using compactc
    const compactcPath = require.resolve('@midnight-ntwrk/compactc/bin/compactc');
    await execAsync(
      `node ${compactcPath} compile --input ${circuitPath} --output ${buildDir}/signature_circuit.r1cs --wasm ${buildDir}/signature_circuit.wasm`
    );

    console.log('Circuit compilation complete!');
    console.log('Generated files:');
    console.log('- signature_circuit.r1cs');
    console.log('- signature_circuit.wasm');
    
  } catch (error) {
    console.error('Circuit compilation failed:', error);
    process.exit(1);
  }
}

compileCircuit();
