# @gsebdev React Data Table

A table component that displays data, with sorting, filtering, and pagination functionalities.
## Installation
The package can be installed via npm:

```bash
npm install @gsebdev/react-data-table
```
## Usage

```js
import DataTable from '@gsebdev/react-data-table';

function Example({data}) {
    const columns = [
        {
            name: 'First Name',
            selector: row => row?.firstName
        },
        {
            name: 'Last Name',
            selector: row => row?.lastName
        },
    ]

    const deleteRows = (checked) => {
        //delete function
    }

    <DataTable
        rows={data}
        columns={columns}
        id='table-id'
        selectionActions={[
            {
                name: 'Delete selected',
                icon: deleteIcon,
                fn: deleteRows 
            }
        ]}
    />  
}
```

## Props

rows : an array of objects with the data\
columns : an array of columns object {name, selector}\
id : the id name of the table\
pagination = true : paginate the table ? true or false, true by default\
paginationSelectOptions : an array of numbers for pagination option, by default = [10, 25, 50, 100, 'All']\
rowSelectable = true : are row selectable ? true or false, by default true\
selectionActions = [] : actions available when selected = an array of objects {name, icon : optional (if icon set displays an icon otherwise the name text), fn : function to handle the action}\