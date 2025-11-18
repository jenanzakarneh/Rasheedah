import { askValidated } from '../shared/prompt';
import { validators } from '../shared/validators';
import { askCreatePrompts, askUpdatePrompts } from './basic-prompts';

export async function handleBasicAction(rl, option, reservationService) {
  switch (option) {
    case '1':
      return await createReservationFlow(rl, reservationService);
    case '2':
      return await checkReservationFlow(rl, reservationService);
    case '3':
      return await updateReservationFlow(rl, reservationService);
    case '4':
      return await cancelReservationFlow(rl, reservationService);
    case '5':
      console.log('\n Exiting. Goodbye!\n');
      return false;

    default:
      console.log(' Invalid option. Try again.');
      return true;
  }
}

// Create Reservation
async function createReservationFlow(rl, reservationService) {
  console.log('\n Creating reservation...');

  const dto = await askCreatePrompts(rl);
  const result = await safeCall(() =>
    reservationService.createReservation(dto),
  );

  if (typeof result === 'string') console.log(result);
  else console.log(` Reservation created with ID: ${result.id}`);

  return true;
}

// Check Reservation
async function checkReservationFlow(rl, reservationService) {
  const id = await askValidated(rl, 'Enter ID: ', validators.id);

  const result = await safeCall(() => reservationService.getReservation(id));

  if (typeof result === 'string') console.log(result);
  else
    console.log(
      ` Found reservation: ${result.name}, ${result.date} at ${result.timeSlot}, party ${result.partySize}`,
    );

  return true;
}

// Update Reservation

async function updateReservationFlow(rl, reservationService) {
  const id = await askValidated(rl, 'Enter ID: ', validators.id);
  const dto = await askUpdatePrompts(rl);

  const result = await safeCall(() =>
    reservationService.updateReservation(id, dto),
  );

  console.log(typeof result === 'string' ? result : ' Updated successfully');
  return true;
}

// Cancel Reservation

async function cancelReservationFlow(rl, reservationService) {
  const id = await askValidated(rl, 'Enter ID: ', validators.id);

  const result = await safeCall(() => reservationService.cancelReservation(id));

  console.log(typeof result === 'string' ? result : ' Cancelled successfully');
  return true;
}

// Error Handling Wrapper
async function safeCall(fn) {
  try {
    return await fn();
  } catch (err) {
    return err?.response?.message ?? ' Unknown error occurred.';
  }
}
