import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ChatOrchestratorService } from 'src/chat-orchestrator/chat-orchestrator.service';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  private readonly apiVersion = process.env.WHATSAPP_CLOUD_API_VERSION;
  private readonly phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  private readonly accessToken =
    process.env.WHATSAPP_CLOUD_API_TEMPORARY_ACCESS_TOKEN;

  constructor(
    private readonly http: HttpService,
    private readonly orchestrator: ChatOrchestratorService,
  ) {}

  async handleIncomingMessage(payload: any) {
    const value = payload?.entry?.[0]?.changes?.[0]?.value;

    //  Ignore ALL events that are not real user messages
    if (!value?.messages || !Array.isArray(value.messages)) {
      this.logger.debug('Ignoring non-message webhook event.');
      return { status: 'ignored' };
    }

    const message = value.messages[0];

    if (message.type !== 'text') {
      await this.sendTextMessage(
        message.from,
        'Sorry, I can only read text messages for now ❤️',
      );
      return { status: 'unsupported' };
    }

    const userId = message.from;
    const text = message.text.body;

    const reply = await this.orchestrator.handleMessage(userId, text);

    await this.sendTextMessage(userId, reply);

    return { status: 'success' };
  }

  async sendTextMessage(to: string, body: string) {
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;

    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: {
        preview_url: false,
        body,
      },
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    };

    try {
      const result = await lastValueFrom(
        this.http.post(url, data, config).pipe(
          map((res) => res.data),
          catchError((err) => {
            const apiError = err?.response?.data || err;
            this.logger.error('WhatsApp API error:', apiError);
            throw new BadRequestException('Failed to send WhatsApp message');
          }),
        ),
      );

      return result;
    } catch (err) {
      this.logger.error('Fatal send error:', err);
      throw err;
    }
  }
}
