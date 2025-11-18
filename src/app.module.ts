import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ConfigModule } from '@nestjs/config';
import { OpenaiModule } from './openai/openai.module';
import { ReservationModule } from './reservation/reservation.module';
import { ChatOrchestratorModule } from './chat-orchestrator/chat-orchestrator.module';

@Module({
  imports: [
    WhatsappModule,
    ConfigModule.forRoot(),
    OpenaiModule,
    ReservationModule,
    ChatOrchestratorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
