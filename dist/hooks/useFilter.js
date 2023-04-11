"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useFilter;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.regexp.to-string.js");
var _react = require("react");
/**
 * Custom hook to filter an array of objects based on a search string.
 * @author Sebastien GAULT <sgault.webdev@gmail.com>
 * @param {Array.<Object>} rows - The array of objects to filter.
 * @param {string} filter - The search string to use for filtering.
 * @returns {Object} An object containing the filtered rows.
 */

function useFilter(rows, columns, filter) {
  const [filteredRows, setFilteredRows] = (0, _react.useState)(rows);
  const [rowsToString, setRowsToString] = (0, _react.useState)([]);

  /**
  * Create an array of strings reprensenting the object values to be able to test values with indexOf
  */

  (0, _react.useEffect)(() => {
    //map rows array to create the array of string
    const arrayOfString = rows.map(row => {
      return columns.map(col => {
        return col.selector(row);
      }).toString().toLowerCase();
    });
    // set rowsToString with the result
    setRowsToString(arrayOfString);
  }, [rows, columns]);

  /**
  * Filter the rows based on the filter string.
  */
  (0, _react.useEffect)(() => {
    //if a filter string is entered and if rowsToString has been feeded by rows mapping
    if (filter && rowsToString.length === rows.length) {
      // use array.filter to filter rows based on wether their string string representation includes the filter string.
      const filtered = rows.filter((row, index) => rowsToString[index].indexOf(filter.toLowerCase()) !== -1);
      // Set the filteredRows state with the filtered array.
      setFilteredRows(filtered);
    } else {
      // If no filter string is entered or rowsToString hasn't been feeded by rows toString mapping, set the filteredRows state with the original rows array.
      setFilteredRows(rows);
    }
  }, [rowsToString, rows, filter]);
  return {
    filteredRows
  };
}