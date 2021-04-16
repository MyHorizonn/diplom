import React, { Fragment } from 'react'
import Form from './Form';
import Machines from './machines'


export default function Dashboard() {
    return (
        <Fragment>
            <Form />
            <Machines />
        </Fragment>
    )
}
