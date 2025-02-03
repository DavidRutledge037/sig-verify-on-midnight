import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './Navigation.js';
import { SignerRegistration } from './SignerRegistration.js';
import { DocumentUpload } from './DocumentUpload.js';
import { DocumentSigning } from './DocumentSigning.js';
import { NotificationProvider } from '../contexts/NotificationContext.js';
import { WalletProvider } from '../contexts/WalletContext.js';

export function App() {
    return (
        <BrowserRouter>
            <WalletProvider>
                <NotificationProvider>
                    <div className="app">
                        <Navigation />
                        <main className="main-content">
                            <Routes>
                                <Route path="/" element={<SignerRegistration />} />
                                <Route path="/upload" element={<DocumentUpload />} />
                                <Route path="/sign" element={<DocumentSigning />} />
                            </Routes>
                        </main>
                    </div>
                </NotificationProvider>
            </WalletProvider>
        </BrowserRouter>
    );
} 