import axios from 'axios';

import { CREATE_TIMNG, GET_TIMING } from './types';

export const createTiming = (csrfToken, order, machine) => dispatch =>{
    axios.post('/api/timingtables/', {order: order, machine: machine}, {
        headers: {"X-CSRFToken": csrfToken}
    })
    .then(res =>{
        dispatch({
            type: CREATE_TIMNG,
            payload: res.data
        });
    }).catch(err => console.log(err));
}

export const getTiming = (csrfToken) => dispatch => { 
    return axios({
        method: 'get',
        url: '/api/timingtables/',
        headers: {"X-CSRFToken": csrfToken},
    })
    .then(res => {
        dispatch({
            type: GET_TIMING,
            payload: res.data
        });
    }).catch(err => console.log(err));
};