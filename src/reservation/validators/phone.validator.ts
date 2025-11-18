export function isValidJordanianPhone(phone: string): boolean {
  if (!phone) return false;

  const regex = /^(?:\+962|962|0)7[7-9]\d{7}$/;
  return regex.test(phone);
}
