import { NestFactory } from '@nestjs/core';
import * as readline from 'readline';

import { AppModule } from '../../app.module';
import { showBasicMenu } from './basic-menu';
import { handleBasicAction } from './basic-actions';
import { ask } from '../shared/prompt';
import { printIntro } from '../shared/prints';
import { ReservationService } from 'src/reservation/reservation.service';

export async function startBasicTerminalTest() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const reservationService = app.get(ReservationService);

  printIntro('Basic Mode');
  let running = true;

  while (running) {
    showBasicMenu();
    const option = await ask(rl, 'Select option: ');

    running = await handleBasicAction(rl, option.trim(), reservationService);
  }

  rl.close();
  await app.close();
}
