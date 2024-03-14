
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/memop/timsort.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = _default;
// reference: https://github.com/mziccard/node-timsort

/**
 * Default minimum size of a run.
 */
var DEFAULT_MIN_MERGE = 32;
/**
 * Minimum ordered subsequece required to do galloping.
 */

var DEFAULT_MIN_GALLOPING = 7;
/**
 * Default tmp storage length. Can increase depending on the size of the
 * smallest run to merge.
 */

var DEFAULT_TMP_STORAGE_LENGTH = 256;
/**
 * Pre-computed powers of 10 for efficient lexicographic comparison of
 * small integers.
 */

var POWERS_OF_TEN = [1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];
/**
 * Estimate the logarithm base 10 of a small integer.
 *
 * @param {number} x - The integer to estimate the logarithm of.
 * @return {number} - The estimated logarithm of the integer.
 */

function log10(x) {
  if (x < 1e5) {
    if (x < 1e2) {
      return x < 1e1 ? 0 : 1;
    }

    if (x < 1e4) {
      return x < 1e3 ? 2 : 3;
    }

    return 4;
  }

  if (x < 1e7) {
    return x < 1e6 ? 5 : 6;
  }

  if (x < 1e9) {
    return x < 1e8 ? 7 : 8;
  }

  return 9;
}
/**
 * Default alphabetical comparison of items.
 *
 * @param {string|object|number} a - First element to compare.
 * @param {string|object|number} b - Second element to compare.
 * @return {number} - A positive number if a.toString() > b.toString(), a
 * negative number if .toString() < b.toString(), 0 otherwise.
 */


function alphabeticalCompare(a, b) {
  if (a === b) {
    return 0;
  }

  if (~~a === a && ~~b === b) {
    if (a === 0 || b === 0) {
      return a < b ? -1 : 1;
    }

    if (a < 0 || b < 0) {
      if (b >= 0) {
        return -1;
      }

      if (a >= 0) {
        return 1;
      }

      a = -a;
      b = -b;
    }

    var al = log10(a);
    var bl = log10(b);
    var t = 0;

    if (al < bl) {
      a *= POWERS_OF_TEN[bl - al - 1];
      b /= 10;
      t = -1;
    } else if (al > bl) {
      b *= POWERS_OF_TEN[al - bl - 1];
      a /= 10;
      t = 1;
    }

    if (a === b) {
      return t;
    }

    return a < b ? -1 : 1;
  }

  var aStr = String(a);
  var bStr = String(b);

  if (aStr === bStr) {
    return 0;
  }

  return aStr < bStr ? -1 : 1;
}
/**
 * Compute minimum run length for TimSort
 *
 * @param {number} n - The size of the array to sort.
 */


function minRunLength(n) {
  var r = 0;

  while (n >= DEFAULT_MIN_MERGE) {
    r |= n & 1;
    n >>= 1;
  }

  return n + r;
}
/**
 * Counts the length of a monotonically ascending or strictly monotonically
 * descending sequence (run) starting at array[lo] in the range [lo, hi). If
 * the run is descending it is made ascending.
 *
 * @param {array} array - The array to reverse.
 * @param {number} lo - First element in the range (inclusive).
 * @param {number} hi - Last element in the range.
 * @param {function} compare - Item comparison function.
 * @return {number} - The length of the run.
 */


function makeAscendingRun(array, lo, hi, compare) {
  var runHi = lo + 1;

  if (runHi === hi) {
    return 1;
  } // Descending


  if (compare(array[runHi++], array[lo]) < 0) {
    while (runHi < hi && compare(array[runHi], array[runHi - 1]) < 0) {
      runHi++;
    }

    reverseRun(array, lo, runHi); // Ascending
  } else {
    while (runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0) {
      runHi++;
    }
  }

  return runHi - lo;
}
/**
 * Reverse an array in the range [lo, hi).
 *
 * @param {array} array - The array to reverse.
 * @param {number} lo - First element in the range (inclusive).
 * @param {number} hi - Last element in the range.
 */


function reverseRun(array, lo, hi) {
  hi--;

  while (lo < hi) {
    var t = array[lo];
    array[lo++] = array[hi];
    array[hi--] = t;
  }
}
/**
 * Perform the binary sort of the array in the range [lo, hi) where start is
 * the first element possibly out of order.
 *
 * @param {array} array - The array to sort.
 * @param {number} lo - First element in the range (inclusive).
 * @param {number} hi - Last element in the range.
 * @param {number} start - First element possibly out of order.
 * @param {function} compare - Item comparison function.
 */


function binaryInsertionSort(array, lo, hi, start, compare) {
  if (start === lo) {
    start++;
  }

  for (; start < hi; start++) {
    var pivot = array[start]; // Ranges of the array where pivot belongs

    var left = lo;
    var right = start;
    /*
     *   pivot >= array[i] for i in [lo, left)
     *   pivot <  array[i] for i in  in [right, start)
     */

    while (left < right) {
      var mid = left + right >>> 1;

      if (compare(pivot, array[mid]) < 0) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
    /*
     * Move elements right to make room for the pivot. If there are elements
     * equal to pivot, left points to the first slot after them: this is also
     * a reason for which TimSort is stable
     */


    var n = start - left; // Switch is just an optimization for small arrays

    switch (n) {
      case 3:
        array[left + 3] = array[left + 2];

      /* falls through */

      case 2:
        array[left + 2] = array[left + 1];

      /* falls through */

      case 1:
        array[left + 1] = array[left];
        break;

      default:
        while (n > 0) {
          array[left + n] = array[left + n - 1];
          n--;
        }

    }

    array[left] = pivot;
  }
}
/**
 * Find the position at which to insert a value in a sorted range. If the range
 * contains elements equal to the value the leftmost element index is returned
 * (for stability).
 *
 * @param {number} value - Value to insert.
 * @param {array} array - The array in which to insert value.
 * @param {number} start - First element in the range.
 * @param {number} length - Length of the range.
 * @param {number} hint - The index at which to begin the search.
 * @param {function} compare - Item comparison function.
 * @return {number} - The index where to insert value.
 */


function gallopLeft(value, array, start, length, hint, compare) {
  var lastOffset = 0;
  var maxOffset = 0;
  var offset = 1;

  if (compare(value, array[start + hint]) > 0) {
    maxOffset = length - hint;

    while (offset < maxOffset && compare(value, array[start + hint + offset]) > 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    } // Make offsets relative to start


    lastOffset += hint;
    offset += hint; // value <= array[start + hint]
  } else {
    maxOffset = hint + 1;

    while (offset < maxOffset && compare(value, array[start + hint - offset]) <= 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    } // Make offsets relative to start


    var tmp = lastOffset;
    lastOffset = hint - offset;
    offset = hint - tmp;
  }
  /*
   * Now array[start+lastOffset] < value <= array[start+offset], so value
   * belongs somewhere in the range (start + lastOffset, start + offset]. Do a
   * binary search, with invariant array[start + lastOffset - 1] < value <=
   * array[start + offset].
   */


  lastOffset++;

  while (lastOffset < offset) {
    var m = lastOffset + (offset - lastOffset >>> 1);

    if (compare(value, array[start + m]) > 0) {
      lastOffset = m + 1;
    } else {
      offset = m;
    }
  }

  return offset;
}
/**
 * Find the position at which to insert a value in a sorted range. If the range
 * contains elements equal to the value the rightmost element index is returned
 * (for stability).
 *
 * @param {number} value - Value to insert.
 * @param {array} array - The array in which to insert value.
 * @param {number} start - First element in the range.
 * @param {number} length - Length of the range.
 * @param {number} hint - The index at which to begin the search.
 * @param {function} compare - Item comparison function.
 * @return {number} - The index where to insert value.
 */


function gallopRight(value, array, start, length, hint, compare) {
  var lastOffset = 0;
  var maxOffset = 0;
  var offset = 1;

  if (compare(value, array[start + hint]) < 0) {
    maxOffset = hint + 1;

    while (offset < maxOffset && compare(value, array[start + hint - offset]) < 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    } // Make offsets relative to start


    var tmp = lastOffset;
    lastOffset = hint - offset;
    offset = hint - tmp; // value >= array[start + hint]
  } else {
    maxOffset = length - hint;

    while (offset < maxOffset && compare(value, array[start + hint + offset]) >= 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    } // Make offsets relative to start


    lastOffset += hint;
    offset += hint;
  }
  /*
   * Now array[start+lastOffset] < value <= array[start+offset], so value
   * belongs somewhere in the range (start + lastOffset, start + offset]. Do a
   * binary search, with invariant array[start + lastOffset - 1] < value <=
   * array[start + offset].
   */


  lastOffset++;

  while (lastOffset < offset) {
    var m = lastOffset + (offset - lastOffset >>> 1);

    if (compare(value, array[start + m]) < 0) {
      offset = m;
    } else {
      lastOffset = m + 1;
    }
  }

  return offset;
}

var TimSort = /*#__PURE__*/function () {
  function TimSort(array, compare) {
    this.array = array;
    this.compare = compare;
    this.minGallop = DEFAULT_MIN_GALLOPING;
    this.length = array.length;
    this.tmpStorageLength = DEFAULT_TMP_STORAGE_LENGTH;

    if (this.length < 2 * DEFAULT_TMP_STORAGE_LENGTH) {
      this.tmpStorageLength = this.length >>> 1;
    }

    this.tmp = new Array(this.tmpStorageLength);
    this.stackLength = this.length < 120 ? 5 : this.length < 1542 ? 10 : this.length < 119151 ? 19 : 40;
    this.runStart = new Array(this.stackLength);
    this.runLength = new Array(this.stackLength);
    this.stackSize = 0;
  }
  /**
   * Push a new run on TimSort's stack.
   *
   * @param {number} runStart - Start index of the run in the original array.
   * @param {number} runLength - Length of the run;
   */


  var _proto = TimSort.prototype;

  _proto.pushRun = function pushRun(runStart, runLength) {
    this.runStart[this.stackSize] = runStart;
    this.runLength[this.stackSize] = runLength;
    this.stackSize += 1;
  }
  /**
   * Merge runs on TimSort's stack so that the following holds for all i:
   * 1) runLength[i - 3] > runLength[i - 2] + runLength[i - 1]
   * 2) runLength[i - 2] > runLength[i - 1]
   */
  ;

  _proto.mergeRuns = function mergeRuns() {
    while (this.stackSize > 1) {
      var n = this.stackSize - 2;

      if (n >= 1 && this.runLength[n - 1] <= this.runLength[n] + this.runLength[n + 1] || n >= 2 && this.runLength[n - 2] <= this.runLength[n] + this.runLength[n - 1]) {
        if (this.runLength[n - 1] < this.runLength[n + 1]) {
          n--;
        }
      } else if (this.runLength[n] > this.runLength[n + 1]) {
        break;
      }

      this.mergeAt(n);
    }
  }
  /**
   * Merge all runs on TimSort's stack until only one remains.
   */
  ;

  _proto.forceMergeRuns = function forceMergeRuns() {
    while (this.stackSize > 1) {
      var n = this.stackSize - 2;

      if (n > 0 && this.runLength[n - 1] < this.runLength[n + 1]) {
        n--;
      }

      this.mergeAt(n);
    }
  }
  /**
   * Merge the runs on the stack at positions i and i+1. Must be always be called
   * with i=stackSize-2 or i=stackSize-3 (that is, we merge on top of the stack).
   *
   * @param {number} i - Index of the run to merge in TimSort's stack.
   */
  ;

  _proto.mergeAt = function mergeAt(i) {
    var compare = this.compare;
    var array = this.array;
    var start1 = this.runStart[i];
    var length1 = this.runLength[i];
    var start2 = this.runStart[i + 1];
    var length2 = this.runLength[i + 1];
    this.runLength[i] = length1 + length2;

    if (i === this.stackSize - 3) {
      this.runStart[i + 1] = this.runStart[i + 2];
      this.runLength[i + 1] = this.runLength[i + 2];
    }

    this.stackSize--;
    /*
     * Find where the first element in the second run goes in run1. Previous
     * elements in run1 are already in place
     */

    var k = gallopRight(array[start2], array, start1, length1, 0, compare);
    start1 += k;
    length1 -= k;

    if (length1 === 0) {
      return;
    }
    /*
     * Find where the last element in the first run goes in run2. Next elements
     * in run2 are already in place
     */


    length2 = gallopLeft(array[start1 + length1 - 1], array, start2, length2, length2 - 1, compare);

    if (length2 === 0) {
      return;
    }
    /*
     * Merge remaining runs. A tmp array with length = min(length1, length2) is
     * used
     */


    if (length1 <= length2) {
      this.mergeLow(start1, length1, start2, length2);
    } else {
      this.mergeHigh(start1, length1, start2, length2);
    }
  }
  /**
   * Merge two adjacent runs in a stable way. The runs must be such that the
   * first element of run1 is bigger than the first element in run2 and the
   * last element of run1 is greater than all the elements in run2.
   * The method should be called when run1.length <= run2.length as it uses
   * TimSort temporary array to store run1. Use mergeHigh if run1.length >
   * run2.length.
   *
   * @param {number} start1 - First element in run1.
   * @param {number} length1 - Length of run1.
   * @param {number} start2 - First element in run2.
   * @param {number} length2 - Length of run2.
   */
  ;

  _proto.mergeLow = function mergeLow(start1, length1, start2, length2) {
    var compare = this.compare;
    var array = this.array;
    var tmp = this.tmp;
    var i = 0;

    for (i = 0; i < length1; i++) {
      tmp[i] = array[start1 + i];
    }

    var cursor1 = 0;
    var cursor2 = start2;
    var dest = start1;
    array[dest++] = array[cursor2++];

    if (--length2 === 0) {
      for (i = 0; i < length1; i++) {
        array[dest + i] = tmp[cursor1 + i];
      }

      return;
    }

    if (length1 === 1) {
      for (i = 0; i < length2; i++) {
        array[dest + i] = array[cursor2 + i];
      }

      array[dest + length2] = tmp[cursor1];
      return;
    }

    var minGallop = this.minGallop;

    while (true) {
      var count1 = 0;
      var count2 = 0;
      var exit = false;

      do {
        if (compare(array[cursor2], tmp[cursor1]) < 0) {
          array[dest++] = array[cursor2++];
          count2++;
          count1 = 0;

          if (--length2 === 0) {
            exit = true;
            break;
          }
        } else {
          array[dest++] = tmp[cursor1++];
          count1++;
          count2 = 0;

          if (--length1 === 1) {
            exit = true;
            break;
          }
        }
      } while ((count1 | count2) < minGallop);

      if (exit) {
        break;
      }

      do {
        count1 = gallopRight(array[cursor2], tmp, cursor1, length1, 0, compare);

        if (count1 !== 0) {
          for (i = 0; i < count1; i++) {
            array[dest + i] = tmp[cursor1 + i];
          }

          dest += count1;
          cursor1 += count1;
          length1 -= count1;

          if (length1 <= 1) {
            exit = true;
            break;
          }
        }

        array[dest++] = array[cursor2++];

        if (--length2 === 0) {
          exit = true;
          break;
        }

        count2 = gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare);

        if (count2 !== 0) {
          for (i = 0; i < count2; i++) {
            array[dest + i] = array[cursor2 + i];
          }

          dest += count2;
          cursor2 += count2;
          length2 -= count2;

          if (length2 === 0) {
            exit = true;
            break;
          }
        }

        array[dest++] = tmp[cursor1++];

        if (--length1 === 1) {
          exit = true;
          break;
        }

        minGallop--;
      } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);

      if (exit) {
        break;
      }

      if (minGallop < 0) {
        minGallop = 0;
      }

      minGallop += 2;
    }

    this.minGallop = minGallop;

    if (minGallop < 1) {
      this.minGallop = 1;
    }

    if (length1 === 1) {
      for (i = 0; i < length2; i++) {
        array[dest + i] = array[cursor2 + i];
      }

      array[dest + length2] = tmp[cursor1];
    } else if (length1 === 0) {
      throw new Error('mergeLow preconditions were not respected');
    } else {
      for (i = 0; i < length1; i++) {
        array[dest + i] = tmp[cursor1 + i];
      }
    }
  }
  /**
   * Merge two adjacent runs in a stable way. The runs must be such that the
   * first element of run1 is bigger than the first element in run2 and the
   * last element of run1 is greater than all the elements in run2.
   * The method should be called when run1.length > run2.length as it uses
   * TimSort temporary array to store run2. Use mergeLow if run1.length <=
   * run2.length.
   *
   * @param {number} start1 - First element in run1.
   * @param {number} length1 - Length of run1.
   * @param {number} start2 - First element in run2.
   * @param {number} length2 - Length of run2.
   */
  ;

  _proto.mergeHigh = function mergeHigh(start1, length1, start2, length2) {
    var compare = this.compare;
    var array = this.array;
    var tmp = this.tmp;
    var i = 0;

    for (i = 0; i < length2; i++) {
      tmp[i] = array[start2 + i];
    }

    var cursor1 = start1 + length1 - 1;
    var cursor2 = length2 - 1;
    var dest = start2 + length2 - 1;
    var customCursor = 0;
    var customDest = 0;
    array[dest--] = array[cursor1--];

    if (--length1 === 0) {
      customCursor = dest - (length2 - 1);

      for (i = 0; i < length2; i++) {
        array[customCursor + i] = tmp[i];
      }

      return;
    }

    if (length2 === 1) {
      dest -= length1;
      cursor1 -= length1;
      customDest = dest + 1;
      customCursor = cursor1 + 1;

      for (i = length1 - 1; i >= 0; i--) {
        array[customDest + i] = array[customCursor + i];
      }

      array[dest] = tmp[cursor2];
      return;
    }

    var minGallop = this.minGallop;

    while (true) {
      var count1 = 0;
      var count2 = 0;
      var exit = false;

      do {
        if (compare(tmp[cursor2], array[cursor1]) < 0) {
          array[dest--] = array[cursor1--];
          count1++;
          count2 = 0;

          if (--length1 === 0) {
            exit = true;
            break;
          }
        } else {
          array[dest--] = tmp[cursor2--];
          count2++;
          count1 = 0;

          if (--length2 === 1) {
            exit = true;
            break;
          }
        }
      } while ((count1 | count2) < minGallop);

      if (exit) {
        break;
      }

      do {
        count1 = length1 - gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare);

        if (count1 !== 0) {
          dest -= count1;
          cursor1 -= count1;
          length1 -= count1;
          customDest = dest + 1;
          customCursor = cursor1 + 1;

          for (i = count1 - 1; i >= 0; i--) {
            array[customDest + i] = array[customCursor + i];
          }

          if (length1 === 0) {
            exit = true;
            break;
          }
        }

        array[dest--] = tmp[cursor2--];

        if (--length2 === 1) {
          exit = true;
          break;
        }

        count2 = length2 - gallopLeft(array[cursor1], tmp, 0, length2, length2 - 1, compare);

        if (count2 !== 0) {
          dest -= count2;
          cursor2 -= count2;
          length2 -= count2;
          customDest = dest + 1;
          customCursor = cursor2 + 1;

          for (i = 0; i < count2; i++) {
            array[customDest + i] = tmp[customCursor + i];
          }

          if (length2 <= 1) {
            exit = true;
            break;
          }
        }

        array[dest--] = array[cursor1--];

        if (--length1 === 0) {
          exit = true;
          break;
        }

        minGallop--;
      } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);

      if (exit) {
        break;
      }

      if (minGallop < 0) {
        minGallop = 0;
      }

      minGallop += 2;
    }

    this.minGallop = minGallop;

    if (minGallop < 1) {
      this.minGallop = 1;
    }

    if (length2 === 1) {
      dest -= length1;
      cursor1 -= length1;
      customDest = dest + 1;
      customCursor = cursor1 + 1;

      for (i = length1 - 1; i >= 0; i--) {
        array[customDest + i] = array[customCursor + i];
      }

      array[dest] = tmp[cursor2];
    } else if (length2 === 0) {
      throw new Error('mergeHigh preconditions were not respected');
    } else {
      customCursor = dest - (length2 - 1);

      for (i = 0; i < length2; i++) {
        array[customCursor + i] = tmp[i];
      }
    }
  };

  return TimSort;
}();
/**
 * Sort an array in the range [lo, hi) using TimSort.
 *
 * @param {array} array - The array to sort.
 * @param {number} lo - First element in the range (inclusive).
 * @param {number} hi - Last element in the range.
 * @param {function=} compare - Item comparison function. Default is alphabetical.
 */


function _default(array, lo, hi, compare) {
  if (!Array.isArray(array)) {
    throw new TypeError('Can only sort arrays');
  }
  /*
   * Handle the case where a comparison function is not provided. We do
   * lexicographic sorting
   */


  if (lo === undefined) {
    lo = 0;
  }

  if (hi === undefined) {
    hi = array.length;
  }

  if (compare === undefined) {
    compare = alphabeticalCompare;
  }

  var remaining = hi - lo; // The array is already sorted

  if (remaining < 2) {
    return;
  }

  var runLength = 0; // On small arrays binary sort can be used directly

  if (remaining < DEFAULT_MIN_MERGE) {
    runLength = makeAscendingRun(array, lo, hi, compare);
    binaryInsertionSort(array, lo, hi, lo + runLength, compare);
    return;
  }

  var ts = new TimSort(array, compare);
  var minRun = minRunLength(remaining);

  do {
    runLength = makeAscendingRun(array, lo, hi, compare);

    if (runLength < minRun) {
      var force = remaining;

      if (force > minRun) {
        force = minRun;
      }

      binaryInsertionSort(array, lo, lo + force, lo + runLength, compare);
      runLength = force;
    } // Push new run and merge if necessary


    ts.pushRun(lo, runLength);
    ts.mergeRuns(); // Go find next run

    remaining -= runLength;
    lo += runLength;
  } while (remaining !== 0); // Force merging of remaining runs


  ts.forceMergeRuns();
}

module.exports = exports["default"];
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_engine__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS1kZXYvY29jb3MyZC9yZW5kZXJlci9tZW1vcC90aW1zb3J0LmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfTUlOX01FUkdFIiwiREVGQVVMVF9NSU5fR0FMTE9QSU5HIiwiREVGQVVMVF9UTVBfU1RPUkFHRV9MRU5HVEgiLCJQT1dFUlNfT0ZfVEVOIiwibG9nMTAiLCJ4IiwiYWxwaGFiZXRpY2FsQ29tcGFyZSIsImEiLCJiIiwiYWwiLCJibCIsInQiLCJhU3RyIiwiU3RyaW5nIiwiYlN0ciIsIm1pblJ1bkxlbmd0aCIsIm4iLCJyIiwibWFrZUFzY2VuZGluZ1J1biIsImFycmF5IiwibG8iLCJoaSIsImNvbXBhcmUiLCJydW5IaSIsInJldmVyc2VSdW4iLCJiaW5hcnlJbnNlcnRpb25Tb3J0Iiwic3RhcnQiLCJwaXZvdCIsImxlZnQiLCJyaWdodCIsIm1pZCIsImdhbGxvcExlZnQiLCJ2YWx1ZSIsImxlbmd0aCIsImhpbnQiLCJsYXN0T2Zmc2V0IiwibWF4T2Zmc2V0Iiwib2Zmc2V0IiwidG1wIiwibSIsImdhbGxvcFJpZ2h0IiwiVGltU29ydCIsIm1pbkdhbGxvcCIsInRtcFN0b3JhZ2VMZW5ndGgiLCJBcnJheSIsInN0YWNrTGVuZ3RoIiwicnVuU3RhcnQiLCJydW5MZW5ndGgiLCJzdGFja1NpemUiLCJwdXNoUnVuIiwibWVyZ2VSdW5zIiwibWVyZ2VBdCIsImZvcmNlTWVyZ2VSdW5zIiwiaSIsInN0YXJ0MSIsImxlbmd0aDEiLCJzdGFydDIiLCJsZW5ndGgyIiwiayIsIm1lcmdlTG93IiwibWVyZ2VIaWdoIiwiY3Vyc29yMSIsImN1cnNvcjIiLCJkZXN0IiwiY291bnQxIiwiY291bnQyIiwiZXhpdCIsIkVycm9yIiwiY3VzdG9tQ3Vyc29yIiwiY3VzdG9tRGVzdCIsImlzQXJyYXkiLCJUeXBlRXJyb3IiLCJ1bmRlZmluZWQiLCJyZW1haW5pbmciLCJ0cyIsIm1pblJ1biIsImZvcmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7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QUcyQixTQUFyQixFQUFnQ3pCLE9BQWhDLENBQW5CO0FBQ0E7QUFDRDs7QUFFRCxNQUFJb0QsRUFBRSxHQUFHLElBQUlqQyxPQUFKLENBQVl0QixLQUFaLEVBQW1CRyxPQUFuQixDQUFUO0FBRUEsTUFBSXFELE1BQU0sR0FBRzVELFlBQVksQ0FBQzBELFNBQUQsQ0FBekI7O0FBRUEsS0FBRztBQUNEMUIsSUFBQUEsU0FBUyxHQUFHN0IsZ0JBQWdCLENBQUNDLEtBQUQsRUFBUUMsRUFBUixFQUFZQyxFQUFaLEVBQWdCQyxPQUFoQixDQUE1Qjs7QUFDQSxRQUFJeUIsU0FBUyxHQUFHNEIsTUFBaEIsRUFBd0I7QUFDdEIsVUFBSUMsS0FBSyxHQUFHSCxTQUFaOztBQUNBLFVBQUlHLEtBQUssR0FBR0QsTUFBWixFQUFvQjtBQUNsQkMsUUFBQUEsS0FBSyxHQUFHRCxNQUFSO0FBQ0Q7O0FBRURsRCxNQUFBQSxtQkFBbUIsQ0FBQ04sS0FBRCxFQUFRQyxFQUFSLEVBQVlBLEVBQUUsR0FBR3dELEtBQWpCLEVBQXdCeEQsRUFBRSxHQUFHMkIsU0FBN0IsRUFBd0N6QixPQUF4QyxDQUFuQjtBQUNBeUIsTUFBQUEsU0FBUyxHQUFHNkIsS0FBWjtBQUNELEtBVkEsQ0FXRDs7O0FBQ0FGLElBQUFBLEVBQUUsQ0FBQ3pCLE9BQUgsQ0FBVzdCLEVBQVgsRUFBZTJCLFNBQWY7QUFDQTJCLElBQUFBLEVBQUUsQ0FBQ3hCLFNBQUgsR0FiQyxDQWVEOztBQUNBdUIsSUFBQUEsU0FBUyxJQUFJMUIsU0FBYjtBQUNBM0IsSUFBQUEsRUFBRSxJQUFJMkIsU0FBTjtBQUVELEdBbkJELFFBbUJTMEIsU0FBUyxLQUFLLENBbkJ2QixFQXpDK0MsQ0E4RC9DOzs7QUFDQUMsRUFBQUEsRUFBRSxDQUFDdEIsY0FBSDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gcmVmZXJlbmNlOiBodHRwczovL2dpdGh1Yi5jb20vbXppY2NhcmQvbm9kZS10aW1zb3J0XG5cbi8qKlxuICogRGVmYXVsdCBtaW5pbXVtIHNpemUgb2YgYSBydW4uXG4gKi9cbmNvbnN0IERFRkFVTFRfTUlOX01FUkdFID0gMzI7XG5cbi8qKlxuICogTWluaW11bSBvcmRlcmVkIHN1YnNlcXVlY2UgcmVxdWlyZWQgdG8gZG8gZ2FsbG9waW5nLlxuICovXG5jb25zdCBERUZBVUxUX01JTl9HQUxMT1BJTkcgPSA3O1xuXG4vKipcbiAqIERlZmF1bHQgdG1wIHN0b3JhZ2UgbGVuZ3RoLiBDYW4gaW5jcmVhc2UgZGVwZW5kaW5nIG9uIHRoZSBzaXplIG9mIHRoZVxuICogc21hbGxlc3QgcnVuIHRvIG1lcmdlLlxuICovXG5jb25zdCBERUZBVUxUX1RNUF9TVE9SQUdFX0xFTkdUSCA9IDI1NjtcblxuLyoqXG4gKiBQcmUtY29tcHV0ZWQgcG93ZXJzIG9mIDEwIGZvciBlZmZpY2llbnQgbGV4aWNvZ3JhcGhpYyBjb21wYXJpc29uIG9mXG4gKiBzbWFsbCBpbnRlZ2Vycy5cbiAqL1xuY29uc3QgUE9XRVJTX09GX1RFTiA9IFsxZTAsIDFlMSwgMWUyLCAxZTMsIDFlNCwgMWU1LCAxZTYsIDFlNywgMWU4LCAxZTldXG5cbi8qKlxuICogRXN0aW1hdGUgdGhlIGxvZ2FyaXRobSBiYXNlIDEwIG9mIGEgc21hbGwgaW50ZWdlci5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSBpbnRlZ2VyIHRvIGVzdGltYXRlIHRoZSBsb2dhcml0aG0gb2YuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IC0gVGhlIGVzdGltYXRlZCBsb2dhcml0aG0gb2YgdGhlIGludGVnZXIuXG4gKi9cbmZ1bmN0aW9uIGxvZzEwKHgpIHtcbiAgaWYgKHggPCAxZTUpIHtcbiAgICBpZiAoeCA8IDFlMikge1xuICAgICAgcmV0dXJuIHggPCAxZTEgPyAwIDogMTtcbiAgICB9XG5cbiAgICBpZiAoeCA8IDFlNCkge1xuICAgICAgcmV0dXJuIHggPCAxZTMgPyAyIDogMztcbiAgICB9XG5cbiAgICByZXR1cm4gNDtcbiAgfVxuXG4gIGlmICh4IDwgMWU3KSB7XG4gICAgcmV0dXJuIHggPCAxZTYgPyA1IDogNjtcbiAgfVxuXG4gIGlmICh4IDwgMWU5KSB7XG4gICAgcmV0dXJuIHggPCAxZTggPyA3IDogODtcbiAgfVxuXG4gIHJldHVybiA5O1xufVxuXG4vKipcbiAqIERlZmF1bHQgYWxwaGFiZXRpY2FsIGNvbXBhcmlzb24gb2YgaXRlbXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fG51bWJlcn0gYSAtIEZpcnN0IGVsZW1lbnQgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdHxudW1iZXJ9IGIgLSBTZWNvbmQgZWxlbWVudCB0byBjb21wYXJlLlxuICogQHJldHVybiB7bnVtYmVyfSAtIEEgcG9zaXRpdmUgbnVtYmVyIGlmIGEudG9TdHJpbmcoKSA+IGIudG9TdHJpbmcoKSwgYVxuICogbmVnYXRpdmUgbnVtYmVyIGlmIC50b1N0cmluZygpIDwgYi50b1N0cmluZygpLCAwIG90aGVyd2lzZS5cbiAqL1xuZnVuY3Rpb24gYWxwaGFiZXRpY2FsQ29tcGFyZShhLCBiKSB7XG4gIGlmIChhID09PSBiKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAofn5hID09PSBhICYmIH5+YiA9PT0gYikge1xuICAgIGlmIChhID09PSAwIHx8IGIgPT09IDApIHtcbiAgICAgIHJldHVybiBhIDwgYiA/IC0xIDogMTtcbiAgICB9XG5cbiAgICBpZiAoYSA8IDAgfHwgYiA8IDApIHtcbiAgICAgIGlmIChiID49IDApIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuXG4gICAgICBpZiAoYSA+PSAwKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuXG4gICAgICBhID0gLWE7XG4gICAgICBiID0gLWI7XG4gICAgfVxuXG4gICAgY29uc3QgYWwgPSBsb2cxMChhKTtcbiAgICBjb25zdCBibCA9IGxvZzEwKGIpO1xuXG4gICAgbGV0IHQgPSAwO1xuXG4gICAgaWYgKGFsIDwgYmwpIHtcbiAgICAgIGEgKj0gUE9XRVJTX09GX1RFTltibCAtIGFsIC0gMV07XG4gICAgICBiIC89IDEwO1xuICAgICAgdCA9IC0xO1xuICAgIH0gZWxzZSBpZiAoYWwgPiBibCkge1xuICAgICAgYiAqPSBQT1dFUlNfT0ZfVEVOW2FsIC0gYmwgLSAxXTtcbiAgICAgIGEgLz0gMTA7XG4gICAgICB0ID0gMTtcbiAgICB9XG5cbiAgICBpZiAoYSA9PT0gYikge1xuICAgICAgcmV0dXJuIHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGEgPCBiID8gLTEgOiAxO1xuICB9XG5cbiAgbGV0IGFTdHIgPSBTdHJpbmcoYSk7XG4gIGxldCBiU3RyID0gU3RyaW5nKGIpO1xuXG4gIGlmIChhU3RyID09PSBiU3RyKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gYVN0ciA8IGJTdHIgPyAtMSA6IDE7XG59XG5cbi8qKlxuICogQ29tcHV0ZSBtaW5pbXVtIHJ1biBsZW5ndGggZm9yIFRpbVNvcnRcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbiAtIFRoZSBzaXplIG9mIHRoZSBhcnJheSB0byBzb3J0LlxuICovXG5mdW5jdGlvbiBtaW5SdW5MZW5ndGgobikge1xuICBsZXQgciA9IDA7XG5cbiAgd2hpbGUgKG4gPj0gREVGQVVMVF9NSU5fTUVSR0UpIHtcbiAgICByIHw9IChuICYgMSk7XG4gICAgbiA+Pj0gMTtcbiAgfVxuXG4gIHJldHVybiBuICsgcjtcbn1cblxuLyoqXG4gKiBDb3VudHMgdGhlIGxlbmd0aCBvZiBhIG1vbm90b25pY2FsbHkgYXNjZW5kaW5nIG9yIHN0cmljdGx5IG1vbm90b25pY2FsbHlcbiAqIGRlc2NlbmRpbmcgc2VxdWVuY2UgKHJ1bikgc3RhcnRpbmcgYXQgYXJyYXlbbG9dIGluIHRoZSByYW5nZSBbbG8sIGhpKS4gSWZcbiAqIHRoZSBydW4gaXMgZGVzY2VuZGluZyBpdCBpcyBtYWRlIGFzY2VuZGluZy5cbiAqXG4gKiBAcGFyYW0ge2FycmF5fSBhcnJheSAtIFRoZSBhcnJheSB0byByZXZlcnNlLlxuICogQHBhcmFtIHtudW1iZXJ9IGxvIC0gRmlyc3QgZWxlbWVudCBpbiB0aGUgcmFuZ2UgKGluY2x1c2l2ZSkuXG4gKiBAcGFyYW0ge251bWJlcn0gaGkgLSBMYXN0IGVsZW1lbnQgaW4gdGhlIHJhbmdlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyZSAtIEl0ZW0gY29tcGFyaXNvbiBmdW5jdGlvbi5cbiAqIEByZXR1cm4ge251bWJlcn0gLSBUaGUgbGVuZ3RoIG9mIHRoZSBydW4uXG4gKi9cbmZ1bmN0aW9uIG1ha2VBc2NlbmRpbmdSdW4oYXJyYXksIGxvLCBoaSwgY29tcGFyZSkge1xuICBsZXQgcnVuSGkgPSBsbyArIDE7XG5cbiAgaWYgKHJ1bkhpID09PSBoaSkge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgLy8gRGVzY2VuZGluZ1xuICBpZiAoY29tcGFyZShhcnJheVtydW5IaSsrXSwgYXJyYXlbbG9dKSA8IDApIHtcbiAgICB3aGlsZSAocnVuSGkgPCBoaSAmJiBjb21wYXJlKGFycmF5W3J1bkhpXSwgYXJyYXlbcnVuSGkgLSAxXSkgPCAwKSB7XG4gICAgICBydW5IaSsrO1xuICAgIH1cblxuICAgIHJldmVyc2VSdW4oYXJyYXksIGxvLCBydW5IaSk7XG4gICAgLy8gQXNjZW5kaW5nXG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHJ1bkhpIDwgaGkgJiYgY29tcGFyZShhcnJheVtydW5IaV0sIGFycmF5W3J1bkhpIC0gMV0pID49IDApIHtcbiAgICAgIHJ1bkhpKys7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJ1bkhpIC0gbG87XG59XG5cbi8qKlxuICogUmV2ZXJzZSBhbiBhcnJheSBpbiB0aGUgcmFuZ2UgW2xvLCBoaSkuXG4gKlxuICogQHBhcmFtIHthcnJheX0gYXJyYXkgLSBUaGUgYXJyYXkgdG8gcmV2ZXJzZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsbyAtIEZpcnN0IGVsZW1lbnQgaW4gdGhlIHJhbmdlIChpbmNsdXNpdmUpLlxuICogQHBhcmFtIHtudW1iZXJ9IGhpIC0gTGFzdCBlbGVtZW50IGluIHRoZSByYW5nZS5cbiAqL1xuZnVuY3Rpb24gcmV2ZXJzZVJ1bihhcnJheSwgbG8sIGhpKSB7XG4gIGhpLS07XG5cbiAgd2hpbGUgKGxvIDwgaGkpIHtcbiAgICBsZXQgdCA9IGFycmF5W2xvXTtcbiAgICBhcnJheVtsbysrXSA9IGFycmF5W2hpXTtcbiAgICBhcnJheVtoaS0tXSA9IHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBQZXJmb3JtIHRoZSBiaW5hcnkgc29ydCBvZiB0aGUgYXJyYXkgaW4gdGhlIHJhbmdlIFtsbywgaGkpIHdoZXJlIHN0YXJ0IGlzXG4gKiB0aGUgZmlyc3QgZWxlbWVudCBwb3NzaWJseSBvdXQgb2Ygb3JkZXIuXG4gKlxuICogQHBhcmFtIHthcnJheX0gYXJyYXkgLSBUaGUgYXJyYXkgdG8gc29ydC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsbyAtIEZpcnN0IGVsZW1lbnQgaW4gdGhlIHJhbmdlIChpbmNsdXNpdmUpLlxuICogQHBhcmFtIHtudW1iZXJ9IGhpIC0gTGFzdCBlbGVtZW50IGluIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCAtIEZpcnN0IGVsZW1lbnQgcG9zc2libHkgb3V0IG9mIG9yZGVyLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyZSAtIEl0ZW0gY29tcGFyaXNvbiBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmluYXJ5SW5zZXJ0aW9uU29ydChhcnJheSwgbG8sIGhpLCBzdGFydCwgY29tcGFyZSkge1xuICBpZiAoc3RhcnQgPT09IGxvKSB7XG4gICAgc3RhcnQrKztcbiAgfVxuXG4gIGZvciAoOyBzdGFydCA8IGhpOyBzdGFydCsrKSB7XG4gICAgbGV0IHBpdm90ID0gYXJyYXlbc3RhcnRdO1xuXG4gICAgLy8gUmFuZ2VzIG9mIHRoZSBhcnJheSB3aGVyZSBwaXZvdCBiZWxvbmdzXG4gICAgbGV0IGxlZnQgPSBsbztcbiAgICBsZXQgcmlnaHQgPSBzdGFydDtcblxuICAgIC8qXG4gICAgICogICBwaXZvdCA+PSBhcnJheVtpXSBmb3IgaSBpbiBbbG8sIGxlZnQpXG4gICAgICogICBwaXZvdCA8ICBhcnJheVtpXSBmb3IgaSBpbiAgaW4gW3JpZ2h0LCBzdGFydClcbiAgICAgKi9cbiAgICB3aGlsZSAobGVmdCA8IHJpZ2h0KSB7XG4gICAgICBsZXQgbWlkID0gKGxlZnQgKyByaWdodCkgPj4+IDE7XG5cbiAgICAgIGlmIChjb21wYXJlKHBpdm90LCBhcnJheVttaWRdKSA8IDApIHtcbiAgICAgICAgcmlnaHQgPSBtaWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0ID0gbWlkICsgMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE1vdmUgZWxlbWVudHMgcmlnaHQgdG8gbWFrZSByb29tIGZvciB0aGUgcGl2b3QuIElmIHRoZXJlIGFyZSBlbGVtZW50c1xuICAgICAqIGVxdWFsIHRvIHBpdm90LCBsZWZ0IHBvaW50cyB0byB0aGUgZmlyc3Qgc2xvdCBhZnRlciB0aGVtOiB0aGlzIGlzIGFsc29cbiAgICAgKiBhIHJlYXNvbiBmb3Igd2hpY2ggVGltU29ydCBpcyBzdGFibGVcbiAgICAgKi9cbiAgICBsZXQgbiA9IHN0YXJ0IC0gbGVmdDtcbiAgICAvLyBTd2l0Y2ggaXMganVzdCBhbiBvcHRpbWl6YXRpb24gZm9yIHNtYWxsIGFycmF5c1xuICAgIHN3aXRjaCAobikge1xuICAgICAgY2FzZSAzOlxuICAgICAgICBhcnJheVtsZWZ0ICsgM10gPSBhcnJheVtsZWZ0ICsgMl07XG4gICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICBjYXNlIDI6XG4gICAgICAgIGFycmF5W2xlZnQgKyAyXSA9IGFycmF5W2xlZnQgKyAxXTtcbiAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgYXJyYXlbbGVmdCArIDFdID0gYXJyYXlbbGVmdF07XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgd2hpbGUgKG4gPiAwKSB7XG4gICAgICAgICAgYXJyYXlbbGVmdCArIG5dID0gYXJyYXlbbGVmdCArIG4gLSAxXTtcbiAgICAgICAgICBuLS07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcnJheVtsZWZ0XSA9IHBpdm90O1xuICB9XG59XG5cbi8qKlxuICogRmluZCB0aGUgcG9zaXRpb24gYXQgd2hpY2ggdG8gaW5zZXJ0IGEgdmFsdWUgaW4gYSBzb3J0ZWQgcmFuZ2UuIElmIHRoZSByYW5nZVxuICogY29udGFpbnMgZWxlbWVudHMgZXF1YWwgdG8gdGhlIHZhbHVlIHRoZSBsZWZ0bW9zdCBlbGVtZW50IGluZGV4IGlzIHJldHVybmVkXG4gKiAoZm9yIHN0YWJpbGl0eSkuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gVmFsdWUgdG8gaW5zZXJ0LlxuICogQHBhcmFtIHthcnJheX0gYXJyYXkgLSBUaGUgYXJyYXkgaW4gd2hpY2ggdG8gaW5zZXJ0IHZhbHVlLlxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IC0gRmlyc3QgZWxlbWVudCBpbiB0aGUgcmFuZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gTGVuZ3RoIG9mIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBoaW50IC0gVGhlIGluZGV4IGF0IHdoaWNoIHRvIGJlZ2luIHRoZSBzZWFyY2guXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb21wYXJlIC0gSXRlbSBjb21wYXJpc29uIGZ1bmN0aW9uLlxuICogQHJldHVybiB7bnVtYmVyfSAtIFRoZSBpbmRleCB3aGVyZSB0byBpbnNlcnQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdhbGxvcExlZnQodmFsdWUsIGFycmF5LCBzdGFydCwgbGVuZ3RoLCBoaW50LCBjb21wYXJlKSB7XG4gIGxldCBsYXN0T2Zmc2V0ID0gMDtcbiAgbGV0IG1heE9mZnNldCA9IDA7XG4gIGxldCBvZmZzZXQgPSAxO1xuXG4gIGlmIChjb21wYXJlKHZhbHVlLCBhcnJheVtzdGFydCArIGhpbnRdKSA+IDApIHtcbiAgICBtYXhPZmZzZXQgPSBsZW5ndGggLSBoaW50O1xuXG4gICAgd2hpbGUgKG9mZnNldCA8IG1heE9mZnNldCAmJiBjb21wYXJlKHZhbHVlLCBhcnJheVtzdGFydCArIGhpbnQgKyBvZmZzZXRdKSA+IDApIHtcbiAgICAgIGxhc3RPZmZzZXQgPSBvZmZzZXQ7XG4gICAgICBvZmZzZXQgPSAob2Zmc2V0IDw8IDEpICsgMTtcblxuICAgICAgaWYgKG9mZnNldCA8PSAwKSB7XG4gICAgICAgIG9mZnNldCA9IG1heE9mZnNldDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob2Zmc2V0ID4gbWF4T2Zmc2V0KSB7XG4gICAgICBvZmZzZXQgPSBtYXhPZmZzZXQ7XG4gICAgfVxuXG4gICAgLy8gTWFrZSBvZmZzZXRzIHJlbGF0aXZlIHRvIHN0YXJ0XG4gICAgbGFzdE9mZnNldCArPSBoaW50O1xuICAgIG9mZnNldCArPSBoaW50O1xuXG4gICAgLy8gdmFsdWUgPD0gYXJyYXlbc3RhcnQgKyBoaW50XVxuICB9IGVsc2Uge1xuICAgIG1heE9mZnNldCA9IGhpbnQgKyAxO1xuICAgIHdoaWxlIChvZmZzZXQgPCBtYXhPZmZzZXQgJiYgY29tcGFyZSh2YWx1ZSwgYXJyYXlbc3RhcnQgKyBoaW50IC0gb2Zmc2V0XSkgPD0gMCkge1xuICAgICAgbGFzdE9mZnNldCA9IG9mZnNldDtcbiAgICAgIG9mZnNldCA9IChvZmZzZXQgPDwgMSkgKyAxO1xuXG4gICAgICBpZiAob2Zmc2V0IDw9IDApIHtcbiAgICAgICAgb2Zmc2V0ID0gbWF4T2Zmc2V0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob2Zmc2V0ID4gbWF4T2Zmc2V0KSB7XG4gICAgICBvZmZzZXQgPSBtYXhPZmZzZXQ7XG4gICAgfVxuXG4gICAgLy8gTWFrZSBvZmZzZXRzIHJlbGF0aXZlIHRvIHN0YXJ0XG4gICAgbGV0IHRtcCA9IGxhc3RPZmZzZXQ7XG4gICAgbGFzdE9mZnNldCA9IGhpbnQgLSBvZmZzZXQ7XG4gICAgb2Zmc2V0ID0gaGludCAtIHRtcDtcbiAgfVxuXG4gIC8qXG4gICAqIE5vdyBhcnJheVtzdGFydCtsYXN0T2Zmc2V0XSA8IHZhbHVlIDw9IGFycmF5W3N0YXJ0K29mZnNldF0sIHNvIHZhbHVlXG4gICAqIGJlbG9uZ3Mgc29tZXdoZXJlIGluIHRoZSByYW5nZSAoc3RhcnQgKyBsYXN0T2Zmc2V0LCBzdGFydCArIG9mZnNldF0uIERvIGFcbiAgICogYmluYXJ5IHNlYXJjaCwgd2l0aCBpbnZhcmlhbnQgYXJyYXlbc3RhcnQgKyBsYXN0T2Zmc2V0IC0gMV0gPCB2YWx1ZSA8PVxuICAgKiBhcnJheVtzdGFydCArIG9mZnNldF0uXG4gICAqL1xuICBsYXN0T2Zmc2V0Kys7XG4gIHdoaWxlIChsYXN0T2Zmc2V0IDwgb2Zmc2V0KSB7XG4gICAgbGV0IG0gPSBsYXN0T2Zmc2V0ICsgKChvZmZzZXQgLSBsYXN0T2Zmc2V0KSA+Pj4gMSk7XG5cbiAgICBpZiAoY29tcGFyZSh2YWx1ZSwgYXJyYXlbc3RhcnQgKyBtXSkgPiAwKSB7XG4gICAgICBsYXN0T2Zmc2V0ID0gbSArIDE7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgb2Zmc2V0ID0gbTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9mZnNldDtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBwb3NpdGlvbiBhdCB3aGljaCB0byBpbnNlcnQgYSB2YWx1ZSBpbiBhIHNvcnRlZCByYW5nZS4gSWYgdGhlIHJhbmdlXG4gKiBjb250YWlucyBlbGVtZW50cyBlcXVhbCB0byB0aGUgdmFsdWUgdGhlIHJpZ2h0bW9zdCBlbGVtZW50IGluZGV4IGlzIHJldHVybmVkXG4gKiAoZm9yIHN0YWJpbGl0eSkuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gVmFsdWUgdG8gaW5zZXJ0LlxuICogQHBhcmFtIHthcnJheX0gYXJyYXkgLSBUaGUgYXJyYXkgaW4gd2hpY2ggdG8gaW5zZXJ0IHZhbHVlLlxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IC0gRmlyc3QgZWxlbWVudCBpbiB0aGUgcmFuZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gTGVuZ3RoIG9mIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBoaW50IC0gVGhlIGluZGV4IGF0IHdoaWNoIHRvIGJlZ2luIHRoZSBzZWFyY2guXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb21wYXJlIC0gSXRlbSBjb21wYXJpc29uIGZ1bmN0aW9uLlxuICogQHJldHVybiB7bnVtYmVyfSAtIFRoZSBpbmRleCB3aGVyZSB0byBpbnNlcnQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdhbGxvcFJpZ2h0KHZhbHVlLCBhcnJheSwgc3RhcnQsIGxlbmd0aCwgaGludCwgY29tcGFyZSkge1xuICBsZXQgbGFzdE9mZnNldCA9IDA7XG4gIGxldCBtYXhPZmZzZXQgPSAwO1xuICBsZXQgb2Zmc2V0ID0gMTtcblxuICBpZiAoY29tcGFyZSh2YWx1ZSwgYXJyYXlbc3RhcnQgKyBoaW50XSkgPCAwKSB7XG4gICAgbWF4T2Zmc2V0ID0gaGludCArIDE7XG5cbiAgICB3aGlsZSAob2Zmc2V0IDwgbWF4T2Zmc2V0ICYmIGNvbXBhcmUodmFsdWUsIGFycmF5W3N0YXJ0ICsgaGludCAtIG9mZnNldF0pIDwgMCkge1xuICAgICAgbGFzdE9mZnNldCA9IG9mZnNldDtcbiAgICAgIG9mZnNldCA9IChvZmZzZXQgPDwgMSkgKyAxO1xuXG4gICAgICBpZiAob2Zmc2V0IDw9IDApIHtcbiAgICAgICAgb2Zmc2V0ID0gbWF4T2Zmc2V0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvZmZzZXQgPiBtYXhPZmZzZXQpIHtcbiAgICAgIG9mZnNldCA9IG1heE9mZnNldDtcbiAgICB9XG5cbiAgICAvLyBNYWtlIG9mZnNldHMgcmVsYXRpdmUgdG8gc3RhcnRcbiAgICBsZXQgdG1wID0gbGFzdE9mZnNldDtcbiAgICBsYXN0T2Zmc2V0ID0gaGludCAtIG9mZnNldDtcbiAgICBvZmZzZXQgPSBoaW50IC0gdG1wO1xuXG4gICAgLy8gdmFsdWUgPj0gYXJyYXlbc3RhcnQgKyBoaW50XVxuICB9IGVsc2Uge1xuICAgIG1heE9mZnNldCA9IGxlbmd0aCAtIGhpbnQ7XG5cbiAgICB3aGlsZSAob2Zmc2V0IDwgbWF4T2Zmc2V0ICYmIGNvbXBhcmUodmFsdWUsIGFycmF5W3N0YXJ0ICsgaGludCArIG9mZnNldF0pID49IDApIHtcbiAgICAgIGxhc3RPZmZzZXQgPSBvZmZzZXQ7XG4gICAgICBvZmZzZXQgPSAob2Zmc2V0IDw8IDEpICsgMTtcblxuICAgICAgaWYgKG9mZnNldCA8PSAwKSB7XG4gICAgICAgIG9mZnNldCA9IG1heE9mZnNldDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob2Zmc2V0ID4gbWF4T2Zmc2V0KSB7XG4gICAgICBvZmZzZXQgPSBtYXhPZmZzZXQ7XG4gICAgfVxuXG4gICAgLy8gTWFrZSBvZmZzZXRzIHJlbGF0aXZlIHRvIHN0YXJ0XG4gICAgbGFzdE9mZnNldCArPSBoaW50O1xuICAgIG9mZnNldCArPSBoaW50O1xuICB9XG5cbiAgLypcbiAgICogTm93IGFycmF5W3N0YXJ0K2xhc3RPZmZzZXRdIDwgdmFsdWUgPD0gYXJyYXlbc3RhcnQrb2Zmc2V0XSwgc28gdmFsdWVcbiAgICogYmVsb25ncyBzb21ld2hlcmUgaW4gdGhlIHJhbmdlIChzdGFydCArIGxhc3RPZmZzZXQsIHN0YXJ0ICsgb2Zmc2V0XS4gRG8gYVxuICAgKiBiaW5hcnkgc2VhcmNoLCB3aXRoIGludmFyaWFudCBhcnJheVtzdGFydCArIGxhc3RPZmZzZXQgLSAxXSA8IHZhbHVlIDw9XG4gICAqIGFycmF5W3N0YXJ0ICsgb2Zmc2V0XS5cbiAgICovXG4gIGxhc3RPZmZzZXQrKztcblxuICB3aGlsZSAobGFzdE9mZnNldCA8IG9mZnNldCkge1xuICAgIGxldCBtID0gbGFzdE9mZnNldCArICgob2Zmc2V0IC0gbGFzdE9mZnNldCkgPj4+IDEpO1xuXG4gICAgaWYgKGNvbXBhcmUodmFsdWUsIGFycmF5W3N0YXJ0ICsgbV0pIDwgMCkge1xuICAgICAgb2Zmc2V0ID0gbTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBsYXN0T2Zmc2V0ID0gbSArIDE7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9mZnNldDtcbn1cblxuY2xhc3MgVGltU29ydCB7XG5cbiAgY29uc3RydWN0b3IoYXJyYXksIGNvbXBhcmUpIHtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG4gICAgdGhpcy5jb21wYXJlID0gY29tcGFyZTtcbiAgICB0aGlzLm1pbkdhbGxvcCA9IERFRkFVTFRfTUlOX0dBTExPUElORztcbiAgICB0aGlzLmxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICAgIHRoaXMudG1wU3RvcmFnZUxlbmd0aCA9IERFRkFVTFRfVE1QX1NUT1JBR0VfTEVOR1RIO1xuICAgIGlmICh0aGlzLmxlbmd0aCA8IDIgKiBERUZBVUxUX1RNUF9TVE9SQUdFX0xFTkdUSCkge1xuICAgICAgdGhpcy50bXBTdG9yYWdlTGVuZ3RoID0gdGhpcy5sZW5ndGggPj4+IDE7XG4gICAgfVxuXG4gICAgdGhpcy50bXAgPSBuZXcgQXJyYXkodGhpcy50bXBTdG9yYWdlTGVuZ3RoKTtcblxuICAgIHRoaXMuc3RhY2tMZW5ndGggPVxuICAgICAgKHRoaXMubGVuZ3RoIDwgMTIwID8gNSA6XG4gICAgICAgIHRoaXMubGVuZ3RoIDwgMTU0MiA/IDEwIDpcbiAgICAgICAgICB0aGlzLmxlbmd0aCA8IDExOTE1MSA/IDE5IDogNDApO1xuXG4gICAgdGhpcy5ydW5TdGFydCA9IG5ldyBBcnJheSh0aGlzLnN0YWNrTGVuZ3RoKTtcbiAgICB0aGlzLnJ1bkxlbmd0aCA9IG5ldyBBcnJheSh0aGlzLnN0YWNrTGVuZ3RoKTtcbiAgICB0aGlzLnN0YWNrU2l6ZSA9IDA7XG4gIH1cblxuICAvKipcbiAgICogUHVzaCBhIG5ldyBydW4gb24gVGltU29ydCdzIHN0YWNrLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gcnVuU3RhcnQgLSBTdGFydCBpbmRleCBvZiB0aGUgcnVuIGluIHRoZSBvcmlnaW5hbCBhcnJheS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHJ1bkxlbmd0aCAtIExlbmd0aCBvZiB0aGUgcnVuO1xuICAgKi9cbiAgcHVzaFJ1bihydW5TdGFydCwgcnVuTGVuZ3RoKSB7XG4gICAgdGhpcy5ydW5TdGFydFt0aGlzLnN0YWNrU2l6ZV0gPSBydW5TdGFydDtcbiAgICB0aGlzLnJ1bkxlbmd0aFt0aGlzLnN0YWNrU2l6ZV0gPSBydW5MZW5ndGg7XG4gICAgdGhpcy5zdGFja1NpemUgKz0gMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXJnZSBydW5zIG9uIFRpbVNvcnQncyBzdGFjayBzbyB0aGF0IHRoZSBmb2xsb3dpbmcgaG9sZHMgZm9yIGFsbCBpOlxuICAgKiAxKSBydW5MZW5ndGhbaSAtIDNdID4gcnVuTGVuZ3RoW2kgLSAyXSArIHJ1bkxlbmd0aFtpIC0gMV1cbiAgICogMikgcnVuTGVuZ3RoW2kgLSAyXSA+IHJ1bkxlbmd0aFtpIC0gMV1cbiAgICovXG4gIG1lcmdlUnVucygpIHtcbiAgICB3aGlsZSAodGhpcy5zdGFja1NpemUgPiAxKSB7XG4gICAgICBsZXQgbiA9IHRoaXMuc3RhY2tTaXplIC0gMjtcblxuICAgICAgaWYgKChuID49IDEgJiZcbiAgICAgICAgdGhpcy5ydW5MZW5ndGhbbiAtIDFdIDw9IHRoaXMucnVuTGVuZ3RoW25dICsgdGhpcy5ydW5MZW5ndGhbbiArIDFdKSB8fFxuICAgICAgICAobiA+PSAyICYmXG4gICAgICAgIHRoaXMucnVuTGVuZ3RoW24gLSAyXSA8PSB0aGlzLnJ1bkxlbmd0aFtuXSArIHRoaXMucnVuTGVuZ3RoW24gLSAxXSkpIHtcblxuICAgICAgICBpZiAodGhpcy5ydW5MZW5ndGhbbiAtIDFdIDwgdGhpcy5ydW5MZW5ndGhbbiArIDFdKSB7XG4gICAgICAgICAgbi0tO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5ydW5MZW5ndGhbbl0gPiB0aGlzLnJ1bkxlbmd0aFtuICsgMV0pIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICB0aGlzLm1lcmdlQXQobik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlIGFsbCBydW5zIG9uIFRpbVNvcnQncyBzdGFjayB1bnRpbCBvbmx5IG9uZSByZW1haW5zLlxuICAgKi9cbiAgZm9yY2VNZXJnZVJ1bnMoKSB7XG4gICAgd2hpbGUgKHRoaXMuc3RhY2tTaXplID4gMSkge1xuICAgICAgbGV0IG4gPSB0aGlzLnN0YWNrU2l6ZSAtIDI7XG5cbiAgICAgIGlmIChuID4gMCAmJiB0aGlzLnJ1bkxlbmd0aFtuIC0gMV0gPCB0aGlzLnJ1bkxlbmd0aFtuICsgMV0pIHtcbiAgICAgICAgbi0tO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm1lcmdlQXQobik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlIHRoZSBydW5zIG9uIHRoZSBzdGFjayBhdCBwb3NpdGlvbnMgaSBhbmQgaSsxLiBNdXN0IGJlIGFsd2F5cyBiZSBjYWxsZWRcbiAgICogd2l0aCBpPXN0YWNrU2l6ZS0yIG9yIGk9c3RhY2tTaXplLTMgKHRoYXQgaXMsIHdlIG1lcmdlIG9uIHRvcCBvZiB0aGUgc3RhY2spLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gaSAtIEluZGV4IG9mIHRoZSBydW4gdG8gbWVyZ2UgaW4gVGltU29ydCdzIHN0YWNrLlxuICAgKi9cbiAgbWVyZ2VBdChpKSB7XG4gICAgbGV0IGNvbXBhcmUgPSB0aGlzLmNvbXBhcmU7XG4gICAgbGV0IGFycmF5ID0gdGhpcy5hcnJheTtcblxuICAgIGxldCBzdGFydDEgPSB0aGlzLnJ1blN0YXJ0W2ldO1xuICAgIGxldCBsZW5ndGgxID0gdGhpcy5ydW5MZW5ndGhbaV07XG4gICAgbGV0IHN0YXJ0MiA9IHRoaXMucnVuU3RhcnRbaSArIDFdO1xuICAgIGxldCBsZW5ndGgyID0gdGhpcy5ydW5MZW5ndGhbaSArIDFdO1xuXG4gICAgdGhpcy5ydW5MZW5ndGhbaV0gPSBsZW5ndGgxICsgbGVuZ3RoMjtcblxuICAgIGlmIChpID09PSB0aGlzLnN0YWNrU2l6ZSAtIDMpIHtcbiAgICAgIHRoaXMucnVuU3RhcnRbaSArIDFdID0gdGhpcy5ydW5TdGFydFtpICsgMl07XG4gICAgICB0aGlzLnJ1bkxlbmd0aFtpICsgMV0gPSB0aGlzLnJ1bkxlbmd0aFtpICsgMl07XG4gICAgfVxuXG4gICAgdGhpcy5zdGFja1NpemUtLTtcblxuICAgIC8qXG4gICAgICogRmluZCB3aGVyZSB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgc2Vjb25kIHJ1biBnb2VzIGluIHJ1bjEuIFByZXZpb3VzXG4gICAgICogZWxlbWVudHMgaW4gcnVuMSBhcmUgYWxyZWFkeSBpbiBwbGFjZVxuICAgICAqL1xuICAgIGxldCBrID0gZ2FsbG9wUmlnaHQoYXJyYXlbc3RhcnQyXSwgYXJyYXksIHN0YXJ0MSwgbGVuZ3RoMSwgMCwgY29tcGFyZSk7XG4gICAgc3RhcnQxICs9IGs7XG4gICAgbGVuZ3RoMSAtPSBrO1xuXG4gICAgaWYgKGxlbmd0aDEgPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEZpbmQgd2hlcmUgdGhlIGxhc3QgZWxlbWVudCBpbiB0aGUgZmlyc3QgcnVuIGdvZXMgaW4gcnVuMi4gTmV4dCBlbGVtZW50c1xuICAgICAqIGluIHJ1bjIgYXJlIGFscmVhZHkgaW4gcGxhY2VcbiAgICAgKi9cbiAgICBsZW5ndGgyID0gZ2FsbG9wTGVmdChhcnJheVtzdGFydDEgKyBsZW5ndGgxIC0gMV0sIGFycmF5LCBzdGFydDIsIGxlbmd0aDIsIGxlbmd0aDIgLSAxLCBjb21wYXJlKTtcblxuICAgIGlmIChsZW5ndGgyID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBNZXJnZSByZW1haW5pbmcgcnVucy4gQSB0bXAgYXJyYXkgd2l0aCBsZW5ndGggPSBtaW4obGVuZ3RoMSwgbGVuZ3RoMikgaXNcbiAgICAgKiB1c2VkXG4gICAgICovXG4gICAgaWYgKGxlbmd0aDEgPD0gbGVuZ3RoMikge1xuICAgICAgdGhpcy5tZXJnZUxvdyhzdGFydDEsIGxlbmd0aDEsIHN0YXJ0MiwgbGVuZ3RoMik7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tZXJnZUhpZ2goc3RhcnQxLCBsZW5ndGgxLCBzdGFydDIsIGxlbmd0aDIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNZXJnZSB0d28gYWRqYWNlbnQgcnVucyBpbiBhIHN0YWJsZSB3YXkuIFRoZSBydW5zIG11c3QgYmUgc3VjaCB0aGF0IHRoZVxuICAgKiBmaXJzdCBlbGVtZW50IG9mIHJ1bjEgaXMgYmlnZ2VyIHRoYW4gdGhlIGZpcnN0IGVsZW1lbnQgaW4gcnVuMiBhbmQgdGhlXG4gICAqIGxhc3QgZWxlbWVudCBvZiBydW4xIGlzIGdyZWF0ZXIgdGhhbiBhbGwgdGhlIGVsZW1lbnRzIGluIHJ1bjIuXG4gICAqIFRoZSBtZXRob2Qgc2hvdWxkIGJlIGNhbGxlZCB3aGVuIHJ1bjEubGVuZ3RoIDw9IHJ1bjIubGVuZ3RoIGFzIGl0IHVzZXNcbiAgICogVGltU29ydCB0ZW1wb3JhcnkgYXJyYXkgdG8gc3RvcmUgcnVuMS4gVXNlIG1lcmdlSGlnaCBpZiBydW4xLmxlbmd0aCA+XG4gICAqIHJ1bjIubGVuZ3RoLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnQxIC0gRmlyc3QgZWxlbWVudCBpbiBydW4xLlxuICAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoMSAtIExlbmd0aCBvZiBydW4xLlxuICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnQyIC0gRmlyc3QgZWxlbWVudCBpbiBydW4yLlxuICAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoMiAtIExlbmd0aCBvZiBydW4yLlxuICAgKi9cbiAgbWVyZ2VMb3coc3RhcnQxLCBsZW5ndGgxLCBzdGFydDIsIGxlbmd0aDIpIHtcblxuICAgIGxldCBjb21wYXJlID0gdGhpcy5jb21wYXJlO1xuICAgIGxldCBhcnJheSA9IHRoaXMuYXJyYXk7XG4gICAgbGV0IHRtcCA9IHRoaXMudG1wO1xuICAgIGxldCBpID0gMDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGgxOyBpKyspIHtcbiAgICAgIHRtcFtpXSA9IGFycmF5W3N0YXJ0MSArIGldO1xuICAgIH1cblxuICAgIGxldCBjdXJzb3IxID0gMDtcbiAgICBsZXQgY3Vyc29yMiA9IHN0YXJ0MjtcbiAgICBsZXQgZGVzdCA9IHN0YXJ0MTtcblxuICAgIGFycmF5W2Rlc3QrK10gPSBhcnJheVtjdXJzb3IyKytdO1xuXG4gICAgaWYgKC0tbGVuZ3RoMiA9PT0gMCkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDE7IGkrKykge1xuICAgICAgICBhcnJheVtkZXN0ICsgaV0gPSB0bXBbY3Vyc29yMSArIGldO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChsZW5ndGgxID09PSAxKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoMjsgaSsrKSB7XG4gICAgICAgIGFycmF5W2Rlc3QgKyBpXSA9IGFycmF5W2N1cnNvcjIgKyBpXTtcbiAgICAgIH1cbiAgICAgIGFycmF5W2Rlc3QgKyBsZW5ndGgyXSA9IHRtcFtjdXJzb3IxXTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgbWluR2FsbG9wID0gdGhpcy5taW5HYWxsb3A7XG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgbGV0IGNvdW50MSA9IDA7XG4gICAgICBsZXQgY291bnQyID0gMDtcbiAgICAgIGxldCBleGl0ID0gZmFsc2U7XG5cbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKGNvbXBhcmUoYXJyYXlbY3Vyc29yMl0sIHRtcFtjdXJzb3IxXSkgPCAwKSB7XG4gICAgICAgICAgYXJyYXlbZGVzdCsrXSA9IGFycmF5W2N1cnNvcjIrK107XG4gICAgICAgICAgY291bnQyKys7XG4gICAgICAgICAgY291bnQxID0gMDtcblxuICAgICAgICAgIGlmICgtLWxlbmd0aDIgPT09IDApIHtcbiAgICAgICAgICAgIGV4aXQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJyYXlbZGVzdCsrXSA9IHRtcFtjdXJzb3IxKytdO1xuICAgICAgICAgIGNvdW50MSsrO1xuICAgICAgICAgIGNvdW50MiA9IDA7XG4gICAgICAgICAgaWYgKC0tbGVuZ3RoMSA9PT0gMSkge1xuICAgICAgICAgICAgZXhpdCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKChjb3VudDEgfCBjb3VudDIpIDwgbWluR2FsbG9wKTtcblxuICAgICAgaWYgKGV4aXQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGRvIHtcbiAgICAgICAgY291bnQxID0gZ2FsbG9wUmlnaHQoYXJyYXlbY3Vyc29yMl0sIHRtcCwgY3Vyc29yMSwgbGVuZ3RoMSwgMCwgY29tcGFyZSk7XG5cbiAgICAgICAgaWYgKGNvdW50MSAhPT0gMCkge1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb3VudDE7IGkrKykge1xuICAgICAgICAgICAgYXJyYXlbZGVzdCArIGldID0gdG1wW2N1cnNvcjEgKyBpXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkZXN0ICs9IGNvdW50MTtcbiAgICAgICAgICBjdXJzb3IxICs9IGNvdW50MTtcbiAgICAgICAgICBsZW5ndGgxIC09IGNvdW50MTtcbiAgICAgICAgICBpZiAobGVuZ3RoMSA8PSAxKSB7XG4gICAgICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFycmF5W2Rlc3QrK10gPSBhcnJheVtjdXJzb3IyKytdO1xuXG4gICAgICAgIGlmICgtLWxlbmd0aDIgPT09IDApIHtcbiAgICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvdW50MiA9IGdhbGxvcExlZnQodG1wW2N1cnNvcjFdLCBhcnJheSwgY3Vyc29yMiwgbGVuZ3RoMiwgMCwgY29tcGFyZSk7XG5cbiAgICAgICAgaWYgKGNvdW50MiAhPT0gMCkge1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb3VudDI7IGkrKykge1xuICAgICAgICAgICAgYXJyYXlbZGVzdCArIGldID0gYXJyYXlbY3Vyc29yMiArIGldO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRlc3QgKz0gY291bnQyO1xuICAgICAgICAgIGN1cnNvcjIgKz0gY291bnQyO1xuICAgICAgICAgIGxlbmd0aDIgLT0gY291bnQyO1xuXG4gICAgICAgICAgaWYgKGxlbmd0aDIgPT09IDApIHtcbiAgICAgICAgICAgIGV4aXQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFycmF5W2Rlc3QrK10gPSB0bXBbY3Vyc29yMSsrXTtcblxuICAgICAgICBpZiAoLS1sZW5ndGgxID09PSAxKSB7XG4gICAgICAgICAgZXhpdCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBtaW5HYWxsb3AtLTtcblxuICAgICAgfSB3aGlsZSAoY291bnQxID49IERFRkFVTFRfTUlOX0dBTExPUElORyB8fCBjb3VudDIgPj0gREVGQVVMVF9NSU5fR0FMTE9QSU5HKTtcblxuICAgICAgaWYgKGV4aXQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChtaW5HYWxsb3AgPCAwKSB7XG4gICAgICAgIG1pbkdhbGxvcCA9IDA7XG4gICAgICB9XG5cbiAgICAgIG1pbkdhbGxvcCArPSAyO1xuICAgIH1cblxuICAgIHRoaXMubWluR2FsbG9wID0gbWluR2FsbG9wO1xuXG4gICAgaWYgKG1pbkdhbGxvcCA8IDEpIHtcbiAgICAgIHRoaXMubWluR2FsbG9wID0gMTtcbiAgICB9XG5cbiAgICBpZiAobGVuZ3RoMSA9PT0gMSkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDI7IGkrKykge1xuICAgICAgICBhcnJheVtkZXN0ICsgaV0gPSBhcnJheVtjdXJzb3IyICsgaV07XG4gICAgICB9XG4gICAgICBhcnJheVtkZXN0ICsgbGVuZ3RoMl0gPSB0bXBbY3Vyc29yMV07XG5cbiAgICB9IGVsc2UgaWYgKGxlbmd0aDEgPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWVyZ2VMb3cgcHJlY29uZGl0aW9ucyB3ZXJlIG5vdCByZXNwZWN0ZWQnKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoMTsgaSsrKSB7XG4gICAgICAgIGFycmF5W2Rlc3QgKyBpXSA9IHRtcFtjdXJzb3IxICsgaV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlIHR3byBhZGphY2VudCBydW5zIGluIGEgc3RhYmxlIHdheS4gVGhlIHJ1bnMgbXVzdCBiZSBzdWNoIHRoYXQgdGhlXG4gICAqIGZpcnN0IGVsZW1lbnQgb2YgcnVuMSBpcyBiaWdnZXIgdGhhbiB0aGUgZmlyc3QgZWxlbWVudCBpbiBydW4yIGFuZCB0aGVcbiAgICogbGFzdCBlbGVtZW50IG9mIHJ1bjEgaXMgZ3JlYXRlciB0aGFuIGFsbCB0aGUgZWxlbWVudHMgaW4gcnVuMi5cbiAgICogVGhlIG1ldGhvZCBzaG91bGQgYmUgY2FsbGVkIHdoZW4gcnVuMS5sZW5ndGggPiBydW4yLmxlbmd0aCBhcyBpdCB1c2VzXG4gICAqIFRpbVNvcnQgdGVtcG9yYXJ5IGFycmF5IHRvIHN0b3JlIHJ1bjIuIFVzZSBtZXJnZUxvdyBpZiBydW4xLmxlbmd0aCA8PVxuICAgKiBydW4yLmxlbmd0aC5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0MSAtIEZpcnN0IGVsZW1lbnQgaW4gcnVuMS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aDEgLSBMZW5ndGggb2YgcnVuMS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0MiAtIEZpcnN0IGVsZW1lbnQgaW4gcnVuMi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aDIgLSBMZW5ndGggb2YgcnVuMi5cbiAgICovXG4gIG1lcmdlSGlnaChzdGFydDEsIGxlbmd0aDEsIHN0YXJ0MiwgbGVuZ3RoMikge1xuICAgIGxldCBjb21wYXJlID0gdGhpcy5jb21wYXJlO1xuICAgIGxldCBhcnJheSA9IHRoaXMuYXJyYXk7XG4gICAgbGV0IHRtcCA9IHRoaXMudG1wO1xuICAgIGxldCBpID0gMDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGgyOyBpKyspIHtcbiAgICAgIHRtcFtpXSA9IGFycmF5W3N0YXJ0MiArIGldO1xuICAgIH1cblxuICAgIGxldCBjdXJzb3IxID0gc3RhcnQxICsgbGVuZ3RoMSAtIDE7XG4gICAgbGV0IGN1cnNvcjIgPSBsZW5ndGgyIC0gMTtcbiAgICBsZXQgZGVzdCA9IHN0YXJ0MiArIGxlbmd0aDIgLSAxO1xuICAgIGxldCBjdXN0b21DdXJzb3IgPSAwO1xuICAgIGxldCBjdXN0b21EZXN0ID0gMDtcblxuICAgIGFycmF5W2Rlc3QtLV0gPSBhcnJheVtjdXJzb3IxLS1dO1xuXG4gICAgaWYgKC0tbGVuZ3RoMSA9PT0gMCkge1xuICAgICAgY3VzdG9tQ3Vyc29yID0gZGVzdCAtIChsZW5ndGgyIC0gMSk7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGgyOyBpKyspIHtcbiAgICAgICAgYXJyYXlbY3VzdG9tQ3Vyc29yICsgaV0gPSB0bXBbaV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobGVuZ3RoMiA9PT0gMSkge1xuICAgICAgZGVzdCAtPSBsZW5ndGgxO1xuICAgICAgY3Vyc29yMSAtPSBsZW5ndGgxO1xuICAgICAgY3VzdG9tRGVzdCA9IGRlc3QgKyAxO1xuICAgICAgY3VzdG9tQ3Vyc29yID0gY3Vyc29yMSArIDE7XG5cbiAgICAgIGZvciAoaSA9IGxlbmd0aDEgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBhcnJheVtjdXN0b21EZXN0ICsgaV0gPSBhcnJheVtjdXN0b21DdXJzb3IgKyBpXTtcbiAgICAgIH1cblxuICAgICAgYXJyYXlbZGVzdF0gPSB0bXBbY3Vyc29yMl07XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IG1pbkdhbGxvcCA9IHRoaXMubWluR2FsbG9wO1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGxldCBjb3VudDEgPSAwO1xuICAgICAgbGV0IGNvdW50MiA9IDA7XG4gICAgICBsZXQgZXhpdCA9IGZhbHNlO1xuXG4gICAgICBkbyB7XG4gICAgICAgIGlmIChjb21wYXJlKHRtcFtjdXJzb3IyXSwgYXJyYXlbY3Vyc29yMV0pIDwgMCkge1xuICAgICAgICAgIGFycmF5W2Rlc3QtLV0gPSBhcnJheVtjdXJzb3IxLS1dO1xuICAgICAgICAgIGNvdW50MSsrO1xuICAgICAgICAgIGNvdW50MiA9IDA7XG4gICAgICAgICAgaWYgKC0tbGVuZ3RoMSA9PT0gMCkge1xuICAgICAgICAgICAgZXhpdCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcnJheVtkZXN0LS1dID0gdG1wW2N1cnNvcjItLV07XG4gICAgICAgICAgY291bnQyKys7XG4gICAgICAgICAgY291bnQxID0gMDtcbiAgICAgICAgICBpZiAoLS1sZW5ndGgyID09PSAxKSB7XG4gICAgICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9IHdoaWxlICgoY291bnQxIHwgY291bnQyKSA8IG1pbkdhbGxvcCk7XG5cbiAgICAgIGlmIChleGl0KSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBkbyB7XG4gICAgICAgIGNvdW50MSA9IGxlbmd0aDEgLSBnYWxsb3BSaWdodCh0bXBbY3Vyc29yMl0sIGFycmF5LCBzdGFydDEsIGxlbmd0aDEsIGxlbmd0aDEgLSAxLCBjb21wYXJlKTtcblxuICAgICAgICBpZiAoY291bnQxICE9PSAwKSB7XG4gICAgICAgICAgZGVzdCAtPSBjb3VudDE7XG4gICAgICAgICAgY3Vyc29yMSAtPSBjb3VudDE7XG4gICAgICAgICAgbGVuZ3RoMSAtPSBjb3VudDE7XG4gICAgICAgICAgY3VzdG9tRGVzdCA9IGRlc3QgKyAxO1xuICAgICAgICAgIGN1c3RvbUN1cnNvciA9IGN1cnNvcjEgKyAxO1xuXG4gICAgICAgICAgZm9yIChpID0gY291bnQxIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGFycmF5W2N1c3RvbURlc3QgKyBpXSA9IGFycmF5W2N1c3RvbUN1cnNvciArIGldO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChsZW5ndGgxID09PSAwKSB7XG4gICAgICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFycmF5W2Rlc3QtLV0gPSB0bXBbY3Vyc29yMi0tXTtcblxuICAgICAgICBpZiAoLS1sZW5ndGgyID09PSAxKSB7XG4gICAgICAgICAgZXhpdCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBjb3VudDIgPSBsZW5ndGgyIC0gZ2FsbG9wTGVmdChhcnJheVtjdXJzb3IxXSwgdG1wLCAwLCBsZW5ndGgyLCBsZW5ndGgyIC0gMSwgY29tcGFyZSk7XG5cbiAgICAgICAgaWYgKGNvdW50MiAhPT0gMCkge1xuICAgICAgICAgIGRlc3QgLT0gY291bnQyO1xuICAgICAgICAgIGN1cnNvcjIgLT0gY291bnQyO1xuICAgICAgICAgIGxlbmd0aDIgLT0gY291bnQyO1xuICAgICAgICAgIGN1c3RvbURlc3QgPSBkZXN0ICsgMTtcbiAgICAgICAgICBjdXN0b21DdXJzb3IgPSBjdXJzb3IyICsgMTtcblxuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb3VudDI7IGkrKykge1xuICAgICAgICAgICAgYXJyYXlbY3VzdG9tRGVzdCArIGldID0gdG1wW2N1c3RvbUN1cnNvciArIGldO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChsZW5ndGgyIDw9IDEpIHtcbiAgICAgICAgICAgIGV4aXQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYXJyYXlbZGVzdC0tXSA9IGFycmF5W2N1cnNvcjEtLV07XG5cbiAgICAgICAgaWYgKC0tbGVuZ3RoMSA9PT0gMCkge1xuICAgICAgICAgIGV4aXQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgbWluR2FsbG9wLS07XG5cbiAgICAgIH0gd2hpbGUgKGNvdW50MSA+PSBERUZBVUxUX01JTl9HQUxMT1BJTkcgfHwgY291bnQyID49IERFRkFVTFRfTUlOX0dBTExPUElORyk7XG5cbiAgICAgIGlmIChleGl0KSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAobWluR2FsbG9wIDwgMCkge1xuICAgICAgICBtaW5HYWxsb3AgPSAwO1xuICAgICAgfVxuXG4gICAgICBtaW5HYWxsb3AgKz0gMjtcbiAgICB9XG5cbiAgICB0aGlzLm1pbkdhbGxvcCA9IG1pbkdhbGxvcDtcblxuICAgIGlmIChtaW5HYWxsb3AgPCAxKSB7XG4gICAgICB0aGlzLm1pbkdhbGxvcCA9IDE7XG4gICAgfVxuXG4gICAgaWYgKGxlbmd0aDIgPT09IDEpIHtcbiAgICAgIGRlc3QgLT0gbGVuZ3RoMTtcbiAgICAgIGN1cnNvcjEgLT0gbGVuZ3RoMTtcbiAgICAgIGN1c3RvbURlc3QgPSBkZXN0ICsgMTtcbiAgICAgIGN1c3RvbUN1cnNvciA9IGN1cnNvcjEgKyAxO1xuXG4gICAgICBmb3IgKGkgPSBsZW5ndGgxIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgYXJyYXlbY3VzdG9tRGVzdCArIGldID0gYXJyYXlbY3VzdG9tQ3Vyc29yICsgaV07XG4gICAgICB9XG5cbiAgICAgIGFycmF5W2Rlc3RdID0gdG1wW2N1cnNvcjJdO1xuXG4gICAgfSBlbHNlIGlmIChsZW5ndGgyID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21lcmdlSGlnaCBwcmVjb25kaXRpb25zIHdlcmUgbm90IHJlc3BlY3RlZCcpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGN1c3RvbUN1cnNvciA9IGRlc3QgLSAobGVuZ3RoMiAtIDEpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDI7IGkrKykge1xuICAgICAgICBhcnJheVtjdXN0b21DdXJzb3IgKyBpXSA9IHRtcFtpXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTb3J0IGFuIGFycmF5IGluIHRoZSByYW5nZSBbbG8sIGhpKSB1c2luZyBUaW1Tb3J0LlxuICpcbiAqIEBwYXJhbSB7YXJyYXl9IGFycmF5IC0gVGhlIGFycmF5IHRvIHNvcnQuXG4gKiBAcGFyYW0ge251bWJlcn0gbG8gLSBGaXJzdCBlbGVtZW50IGluIHRoZSByYW5nZSAoaW5jbHVzaXZlKS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBoaSAtIExhc3QgZWxlbWVudCBpbiB0aGUgcmFuZ2UuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uPX0gY29tcGFyZSAtIEl0ZW0gY29tcGFyaXNvbiBmdW5jdGlvbi4gRGVmYXVsdCBpcyBhbHBoYWJldGljYWwuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChhcnJheSwgbG8sIGhpLCBjb21wYXJlKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShhcnJheSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW4gb25seSBzb3J0IGFycmF5cycpO1xuICB9XG5cbiAgLypcbiAgICogSGFuZGxlIHRoZSBjYXNlIHdoZXJlIGEgY29tcGFyaXNvbiBmdW5jdGlvbiBpcyBub3QgcHJvdmlkZWQuIFdlIGRvXG4gICAqIGxleGljb2dyYXBoaWMgc29ydGluZ1xuICAgKi9cblxuICBpZiAobG8gPT09IHVuZGVmaW5lZCkge1xuICAgIGxvID0gMDtcbiAgfVxuXG4gIGlmIChoaSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgaGkgPSBhcnJheS5sZW5ndGg7XG4gIH1cblxuICBpZiAoY29tcGFyZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY29tcGFyZSA9IGFscGhhYmV0aWNhbENvbXBhcmU7XG4gIH1cblxuICBsZXQgcmVtYWluaW5nID0gaGkgLSBsbztcblxuICAvLyBUaGUgYXJyYXkgaXMgYWxyZWFkeSBzb3J0ZWRcbiAgaWYgKHJlbWFpbmluZyA8IDIpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgcnVuTGVuZ3RoID0gMDtcbiAgLy8gT24gc21hbGwgYXJyYXlzIGJpbmFyeSBzb3J0IGNhbiBiZSB1c2VkIGRpcmVjdGx5XG4gIGlmIChyZW1haW5pbmcgPCBERUZBVUxUX01JTl9NRVJHRSkge1xuICAgIHJ1bkxlbmd0aCA9IG1ha2VBc2NlbmRpbmdSdW4oYXJyYXksIGxvLCBoaSwgY29tcGFyZSk7XG4gICAgYmluYXJ5SW5zZXJ0aW9uU29ydChhcnJheSwgbG8sIGhpLCBsbyArIHJ1bkxlbmd0aCwgY29tcGFyZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHRzID0gbmV3IFRpbVNvcnQoYXJyYXksIGNvbXBhcmUpO1xuXG4gIGxldCBtaW5SdW4gPSBtaW5SdW5MZW5ndGgocmVtYWluaW5nKTtcblxuICBkbyB7XG4gICAgcnVuTGVuZ3RoID0gbWFrZUFzY2VuZGluZ1J1bihhcnJheSwgbG8sIGhpLCBjb21wYXJlKTtcbiAgICBpZiAocnVuTGVuZ3RoIDwgbWluUnVuKSB7XG4gICAgICBsZXQgZm9yY2UgPSByZW1haW5pbmc7XG4gICAgICBpZiAoZm9yY2UgPiBtaW5SdW4pIHtcbiAgICAgICAgZm9yY2UgPSBtaW5SdW47XG4gICAgICB9XG5cbiAgICAgIGJpbmFyeUluc2VydGlvblNvcnQoYXJyYXksIGxvLCBsbyArIGZvcmNlLCBsbyArIHJ1bkxlbmd0aCwgY29tcGFyZSk7XG4gICAgICBydW5MZW5ndGggPSBmb3JjZTtcbiAgICB9XG4gICAgLy8gUHVzaCBuZXcgcnVuIGFuZCBtZXJnZSBpZiBuZWNlc3NhcnlcbiAgICB0cy5wdXNoUnVuKGxvLCBydW5MZW5ndGgpO1xuICAgIHRzLm1lcmdlUnVucygpO1xuXG4gICAgLy8gR28gZmluZCBuZXh0IHJ1blxuICAgIHJlbWFpbmluZyAtPSBydW5MZW5ndGg7XG4gICAgbG8gKz0gcnVuTGVuZ3RoO1xuXG4gIH0gd2hpbGUgKHJlbWFpbmluZyAhPT0gMCk7XG5cbiAgLy8gRm9yY2UgbWVyZ2luZyBvZiByZW1haW5pbmcgcnVuc1xuICB0cy5mb3JjZU1lcmdlUnVucygpO1xufSJdLCJzb3VyY2VSb290IjoiLyJ9