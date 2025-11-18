import { CreateReservationHandler } from './reservation/create-reservation.handler';
import { ModifyReservationHandler } from './reservation/modify-resrvation.handler';
import { CheckAvailabilityHandler } from './reservation/check-availablity.handler';
import { CancelReservationHandler } from './reservation/cancel-resrvation.handler';
import { CheckReservationHandler } from './reservation/check-resrvation.handler';

export const HANDLER_LIST = 'HANDLER_LIST';

export const HANDLERS = [
  CreateReservationHandler,
  ModifyReservationHandler,
  CheckAvailabilityHandler,
  CheckReservationHandler,
  CancelReservationHandler,
];

export const SUPPORTED_INTENTS = HANDLERS.map(
  (handlerClass) => handlerClass.intent,
);
