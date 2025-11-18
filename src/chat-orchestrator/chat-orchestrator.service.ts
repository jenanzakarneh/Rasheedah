import { Inject, Injectable, Logger } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { BaseIntentHandler } from './handlers/base-intent-handler';
import { HANDLER_LIST } from './handlers';

@Injectable()
export class ChatOrchestratorService {
  private readonly logger = new Logger(ChatOrchestratorService.name);
  private handlerMap = new Map<string, BaseIntentHandler>();

  constructor(
    private readonly openai: OpenaiService,

    @Inject(HANDLER_LIST)
    private readonly handlers: BaseIntentHandler[],
  ) {
    handlers.forEach((handler) => {
      this.handlerMap.set(handler.intent, handler);
      this.logger.log(`Registered handler for intent: ${handler.intent}`);
    });
  }

  async handleMessage(userId: string, userInput: string): Promise<string> {
    const { reply, routingPayload } = await this.openai.generateResponse(
      userId,
      userInput,
    );

    if (!routingPayload) return reply;

    const handler = this.handlerMap.get(routingPayload.intent);
    if (!handler) {
      return `Sorry, I don’t know how to handle the intent "${routingPayload.intent}".`;
    }

    try {
      // Try calling reservation service (create/modify/cancel/check)
      return await handler.execute(routingPayload);
    } catch (err) {
      const errorMsg = err?.response?.message || err.message || 'Unknown error';

      await this.openai.injectSystemFeedback(
        userId,
        `The backend rejected your last values with this message: "${errorMsg}". 
      Please ask the user to correct the invalid field ONLY.`,
      );

      return `Oops! Something needs fixing: ${errorMsg}`;
    }
  }
}
