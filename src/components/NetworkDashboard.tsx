import React, { useEffect, useState } from 'react';
import { ReportingService, TransactionReport, NetworkStats } from '../services/reporting';
import { StargateClient } from '@cosmjs/stargate';

interface NetworkDashboardProps {
    nodeUrl: string;
}

export function NetworkDashboard({ nodeUrl }: NetworkDashboardProps) {
    const [client, setClient] = useState<StargateClient | null>(null);
    const [reportingService, setReportingService] = useState<ReportingService | null>(null);
    const [stats, setStats] = useState<NetworkStats | null>(null);
    const [recentTxs, setRecentTxs] = useState<TransactionReport[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Initialize clients
    useEffect(() => {
        const init = async () => {
            try {
                const stargate = await StargateClient.connect(nodeUrl);
                const service = new ReportingService(stargate);
                setClient(stargate);
                setReportingService(service);

                // Start monitoring transactions immediately
                service.monitorTransactions((report) => {
                    setRecentTxs(prev => [report, ...prev].slice(0, 10));
                });
            } catch (err) {
                setError(`Failed to connect to network: ${err}`);
            }
        };
        init();

        // Cleanup
        return () => {
            if (reportingService) {
                reportingService.clearCache();
            }
        };
    }, [nodeUrl]);

    // Monitor network stats
    useEffect(() => {
        if (!reportingService) return;

        const updateStats = async () => {
            try {
                const currentHeight = await client?.getHeight();
                if (!currentHeight) return;

                const fromBlock = Math.max(1, currentHeight - 100); // Last 100 blocks
                const stats = await reportingService.getNetworkStats(fromBlock, currentHeight);
                setStats(stats);
            } catch (err) {
                setError(`Failed to fetch network stats: ${err}`);
            }
        };

        const interval = setInterval(updateStats, 10000); // Update every 10 seconds
        updateStats(); // Initial update

        return () => clearInterval(interval);
    }, [reportingService, client]);

    if (error) {
        return (
            <div className="bg-red-100 p-4 rounded-lg">
                <p className="text-red-700">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">
            {/* Network Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Total Transactions</h3>
                    <p className="text-2xl">{stats?.totalTransactions ?? 'Loading...'}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Average Gas Used</h3>
                    <p className="text-2xl">
                        {stats?.averageGasUsed 
                            ? Math.round(stats.averageGasUsed).toLocaleString() 
                            : 'Loading...'}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Average Block Time</h3>
                    <p className="text-2xl">
                        {stats?.averageBlockTime 
                            ? `${(stats.averageBlockTime / 1000).toFixed(2)}s` 
                            : 'Loading...'}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Success Rate</h3>
                    <p className="text-2xl">
                        {stats?.successRate 
                            ? `${(stats.successRate * 100).toFixed(1)}%` 
                            : 'Loading...'}
                    </p>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2">Hash</th>
                                <th className="text-left p-2">Block</th>
                                <th className="text-left p-2">Time</th>
                                <th className="text-left p-2">Gas Used</th>
                                <th className="text-left p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTxs.map(tx => (
                                <tr key={tx.hash} className="border-b hover:bg-gray-50">
                                    <td className="p-2 font-mono text-sm">
                                        {tx.hash.substring(0, 10)}...
                                    </td>
                                    <td className="p-2">{tx.blockHeight}</td>
                                    <td className="p-2">
                                        {tx.timestamp.toLocaleTimeString()}
                                    </td>
                                    <td className="p-2">{tx.gasUsed.toLocaleString()}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 rounded text-sm ${
                                            tx.success 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {tx.success ? 'Success' : 'Failed'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentTxs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">
                                        No recent transactions
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 