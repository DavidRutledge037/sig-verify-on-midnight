import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

class TestRunner {
    private readonly GREEN = '\x1b[32m';
    private readonly RED = '\x1b[31m';
    private readonly RESET = '\x1b[0m';

    async run() {
        try {
            console.log('🚀 Starting test suite...\n');

            // 1. Check environment
            this.checkEnvironment();

            // 2. Install dependencies
            console.log('📦 Installing dependencies...');
            execSync('npm install', { stdio: 'inherit' });

            // 3. Build project
            console.log('\n🔨 Building project...');
            execSync('npm run build', { stdio: 'inherit' });

            // 4. Run tests
            console.log('\n🧪 Running tests...');
            execSync('npx vitest run', { stdio: 'inherit' });

            // 5. Run coverage
            console.log('\n📊 Generating coverage report...');
            execSync('npx vitest run --coverage', { stdio: 'inherit' });

            console.log(`\n${this.GREEN}✅ All tests completed successfully!${this.RESET}`);

        } catch (error) {
            console.error(`\n${this.RED}❌ Test suite failed:${this.RESET}`, error);
            process.exit(1);
        }
    }

    private checkEnvironment() {
        console.log('🔍 Checking environment...');
        
        // Check .env file
        const envPath = path.join(process.cwd(), '.env');
        if (!fs.existsSync(envPath)) {
            console.log('Creating .env file from .env.example...');
            const envExample = fs.readFileSync(
                path.join(process.cwd(), '.env.example'),
                'utf8'
            );
            fs.writeFileSync(envPath, envExample);
        }

        // Check required environment variables
        const requiredEnvVars = [
            'MONGODB_URI',
            'DATABASE_NAME',
            'MIDNIGHT_NODE_URL',
            'MIDNIGHT_CHAIN_ID'
        ];

        const missingVars = requiredEnvVars.filter(
            varName => !process.env[varName]
        );

        if (missingVars.length > 0) {
            console.log(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
            console.log('Using default test values...');
        }
    }
}

// Run tests
const runner = new TestRunner();
runner.run(); 