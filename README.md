# @gsebdev React Data Table

A simple data table react component, with sorting, filtering, and pagination functionalities.
Each columns can be sorted ascending or descending.
User can filter rows by filling a text input.
Pagination and row selection options can be activated.

When selection option is activated, you can provide the component custom actions functions.

[See demo link](https://gsebdev.github.io/react-data-table/)
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

***rows*** : an array of objects with the data\
***columns*** : an array of columns object `{name, selector}`\
***id*** : the id name of the table\
***pagination*** = `true` : paginate the table ? `true` or `false`\
***paginationSelectOptions*** : an array of numbers for pagination option, by default = `[10, 25, 50, 100, 'All']`\
***rowSelectable*** = `true` : are row selectable ? `true` or `false`\
***selectionActions*** = [] : actions available when selected = an array of objects `{name, icon : optional (if icon set displays an icon otherwise the name text), fn : function to handle the action}`