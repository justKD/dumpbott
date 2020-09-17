/**
 * @file check.ts
 * @author justKD
 * @copyright justKD 2020
 * @license MIT https://notnatural.co/license/mit/
 * @fileoverview `export const check`
 */

/**
 * Make various assertions concerning type.
 */
export const check = {
  /**
   * Assert that the value is `!== undefined` and `!== null`.
   * @note See also `check.is.undefined()` and `check.is.null()`.
   * @param {any} t - Target value to be checked.
   * @returns {boolean}
   * ```
   * let a;           // false
   * let b = false;   // true
   * let c = null;    // false
   * let d = 100;     // true
   * ```
   */
  exists: (t: any): boolean => {
    return t !== undefined && t !== null;
  },

  has: {
    /**
     * Assert that the value is `!== undefined` and `!== null`. Then assert
     * that the value has the given key.
     * @note Returns `true` as long as the key exists on the target, even if
     * the value for that key is `undefined`.
     * @param {any} t - Target value to be checked.
     * @param {string} key - The target property key.
     * @returns {boolean}
     */
    key: (t: any, key: string): boolean => {
      return check.exists(t) && t.hasOwnProperty(key);
    },
    /**
     * Assert that the value is `!== undefined` and `!== null`. Then assert
     * that the value has the given key. Then assert that the property value is
     * `!== undefined` and `!== null`.
     * @param {any} t - Target value to be checked.
     * @param {string} key - The target property key.
     * @returns {boolean}
     */
    valueForKey: (t: any, key: string): boolean => {
      return check.exists(t) && t.hasOwnProperty(key) && check.exists(t[key]);
    },
  },

  /**
   * Assert that the value is of various specific types.
   */
  is: {
    /**
     * Assert that the value is `!== undefined` and `!== null`. Then assert
     * that the value is of type `number`. `True` for any `number`, including
     * `NaN` and `Infinity`. `False` for anything else, including `BigInt`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * ```
     * let a;             // false
     * let b = 100;       // true
     * let c = "100";     // false
     * let d = NaN;       // true
     *
     * let e = Infinity;  // true
     * let f = 0;         // true
     * let g = false;     // false
     * ```
     */
    number: (t: any): boolean => {
      return check.exists(t) && typeof t === "number";
    },

    /**
     * Assert that the value is `!== undefined` and `!== null`. Then assert
     * that the value is of type `number`, can be safely used in arithmetic,
     * and can be safely represented in memory.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * ```
     * let a;                             // false
     * let b = Number.MIN_SAFE_INTEGER;   // true
     * let c = Number.MAX_SAFE_INTEGER;   // true
     * let d = b - 10;                    // false
     * let e = c + 10;                    // false
     *
     * let f = NaN;                       // false
     * let g = Infinity;                  // false
     * let h = 100;                       // true
     * let i = "100";                     // false
     * let j = 0;                         // true
     * ```
     */
    safeNumber: (t: any): boolean => {
      if (check.is.number(t)) {
        const n: number = t as number;
        const isFinite = Number.isFinite(n);
        const notTooBig = n <= Number.MAX_SAFE_INTEGER;
        const notTooSmall = n >= Number.MIN_SAFE_INTEGER;
        return isFinite && notTooBig && notTooSmall;
      }
      return false;
    },

    /**
     * Assert that the value is `!== undefined` and `!== null`. Then assert
     * that the value is of type `number` and can specifically be represented
     * as an integer.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * ```
     * let a;                             // false
     * let b = Number.MIN_SAFE_INTEGER;   // true
     * let c = Number.MAX_SAFE_INTEGER;   // true
     * let d = b - 10;                    // true
     * let e = c + 10;                    // true
     *
     * let f = NaN;                       // false
     * let g = Infinity;                  // false
     * let h = 100;                       // true
     * let i = "100";                     // false
     * let j = 0;                         // true
     * ```
     */
    integer: (t: any): boolean => {
      return check.is.number(t) && Number.isInteger(t as number);
    },

    /**
     * Assert that the value is `!== undefined` and `!== null`. Then assert
     * that the value is of type `number`, can be safely used in arithmetic,
     * can be safely represented in memory. and can specifically be represented
     * as an integer.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * ```
     * let a;                             // false
     * let b = Number.MIN_SAFE_INTEGER;   // true
     * let c = Number.MAX_SAFE_INTEGER;   // true
     * let d = b - 10;                    // false
     * let e = c + 10;                    // false
     *
     * let f = NaN;                       // false
     * let g = Infinity;                  // false
     * let h = 100;                       // true
     * let i = "100";                     // false
     * let j = 0;                         // true
     * ```
     */
    safeInteger: (t: any): boolean => {
      return check.is.safeNumber(t) && Number.isInteger(t as number);
    },

    /**
     * Assert that the value is of type `boolean`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * ```
     * let a;           // false
     * let b = true;    // true
     * let c = false;   // true
     * let d = 0;       // false
     * let e = "true";  // false
     * ```
     */
    boolean: (t: any): boolean => {
      return typeof t === "boolean";
    },

    /**
     * Assert that the value is of type `string`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * ```
     * let a;         // false
     * let b = "2";   // true
     * let c = 2;     // false
     * ```
     */
    string: (t: any): boolean => {
      return typeof t === "string" || t instanceof String;
    },

    /**
     * Assert that the value is `!== undefined` and `!== null`. Then assert that
     * the value constructor is `=== Object`.
     * @note Only values representing generic objects will return `true`.
     * Values created using the `new` keyword will be represented with their
     * specific constructors and will return `false`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * ```
     * let a;               // false
     * let b = {};          // true
     * let c = [];          // false
     * let d = () => {};    // true
     * let e = new Date();  // false
     * ```
     */
    object: (t: any): boolean => {
      return check.exists(t) && t.constructor === Object;
    },

    /**
     * Assert that the value is `!== undefined` and `!== null`. Then assert
     * that the `constructor` argument can be called with the `new` keyword.
     * Then assert that the values constructor `=== constructor`.
     * @note Only values representing the provided constructor will return
     * `true`. Generic objects whose constructor `=== Object` will return
     * `false`.
     * @param {any} t - Target value to be checked.
     * @param {any} constructor - A valid constructor function.
     * @returns {boolean}
     * ```
     * let a;               // false
     * let b = {};          // true
     * let c = [];          // false
     * let d = () => {};    // true
     * let e = new Date();  // false
     * ```
     */
    constructedFrom: (t: any, constructor: any): boolean => {
      try {
        new constructor();
        return check.exists(t) && t.constructor === constructor;
      } catch {
        return false;
      }
    },

    /**
     * Assert that the value is `!== undefined` and `!== null`. Then assert
     * that the value is specifically an `Array`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * ```
     * let a;                       // false
     * let b = {};                  // false
     * let c = [];                  // true
     *
     * let d = new Set([]);         // false
     * let e = new Uint32Array();   // false
     * let f = new Array(5);        // true
     * ```
     */
    array: (t: any): boolean => {
      return check.exists(t) && Array.isArray(t);
    },

    /**
     * Assert that the value is `!== undefined` and `!== null`. Then assert
     * that the value is specifically an `Array` and has `length > 0`. Finally,
     * assert that every value in the array is a `number`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * ```
     * let a;                       // false
     * let b = [];                  // false
     * let c = [1, 2, 3, 0];        // true
     * let d = [1, 2, "3", 0];      // false
     * ```
     */
    numberArray: (t: any): boolean => {
      if (check.is.array(t)) {
        if (t.length > 0) {
          return t.every((x: any) => check.is.number(x));
        }
      }
      return false;
    },

    /**
     * Assert that the value is `!== undefined` and `!== null`. Then assert
     * that the value is specifically an `Array` and has `length > 0`. Finally,
     * assert that every value in the array is a `string`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * ```
     * let a;                       // false
     * let b = [];                  // false
     * let c = ["a", "b", "c"];     // true
     * let d = [1, 2, "3", 0];      // false
     * ```
     */
    stringArray: (t: any): boolean => {
      if (check.is.array(t)) {
        if (t.length > 0) {
          return t.every((x: any) => check.is.string(x));
        }
      }
      return false;
    },

    /**
     * Assert that the value is `!== undefined` and `!== null`. Then assert
     * that the value is specifically an `Array` and has `length > 0`. Finally,
     * assert that every value in the array is an `Object`.
     * @note Fails if elements are `Array` or `null`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * ```
     * let a;                       // false
     * let b = [];                  // false
     * let c = [{}, {}, {}];        // true
     * let d = [{}, {}, []];      // false
     * ```
     */
    objectArray: (t: any): boolean => {
      if (check.is.array(t)) {
        if (t.length > 0) {
          return t.every((x: any) => check.is.object(x));
        }
      }
      return false;
    },

    /**
     * Assert that the value is `!== undefined` and `!== null`. Then assert
     * that the value is specifically an `Array` and has `length > 0`. Finally,
     * assert that every value in the array is an `Function`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * ```
     * let a;                       // false
     * let b = [];                  // false
     * let c = [()=>{}, ()=>{}];    // true
     * let d = [()=>{}, {}];        // false
     * ```
     */
    functionArray: (t: any): boolean => {
      if (check.is.array(t)) {
        if (t.length > 0) {
          return t.every((x: any) => check.is.function(x));
        }
      }
      return false;
    },

    /**
     * Assert that the value is `!== undefined` and `!== null`. Then assert
     * that the value is specifically an `Array` and has `length > 0`. Finally,
     * assert that every value in the array is an `boolean`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * ```
     * let a;                       // false
     * let b = [];                  // false
     * let c = [true, false];       // true
     * let d = [true, false, 1];    // false
     * ```
     */
    booleanArray: (t: any): boolean => {
      if (check.is.array(t)) {
        if (t.length > 0) {
          return t.every((x: any) => check.is.boolean(x));
        }
      }
      return false;
    },

    /**
     * Assert that the value is `!== undefined` and `!== null`. Then assert
     * that the value is specifically a `Function`.
     * @note This checks that the value can actually be called as a `Function`.
     * It does not check `typeof t` or `t.constructor`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * ```
     * let a;               // false
     * let b = () => {};    // true
     * let c = Date;        // true
     * let d = new Date();  // false
     * ```
     */
    function: (t: any): boolean => {
      if (check.exists(t)) {
        return Object.prototype.toString.call(t) === "[object Function]";
      }
      return false;
    },

    /**
     * Assert that the value is specifically `=== null`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * ```
     * let a;           // false
     * let b = null;    // true
     * let c = 0;       // false
     * let d = false;   // false
     * ```
     */
    null: (t: any): boolean => {
      return t === null;
    },

    /**
     * Assert that the value is specifically `=== undefined`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * ```
     * let a;           // true
     * let b = null;    // false
     * let c = 0;       // false
     * let d = false;   // false
     * ```
     */
    undefined: (t: any): boolean => {
      return t === undefined;
    },

    /**
     * Assert that the value is `!== undefined` and `!== null`. Then assert
     * that the value constructor is `ArrayBuffer`.
     * @param {any} t - Target value to be checked.
     * @returns {boolean}
     * ```
     * let a;                       // false
     * let b = [];                  // false
     * let c = new ArrayBuffer();   // true
     * let d = new Uint32Array();   // false
     * ```
     */
    arrayBuffer: (t: any): boolean => {
      return check.exists(t) && t.constructor === ArrayBuffer;
    },

    /**
     * Functions that assert a value is a specific typed array.
     */
    typedArray: {
      /**
       * Assert that the value is `!== undefined` and `!== null`. Then assert
       * that the value constructor is `Int8Array`.
       * @note Value range `-128 to 127`.
       * @param {any} t - Target value to be checked.
       * @returns {boolean}
       * ```
       * let a;                     // false
       * let b = [];                // false
       * let c = new Int8Array();   // true
       * ```
       */
      Int8Array: (t: any): boolean => {
        return check.exists(t) && t.constructor === Int8Array;
      },
      /**
       * Assert that the value is `!== undefined` and `!== null`. Then assert
       * that the value constructor is `Uint8Array`.
       * @note Value range `0 to 255`.
       * @param {any} t - Target value to be checked.
       * @returns {boolean}
       * ```
       * let a;                       // false
       * let b = [];                  // false
       * let c = new Uint8Array();    // true
       * ```
       */
      Uint8Array: (t: any): boolean => {
        return check.exists(t) && t.constructor === Uint8Array;
      },
      /**
       * Assert that the value is `!== undefined` and `!== null`. Then assert
       * that the value constructor is `Uint8ClampedArray`.
       * @note Value range `0 to 255`.
       * @param {any} t - Target value to be checked.
       * @returns {boolean}
       * ```
       * let a;                             // false
       * let b = [];                        // false
       * let c = new Uint8ClampedArray();   // true
       * ```
       */
      Uint8ClampedArray: (t: any): boolean => {
        return check.exists(t) && t.constructor === Uint8ClampedArray;
      },
      /**
       * Assert that the value is `!== undefined` and `!== null`. Then assert
       * that the value constructor is `Int16Array`.
       * @note Value range `-32768 to 32767`.
       * @param {any} t - Target value to be checked.
       * @returns {boolean}
       * ```
       * let a;                       // false
       * let b = [];                  // false
       * let c = new Int16Array();    // true
       * ```
       */
      Int16Array: (t: any): boolean => {
        return check.exists(t) && t.constructor === Int16Array;
      },
      /**
       * Assert that the value is `!== undefined` and `!== null`. Then assert
       * that the value constructor is `Uint16Array`.
       * @note Value range `0 to 65535`.
       * @param {any} t - Target value to be checked.
       * ```
       * let a;                       // false
       * let b = [];                  // false
       * let c = new Uint16Array();   // true
       * ```
       * @returns {boolean}
       */
      Uint16Array: (t: any): boolean => {
        return check.exists(t) && t.constructor === Uint16Array;
      },
      /**
       * Assert that the value is `!== undefined` and `!== null`. Then assert
       * that the value constructor is `Int32Array`.
       * @note Value range `-2147483648 to 2147483647`.
       * @param {any} t - Target value to be checked.
       * @returns {boolean}
       * ```
       * let a;                       // false
       * let b = [];                  // false
       * let c = new Int32Array();    // true
       * ```
       */
      Int32Array: (t: any): boolean => {
        return check.exists(t) && t.constructor === Int32Array;
      },
      /**
       * Assert that the value is `!== undefined` and `!== null`. Then assert
       * that the value constructor is `Uint32Array`.
       * @note Value range `0 to 4294967295`.
       * @param {any} t - Target value to be checked.
       * @returns {boolean}
       * ```
       * let a;                       // false
       * let b = [];                  // false
       * let c = new Uint8Array();    // true
       * ```
       */
      Uint32Array: (t: any): boolean => {
        return check.exists(t) && t.constructor === Uint32Array;
      },
      /**
       * Assert that the value is `!== undefined` and `!== null`. Then assert
       * that the value constructor is `Float32Array`.
       * @note Value range `1.2×10-38 to 3.4×1038`.
       * @param {any} t - Target value to be checked.
       * @returns {boolean}
       * ```
       * let a;                         // false
       * let b = [];                    // false
       * let c = new Float32Array();    // true
       * ```
       */
      Float32Array: (t: any): boolean => {
        return check.exists(t) && t.constructor === Float32Array;
      },
      /**
       * Assert that the value is `!== undefined` and `!== null`. Then assert
       * that the value constructor is `Float64Array`.
       * @note Value range `5.0×10-324 to 1.8×10308`.
       * @param {any} t - Target value to be checked.
       * @returns {boolean}
       * ```
       * let a;                         // false
       * let b = [];                    // false
       * let c = new Float64Array();    // true
       * ```
       */
      Float64Array: (t: any): boolean => {
        return check.exists(t) && t.constructor === Float64Array;
      },
      // /**
      //  * @alert Not yet a standard browser feature.
      //  * Assert that the value is `!== undefined` and `!== null`. Then assert
      //  * that the value constructor is `BigInt64Array`.
      //  * @note Value range `-263 to 263-1`.
      //  * @param {any} t - Target value to be checked.
      //  * @returns {boolean}
      //  * ```
      //  * let a;                           // false
      //  * let b = [];                      // false
      //  * let c = new BigInt64Array());    // true
      //  * ```
      //  */
      // BigInt64Array: (t: any): boolean => {
      //   return check.exists(t) && t.constructor === BigInt64Array;
      // },
      // /**
      //  * @alert Not yet a standard browser feature.
      //  * Assert that the value is `!== undefined` and `!== null`. Then assert
      //  * that the value constructor is `BigUint64Array`.
      //  * @note Value range `0 to 264-1`.
      //  * @param {any} t - Target value to be checked.
      //  * @returns {boolean}
      //  * ```
      //  * let a;                             // false
      //  * let b = [];                        // false
      //  * let c = new BigUint64Array();      // true
      //  * ```
      //  */
      // BigUint64Array: (t: any): boolean => {
      //   return check.exists(t) && t.constructor === BigUint64Array;
      // },
    },
  },
};
