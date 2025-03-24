// This is a TypeScript compatibility file that ensures the server
// stays running when executed with tsx in the workflow

// Instead of importing, which causes a circular dependency,
// we'll use a child process to run the JS file directly
import { exec } from 'child_process';

console.log('Starting server through TypeScript bridge...');

// Execute the JavaScript file directly
const serverProcess = exec('node server/index.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

// Forward stdout and stderr to the console
serverProcess.stdout?.on('data', (data) => {
  process.stdout.write(data);
});

serverProcess.stderr?.on('data', (data) => {
  process.stderr.write(data);
});

// Keep the process alive
process.on('SIGINT', () => {
  serverProcess.kill();
  process.exit();
});