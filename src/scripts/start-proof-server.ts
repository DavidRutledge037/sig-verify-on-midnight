import { ProofService } from "../services/proof";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PROOF_SERVER_PORT || 3000;

// Add middleware
app.use(cors());
app.use(express.json());

async function startProofServer() {
    try {
        // Initialize proof service
        const proofService = new ProofService(
            process.env.MIDNIGHT_NODE_URL || "http://65.108.44.149:26657",
            process.env.MIDNIGHT_CHAIN_ID || "midnight-testnet-1"
        );

        // Connect to Midnight network
        await proofService.connect();
        console.log("Connected to Midnight network");

        // Endpoints
        app.post("/verify-did", async (req, res) => {
            try {
                const { did } = req.body;
                const proof = await proofService.getDIDProof(did);
                res.json({ proof });
            } catch (err) {
                const error = err as Error;
                res.status(500).json({ error: error?.message || 'Unknown error occurred' });
            }
        });

        app.post("/verify-hash", async (req, res) => {
            try {
                const { hash } = req.body;
                const proof = await proofService.getHashProof(hash);
                res.json({ proof });
            } catch (err) {
                const error = err as Error;
                res.status(500).json({ error: error?.message || 'Unknown error occurred' });
            }
        });

        // Health check endpoint
        app.get("/health", (_, res) => {
            res.json({ status: "ok", timestamp: new Date().toISOString() });
        });

        // Start server
        app.listen(port, () => {
            console.log(`Proof server running at http://localhost:${port}`);
            console.log(`Health check: http://localhost:${port}/health`);
        });

    } catch (err) {
        const error = err as Error;
        console.error("Failed to start proof server:", error?.message || 'Unknown error');
        process.exit(1);
    }
}

startProofServer(); 