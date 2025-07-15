export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>?/gm, '');
}

export function sanitizeDisplayName(name: string): string {
  return stripHtml(name.trim()).replace(/[^a-zA-Z0-9 _.-]/g, '');
}

export function sanitizeEmail(email: string): string {
  return stripHtml(email.trim().toLowerCase());
}

export function sanitizePassword(password: string): string {
  return stripHtml(password.trim());
}
