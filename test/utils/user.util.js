/**
 * Generates a unique email with the required aqa-test- prefix.
 * @param {string} [suffix]
 */
export function generateAqaEmail(suffix = Date.now().toString()) {
  return `aqa-test-${suffix}@gmail.com`;
}
