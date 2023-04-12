"use strict";

require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.array.sort.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useSort;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.array.sort.js");
var _react = require("react");
/**
 * Custom hook that sorts an array of objects based on a selected column and order.
 * @author Sebastien GAULT <sgault.webdev@gmail.com>
 * @param {Object[]} rows - The array of objects to sort.
 * @param {Object[]} columns - An array of column configuration objects.
 * @returns {Object} - An object containing the sorted rows and sort column information.
 */
function useSort(rows, columns) {
  // sortColumn state is an object with 2 properties : index => index of the column to sort, order => 'ascending' || 'descending'
  const [sortColumn, setSortColumn] = (0, _react.useState)({
    index: null,
    order: null
  });
  // The result of the sort function
  const [sortedRows, setSortedRows] = (0, _react.useState)(rows);
  (0, _react.useEffect)(() => {
    const {
      index,
      order
    } = sortColumn;
    if (index !== null && order !== null) {
      // define the compare function
      function compare(a, b) {
        a = columns[index].selector(a) || '';
        b = columns[index].selector(b) || '';
        //determine if a sort by date is needed based if the provided a and b strings are date representation
        let sortByDate = !isNaN(Date.parse(a)) && !isNaN(Date.parse(b)) ? true : false;
        // if sort by dates transform a and b in Date objects
        if (sortByDate) {
          a = a ? new Date(a) : new Date(null);
          b = b ? new Date(b) : new Date(null);
        }
        // Compare and return sort values depending on the order string
        if (a > b) {
          return order === 'descending' ? 1 : -1;
        }
        if (a < b) {
          return order === 'descending' ? -1 : 1;
        }
        return 0;
      }
      //update sortedRows state by the sort result
      setSortedRows([...rows].sort(compare));
    } else {
      //if sortColumn object properties are null, return the original rows
      setSortedRows([...rows]);
    }
  }, [sortColumn, columns, rows]);
  return {
    sortedRows,
    sortColumn,
    setSortColumn
  };
}