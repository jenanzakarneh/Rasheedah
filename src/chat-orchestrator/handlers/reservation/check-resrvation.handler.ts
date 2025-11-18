import { Injectable } from '@nestjs/common';
import e from 'express';
import { ReservationService } from 'src/reservation/reservation.service';
import { BaseIntentHandler } from '../base-intent-handler';

@Injectable()
export class CheckReservationHandler extends BaseIntentHandler {
  static readonly intent = 'check_reservation';

  constructor(private readonly reservationService: ReservationService) {
    super();
  }

  async execute(p: any): Promise<string> {
    if (!p.reservationId) {
      return ' A reservation ID is required to check a reservation.';
    }

    const result = await this.reservationService.getReservation(
      p.reservationId,
    );

    if (typeof result === 'string') return result;

    return (
      ` Reservation Details:\n` +
      `• Guests: ${result.partySize}\n` +
      `• Date: ${result.date}\n` +
      `• Time: ${result.timeSlot}\n` +
      `• Status: ${result.status}`
    );
  }
}
