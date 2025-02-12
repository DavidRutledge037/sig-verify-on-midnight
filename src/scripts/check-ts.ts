import { exec } from 'child_process';

function checkTypeScript() {
    exec('tsc --noEmit', (error, stdout, stderr) => {
        if (error) {
            console.error('TypeScript Errors Found:');
            console.error(stdout);
            return;
        }
        
        if (stderr) {
            console.error('Error:', stderr);
            return;
        }
        
        console.log('TypeScript check passed! ✅');
    });
}

checkTypeScript(); 