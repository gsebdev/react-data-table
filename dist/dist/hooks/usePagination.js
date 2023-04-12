"use strict";

require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = usePagination;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = require("react");
/**
 * A custom hook that handles pagination logic for an array of items.
 * @author Sebastien GAULT <sgault.webdev@gmail.com>
 * @param {Array} rows - The array of items to paginate.
 * @param {Array} itemsPerPageSelectOptions - An array of options for the number of items to display per page.
 * @returns {Object} An object containing the displayed rows, the current page number, the number of items per page, an array of available page numbers, a function to set the number of items per page, and a function to set the current page number.
 */
function usePagination(rows, itemsPerPageSelectOptions) {
  // displayedRows state, an array containing the rows of the actual page to display.
  const [displayedRows, setDisplayedRows] = (0, _react.useState)([]);
  // page state, a number reprensenting the page number from 1 to infinite
  const [page, setPage] = (0, _react.useState)(1);
  // itemsPerPage state, a number reprensting the index of the selected itemsPerPageSelectOptions
  const [itemsPerPage, setItemsPerPage] = (0, _react.useState)(0);
  // pageList state, a list of the current available pages
  const [pageList, setPageList] = (0, _react.useState)([]);

  /**
   * Update the displayedRows state and the pageList state based on the current page and the number of items per page.
  */

  (0, _react.useEffect)(() => {
    // If itemsPerPageSelectOptions is defined
    if (itemsPerPageSelectOptions) {
      // Determine the number of items to display based on the current itemsPerPage value if it's a number, or the length of the rows array.
      const itemsNumber = typeof itemsPerPageSelectOptions[itemsPerPage] === 'number' ? itemsPerPageSelectOptions[itemsPerPage] : rows.length;
      // Slice the rows array to display only the items for the current page determined by the page value and itemsNumber value.
      const rowsToDisplay = rows.slice((page - 1) * itemsNumber, page * itemsNumber);
      // Generate an array of page numbers based on the number of items and the current itemsPerPage value.
      setPageList(Array.from([...Array(Math.ceil(rows.length / itemsNumber)).keys()], p => p + 1));

      // If the rowsToDisplay array is empty and the current page is not the first page, decrement the page state to display the previous page.
      if (rowsToDisplay.length === 0 && page > 1) {
        setPage(page - 1);
      } else {
        setDisplayedRows(rowsToDisplay);
      }
    } else {
      // If itemsPerPageSelectOptions is not defined, set the displayedRows state with the original rows array.
      setDisplayedRows(rows);
    }
  }, [rows, itemsPerPage, page, itemsPerPageSelectOptions]);
  return {
    displayedRows,
    page,
    itemsPerPage,
    pageList,
    setItemsPerPage,
    setPage
  };
}