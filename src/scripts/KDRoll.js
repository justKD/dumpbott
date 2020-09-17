/**
 * @file KDRoll.esm.js
 * @version 1.3.1
 * @author justKD
 * @copyright justKD 2020
 * @license MIT https://notnatural.co/license/mit/
 * @fileoverview `KDRoll` is a class representing a random number manager.
 * Includes Mersenne Twister uniform distribution, Box Mueller gaussian
 * distribution, n-sided die rolling, history of variable max size, elementary
 * statistics, and scale/clip/round convenience functions.
 *
 * This build is an esm module.
 */

const KDRollDeps = {
  KDNumber: class {
    constructor(value, range = [0, 1]) {
      this.value =
        typeof value === "number"
          ? value
          : !Number.isNaN(parseFloat(`${value}`))
          ? parseFloat(`${value}`)
          : value.value;
      this.range = range;
      this.scale = (min = 0, max = 1) => {
        this.value = KDRollDeps.KDNumber.scale(this.value, this.range, [
          min,
          max
        ]);
        this.range = [min, max];
        return this;
      };
      this.clip = (min, max) => {
        this.value = KDRollDeps.KDNumber.clip(this.value, [min, max]);
        return this;
      };
      this.round = (places = 0) => {
        this.value = KDRollDeps.KDNumber.round(this.value, places);
        return this;
      };
    }
    static scale(value, initialRange, targetRange) {
      const fix = KDRollDeps.KDNumber.floatingPointFix;
      const r1 = initialRange;
      const r2 = targetRange;
      const r1Size = r1[1] - r1[0];
      const r2Size = r2[1] - r2[0];
      const x = fix(value - r1[0]);
      const y = fix(x * r2Size);
      const z = fix(y / r1Size);
      const scaled = fix(z + r2[0]);
      return scaled;
    }
    static clip(value, range) {
      return KDRollDeps.KDNumber.floatingPointFix(
        Math.min(Math.max(range[0], value), range[1])
      );
    }
    static round(value, places = 0) {
      return KDRollDeps.KDNumber.floatingPointFix(
        Number(Math.round(Number(value + "e" + places)) + "e-" + places)
      );
    }
    static floatingPointFix(value, repeat = 6) {
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
    }
  },

  KDHistory: class extends Array {
    constructor() {
      super();
      let max = 1000;
      this.max = size => {
        const s = size;
        if (Number.isSafeInteger(s)) max = s;
        return max;
      };
      this.push = (...items) => {
        let count = items.length;
        while (count--) if (this.length >= max) this.shift();
        super.push(items);
        return this.length;
      };
    }
  },

  KDUniform: class {
    constructor(seed) {
      const N = 624;
      let mt = new Array(N);
      let mti = null;
      const _state = {
        seed: seed
      };
      const _private = {
        seed: {
          withInt: seed => {
            let s;
            mt[0] = seed >>> 0;
            for (mti = 1; mti < N; mti++) {
              s = mt[mti - 1] ^ (mt[mti - 1] >>> 30);
              mt[mti] =
                ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
                (s & 0x0000ffff) * 1812433253 +
                mti;
              mt[mti] >>>= 0;
            }
          },
          withArray: seed => {
            const isUint32Array = seed.constructor === Uint32Array;
            let s;
            let v = isUint32Array ? [...seed] : seed;
            let i = 1;
            let j = 0;
            let k = N > v.length ? N : v.length;
            _private.seed.withInt(v[0]);
            for (; k > 0; k--) {
              s = mt[i - 1] ^ (mt[i - 1] >>> 30);
              const a = (((s & 0xffff0000) >>> 16) * 1664525) << 16;
              const b = (s & 0x0000ffff) * 1664525;
              mt[i] = (mt[i] ^ (a + b)) + v[j] + j;
              mt[i] >>>= 0;
              i++;
              j++;
              if (i >= N) {
                mt[0] = mt[N - 1];
                i = 1;
              }
              if (j >= v.length) j = 0;
            }
            for (k = N - 1; k; k--) {
              s = mt[i - 1] ^ (mt[i - 1] >>> 30);
              const a = (((s & 0xffff0000) >>> 16) * 1566083941) << 16;
              const b = (s & 0x0000ffff) * 1566083941;
              mt[i] = (mt[i] ^ (a + b)) - i;
              mt[i] >>>= 0;
              i++;
              if (i >= N) {
                mt[0] = mt[N - 1];
                i = 1;
              }
            }
            if (mt.length < 1) mt[0] = 0x80000000;
          },
          withCrypto: () => {
            _state.seed = KDRollDeps.KDUniform.createRandomSeed();
            _private.seed.withArray(_state.seed);
          }
        },
        init: seed => {
          const ensureUint = num => {
            if (num > Number.MAX_SAFE_INTEGER) return -1;
            if (num < 0) num = Math.abs(num);
            if (!Number.isInteger(num)) num = Number(num.toFixed(0));
            if (!Number.isSafeInteger(num)) num = -1;
            return num;
          };
          let s = seed;
          if (typeof s === "number") {
            let ss = s;
            ss = ensureUint(ss);
            if (ss >= 0) {
              _state.seed = ss;
              _private.seed.withInt(ss);
            } else {
              console.warn("Seed integer is unsafe.");
              console.log("Generating a random seed array instead.");
              _private.seed.withCrypto();
            }
          } else if (s && s.every && s.every(v => typeof v === "number")) {
            const isUint32Array = s.constructor === Uint32Array;
            let ss = isUint32Array ? [...s] : s;
            if (ss.length > 0) {
              ss = ss.map(x => ensureUint(x));
              if (ss.includes(-1)) {
                console.warn("Seed array can not contain unsafe integers.");
                console.log("Generating a random seed array instead.");
                _private.seed.withCrypto();
              } else {
                _state.seed = ss;
                _private.seed.withArray(ss);
              }
            } else {
              console.warn("Seed array can not be empty.");
              console.log("Generating a random seed array instead.");
              _private.seed.withCrypto();
            }
          } else {
            _private.seed.withCrypto();
          }
        },
        int32: () => {
          const M = 397;
          const UM = 0x80000000;
          const LM = 0x7fffffff;
          const MA = 0x9908b0df;
          let y;
          let kk = 0;
          let mag01 = [0, MA];
          if (mti !== null) {
            for (; kk < N - M; kk++) {
              y = (mt[kk] & UM) | (mt[kk + 1] & LM);
              mt[kk] = mt[kk + M] ^ (y >>> 1) ^ mag01[y & 1];
            }
            for (; kk < N - 1; kk++) {
              y = (mt[kk] & UM) | (mt[kk + 1] & LM);
              mt[kk] = mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 1];
            }
            y = (mt[N - 1] & UM) | (mt[0] & LM);
            mt[N - 1] = mt[M - 1] ^ (y >>> 1) ^ mag01[y & 1];
            mti = 0;
          }
          y = mt[mti++];
          y ^= y >>> 11;
          y ^= (y << 7) & 0x9d2c5680;
          y ^= (y << 15) & 0xefc60000;
          y ^= y >>> 18;
          return y >>> 0;
        }
      };
      this.random = () => {
        const fix = (value, repeat = 6) => {
          if (!value || Number.isNaN(parseFloat(`${value}`))) return value;
          const [intPart, decimalPart] = `${value}`.split(".");
          if (!decimalPart) return value;
          const regex = new RegExp(
            `(9{${repeat},}|0{${repeat},})(\\d)*$`,
            "gm"
          );
          const matched = decimalPart.match(regex);
          if (!matched) return value;
          const [wrongPart] = matched;
          const correctDecimalsLength = decimalPart.length - wrongPart.length;
          const fixed = parseFloat(`${intPart}.${decimalPart}`);
          return parseFloat(fixed.toFixed(correctDecimalsLength));
        };
        const c = _private.int32();
        const a = c >>> 5;
        const b = c >>> 6;
        const x = fix(a * 67108864.0 + b);
        const y = fix(1.0 / 9007199254740992.0);
        const result = fix(x * y);
        return result;
      };
      this.seed = seed => {
        if (seed !== undefined && seed !== null) _private.init(seed);
        return _state.seed;
      };
      _private.init(seed);
    }
    static createRandomSeed() {
      const max = 623;
      const min = 20;
      const len = Math.floor(Math.random() * Math.floor(max - min)) + min;
      if (window.crypto) {
        return [...window.crypto.getRandomValues(new Uint32Array(len))];
      } else {
        let crypto;
        try {
          crypto = require("crypto");
          const buf = Buffer.alloc(len);
          return [...crypto.randomFillSync(buf)];
        } catch (_a) {
          const randomInt = () => {
            return Math.floor(Number(Math.random().toFixed(4)) * 1000);
          };
          return new Array(len).fill(0).map(x => randomInt());
        }
      }
    }
  },

  KDGaussian: (uniformGenerator, skew = 0) => {
    const scaleSkew = sk => {
      let n = new KDRollDeps.KDNumber(Math.abs(sk));
      n.clip(0, 1);
      const skewRight = () => {
        sk = 1 - n.value;
      };
      const skewLeft = () => {
        n.scale(0, 4);
        sk = n.value;
      };
      const noSkew = () => (sk = 1);
      sk === 0 ? noSkew() : sk < 0 ? skewRight() : skewLeft();
      return sk;
    };
    skew = scaleSkew(skew);
    let u = 0;
    let v = 0;
    if (typeof uniformGenerator.random === "function") {
      while (u === 0) u = uniformGenerator.random();
      while (v === 0) v = uniformGenerator.random();
    }
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5;
    if (num > 1 || num < 0)
      num = KDRollDeps.Number(
        KDRollDeps.KDGaussian(new KDRollDeps.KDUniform(), skew)
      );
    num = Math.pow(num, skew);
    return num;
  },

  KDElemstats: {
    mean: arr => {
      const sum = arr.reduce((previous, current) => (current += previous));
      return KDRollDeps.KDNumber.floatingPointFix(sum / arr.length);
    },
    median: arr => {
      arr.sort((a, b) => a - b);
      const median = (arr[(arr.length - 1) >> 1] + arr[arr.length >> 1]) / 2;
      return KDRollDeps.KDNumber.floatingPointFix(median);
    },
    modes: arr => {
      const modes = [];
      const counts = [];
      let max = 0;
      arr.forEach(number => {
        counts[number] = (counts[number] || 0) + 1;
        if (counts[number] > max) max = counts[number];
      });
      counts.forEach((count, index) => {
        if (count === max)
          modes.push(KDRollDeps.KDNumber.floatingPointFix(index));
      });
      return modes;
    },
    stdDev: arr => {
      const fix = KDRollDeps.KDNumber.floatingPointFix;
      const avg = KDRollDeps.KDElemstats.mean(arr);
      const sqDiffs = arr.map(value =>
        fix(fix(value - avg) * fix(value - avg))
      );
      const avgSqRt = fix(Math.sqrt(KDRollDeps.KDElemstats.mean(sqDiffs)));
      const stdDev = KDRollDeps.KDNumber.scale(
        avgSqRt,
        [0, Math.max(...arr)],
        [0, 1]
      );
      return stdDev;
    }
  }
};

/**
 * `KDRoll` is a class representing a pseudo-random number generator and
 * manager. Includes Mersenne-Twister uniform distribution, Box-Mueller
 * gaussian distribution, n-sided die rolling, history of variable max size,
 * elementary statistics, and scale/clip/round convenience functions.
 */
export class KDRoll {
  /**
   * Instantiates a new `KDRoll()`
   * @param {Seed} [seed] - The initial seed value. Should be an unsigned
   * integer or `Uint32Array` of arbitrary values and length. If
   * `seed=undefined`, `KDRoll()` will generate its own random seed using
   * `KDRoll.createRandomSeed()`.
   * @note `KDRoll` is a class representing a pseudo-random number generator
   * and manager. Includes Mersenne-Twister uniform distribution, Box-Mueller
   * gaussian distribution, n-sided die rolling, history of variable max size,
   * elementary statistics, and scale/clip/round convenience functions.
   */
  constructor(seed) {
    const uniform = new KDRollDeps.KDUniform(seed);
    let history = new KDRollDeps.KDHistory();
    const _private = {
      seed: seed => {
        if (typeof seed !== "undefined" && seed !== null) {
          this.clearHistory();
          uniform.seed(seed);
        }
        return uniform.seed();
      },
      history: () => history.map(x => x[0]),
      maxHistory: size => history.max(size),
      clearHistory: () => {
        const max = history.max();
        history = new KDRollDeps.KDHistory();
        history.max(max);
      },
      uniform: () => {
        const rand = uniform.random();
        history.push(rand);
        return rand;
      },
      gaussian: skew => {
        const rand = KDRollDeps.KDGaussian(uniform, skew);
        history.push(rand);
        return rand;
      },
      d: sides => {
        if (typeof sides === "number") {
          const n = new KDRollDeps.KDNumber(uniform.random());
          n.scale(1, sides).round(0);
          history.push(n.value);
          return n.value;
        } else console.log(new Error("Sides must be a number."));
      },
      mean: arr => {
        arr = arr ? arr : this.history();
        return KDRollDeps.KDElemstats.mean(arr);
      },
      median: arr => {
        arr = arr ? arr : this.history();
        return KDRollDeps.KDElemstats.median(arr);
      },
      modes: arr => {
        arr = arr ? arr : this.history();
        return KDRollDeps.KDElemstats.modes(arr);
      },
      stdDev: arr => {
        arr = arr ? arr : this.history();
        return KDRollDeps.KDElemstats.stdDev(arr);
      }
    };

    /**
     * Re-seed the manager. Automatically clears history.
     * @param {Seed} [seed] - Unsigned 32-bit integer `number`, `Uint32Array`,
     * or `number[]` of arbitrary size/values.
     * @returns {Seed} Returns the current seed.
     * @readonly
     */
    this.seed = seed => _private.seed(seed);

    /**
     * Return a copy of the internal `history` object with no references.
     * @returns {number[]} Returns the current `history`.
     * @readonly
     */
    this.history = () => _private.history();

    /**
     * Get or set the maximum history size.
     * @param {number} [size] - The maximum history size. If `size=undefined` is
     * this function will return the current `maxHistory`. Initial `maxHistory`
     * is `1000`.
     * @returns {number} Returns the current `maxHistory`.
     * @readonly
     */
    this.maxHistory = size => _private.maxHistory(size);

    /**
     * Reset `history` but retain the current `maxHistory`.
     */
    this.clearHistory = () => _private.clearHistory();

    /**
     * Generates a 53-bit random real in the interval [0,1] with
     * normal distribution.
     * @returns {number}
     * @readonly
     */
    this.uniform = () => _private.uniform();

    /**
     * Generates a 53-bit random real in the interval [0,1] with gaussian
     * distribution.
     * @param {number} [skew=0] - In the range [-1,1]. Negative values skew data
     * RIGHT, and positive values skew data LEFT. Default `skew=0`.
     * @returns {number}
     * @readonly
     */
    this.gaussian = skew => _private.gaussian(skew);

    /**
     * Simulates a die-rolling metaphor. Generates a 53-bit random real in the
     * interval [0,1] with normal distribution, then scales it to a range [1,n]
     * where n is the number of sides, then rounds to whole number.
     * @param {number} sides - Number of sides to represent. Allows but ignores
     * decimals.
     * @returns {number}
     * @readonly
     */
    this.d = sides => _private.d(sides);

    /**
     * Convenience function. Alias for `uniform()`.
     * @returns {number}
     * @readonly
     */
    this.random = () => _private.uniform();

    /**
     * Calculate the statistical mean of a `number[]` or the current
     * `history()`.
     * @param {number[]} [arr] - The array on which to operate.
     * Defaults to `history()` if `arr=undefined`.
     * @returns {number}
     * @readonly
     */
    this.mean = arr => _private.mean(arr);

    /**
     * Calculate the statistical median of a `number[]` or the current
     * `history()`.
     * @param {number[]} [arr] - The array on which to operate.
     * Defaults to `history()` if `arr=undefined`.
     * @returns {number}
     * @readonly
     */
    this.median = arr => _private.median(arr);

    /**
     * Calculate the statistical modes of a `number[]` or the current
     * `history()`.
     * @param {number[]} [arr] - The array on which to operate.
     * Defaults to `history()` if `arr=undefined`.
     * @returns {number[]}
     * @readonly
     */
    this.modes = arr => _private.modes(arr);

    /**
     * Calculate the standard deviation of a `number[]` or the current
     * `history()`.
     * @param {number[]} [arr] - The array on which to operate. Defaults to
     * `history()` if `arr=undefined`.
     * @returns {number} Standard deviation is normalized [0,1].
     * @readonly
     */
    this.standardDeviation = arr => _private.stdDev(arr);

    Object.keys(this).forEach(key => {
      Object.defineProperty(this, key, {
        value: this[key],
        writable: false,
        enumerable: true
      });
    });
  }

  /**
   * @static Convenience function to generate a randomly seeded random number
   * normalized [0,1].
   * @returns {number}
   * @readonly
   */
  static random() {
    return new KDRoll().random();
  }

  /**
   * @static Convenience function to generate a randomly seeded random number
   * in the range 1-sides.
   * @param {number} sides - The desired number of sides to simulate.
   * @returns {number}
   * @readonly
   */
  static d(sides) {
    return new KDRoll().d(sides);
  }

  /**
   * @static Generate a random seed array using `window.crypto`. Falls back to
   * `node.crypto` or a final fallback to using `Math.random()` to fill an
   * array.
   * @return {number[]} Randomly generated `number[]` of random size [20,623]
   * and values.
   * @readonly
   */
  static createRandomSeed() {
    return KDRollDeps.KDUniform.createRandomSeed();
  }

  /**
   * @static Scale a value from a known range to a new range.
   * @param {number} value - The initial value.
   * @param {[number, number]} r1 - The initial range [min, max].
   * @param {[number, number]} r2 - The target range [min, max].
   * @returns {number}
   * @readonly
   */
  static scale(value, r1, r2) {
    return KDRollDeps.KDNumber.scale(value, r1, r2);
  }

  /**
   * @static Limit a value to a hard minimum and maximum.
   * @param {number} value - The initial value.
   * @param {[number, number]} range - Array containing the minimum and
   * maximum possible values.
   * @returns {number}
   * @readonly
   */
  static clip(value, range) {
    return KDRollDeps.KDNumber.clip(value, range);
  }

  /**
   * @static Round a value to a specific number of places. Decimal values < 5
   * (for any given place) are rounded down.
   * @param {number} value - The initial value.
   * @param {number} [places=0] - The desired number of decimal places.
   * `0` results in a whole number. Default is `places=0`.
   * @returns {number}
   * @readonly
   */
  static round(value, places) {
    return KDRollDeps.KDNumber.round(value, places);
  }
}
