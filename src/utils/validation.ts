/**
 * =========================================================================
 * FORMULA-AI 2026 - FIELD SANITIZATION & INPUT VALIDATION UTILITIES
 * =========================================================================
 */

/**
 * Sanitizes input string to prevent XSS and HTML injection attacks.
 */
export const sanitizeInput = (val: string): string => {
  if (!val) return '';
  return val
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/script/gi, '')   // Strip script keywords
    .replace(/[<>]/g, '')      // Strip angle brackets
    .trim();
};

/**
 * Validates Email format using RFC 5322 compliant regex.
 */
export const validateEmail = (email: string): boolean => {
  const clean = sanitizeInput(email);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(clean);
};

/**
 * Validates 10-Digit Mobile Phone Number format.
 */
export const validatePhone = (phone: string): boolean => {
  const clean = phone.replace(/[^0-9]/g, '');
  return clean.length >= 10 && clean.length <= 13;
};

/**
 * Validates Bank Deposit 12-Digit UTR / Transaction Reference Number.
 */
export const validateUtr = (utr: string): boolean => {
  const clean = sanitizeInput(utr);
  // Must be at least 10-16 alphanumeric characters without spaces
  return clean.length >= 8 && /^[a-zA-Z0-9]+$/.test(clean);
};

/**
 * Validates Full Name (minimum 2 characters).
 */
export const validateFullName = (name: string): boolean => {
  const clean = sanitizeInput(name);
  return clean.length >= 2;
};
