"use strict";

require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useCheckIfDataIsString;
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _react = require("react");
/**
 * Custom hook that checks if data in an array of objects is a string or number, and if not, converts it to a string representation.
 * @author Sebastien GAULT <sgault.webdev@gmail.com>
 * @param {Object[]} rows - The array of objects to check.
 * @returns {Object} - An object containing the checked rows.
 */

function useCheckIfDataIsString(rows) {
  const checkedRows = (0, _react.useMemo)(() => {
    // The check function
    const check = value => {
      // if data is not a string or a number
      if (typeof value !== 'string' && typeof value !== 'number') {
        // and if it's a Date object, convert it to a date string
        if (value instanceof Date) {
          value = value.toLocaleDateString('en-EN');

          // or if it's an array convert it to a string representation
        } else if (value instanceof Array) {
          value = value.toString();

          // otherwise replace with a string data error
        } else {
          value = 'data error';
        }
      }
      return value;
    };
    // map rows to check each property of each object row
    return rows.map(row => {
      // for each property of the row
      for (const [key, value] of Object.entries(row)) {
        // if it's an object check also each property values of this object
        if (typeof value === 'object' && !Array.isArray(value)) {
          const groupedRows = value;
          for (const [k, val] of Object.entries(groupedRows)) {
            // replace the original value by the checked value
            row[key][k] = check(val);
          }
        } else {
          // replace the original value by the checked value
          row[key] = check(value);
        }
      }
      return row;
    });
  }, [rows]);
  return {
    checkedRows
  };
}