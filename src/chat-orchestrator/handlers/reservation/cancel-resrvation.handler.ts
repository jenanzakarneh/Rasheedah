import { Injectable } from '@nestjs/common';
import e from 'express';
import { ReservationService } from 'src/reservation/reservation.service';
import { BaseIntentHandler } from '../base-intent-handler';

@Injectable()
export class CancelReservationHandler extends BaseIntentHandler {
  static readonly intent = 'cancel_reservation';

  constructor(private readonly reservationService: ReservationService) {
    super();
  }

  async execute(p: any): Promise<string> {
    if (!p.reservationId) {
      return ' A reservation ID is required to cancel.';
    }

    const result = await this.reservationService.cancelReservation(
      p.reservationId,
    );

    if (typeof result === 'string') return result;

    return `🗑️ Your reservation has been canceled.`;
  }
}
