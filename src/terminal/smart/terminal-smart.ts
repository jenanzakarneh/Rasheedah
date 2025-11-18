import { NestFactory } from '@nestjs/core';
import * as readline from 'readline';
import { AppModule } from 'src/app.module';
import { ChatOrchestratorService } from 'src/chat-orchestrator/chat-orchestrator.service';
import { printSmartIntro } from './smart-intro';
import { runSmartLoop } from './smart-loop';

export async function startSmartTerminalTest() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const orchestrator = app.get(ChatOrchestratorService);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  printSmartIntro();
  await runSmartLoop(rl, orchestrator);

  rl.close();
  await app.close();
}
