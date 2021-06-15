import { func } from 'prop-types';
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import Form from './Form';
import Form2 from './Form2'
import Machines from './machines'
import MachineTypes from './machinetypes';

// 1 - Техник
// 2 - Заказы
// 3 - Распределение

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function logout(){
    fetch('api/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": getCookie('csrftoken'),
        },
    })
    .then((res) =>{
        document.cookie = "group=0"
        window.location.href = 'http://localhost:8000/#/'
    })
}

function MyRender(){
    if(getCookie('group') == '1'){
        return(
            <Fragment>
            <div>
            <table style={{ borderSpacing: '11px 7px', borderCollapse: 'separate', marginLeft: '35%'}}>
                <thead>
                    <tr>
                        <th>
                            <button style={{marginLeft: '100%'}} type="button" className='btn btn-primary' onClick={logout}>Выйти</button>
                        </th>
                    </tr>
                </thead>
            </table>
            </div>
            <Form2 />
            <MachineTypes />
            <Form />
            <Machines />
        </Fragment>
        )
    }
    if(getCookie('group') == '2'){
        return(
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
                            <button style={{marginLeft: '100%'}} type="button" className='btn btn-primary' onClick={logout}>Выйти</button>
                        </th>
                    </tr>
                </thead>
            </table>
            </div>
            <Machines />
        </Fragment>
        )
    }
    if(getCookie('group') == '3'){
        return(
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
                        <Link to ="/map">
                                Карта
                            </Link> 
                        </th>
                        <th>
                            <button type="button" className='btn btn-primary' onClick={logout}>Выйти</button>
                        </th>
                    </tr>
                </thead>
            </table>
            </div>
            <Machines />
        </Fragment>
        )
    }
}

export default function Dashboard_machines() {
    return (
        <Fragment>
            {MyRender()}
        </Fragment>
    )
}
