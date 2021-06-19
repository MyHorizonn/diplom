import axios from 'axios';

import { CREATE_TIMNG, DELETE_TIMING, GET_TIMING } from './types';

export const delTiming = (id, csrfToken, group) => dispatch => {
    console.log(id, group)
    if(group == '3'){
        axios.delete(`/api/timingtables/${id}`, {
            headers: {"X-CSRFToken": csrfToken}
        })
        .then(res => {
            dispatch({
                type: DELETE_TIMING,
                payload: id
            });
        }).catch(err => console.log(err));
    }
};

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