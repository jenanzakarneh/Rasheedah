export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  timeSlot: string;
  partySize: number;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}
