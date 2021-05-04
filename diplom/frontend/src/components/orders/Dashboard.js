import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import Form from './Form';
import Orders from './orders'


export default function Dashboard_orders() {
    return (
        <Fragment>
            <Link to ="/machines">
                Machines
            </Link>
            <Form/>
            <Orders/>
        </Fragment>
    )
}