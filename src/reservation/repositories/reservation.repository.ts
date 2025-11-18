import { Reservation } from '../interfaces/reservation.interface';

export interface ReservationRepository {
  create(reservation: Reservation): Promise<Reservation>;
  findById(id: string): Promise<Reservation | null>;
  update(id: string, partial: Partial<Reservation>): Promise<Reservation>;
  cancel(id: string): Promise<Reservation>;
  findByDateTime(date: string, timeSlot: string): Promise<Reservation[]>;
  countReservations(date: string, timeSlot: string): Promise<number>;
  findActiveByPhone(phone: string): Promise<Reservation[]>;
}
