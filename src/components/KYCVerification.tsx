import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { LoadingSpinner } from './LoadingSpinner';

type KYCStatus = 'not_started' | 'pending' | 'verified' | 'rejected';

interface KYCData {
    fullName: string;
    dateOfBirth: string;
    documentType: 'passport' | 'drivers_license' | 'national_id';
}

export const KYCVerification: React.FC = () => {
    const [status, setStatus] = useState<KYCStatus>('not_started');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<KYCData>({
        fullName: '',
        dateOfBirth: '',
        documentType: 'passport'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            setError(null);
            
            // Mock KYC submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            setStatus('pending');
            
        } catch (err) {
            setError('Failed to submit KYC verification');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const renderForm = () => (
        <form onSubmit={handleSubmit} className="kyc-form">
            <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                    type="date"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="documentType">Document Type</label>
                <select
                    id="documentType"
                    value={formData.documentType}
                    onChange={e => setFormData({...formData, documentType: e.target.value as any})}
                    required
                >
                    <option value="passport">Passport</option>
                    <option value="drivers_license">Driver's License</option>
                    <option value="national_id">National ID</option>
                </select>
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                className="submit-button"
            >
                {isLoading ? (
                    <>
                        <LoadingSpinner />
                        <span>Submitting...</span>
                    </>
                ) : (
                    'Submit KYC'
                )}
            </button>
        </form>
    );

    return (
        <div className="kyc-verification">
            <h2>KYC Verification</h2>
            
            {status === 'not_started' && (
                <>
                    <p className="kyc-intro">
                        Complete your KYC verification to access additional features.
                    </p>
                    {renderForm()}
                </>
            )}

            {status === 'pending' && (
                <div className="kyc-status pending">
                    <h3>Verification In Progress</h3>
                    <p>Your KYC verification is being processed. This may take 24-48 hours.</p>
                </div>
            )}

            {status === 'verified' && (
                <div className="kyc-status verified">
                    <h3>Verification Complete</h3>
                    <p>Your identity has been verified successfully.</p>
                </div>
            )}

            {status === 'rejected' && (
                <div className="kyc-status rejected">
                    <h3>Verification Failed</h3>
                    <p>Your KYC verification was not successful. Please try again.</p>
                    {renderForm()}
                </div>
            )}

            {error && <div className="error-message">{error}</div>}
        </div>
    );
}; 