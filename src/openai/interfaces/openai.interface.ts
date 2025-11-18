export type UserIntent =
  | 'create_reservation'
  | 'modify_reservation'
  | 'cancel_reservation'
  | 'check_reservation'
  | 'greeting'
  | 'fallback';

export interface IntentOutput {
  intent: UserIntent;
  confidence: number;
  entities: {
    name?: string;
    phone?: string;
    date?: string;
    timeSlot?: string;
    partySize?: number;
    reservationId?: string;
  };
  explanation?: string;
}
