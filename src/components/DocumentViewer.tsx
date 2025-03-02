import { useState, useEffect } from 'react';
import { DocumentService, DocumentMetadata, DocumentStatus } from '../lib/document/document-service';
import { useMidnightLaceWallet } from '../lib/wallet/use-midnight-lace';
import { DIDService } from '../lib/did/did-service';

interface DocumentViewerProps {
  documentHash: string;
  onSign?: () => void;
  onClose: () => void;
}

export function DocumentViewer({ documentHash, onSign, onClose }: DocumentViewerProps) {
  const [metadata, setMetadata] = useState<DocumentMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canSign, setCanSign] = useState(false);
  
  const wallet = useMidnightLaceWallet();
  const documentService = new DocumentService(wallet);
  const didService = new DIDService(wallet);

  useEffect(() => {
    loadDocument();
  }, [documentHash]);

  const loadDocument = async () => {
    try {
      // Check access first
      const hasAccess = await documentService.checkAccess(documentHash);
      if (!hasAccess) {
        setError('You do not have permission to view this document');
        return;
      }

      // Get document metadata
      const meta = await documentService.getDocumentMetadata(documentHash);
      setMetadata(meta);

      // Check if user can sign
      if (meta.status === DocumentStatus.Pending) {
        const kycLevel = await didService.getKYCLevel(meta.owner);
        setCanSign(kycLevel >= meta.requiredKyc);
      }
    } catch (err) {
      console.error('Failed to load document:', err);
      setError('Failed to load document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
          <div className="flex justify-center">
            <svg className="animate-spin h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-medium">Document Details</h2>
          <button
            onClick={onClose}
            className="rounded-md bg-white text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error ? (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : metadata ? (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Document Hash
              </label>
              <div className="mt-1 font-mono text-sm bg-gray-50 p-2 rounded">
                {metadata.hash}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Owner
              </label>
              <div className="mt-1 font-mono text-sm bg-gray-50 p-2 rounded">
                {metadata.owner}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Required KYC Level
              </label>
              <div className="mt-1 text-sm bg-gray-50 p-2 rounded">
                Level {metadata.requiredKyc}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  metadata.status === DocumentStatus.Signed
                    ? 'bg-green-100 text-green-800'
                    : metadata.status === DocumentStatus.Revoked
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {metadata.status}
                </span>
              </div>
            </div>

            {metadata.status === DocumentStatus.Pending && canSign && onSign && (
              <div className="mt-6">
                <button
                  onClick={onSign}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign Document
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
