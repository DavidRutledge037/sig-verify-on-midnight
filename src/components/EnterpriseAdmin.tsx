import React, { useState } from 'react';
import { DIDDocument } from '../types/did';
import { LoadingSpinner } from './LoadingSpinner';
import { BatchProcessor, BatchOperation, BatchJob } from '../services/BatchProcessor';
import { NavigationService, NavigationError } from '../services/NavigationService';

interface VerificationRequest {
    id: string;
    did: string;
    timestamp: Date;
    status: 'pending' | 'approved' | 'rejected';
    type: 'individual' | 'organization';
    documentHash?: string;
}

interface EnterpriseStats {
    totalDIDs: number;
    activeVerifications: number;
    completedVerifications: number;
    failedVerifications: number;
}

type AdminView = 
    | 'dashboard' 
    | 'verifications' 
    | 'bulk-operations'
    | 'reports'
    | 'settings';

interface BulkOperation {
    id: string;
    type: 'verify' | 'revoke' | 'update';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    totalItems: number;
    processedItems: number;
    timestamp: Date;
}

export const EnterpriseAdmin: React.FC = () => {
    const [activeView, setActiveView] = useState<AdminView>('dashboard');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDIDs, setSelectedDIDs] = useState<string[]>([]);
    const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>([
        {
            id: '1',
            type: 'verify',
            status: 'completed',
            totalItems: 100,
            processedItems: 100,
            timestamp: new Date()
        },
        {
            id: '2',
            type: 'update',
            status: 'processing',
            totalItems: 50,
            processedItems: 25,
            timestamp: new Date()
        }
    ]);
    const [batchProcessor] = useState(() => new BatchProcessor());
    const [activeJobs, setActiveJobs] = useState<BatchJob[]>([]);
    const [navigationService] = useState(() => new NavigationService());
    const [navigationError, setNavigationError] = useState<NavigationError | null>(null);

    // Mock data
    const stats: EnterpriseStats = {
        totalDIDs: 156,
        activeVerifications: 23,
        completedVerifications: 432,
        failedVerifications: 12
    };

    const verificationRequests: VerificationRequest[] = [
        {
            id: '1',
            did: 'did:midnight:abc123',
            timestamp: new Date(),
            status: 'pending',
            type: 'individual'
        },
        // ... more mock data
    ];

    const handleVerification = async (requestId: string, action: 'approve' | 'reject') => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update verification status logic would go here
            console.log(`${action} verification ${requestId}`);
            
        } catch (err) {
            setError(`Failed to ${action} verification`);
        } finally {
            setIsLoading(false);
        }
    };

    const startBatchOperation = async (operation: BatchOperation) => {
        if (selectedDIDs.length === 0) return;

        try {
            setIsLoading(true);
            setError(null);

            const jobId = await batchProcessor.processBatch(
                operation,
                selectedDIDs,
                (progress) => {
                    // Update job progress in UI
                    setActiveJobs(prev => prev.map(job => 
                        job.id === jobId 
                            ? { ...job, progress }
                            : job
                    ));
                },
                (results) => {
                    // Handle completion
                    console.log(`Batch operation ${operation} completed:`, results);
                    setActiveJobs(prev => prev.map(job => 
                        job.id === jobId 
                            ? { ...job, status: 'completed' }
                            : job
                    ));
                },
                (error) => {
                    setError(`Batch operation failed: ${error}`);
                    setActiveJobs(prev => prev.map(job => 
                        job.id === jobId 
                            ? { ...job, status: 'failed', error }
                            : job
                    ));
                }
            );

            // Add new job to active jobs
            setActiveJobs(prev => [...prev, {
                id: jobId,
                operation,
                items: selectedDIDs,
                status: 'processing',
                progress: 0,
                results: new Map()
            }]);

        } catch (err) {
            setError('Failed to start batch operation');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigation = async (route: string) => {
        setError(null);
        setNavigationError(null);

        const success = await navigationService.navigateWithRetry(
            route,
            {
                isAuthenticated: true, // Replace with actual auth state
                userRoles: ['admin'] // Replace with actual user roles
            },
            (error: NavigationError) => {
                setNavigationError(error);
                if (!error.retryable) {
                    setError(error.message);
                }
            }
        );

        if (success) {
            setActiveView(route as AdminView);
        }
    };

    const renderDashboard = () => (
        <div className="enterprise-dashboard">
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total DIDs</h3>
                    <span className="stat-value">{stats.totalDIDs}</span>
                </div>
                <div className="stat-card">
                    <h3>Active Verifications</h3>
                    <span className="stat-value">{stats.activeVerifications}</span>
                </div>
                <div className="stat-card">
                    <h3>Completed</h3>
                    <span className="stat-value">{stats.completedVerifications}</span>
                </div>
                <div className="stat-card">
                    <h3>Failed</h3>
                    <span className="stat-value">{stats.failedVerifications}</span>
                </div>
            </div>

            <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                    {verificationRequests.map(request => (
                        <div key={request.id} className="activity-item">
                            <div className="activity-info">
                                <span className="activity-did">{request.did}</span>
                                <span className={`status-badge ${request.status}`}>
                                    {request.status}
                                </span>
                            </div>
                            <div className="activity-actions">
                                <button
                                    onClick={() => handleVerification(request.id, 'approve')}
                                    disabled={isLoading || request.status !== 'pending'}
                                    className="approve-button"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleVerification(request.id, 'reject')}
                                    disabled={isLoading || request.status !== 'pending'}
                                    className="reject-button"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderNavigation = () => {
        const availableRoutes = navigationService.getAvailableRoutes(['admin']);
        
        return (
            <nav className="admin-nav">
                <div className="nav-group primary">
                    {availableRoutes.map(route => (
                        <button
                            key={route.id}
                            onClick={() => handleNavigation(route.id)}
                            className={`nav-button ${activeView === route.id ? 'active' : ''}`}
                            disabled={isLoading}
                        >
                            <span className="nav-icon">{route.icon}</span>
                            {route.title}
                        </button>
                    ))}
                </div>
            </nav>
        );
    };

    const renderBulkOperations = () => (
        <div className="bulk-operations">
            <div className="bulk-actions">
                <h3>Bulk Actions</h3>
                <div className="action-buttons">
                    <button 
                        className="bulk-action-button"
                        disabled={selectedDIDs.length === 0 || isLoading}
                        onClick={() => startBatchOperation('verify')}
                    >
                        Verify Selected ({selectedDIDs.length})
                    </button>
                    <button 
                        className="bulk-action-button"
                        disabled={selectedDIDs.length === 0 || isLoading}
                        onClick={() => startBatchOperation('revoke')}
                    >
                        Revoke Selected ({selectedDIDs.length})
                    </button>
                    <button 
                        className="bulk-action-button"
                        disabled={selectedDIDs.length === 0 || isLoading}
                        onClick={() => startBatchOperation('update')}
                    >
                        Update Selected ({selectedDIDs.length})
                    </button>
                </div>
            </div>

            <div className="active-jobs">
                <h3>Active Jobs</h3>
                {activeJobs.map(job => (
                    <div key={job.id} className="job-item">
                        <div className="job-info">
                            <span className="job-type">{job.operation}</span>
                            <span className={`status-badge ${job.status}`}>
                                {job.status}
                            </span>
                        </div>
                        <div className="job-progress">
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill"
                                    style={{ width: `${job.progress}%` }}
                                />
                            </div>
                            <span className="progress-text">
                                {Math.round(job.progress)}%
                            </span>
                        </div>
                        {job.error && (
                            <div className="job-error">{job.error}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="enterprise-admin">
            <header className="admin-header">
                <h2>Enterprise Administration</h2>
                {renderNavigation()}
                {navigationError && navigationError.retryable && (
                    <div className="navigation-error">
                        <span>{navigationError.message}</span>
                        <button 
                            onClick={() => handleNavigation(activeView)}
                            className="retry-button"
                        >
                            Retry
                        </button>
                    </div>
                )}
            </header>

            {error && <div className="error-message">{error}</div>}

            <main className="admin-content">
                {isLoading ? (
                    <div className="loading-container">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        {activeView === 'dashboard' && renderDashboard()}
                        {activeView === 'bulk-operations' && renderBulkOperations()}
                        {/* Add other view renders here */}
                    </>
                )}
            </main>
        </div>
    );
}; 