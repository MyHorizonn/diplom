import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import Form from './Form';
import Orders from './orders'


export default function Dashboard_orders() {
    return (
        <Fragment>
            <div>
            <table style={{ borderSpacing: '11px 7px', borderCollapse: 'separate', marginLeft: '35%'}}>
                <thead>
                    <tr style={{textDecoration: 'underline'}}>
                        <th>
                            <Link to ="/machines">
                                Список техники
                            </Link> 
                        </th>
                        <th>
                        <Link to ="/">
                                На главную
                            </Link> 
                        </th>
                    </tr>
                </thead>
            </table>
            </div>
            <Form/>
            <Orders/>
        </Fragment>
    )
}