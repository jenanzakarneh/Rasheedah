import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startSmartTerminalTest } from './terminal/smart/terminal-smart';
import { startBasicTerminalTest } from './terminal/basic/terminal-basic';

async function bootstrap() {
  const hasWhatsApp =
    process.env.WHATSAPP_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN &&
    process.env.WHATSAPP_CLOUD_API_TEMPORARY_ACCESS_TOKEN &&
    process.env.WHATSAPP_CLOUD_API_VERSION &&
    process.env.WHATSAPP_PHONE_NUMBER_ID;

  const hasOpenAI = process.env.OPENAI_API_KEY;

  if (hasWhatsApp) {
    console.log('\n Rasheedah is running in Smart WhatsApp Mode \n');
    console.log('Waiting for WhatsApp messages...\n');

    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
    return;
  }

  if (hasOpenAI) {
    console.log('\n Running in Basic Terminal Mode \n');
    return startSmartTerminalTest();
  }

  console.log('\n Starting **Basic Terminal Mode** (manual options)\n');
  return startBasicTerminalTest();
}

bootstrap();
