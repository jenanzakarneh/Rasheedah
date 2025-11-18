import { Module } from '@nestjs/common';
import { ChatOrchestratorService } from './chat-orchestrator.service';
import { HANDLER_LIST, HANDLERS } from './handlers';
import { OpenaiModule } from '../openai/openai.module';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports: [OpenaiModule, ReservationModule],
  providers: [
    ChatOrchestratorService,
    ...HANDLERS,
    {
      provide: HANDLER_LIST,
      useFactory: (...handlers: any[]) => handlers,
      inject: HANDLERS,
    },
  ],
  exports: [ChatOrchestratorService],
})
export class ChatOrchestratorModule {}
