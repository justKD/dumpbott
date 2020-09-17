/**
 * @file Numbers.ts
 * @author justKD
 * @copyright justKD 2020-present
 * @license MIT https://notnatural.co/license/mit/
 * @fileoverview `export const Numbers`
 */

/**
 * Functions for mutating a number with scale/clip/round/fix.
 */
export const Numbers = {
  /**
   * Fix the floating point error found in JS math.
   * @param {number} value - The value or arithmetic expression.
   * @param {number} [repeat=6] - The number of 0's or 9's to allow to repeat.
   * @returns {number} The corrected value.
   * @example
   * ```
   * let wrong = 0.2 + 0.1 // 0.30000000000000004
   * let correct = Numbers.fix(0.2 + 0.1) // 0.3
   *
   * let wrongAgain = 0.3 - 0.1 // 0.19999999999999998
   * let notWrong = Numbers.fix(0.3 - 0.1) // 0.2
   * ```
   */
  fix: (value: number, repeat: number = 6): number => {
    if (!value || Number.isNaN(parseFloat(`${value}`))) return value;
    const [intPart, decimalPart] = `${value}`.split(".");
    if (!decimalPart) return value;
    const regex = new RegExp(`(9{${repeat},}|0{${repeat},})(\\d)*$`, "gm");
    const matched = decimalPart.match(regex);
    if (!matched) return value;
    const [wrongPart] = matched;
    const correctDecimalsLength = decimalPart.length - wrongPart.length;
    const fixed = parseFloat(`${intPart}.${decimalPart}`);
    return parseFloat(fixed.toFixed(correctDecimalsLength));
  },

  /**
   * Limit a value to a hard minimum and maximum.
   * @param {number} value - The original value.
   * @param {[number, number]} range - The `[min, max]` allowed values.
   * @returns {number} The clipped result.
   * @example
   * ```
   * const n = 3.75
   * let clipped = Numbers.clip(n, [0, 3]) // clipped == 3.0
   * ```
   */
  clip: (value: number, range: [number, number]): number => {
    return Numbers.fix(Math.min(Math.max(range[0], value), range[1]));
  },
  /**
   * Scale the value from one range to another.
   * @param {number} value - The original value.
   * @param {[number, number]} initialRange - Initial number range scale.
   * @param {[number, number]} targetRange - Target number range scale.
   * @returns {number} The scaled result.
   * @example
   * ```
   * const n = 3.75
   * let scaled = Numbers.scale(n, [0, 10], [0, 1]) // scaled == 0.375
   * ```
   */
  scale: (
    value: number,
    initialRange: [number, number],
    targetRange: [number, number],
  ): number => {
    const fix = Numbers.fix;
    const r1 = initialRange;
    const r2 = targetRange;
    const r1Size = r1[1] - r1[0];
    const r2Size = r2[1] - r2[0];
    const x = fix(value - r1[0]);
    const y = fix(x * r2Size);
    const z = fix(y / r1Size);
    const scaled = fix(z + r2[0]);
    return scaled;
  },

  /**
   * Round a value to a specific number of places. Digits < 5 are rounded down.
   * @param {number} value - The original value.
   * @param {number} [places=0] - The desired number of decimal places.
   * `0` rounds to a whole number.
   * @returns {number} The rounded result.
   * @example
   * ```
   * const n = 3.75
   * let rounded = Numbers.round(n, 1) // rounded == 3.8
   * ```
   */
  round: (value: number, places: number = 0): number => {
    return Numbers.fix(
      Number(Math.round(Number(value + "e" + places)) + "e-" + places),
    );
  },
};
