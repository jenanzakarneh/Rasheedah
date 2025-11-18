import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { InMemoryReservationRepository } from './repositories/reservation.memory';

@Module({
  providers: [
    ReservationService,
    {
      provide: 'ReservationRepository',
      useClass: InMemoryReservationRepository,
    },
  ],
  exports: [ReservationService],
})
export class ReservationModule {}
