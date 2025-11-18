import { ask } from '../shared/prompt';
import { smartCommands } from './smart-commands';

export async function runSmartLoop(rl, orchestrator) {
  const userId = 'smart-terminal-user';

  while (true) {
    const msg = await ask(rl, 'You: ');

    const cleaned = msg.trim().toLowerCase();
    if (!cleaned) continue;

    const handled = await smartCommands(rl, cleaned, orchestrator, userId);
    if (handled === 'exit') return;

    try {
      const reply = await orchestrator.handleMessage(userId, msg);
      console.log(`\nRasheedah: ${reply}\n`);
    } catch (err) {
      console.log('\n Error:', err?.message ?? 'Unknown error');
    }
  }
}
