import * as snarkjs from 'snarkjs';
import * as path from 'path';
import * as fs from 'fs/promises';

async function setupCircuit() {
  try {
    console.log('Setting up Signature Circuit...');

    const buildDir = path.join(process.cwd(), 'public', 'circuits');

    // Generate zkey
    console.log('Generating zkey...');
    const ptau = path.join(buildDir, 'pot15_final.ptau');
    const r1cs = path.join(buildDir, 'signature_circuit.r1cs');
    const zkey = path.join(buildDir, 'signature_circuit.zkey');

    // Download Powers of Tau file if not exists
    if (!fs.existsSync(ptau)) {
      console.log('Downloading Powers of Tau file...');
      // In production, download from a trusted source
      // For now, we'll use a placeholder
      throw new Error('Please download pot15_final.ptau and place it in public/circuits/');
    }

    // Generate initial zkey
    await snarkjs.zKey.newZKey(r1cs, ptau, zkey);

    // Export verification key
    const vkey = path.join(buildDir, 'verification_key.json');
    await snarkjs.zKey.exportVerificationKey(zkey, vkey);

    console.log('Circuit setup complete!');
    console.log('Generated files:');
    console.log('- signature_circuit.zkey');
    console.log('- verification_key.json');

  } catch (error) {
    console.error('Circuit setup failed:', error);
    process.exit(1);
  }
}

setupCircuit();
