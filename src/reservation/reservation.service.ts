import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import * as reservationRepository from './repositories/reservation.repository';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './interfaces/reservation.interface';
import { v4 as uuid } from 'uuid';
import { isValidJordanianPhone } from './validators/phone.validator';
import { normalizeJordanianPhone } from './validators/phone.normalizer';

@Injectable()
export class ReservationService {
  private static readonly MAX_PER_SLOT = 5;

  constructor(
    @Inject('ReservationRepository')
    private readonly repo: reservationRepository.ReservationRepository,
  ) {}

  private ensureFutureDate(date: string, timeSlot: string): void {
    const combined = new Date(`${date}T${timeSlot}:00`);

    if (isNaN(combined.getTime())) {
      throw new BadRequestException(
        `Invalid date or time format: ${date} ${timeSlot}`,
      );
    }

    const now = new Date();

    if (combined.getTime() < now.getTime()) {
      throw new ConflictException(
        `The selected time (${date} at ${timeSlot}) is in the past.`,
      );
    }
  }

  private async ensureSlotAvailable(
    date: string,
    timeSlot: string,
  ): Promise<void> {
    const count = await this.repo.countReservations(date, timeSlot);

    if (count >= ReservationService.MAX_PER_SLOT) {
      throw new ConflictException(
        `The time slot ${timeSlot} on ${date} is fully booked.`,
      );
    }
  }

  private async ensureExists(id: string): Promise<Reservation> {
    const reservation = await this.repo.findById(id);
    if (!reservation)
      throw new NotFoundException(`Reservation ${id} not found.`);
    return reservation;
  }

  private async ensureNotDoubleBooked(
    phone: string,
    date: string,
    timeSlot: string,
  ) {
    const activeReservations = await this.repo.findActiveByPhone(phone);

    const conflict = activeReservations.find(
      (r) => r.date === date && r.timeSlot === timeSlot,
    );

    if (conflict) {
      throw new ConflictException(
        `You already have a reservation on ${date} at ${timeSlot}. ` +
          `Would you like to modify it instead? (Reservation ID: ${conflict.id})`,
      );
    }
  }

  private now(): string {
    return new Date().toISOString();
  }

  async createReservation(dto: CreateReservationDto): Promise<Reservation> {
    if (!isValidJordanianPhone(dto.phone)) {
      throw new BadRequestException(
        'Invalid phone number. Please provide a valid Jordanian mobile number.',
      );
    }

    if (new Date(dto.date) < new Date()) {
      throw new BadRequestException(
        'Reservations cannot be created for past dates.',
      );
    }

    const activeReservations = await this.repo.findActiveByPhone(dto.phone);
    const conflict = activeReservations.find(
      (r) => r.date === dto.date && r.timeSlot === dto.timeSlot,
    );

    if (conflict) {
      throw new ConflictException(
        `You already have a reservation on ${dto.date} at ${dto.timeSlot}. Reservation ID: ${conflict.id}`,
      );
    }

    await this.ensureSlotAvailable(dto.date, dto.timeSlot);

    const timestamp = this.now();
    const reservation: Reservation = {
      id: uuid(),
      ...dto,
      status: 'CONFIRMED',
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    dto.phone = normalizeJordanianPhone(dto.phone);
    return this.repo.create(reservation);
  }

  async getReservation(id: string): Promise<Reservation> {
    return this.ensureExists(id);
  }

  async updateReservation(
    id: string,
    dto: UpdateReservationDto,
  ): Promise<Reservation> {
    const existing = await this.ensureExists(id);

    const newDate = dto.date ?? existing.date;
    const newSlot = dto.timeSlot ?? existing.timeSlot;

    this.ensureFutureDate(newDate, newSlot);

    const slotChanged =
      newDate !== existing.date || newSlot !== existing.timeSlot;

    if (slotChanged) {
      await this.ensureSlotAvailable(newDate, newSlot);
    }

    const safeUpdate: Partial<Reservation> = {
      date: newDate,
      timeSlot: newSlot,
      partySize: dto.partySize ?? existing.partySize,
      updatedAt: this.now(),
    };

    return this.repo.update(id, safeUpdate);
  }

  async cancelReservation(id: string): Promise<Reservation> {
    await this.ensureExists(id);
    return this.repo.cancel(id);
  }
  async getAvailableSlots(date: string): Promise<string[]> {
    const allSlots = [
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
      '23:00',
    ];

    const available: string[] = [];

    for (const slot of allSlots) {
      const count = await this.repo.countReservations(date, slot);

      if (count < ReservationService.MAX_PER_SLOT) {
        available.push(slot);
      }
    }

    return available;
  }
}
