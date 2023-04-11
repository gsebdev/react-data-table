"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DataTable;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = require("react");
var _arrow = _interopRequireDefault(require("./icons/arrow.svg"));
var _useCheckIfDataIsString = _interopRequireDefault(require("./hooks/useCheckIfDataIsString"));
var _useFilter = _interopRequireDefault(require("./hooks/useFilter"));
var _usePagination = _interopRequireDefault(require("./hooks/usePagination"));
var _useSort = _interopRequireDefault(require("./hooks/useSort"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * A table component that displays data in table, with sorting, filtering, and pagination functionalities.
 * @author Sebastien GAULT <sgault.webdev@gmail.com>
 * @param {Object[]} rows - An array of objects representing the rows to display in the table.
 * @param {Object[]} columns - An array of objects representing the columns names and associated row selectors to display in the table.
 * @param {string} id - The id attribute for the <table> element.
 * @param {boolean} [pagination=true] - A boolean indicating whether or not to enable pagination.
 * @param {number[] | string[]} [paginationSelectOptions] - An array of numbers or strings representing the number of items to display per page.
 * @param {boolean} [rowSelectable=true] - A boolean indicating whether or not to enable row selection.
 * @param {Object[]} [selectionActions=[]] - An array of objects representing the actions available on selected rows.
 * @returns {JSX.Element} The data table component.
 */

function DataTable(_ref) {
  let {
    rows,
    columns,
    id,
    pagination = true,
    paginationSelectOptions,
    rowSelectable = true,
    selectionActions = []
  } = _ref;
  // checked state is an array of row ID's that are selected in the table
  const [checked, setChecked] = (0, _react.useState)([]);
  // filter state is a string to filter rows to display
  const [filter, setFilter] = (0, _react.useState)('');

  // determine pagination display options
  const itemsPerPageSelectOptions = (0, _react.useMemo)(() => {
    if (!pagination) {
      return null;
    }
    return paginationSelectOptions ? paginationSelectOptions : [10, 25, 50, 100, 'All'];
  }, [paginationSelectOptions, pagination]);

  // First check and convert to string all row data to avoid errors
  const {
    checkedRows
  } = (0, _useCheckIfDataIsString.default)(rows);
  // Then sort checkedRows if sortColumn is defined
  const {
    sortedRows,
    sortColumn,
    setSortColumn
  } = (0, _useSort.default)(checkedRows, columns);
  // Then filter rows function of filter state
  const {
    filteredRows
  } = (0, _useFilter.default)(sortedRows, filter);
  // Then paginate rows to display
  const {
    displayedRows,
    page,
    itemsPerPage,
    pageList,
    setItemsPerPage,
    setPage
  } = (0, _usePagination.default)(filteredRows, itemsPerPageSelectOptions);

  //handle click on th element
  const onSortClick = index => {
    let order = 'ascending';
    if (sortColumn.index === index && sortColumn.order === 'ascending') {
      order = 'descending';
    }
    setSortColumn({
      index: index,
      order: order
    });
  };
  //handle click on row checkbox 
  const onCheckRow = (id, check) => {
    const checkedSet = new Set(checked);
    if (check) {
      checkedSet.add(id);
    } else {
      checkedSet.delete(id);
    }
    setChecked([...checkedSet]);
  };
  //handle click on select all rows checkbox 
  const checkAll = e => {
    if (e.target.checked) {
      setChecked(filteredRows.map(row => row.id));
    } else {
      setChecked([]);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "SG-data-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "SG-data-table__header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "SG-data-table__view-select"
  }, pagination && /*#__PURE__*/React.createElement("select", {
    defaultValue: itemsPerPage,
    onChange: e => {
      setItemsPerPage(e.target.value);
      setPage(1);
    }
  }, itemsPerPageSelectOptions.map((option, index) => {
    return /*#__PURE__*/React.createElement("option", {
      key: option + index + 'view-items-page',
      value: index
    }, option);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "SG-data-table__filter"
  }, /*#__PURE__*/React.createElement("span", null, "Search"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: filter,
    onChange: e => {
      setFilter(e.target.value);
    }
  }), filter && /*#__PURE__*/React.createElement("div", {
    className: "SG-data-table__filter__delete",
    onClick: () => {
      setFilter('');
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "SG-data-table__table-container"
  }, /*#__PURE__*/React.createElement("table", {
    id: id,
    className: "SG-data-table__table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    role: "row"
  }, rowSelectable && /*#__PURE__*/React.createElement("th", null, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: filteredRows.length === checked.length && filteredRows.length > 0 ? true : false,
    onChange: checkAll
  })), columns.map((column, index) => {
    return /*#__PURE__*/React.createElement("th", {
      key: column.name + index + 'thead',
      className: index === sortColumn.index ? sortColumn.order + ' sorted' : '',
      tabIndex: 0,
      "aria-controls": id,
      "aria-sort": index === sortColumn.index ? sortColumn.order : '',
      "aria-label": "".concat(column.name, ": activate to sort column ").concat(index === sortColumn.index && sortColumn.order === 'ascending' ? 'descending' : 'ascending'),
      rowSpan: 1,
      colSpan: 1,
      onClick: () => {
        onSortClick(index);
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "SG-data-table__head-text"
    }, column.name), /*#__PURE__*/React.createElement("span", {
      className: 'SG-data-table__sort-icon' + (index === sortColumn.index ? ' ' + sortColumn.order : ' ascending')
    }, /*#__PURE__*/React.createElement("img", {
      src: _arrow.default,
      alt: ""
    }))));
  }))), /*#__PURE__*/React.createElement("tbody", null, displayedRows.map((row, y) => {
    return /*#__PURE__*/React.createElement("tr", {
      key: row + y,
      role: "row",
      className: y % 2 === 0 ? 'even' : 'odd'
    }, rowSelectable && /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: checked.indexOf(row.id) !== -1 ? true : false,
      onChange: e => {
        onCheckRow(row.id, e.target.checked);
      }
    })), columns.map((column, x) => {
      return /*#__PURE__*/React.createElement("td", {
        key: column + x + y
      }, column.selector(row) ? column.selector(row) : '');
    }));
  })))), /*#__PURE__*/React.createElement("div", null, checked.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "SG-data-table__actions"
  }, selectionActions.map((action, index) => {
    return action.icon ? /*#__PURE__*/React.createElement("span", {
      key: action + index
    }, /*#__PURE__*/React.createElement("img", {
      src: action.icon,
      alt: action.name,
      key: index + action,
      onClick: () => {
        action.fn(checked);
        setChecked([]);
      }
    })) : /*#__PURE__*/React.createElement("span", {
      key: index + action,
      onClick: () => {
        action.fn(checked);
        setChecked([]);
      }
    }, action.name);
  }), /*#__PURE__*/React.createElement("span", null, checked.length, " row", checked.length === 1 ? '' : 's', " selected"))), pagination && /*#__PURE__*/React.createElement("div", {
    className: "SG-data-table__pagination"
  }, typeof itemsPerPageSelectOptions[itemsPerPage] === 'number' && /*#__PURE__*/React.createElement("span", null, filteredRows.length > 0 ? (page - 1) * itemsPerPageSelectOptions[itemsPerPage] + 1 : 0, " - ", page * itemsPerPageSelectOptions[itemsPerPage] > filteredRows.length ? filteredRows.length : page * itemsPerPageSelectOptions[itemsPerPage], " of ", filteredRows.length), typeof itemsPerPageSelectOptions[itemsPerPage] === 'string' && /*#__PURE__*/React.createElement("span", null, filteredRows.length > 0 ? '1' : '0', " - ", filteredRows.length, " of ", filteredRows.length), /*#__PURE__*/React.createElement("div", null, pageList.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "SG-data-table__pagination__button-navigation".concat(page === 1 ? ' inactive' : ''),
    onClick: () => {
      if (page > 1) {
        setPage(page - 1);
      }
    }
  }, "Previous"), pageList.map((p, index) => {
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setPage(p);
      },
      className: "SG-data-table__pagination__button-page".concat(p === page ? ' active' : ''),
      key: p + 'pagination' + index
    }, p);
  }), /*#__PURE__*/React.createElement("button", {
    className: "SG-data-table__pagination__button-navigation".concat(page === pageList.length ? ' inactive' : ''),
    onClick: () => {
      if (page < pageList.length) {
        setPage(page + 1);
      }
    }
  }, "Next")))));
}