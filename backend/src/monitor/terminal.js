import readline from 'readline';
import os from 'os';

import { env } from '../config/env.js';
import { metrics, getRequestsPerMinute } from './metrics.js';

const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

const okEmoji = '✅';
const warnEmoji = '⚠️';
const errEmoji = '❌';
const socketEmoji = '🛰️';

export const startTerminalUI = ({ server, io }) => {
  if (process.env.NODE_ENV === 'test') return; // skip in tests

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  readline.emitKeypressEvents(process.stdin, rl);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  const render = () => {
    const mem = process.memoryUsage();
    const rssMb = (mem.rss / 1024 / 1024).toFixed(1);
    const heapMb = (mem.heapUsed / 1024 / 1024).toFixed(1);
    const up = formatUptime(process.uptime());
    const rpm = getRequestsPerMinute();

    const status = metrics.totalErrors > 0 ? errEmoji : okEmoji;
    const statusText = metrics.totalErrors > 0 ? red('Degraded') : green('Healthy');

    const sockets = metrics.socketsConnected;

    const lines = [];
    lines.push(`\n${status} ${cyan('Deliwer API')} ${statusText} ${dim(`(env: ${env.NODE_ENV})`)}`);
    lines.push(` ${okEmoji} Uptime: ${up}   ${socketEmoji} Sockets: ${sockets}   🌐 Port: ${env.PORT}`);
    lines.push(
      ` ${okEmoji} RPM: ${rpm.toString().padStart(2, ' ')}   In-flight: ${metrics.inFlight}   Total: ${
        metrics.totalRequests
      }`,
    );
    lines.push(
      ` ${okEmoji} Mem RSS: ${rssMb} MB   Heap: ${heapMb} MB   CPU: ${os.loadavg()[0].toFixed(2)}`,
    );

    const statusParts = Object.entries(metrics.statusCounts)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([code, count]) => `${Number(code) < 400 ? green(code) : yellow(code)}:${count}`)
      .join('  ');
    lines.push(` ${okEmoji} Status: ${statusParts || '—'}`);

    if (metrics.lastError) {
      lines.push(` ${warnEmoji} Last error: ${metrics.lastError.message} @ ${metrics.lastError.time.toISOString()}`);
    }

    // clear and render
    process.stdout.write('\x1Bc');
    process.stdout.write(lines.join('\n') + '\n\n');
    process.stdout.write(dim(' Press q to quit, r to refresh\n'));
  };

  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  const tick = setInterval(render, 1000);
  render();

  process.stdin.on('keypress', (str, key) => {
    if (key?.name === 'q' || (key?.ctrl && key?.name === 'c')) {
      clearInterval(tick);
      rl.close();
      process.exit(0);
    }
    if (key?.name === 'r') render();
  });

  // keep references to avoid GC
  return { rl, tick, server, io };
};


