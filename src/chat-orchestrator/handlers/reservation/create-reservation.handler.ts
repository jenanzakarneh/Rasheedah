import { Injectable } from '@nestjs/common';
import { ReservationService } from 'src/reservation/reservation.service';
import { BaseIntentHandler } from '../base-intent-handler';

@Injectable()
export class CreateReservationHandler extends BaseIntentHandler {
  //  static intent = 'create_reservation';
  // intent = CreateReservationHandler.intent;
  static readonly intent = 'create_reservation';

  constructor(private readonly reservationService: ReservationService) {
    super();
  }

  async execute(p: any): Promise<string> {
    const dto = {
      name: p.name,
      phone: p.phone,
      date: p.date,
      timeSlot: p.timeSlot,
      partySize: Number(p.partySize),
    };

    const result = await this.reservationService.createReservation(dto);

    if (typeof result === 'string') return result;

    return `✨ Your reservation is confirmed!\n Reservation ID: ${result.id}`;
  }
}
