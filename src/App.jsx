import { useState } from "react";
import { employees } from "./employees";
import DataTable from "./lib/DataTable";

export default function App() {
    const [ rows, setRows] = useState(employees)

    const columns = [
        {
            name: 'First Name',
            selector: row => row?.firstName
        },
        {
            name: 'Last Name',
            selector: row => row?.lastName
        },
        {
            name: 'Start Date',
            selector: row => row?.startDate
        },
        {
            name: 'Department',
            selector: row => row?.department
        },
        {
            name: 'Date of Birth',
            selector: row => row?.dateOfBirth
        },
        {
            name: 'Street',
            selector: row => row?.address?.street
        },
        {
            name: 'City',
            selector: row => row?.address?.city
        },
        {
            name: 'State',
            selector: row => row?.address?.state
        },
        {
            name: 'Zip Code',
            selector: row => row?.address?.zipCode
        },
    ]

    // function that delete one row
    const deleteRows = (checked) => {
        let newRows = [...rows]
        checked.forEach(id => {
           newRows = newRows.filter(row => row.id !== id)
        })

        setRows(newRows)
    }
    
    return (
        <div>
            <DataTable 
            rows={rows}
            columns={columns}
            id='employeeTable'
            selectionActions={[
                {
                    name: 'Delete selected',
                    fn: deleteRows 
                }
            ]}
            />
        </div>
    )
}