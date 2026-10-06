import { spawn } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const command = process.argv[2];
if (command !== 'dev' && command !== 'start') {
  throw new Error('Usage: next-runtime.mjs <dev|start>');
}

const host = requiredEnv('APP_HOST');
const port = requiredEnv('APP_PORT');
const nextBin = fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url));
const child = spawn(process.execPath, [nextBin, command, '--hostname', host, '--port', port], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exitCode = code ?? 1;
});
