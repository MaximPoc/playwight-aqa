/**
 * Generates a unique email with the required aqa- prefix.
 * @param {string} [suffix]
 */
export function generateAqaEmail(suffix = Date.now().toString()) {
  return `aqa-${suffix}@test.com`;
}
