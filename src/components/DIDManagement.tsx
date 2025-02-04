import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { LoadingSpinner } from './LoadingSpinner';

// W3C compliant DID Document interface
interface VerificationMethod {
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase?: string;
}

interface Service {
    id: string;
    type: string;
    serviceEndpoint: string;
}

interface DIDDocument {
    '@context': string[];
    id: string;
    controller: string;
    verificationMethod: VerificationMethod[];
    authentication: string[];
    assertionMethod: string[];
    service?: Service[];
    created: string;
    updated: string;
}

type DIDView = 'create' | 'resolve' | 'view';

export const DIDManagement: React.FC = () => {
    const { address } = useWallet();
    const [currentView, setCurrentView] = useState<DIDView>('create');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [didDocument, setDidDocument] = useState<DIDDocument | null>(null);
    const [didToResolve, setDidToResolve] = useState('');
    const [resolvedDID, setResolvedDID] = useState<DIDDocument | null>(null);

    const createDID = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            if (!address) {
                throw new Error('Wallet address required');
            }

            // Create a W3C compliant DID Document
            const did = `did:midnight:${address.slice(0, 16)}`;
            const timestamp = new Date().toISOString();
            
            const newDIDDocument: DIDDocument = {
                '@context': [
                    'https://www.w3.org/ns/did/v1',
                    'https://w3id.org/security/suites/ed25519-2020/v1'
                ],
                id: did,
                controller: did,
                verificationMethod: [{
                    id: `${did}#key-1`,
                    type: 'Ed25519VerificationKey2020',
                    controller: did,
                    publicKeyMultibase: `z${address}` // This should be properly encoded in production
                }],
                authentication: [`${did}#key-1`],
                assertionMethod: [`${did}#key-1`],
                service: [{
                    id: `${did}#vcs`,
                    type: 'VerifiableCredentialService',
                    serviceEndpoint: 'https://midnight.network/credentials'
                }],
                created: timestamp,
                updated: timestamp
            };

            // Mock DID creation delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            setDidDocument(newDIDDocument);
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create DID');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const resolveDID = async (didUrl: string) => {
        try {
            setIsLoading(true);
            setError(null);

            if (!didUrl.startsWith('did:midnight:')) {
                throw new Error('Invalid DID format. Must start with did:midnight:');
            }

            // Mock DID resolution
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // For demo, create a mock resolved DID
            const timestamp = new Date().toISOString();
            const resolvedDocument: DIDDocument = {
                '@context': [
                    'https://www.w3.org/ns/did/v1',
                    'https://w3id.org/security/suites/ed25519-2020/v1'
                ],
                id: didUrl,
                controller: didUrl,
                verificationMethod: [{
                    id: `${didUrl}#key-1`,
                    type: 'Ed25519VerificationKey2020',
                    controller: didUrl,
                    publicKeyMultibase: `z${didUrl.split(':')[2]}`
                }],
                authentication: [`${didUrl}#key-1`],
                assertionMethod: [`${didUrl}#key-1`],
                service: [{
                    id: `${didUrl}#vcs`,
                    type: 'VerifiableCredentialService',
                    serviceEndpoint: 'https://midnight.network/credentials'
                }],
                created: timestamp,
                updated: timestamp
            };

            setResolvedDID(resolvedDocument);
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resolve DID');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const renderDIDDocument = () => {
        if (!didDocument) return null;

        return (
            <div className="did-info">
                <h3>Your DID Document</h3>
                <div className="did-details">
                    <div className="did-field">
                        <strong>DID:</strong>
                        <code>{didDocument.id}</code>
                    </div>
                    
                    <div className="did-field">
                        <strong>Controller:</strong>
                        <code>{didDocument.controller}</code>
                    </div>
                    
                    <div className="did-field">
                        <strong>Created:</strong>
                        <span>{new Date(didDocument.created).toLocaleString()}</span>
                    </div>
                    
                    <div className="did-field">
                        <strong>Verification Method:</strong>
                        <pre className="did-json">
                            {JSON.stringify(didDocument.verificationMethod[0], null, 2)}
                        </pre>
                    </div>

                    <div className="did-field">
                        <strong>Services:</strong>
                        <pre className="did-json">
                            {JSON.stringify(didDocument.service, null, 2)}
                        </pre>
                    </div>

                    <button 
                        onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(didDocument, null, 2));
                        }}
                        className="copy-button"
                    >
                        Copy Full DID Document
                    </button>
                </div>
            </div>
        );
    };

    const renderNavigation = () => (
        <nav className="did-navigation">
            <button
                onClick={() => {
                    setCurrentView('create');
                    setError(null);
                }}
                className={`did-nav-button ${currentView === 'create' ? 'active' : ''}`}
            >
                Create DID
            </button>
            <button
                onClick={() => {
                    setCurrentView('resolve');
                    setError(null);
                }}
                className={`did-nav-button ${currentView === 'resolve' ? 'active' : ''}`}
            >
                Resolve DID
            </button>
            {didDocument && (
                <button
                    onClick={() => {
                        setCurrentView('view');
                        setError(null);
                    }}
                    className={`did-nav-button ${currentView === 'view' ? 'active' : ''}`}
                >
                    View My DID
                </button>
            )}
        </nav>
    );

    const renderResolveForm = () => (
        <div className="did-resolve">
            <h3>Resolve DID</h3>
            <div className="resolve-form">
                <input
                    type="text"
                    value={didToResolve}
                    onChange={(e) => setDidToResolve(e.target.value)}
                    placeholder="Enter DID (did:midnight:...)"
                    className="did-input"
                />
                <button
                    onClick={() => resolveDID(didToResolve)}
                    disabled={isLoading || !didToResolve}
                    className="resolve-button"
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner />
                            <span>Resolving...</span>
                        </>
                    ) : (
                        'Resolve DID'
                    )}
                </button>
            </div>

            {resolvedDID && (
                <div className="resolved-did">
                    <h4>Resolved DID Document</h4>
                    <pre className="did-json">
                        {JSON.stringify(resolvedDID, null, 2)}
                    </pre>
                    <button 
                        onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(resolvedDID, null, 2));
                        }}
                        className="copy-button"
                    >
                        Copy Document
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="did-management">
            <h2>DID Management</h2>
            {renderNavigation()}
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="did-content">
                {currentView === 'create' && !didDocument && (
                    <div className="did-create">
                        <p>No DID found. Create one to get started.</p>
                        <button
                            onClick={createDID}
                            disabled={isLoading}
                            className="create-did-button"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner />
                                    <span>Creating DID...</span>
                                </>
                            ) : (
                                'Create DID'
                            )}
                        </button>
                    </div>
                )}
                
                {currentView === 'resolve' && renderResolveForm()}
                
                {(currentView === 'view' || (currentView === 'create' && didDocument)) && (
                    renderDIDDocument()
                )}
            </div>
        </div>
    );
}; 