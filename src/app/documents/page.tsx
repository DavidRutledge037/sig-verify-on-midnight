'use client';

import { useState } from 'react';
import { DocumentUpload } from '../../components/DocumentUpload';
import { DocumentList } from '../../components/DocumentList';
import { DocumentViewer } from '../../components/DocumentViewer';

export default function DocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const handleUploadComplete = (hash: string) => {
    // Add hash to local storage for MVP
    const hashes = JSON.parse(localStorage.getItem('documentHashes') || '[]');
    localStorage.setItem('documentHashes', JSON.stringify([...hashes, hash]));
    
    setShowUpload(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Documents</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all your documents and documents shared with you.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Upload Document
            </button>
          </div>
        </div>

        <div className="mt-8">
          <DocumentList onSelectDocument={setSelectedDocument} />
        </div>
      </div>

      {showUpload && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-medium">Upload Document</h2>
              <button
                onClick={() => setShowUpload(false)}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <DocumentUpload onUploadComplete={handleUploadComplete} />
          </div>
        </div>
      )}

      {selectedDocument && (
        <DocumentViewer
          documentHash={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onSign={() => {
            // TODO: Implement signing
            console.log('Sign document:', selectedDocument);
          }}
        />
      )}
    </div>
  );
}
