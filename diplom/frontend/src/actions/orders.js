import axios from 'axios';

import { CREATE_ORDER, DELETE_ORDER, GET_ORDERS, CREATE_MACHINELIST } from './types';

export const getOrders = () => dispatch => { 
    axios.get('/api/orders/')
    .then(res => {
        dispatch({
            type: GET_ORDERS,
            payload: res.data
        });
    }).catch(err => console.log(err));
};

export const delOrder = id => dispatch =>{
    axios.delete(`api/orders/${id}/`)
    .then(res => {
        dispatch({
            type: DELETE_ORDER,
            payload: id
        });
    }).catch(err => console.log(err));
};

export const createOrder = (orders) => dispatch =>{
    let order = {};
    let temp = {};
    let machine = {};
    order = {date_of_order: orders.date_of_order, order_time: orders.order_time, 
        end_date_of_order: orders.end_date[0].toString(), end_order_time: orders.end_date[1].toString(), client_num: orders.client_num, 
        client_fio: orders.client_fio, address: orders.address, coordinate: orders.coordinate};
    temp = orders.machines
    axios.post('api/orders/', order)
    .then(res =>{
        dispatch({
            type: CREATE_ORDER,
            payload: res.data
        });
        machine = {hour_or_day: temp.hour_or_day, duration: temp.duration, machine: temp.machine, order: res.data.id};
        axios.post('api/machinelists/', machine)
        .then(res =>{
        dispatch({
            type: CREATE_MACHINELIST,
            payload: res.data
        });
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
};

