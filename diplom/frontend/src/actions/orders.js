import axios from 'axios';

import { CREATE_ORDER, DELETE_ORDER, GET_ORDERS } from './types';

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
    .then(res=>{
        dispatch({
            type: DELETE_ORDER,
            payload: id
        });
    }).catch(err => console.log(err));
};

export const createOrder = (order) => dispatch =>{
    axios.post('api/orders/', order)
    .then(res =>{
        dispatch({
            type: CREATE_ORDER,
            payload: res.data
        });
    }).catch(err => console.log(err));
};

