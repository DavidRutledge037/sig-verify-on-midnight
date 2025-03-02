import { readFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const bytecode = readFileSync(
      join(process.cwd(), 'src/contracts/signatures/signature_verification.compact'),
      'utf-8'
    );
    
    return new NextResponse(bytecode, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Failed to read contract bytecode:', error);
    return new NextResponse('Failed to read contract bytecode', { status: 500 });
  }
}
