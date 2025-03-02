import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentService } from '../lib/document/document-service';
import { useMidnightLaceWallet } from '../lib/wallet/use-midnight-lace';

interface DocumentUploadProps {
  onUploadComplete: (hash: string) => void;
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [kycLevel, setKycLevel] = useState(1);
  const [authorizedDids, setAuthorizedDids] = useState<string[]>([]);
  const [didInput, setDidInput] = useState('');
  
  const wallet = useMidnightLaceWallet();
  const documentService = new DocumentService(wallet);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length !== 1) {
      setError('Please upload one file at a time');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const file = acceptedFiles[0];
      const content = await file.arrayBuffer();
      
      const hash = await documentService.registerDocument(
        content,
        kycLevel,
        authorizedDids
      );
      
      onUploadComplete(hash);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [documentService, kycLevel, authorizedDids, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  const addAuthorizedDid = useCallback(() => {
    if (didInput && !authorizedDids.includes(didInput)) {
      setAuthorizedDids([...authorizedDids, didInput]);
      setDidInput('');
    }
  }, [didInput, authorizedDids]);

  const removeAuthorizedDid = useCallback((did: string) => {
    setAuthorizedDids(authorizedDids.filter(d => d !== did));
  }, [authorizedDids]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Required KYC Level
          </label>
          <select
            value={kycLevel}
            onChange={(e) => setKycLevel(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value={1}>Basic (L1)</option>
            <option value={2}>Standard (L2)</option>
            <option value={3}>Enhanced (L3)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Authorized DIDs
          </label>
          <div className="mt-1 flex space-x-2">
            <input
              type="text"
              value={didInput}
              onChange={(e) => setDidInput(e.target.value)}
              placeholder="Enter DID"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={addAuthorizedDid}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          
          {authorizedDids.length > 0 && (
            <div className="mt-2 space-y-2">
              {authorizedDids.map(did => (
                <div key={did} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                  <span className="font-mono text-sm truncate">{did}</span>
                  <button
                    onClick={() => removeAuthorizedDid(did)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {loading ? (
          <div className="text-gray-600">
            <svg className="animate-spin h-6 w-6 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </div>
        ) : isDragActive ? (
          <p className="text-blue-600">Drop the file here</p>
        ) : (
          <div>
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m-4-4h4" strokeWidth="2" strokeLinecap="round"/>
              <path d="M24 32v-8m0 0l-4 4m4-4l4 4" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="mt-2 text-gray-600">
              Drag and drop a file here, or click to select
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
