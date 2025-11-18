export function normalizeJordanianPhone(phone: string): string {
  phone = phone.trim();

  if (phone.startsWith('0')) {
    return '+962' + phone.slice(1);
  }
  if (phone.startsWith('962')) {
    return '+' + phone;
  }
  if (phone.startsWith('+962')) {
    return phone;
  }

  return phone;
}
