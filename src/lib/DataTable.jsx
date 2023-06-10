import { useMemo, useState } from "react"
import sortArrow from './icons/arrow.svg'
import './data-table.scss'
import useCheckIfDataIsString from "./hooks/useCheckIfDataIsString"
import useFilter from "./hooks/useFilter"
import usePagination from "./hooks/usePagination"
import useSort from "./hooks/useSort"

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

export default function DataTable({ rows, columns, id, pagination = true, paginationSelectOptions, rowSelectable = true, selectionActions = [] }) {
    // checked state is an array of row ID's that are selected in the table
    const [checked, setChecked] = useState([])
    // filter state is a string to filter rows to display
    const [filter, setFilter] = useState('')

    // determine pagination display options
    const itemsPerPageSelectOptions = useMemo(() => {
        if (!pagination) {
            return null
        }
        return paginationSelectOptions ? paginationSelectOptions : [10, 25, 50, 100, 'All']
    }, [paginationSelectOptions, pagination])

    // First check and convert to string all row data to avoid errors
    const { checkedRows } = useCheckIfDataIsString(rows)
    // Then sort checkedRows if sortColumn is defined
    const { sortedRows, sortColumn, setSortColumn } = useSort(checkedRows, columns)
    // Then filter rows function of filter state
    const { filteredRows } = useFilter(sortedRows, columns, filter)
    // Then paginate rows to display
    const { displayedRows, page, itemsPerPage, pageList, setItemsPerPage, setPage } = usePagination(filteredRows, itemsPerPageSelectOptions)

    //handle click on th element
    const onSortClick = (index) => {
        let order = 'ascending'
        if (sortColumn.index === index && sortColumn.order === 'ascending') {
            order = 'descending'
        }
        setSortColumn({ index: index, order: order })
    }
    //handle click on row checkbox 
    const onCheckRow = (id) => {
        const checkedSet = new Set(checked)
        if (!checkedSet.has(id)) {
            checkedSet.add(id)
        } else {
            checkedSet.delete(id)
        }
        setChecked([...checkedSet])

    }
    //handle click on select all rows checkbox 
    const checkAll = (e) => {
        if (e.target.checked) {
            setChecked(filteredRows.map(row => row.id))
        } else {
            setChecked([])
        }
    }

    return (
        <div className='SG-data-table'>
            <div className='SG-data-table__header'>
                <div className='SG-data-table__view-select'>
                    {pagination && <select defaultValue={itemsPerPage} onChange={(e) => { setItemsPerPage(e.target.value); setPage(1) }}>
                        {itemsPerPageSelectOptions.map((option, index) => {
                            return <option key={option + index + 'view-items-page'} value={index}>{option}</option>
                        })}
                    </select>}
                </div>
                <div className='SG-data-table__filter'>
                    <label htmlFor="SG-data-table-filter-input">Search</label>
                    <input id='SG-data-table-filter-input' type="text" value={filter} onChange={(e) => { setFilter(e.target.value) }} />
                    {filter && <div className='SG-data-table__filter__delete' onClick={() => { setFilter('') }}></div>}
                </div>
            </div>
            <div className='SG-data-table__table-container'>
                <table id={id} className='SG-data-table__table'>
                    <thead>
                        <tr role='row'>
                            {rowSelectable && <th><input type="checkbox" checked={filteredRows.length === checked.length && filteredRows.length > 0 ? true : false} onChange={checkAll} /></th>}
                            {columns.map((column, index) => {
                                return <th
                                    key={column.name + index + 'thead'}
                                    className={index === sortColumn.index ? sortColumn.order + ' sorted' : ''}
                                    tabIndex={0} aria-controls={id}
                                    aria-sort={index === sortColumn.index ? sortColumn.order : 'none'}
                                    aria-label={`${column.name}: activate to sort column ${index === sortColumn.index && sortColumn.order === 'ascending' ? 'descending' : 'ascending'}`}
                                    rowSpan={1}
                                    colSpan={1}
                                    onClick={() => { onSortClick(index) }}
                                >
                                    <div>
                                        <span className='SG-data-table__head-text'>{column.name}</span>
                                        <span className={'SG-data-table__sort-icon' + (index === sortColumn.index ? ' ' + sortColumn.order : ' ascending')}><img src={sortArrow} alt='' /></span>
                                    </div>

                                </th>
                            })}

                        </tr>
                    </thead>
                    <tbody>
                        {
                            displayedRows.map((row, y) => {
                                return (
                                    <tr key={row + y} role='row' className={(y % 2 === 0 ? 'even' : 'odd') + (checked.indexOf(row.id) !== -1 ? ' selected': '') } onClick={() => { onCheckRow(row.id) }}>
                                        {rowSelectable && <td><input aria-label={'Select or Deselect :' + row.firstname + row.lastName} type="checkbox" checked={checked.indexOf(row.id) !== -1 ? true : false} /></td>}
                                        {columns.map((column, x) => {
                                            return (
                                                <td key={column + x + y}>
                                                    {column.selector(row) ? column.selector(row) : ''}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div>
                {checked.length > 0 &&
                    <div className='SG-data-table__actions'>
                        {selectionActions.map((action, index) => {

                            return action.icon ? <button key={action + index}><img src={action.icon} alt={action.name} key={index + action} onClick={() => { action.fn(checked); setChecked([]) }} /></button> : <button key={index + action} onClick={() => { action.fn(checked); setChecked([]) }}>{action.name}</button>
                        })}
                        <span>{checked.length} row{checked.length === 1 ? '' : 's'} selected</span>
                    </div>
                }
            </div>
            {pagination && <div className="SG-data-table__pagination">
                {typeof itemsPerPageSelectOptions[itemsPerPage] === 'number' && <span>{filteredRows.length > 0 ? ((page - 1) * itemsPerPageSelectOptions[itemsPerPage]) + 1 : 0} - {(page * itemsPerPageSelectOptions[itemsPerPage]) > filteredRows.length ? filteredRows.length : (page * itemsPerPageSelectOptions[itemsPerPage])} of {filteredRows.length}</span>}
                {typeof itemsPerPageSelectOptions[itemsPerPage] === 'string' && <span>{filteredRows.length > 0 ? '1' : '0'} - {filteredRows.length} of {filteredRows.length}</span>}

                <div>
                    {pageList.length > 0 &&
                        <>
                            <button className={`SG-data-table__pagination__button-navigation${page === 1 ? ' inactive' : ''}`} onClick={() => { if (page > 1) { setPage(page - 1) } }}>Previous</button>
                            {
                                pageList.map((p, index) => {
                                    return <button onClick={() => { setPage(p) }} className={`SG-data-table__pagination__button-page${p === page ? ' active' : ''}`} key={p + 'pagination' + index}>{p}</button>
                                })
                            }
                            <button className={`SG-data-table__pagination__button-navigation${page === pageList.length ? ' inactive' : ''}`} onClick={() => { if (page < pageList.length) { setPage(page + 1) } }}>Next</button>
                        </>
                    }
                </div>
            </div>}
        </div>

    )
}