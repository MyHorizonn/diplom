import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import Form from './Form';
import Index from './main'


export default function Dashboard_main(){
    return(
        <Fragment>
            <div>
            <table style={{ borderSpacing: '11px 7px', borderCollapse: 'separate'}}>
                <thead>
                    <tr style={{textDecoration: 'underline'}}>
                        <th>
                            <Link to ="/orders">
                                Список заказов
                            </Link> 
                        </th>
                        <th>
                        <Link to ="/machines">
                                Список техники
                            </Link> 
                        </th>
                    </tr>
                </thead>
            </table>
            </div>
            <Form/>
            <Index/>
        </Fragment>
    )
}