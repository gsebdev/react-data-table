"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DataTable;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = require("react");
var _arrow = _interopRequireDefault(require("./icons/arrow.svg"));
require("./data-table.scss");
var _useCheckIfDataIsString = _interopRequireDefault(require("./hooks/useCheckIfDataIsString"));
var _useFilter = _interopRequireDefault(require("./hooks/useFilter"));
var _usePagination = _interopRequireDefault(require("./hooks/usePagination"));
var _useSort = _interopRequireDefault(require("./hooks/useSort"));
var _jsxRuntime = require("react/jsx-runtime");
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
 */function DataTable(_ref) {
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
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "SG-data-table",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "SG-data-table__header",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "SG-data-table__view-select",
        children: pagination && /*#__PURE__*/(0, _jsxRuntime.jsx)("select", {
          defaultValue: itemsPerPage,
          onChange: e => {
            setItemsPerPage(e.target.value);
            setPage(1);
          },
          children: itemsPerPageSelectOptions.map((option, index) => {
            return /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
              value: index,
              children: option
            }, option + index + 'view-items-page');
          })
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "SG-data-table__filter",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          children: "Search"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          type: "text",
          value: filter,
          onChange: e => {
            setFilter(e.target.value);
          }
        }), filter && /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: "SG-data-table__filter__delete",
          onClick: () => {
            setFilter('');
          }
        })]
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: "SG-data-table__table-container",
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("table", {
        id: id,
        className: "SG-data-table__table",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("thead", {
          children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("tr", {
            role: "row",
            children: [rowSelectable && /*#__PURE__*/(0, _jsxRuntime.jsx)("th", {
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                type: "checkbox",
                checked: filteredRows.length === checked.length && filteredRows.length > 0 ? true : false,
                onChange: checkAll
              })
            }), columns.map((column, index) => {
              return /*#__PURE__*/(0, _jsxRuntime.jsx)("th", {
                className: index === sortColumn.index ? sortColumn.order + ' sorted' : '',
                tabIndex: 0,
                "aria-controls": id,
                "aria-sort": index === sortColumn.index ? sortColumn.order : '',
                "aria-label": "".concat(column.name, ": activate to sort column ").concat(index === sortColumn.index && sortColumn.order === 'ascending' ? 'descending' : 'ascending'),
                rowSpan: 1,
                colSpan: 1,
                onClick: () => {
                  onSortClick(index);
                },
                children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                    className: "SG-data-table__head-text",
                    children: column.name
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                    className: 'SG-data-table__sort-icon' + (index === sortColumn.index ? ' ' + sortColumn.order : ' ascending'),
                    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("img", {
                      src: _arrow.default,
                      alt: ""
                    })
                  })]
                })
              }, column.name + index + 'thead');
            })]
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("tbody", {
          children: displayedRows.map((row, y) => {
            return /*#__PURE__*/(0, _jsxRuntime.jsxs)("tr", {
              role: "row",
              className: y % 2 === 0 ? 'even' : 'odd',
              children: [rowSelectable && /*#__PURE__*/(0, _jsxRuntime.jsx)("td", {
                children: /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                  type: "checkbox",
                  checked: checked.indexOf(row.id) !== -1 ? true : false,
                  onChange: e => {
                    onCheckRow(row.id, e.target.checked);
                  }
                })
              }), columns.map((column, x) => {
                return /*#__PURE__*/(0, _jsxRuntime.jsx)("td", {
                  children: column.selector(row) ? column.selector(row) : ''
                }, column + x + y);
              })]
            }, row + y);
          })
        })]
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      children: checked.length > 0 && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "SG-data-table__actions",
        children: [selectionActions.map((action, index) => {
          return action.icon ? /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)("img", {
              src: action.icon,
              alt: action.name,
              onClick: () => {
                action.fn(checked);
                setChecked([]);
              }
            }, index + action)
          }, action + index) : /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            onClick: () => {
              action.fn(checked);
              setChecked([]);
            },
            children: action.name
          }, index + action);
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
          children: [checked.length, " row", checked.length === 1 ? '' : 's', " selected"]
        })]
      })
    }), pagination && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "SG-data-table__pagination",
      children: [typeof itemsPerPageSelectOptions[itemsPerPage] === 'number' && /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
        children: [filteredRows.length > 0 ? (page - 1) * itemsPerPageSelectOptions[itemsPerPage] + 1 : 0, " - ", page * itemsPerPageSelectOptions[itemsPerPage] > filteredRows.length ? filteredRows.length : page * itemsPerPageSelectOptions[itemsPerPage], " of ", filteredRows.length]
      }), typeof itemsPerPageSelectOptions[itemsPerPage] === 'string' && /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
        children: [filteredRows.length > 0 ? '1' : '0', " - ", filteredRows.length, " of ", filteredRows.length]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        children: pageList.length > 0 && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
            className: "SG-data-table__pagination__button-navigation".concat(page === 1 ? ' inactive' : ''),
            onClick: () => {
              if (page > 1) {
                setPage(page - 1);
              }
            },
            children: "Previous"
          }), pageList.map((p, index) => {
            return /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
              onClick: () => {
                setPage(p);
              },
              className: "SG-data-table__pagination__button-page".concat(p === page ? ' active' : ''),
              children: p
            }, p + 'pagination' + index);
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
            className: "SG-data-table__pagination__button-navigation".concat(page === pageList.length ? ' inactive' : ''),
            onClick: () => {
              if (page < pageList.length) {
                setPage(page + 1);
              }
            },
            children: "Next"
          })]
        })
      })]
    })]
  });
}