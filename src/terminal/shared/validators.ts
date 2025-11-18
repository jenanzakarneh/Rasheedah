export const validators = {
  name(value: string) {
    return value.includes(' ') ? null : 'Please enter first + last name.';
  },

  phone(value: string) {
    return /^07\d{8}$/.test(value)
      ? null
      : 'Phone must start with 07 and be 10 digits.';
  },

  date(value: string) {
    const parsed = Date.parse(value);
    if (isNaN(parsed)) return 'Invalid date.';
    if (new Date(value) < new Date(new Date().toDateString()))
      return 'Date cannot be in the past.';
    return null;
  },

  time(value: string) {
    if (!/^\d{2}:\d{2}$/.test(value)) return 'Invalid HH:MM format.';
    const [h] = value.split(':').map(Number);
    if (h < 11 || h > 23) return 'Time must be between 11:00–23:00.';
    return null;
  },

  partySize(value: string) {
    const n = Number(value);
    return n >= 1 && n <= 12 ? null : 'Party size must be between 1 and 12.';
  },

  id(value: string) {
    return value ? null : 'Reservation ID required.';
  },
};
