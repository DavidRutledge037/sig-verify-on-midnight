import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { WalletProvider } from '../../contexts/WalletContext.js';
import { NotificationProvider } from '../../contexts/NotificationContext.js';
import { SignerRegistration } from '../../components/SignerRegistration.js';
import { DocumentUpload } from '../../components/DocumentUpload.js';
import { DocumentSigning } from '../../components/DocumentSigning.js';
import { mockMidnightWallet, mockSDK } from '../mocks/walletMock.js';
import { mockDocumentManager } from '../mocks/documentManagerMock.js';

describe('Document Signing Flow', () => {
    beforeEach(() => {
        // @ts-ignore
        global.window.midnight = mockMidnightWallet;
        jest.clearAllMocks();
    });

    it('should complete full document signing flow', async () => {
        // Render the registration component
        const { rerender } = render(
            <NotificationProvider>
                <WalletProvider>
                    <SignerRegistration />
                </WalletProvider>
            </NotificationProvider>
        );

        // Complete registration
        await act(async () => {
            fireEvent.change(screen.getByLabelText('Full Name'), {
                target: { value: 'John Doe' }
            });
            fireEvent.change(screen.getByLabelText('Email'), {
                target: { value: 'john@example.com' }
            });
            fireEvent.change(screen.getByLabelText('ID Number'), {
                target: { value: '123456789' }
            });
            fireEvent.click(screen.getByText('Register'));
        });

        expect(mockSDK.generateZKProof).toHaveBeenCalled();
        expect(screen.getByText('Successfully registered as a signer!')).toBeInTheDocument();

        // Render document upload
        rerender(
            <NotificationProvider>
                <WalletProvider>
                    <DocumentUpload 
                        documentManager={mockDocumentManager}
                        onUploadComplete={() => {}}
                    />
                </WalletProvider>
            </NotificationProvider>
        );

        // Upload document
        const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
        await act(async () => {
            fireEvent.change(screen.getByLabelText('Choose Document'), {
                target: { files: [file] }
            });
            fireEvent.click(screen.getByText('Upload'));
        });

        expect(mockSDK.submitShieldedTransaction).toHaveBeenCalled();
        expect(screen.getByText('Document uploaded successfully!')).toBeInTheDocument();

        // Render signing component
        rerender(
            <NotificationProvider>
                <WalletProvider>
                    <DocumentSigning />
                </WalletProvider>
            </NotificationProvider>
        );

        // Sign document
        await act(async () => {
            fireEvent.click(screen.getByText('Sign Document'));
        });

        expect(mockMidnightWallet.signTransaction).toHaveBeenCalled();
        expect(screen.getByText('Document signed successfully!')).toBeInTheDocument();
    });

    it('should handle errors in the flow', async () => {
        mockSDK.generateZKProof.mockRejectedValueOnce(new Error('ZK proof failed'));

        render(
            <NotificationProvider>
                <WalletProvider>
                    <SignerRegistration />
                </WalletProvider>
            </NotificationProvider>
        );

        await act(async () => {
            fireEvent.change(screen.getByLabelText('Full Name'), {
                target: { value: 'John Doe' }
            });
            fireEvent.click(screen.getByText('Register'));
        });

        expect(screen.getByText('Registration failed. Please try again.')).toBeInTheDocument();
    });

    it('should handle document upload', async () => {
        const mockDocumentManager = {
            createDocument: jest.fn().mockResolvedValue('doc_id_123')
        };

        const mockOnUploadComplete = jest.fn();

        render(
            <NotificationProvider>
                <WalletProvider>
                    <DocumentUpload 
                        documentManager={mockDocumentManager}
                        onUploadComplete={mockOnUploadComplete}
                    />
                </WalletProvider>
            </NotificationProvider>
        );

        // ... rest of the test
    });
}); 