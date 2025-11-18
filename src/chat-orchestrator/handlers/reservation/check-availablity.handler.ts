import { Injectable } from '@nestjs/common';
import { ReservationService } from 'src/reservation/reservation.service';
import { BaseIntentHandler } from '../base-intent-handler';

@Injectable()
export class CheckAvailabilityHandler extends BaseIntentHandler {
  static readonly intent = 'check_availability';

  constructor(private readonly reservationService: ReservationService) {
    super();
  }

  async execute(payload: any): Promise<string> {
    const date = payload.date;
    const slots = await this.reservationService.getAvailableSlots(
      date,
    );

    if (!slots.length) {
      return ` Sorry, no available slots on ${date} at the moment.`;
    }

    return ` Available slots on ${date}:\n\n${slots.join('\n')}`;
  }
}
