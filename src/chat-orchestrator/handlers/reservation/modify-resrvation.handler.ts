import { Injectable } from '@nestjs/common';
import { ReservationService } from 'src/reservation/reservation.service';
import { BaseIntentHandler } from '../base-intent-handler';
@Injectable()
export class ModifyReservationHandler extends BaseIntentHandler {
  static readonly intent = 'modify_reservation';

  constructor(private readonly reservationService: ReservationService) {
    super();
  }

  async execute(p: any): Promise<string> {
    if (!p.reservationId) {
      return ' A reservation ID is required to modify it.';
    }

    const dto = {
      date: p.date, 
      timeSlot: p.timeSlot,
      partySize: p.partySize ? Number(p.partySize) : undefined,
    };

    const result = await this.reservationService.updateReservation(
      p.reservationId,
      dto,
    );

    if (typeof result === 'string') return result;

    return `🔄 Your reservation has been updated successfully.`;
  }
}
