import axios from 'axios';

import { GET_MACHINES, DELETE_MACHINES, CREATE_MACHINES } from './types';

export const getMachines = (csrfToken) => dispatch => { 
    return axios({
        method: 'get',
        url: '/api/machines/',
        headers: {"X-CSRFToken": csrfToken},
    })
    .then(res => {
        dispatch({
            type: GET_MACHINES,
            payload: res.data
        });
    }).catch(err => console.log(err));
};

export const delMachines = (id, csrfToken, group) => dispatch => {
    console.log(group)
    if(group == '1'){
        axios.delete(`/api/machines/${id}`, {
            headers: {"X-CSRFToken": csrfToken}
        })
        .then(res => {
            dispatch({
                type: DELETE_MACHINES,
                payload: id
            });
        }).catch(err => console.log(err));
    }
};

export const createMachines = (machines, csrfToken) => dispatch =>{
    axios.post('/api/machines/', machines, {
        headers: {"X-CSRFToken": csrfToken}
    })
    .then(res =>{
        dispatch({
            type: CREATE_MACHINES,
            payload: res.data
        });
    }).catch(err => console.log(err));
};