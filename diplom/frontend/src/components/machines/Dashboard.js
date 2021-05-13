import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import Form from './Form';
import Machines from './machines'


export default function Dashboard_machines() {
    return (
        <Fragment>
            <div>
            <table style={{ borderSpacing: '11px 7px', borderCollapse: 'separate', marginLeft: '35%'}}>
                <thead>
                    <tr style={{textDecoration: 'underline'}}>
                        <th>
                            <Link to ="/orders">
                                Список заказов
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
            <Form />
            <Machines />
        </Fragment>
    )
}
