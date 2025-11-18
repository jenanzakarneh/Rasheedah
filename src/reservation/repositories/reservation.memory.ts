import { Injectable, NotFoundException } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { Reservation } from '../interfaces/reservation.interface';

@Injectable()
export class InMemoryReservationRepository implements ReservationRepository {
  private readonly reservations = new Map<string, Reservation>();

  private now(): string {
    return new Date().toISOString();
  }

  async create(reservation: Reservation): Promise<Reservation> {
    this.reservations.set(reservation.id, { ...reservation });
    return reservation;
  }

  async findById(id: string): Promise<Reservation | null> {
    const res = this.reservations.get(id);
    return res && res.status !== 'CANCELLED' ? { ...res } : null;
  }

  async update(
    id: string,
    partial: Partial<Reservation>,
  ): Promise<Reservation> {
    const existing = await this.findById(id);
    if (!existing) throw new NotFoundException(`Reservation ${id} not found`);

    const updated: Reservation = {
      ...existing,
      ...partial,
      updatedAt: this.now(),
    };

    this.reservations.set(id, updated);
    return updated;
  }

  async cancel(id: string): Promise<Reservation> {
    const existing = await this.findById(id);
    if (!existing) throw new NotFoundException(`Reservation ${id} not found`);

    const cancelled: Reservation = {
      ...existing,
      status: 'CANCELLED',
      updatedAt: this.now(),
    };

    this.reservations.set(id, cancelled);
    return cancelled;
  }
  async findActiveByPhone(phone: string): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter(
      (r) => r.phone === phone && r.status !== 'CANCELLED',
    );
  }

  async findByDateTime(date: string, timeSlot: string): Promise<Reservation[]> {
    return [...this.reservations.values()]
      .filter(
        (r) =>
          r.date === date &&
          r.timeSlot === timeSlot &&
          r.status !== 'CANCELLED',
      )
      .map((r) => ({ ...r }));
  }

  async countReservations(date: string, timeSlot: string): Promise<number> {
    const matching = await this.findByDateTime(date, timeSlot);
    return matching.length;
  }
}
