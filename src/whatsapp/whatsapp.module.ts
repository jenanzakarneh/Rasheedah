import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ChatOrchestratorModule } from '../chat-orchestrator/chat-orchestrator.module';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';

@Module({
  imports: [HttpModule, ChatOrchestratorModule],
  controllers: [WhatsappController],
  providers: [WhatsappService],
})
export class WhatsappModule {}
