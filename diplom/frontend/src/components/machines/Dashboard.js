import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import Form from './Form';
import Machines from './machines'


export default function Dashboard_machines() {
    return (
        <Fragment>
            <Link to ="/orders">
                Orders
            </Link>
            <Form />
            <Machines />
        </Fragment>
    )
}
