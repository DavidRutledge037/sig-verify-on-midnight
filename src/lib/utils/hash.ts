import { createHash } from 'crypto';

export async function hashDocument(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        if (!e.target?.result) {
          throw new Error('Failed to read file');
        }
        
        const buffer = e.target.result as ArrayBuffer;
        const hash = createHash('sha256');
        hash.update(Buffer.from(buffer));
        resolve(hash.digest('hex'));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}
