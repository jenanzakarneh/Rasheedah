import { askValidated } from '../shared/prompt';
import { validators } from '../shared/validators';

export async function askCreatePrompts(rl) {
  return {
    name: await askValidated(rl, 'Name: ', validators.name),
    phone: await askValidated(rl, 'Phone (07XXXXXXXX): ', validators.phone),
    date: await askValidated(rl, 'Date (YYYY-MM-DD): ', validators.date),
    timeSlot: await askValidated(rl, 'Time (HH:MM): ', validators.time),
    partySize: Number(
      await askValidated(rl, 'Party size (1–12): ', validators.partySize),
    ),
  };
}

export async function askUpdatePrompts(rl) {
  return {
    date: await askValidated(
      rl,
      'New date (optional): ',
      validators.date,
      true,
    ),
    timeSlot: await askValidated(
      rl,
      'New time (optional): ',
      validators.time,
      true,
    ),
    partySize: (() => {
      return askValidated(
        rl,
        'New party size (optional): ',
        validators.partySize,
        true,
      ).then((v) => (v ? Number(v) : undefined));
    })(),
  };
}
