import axios from 'axios';

import { GET_MACHINES, DELETE_MACHINES, CREATE_MACHINES, CHANGE_STATUS} from './types';

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

export const changeStatus = (csrfToken, machine, status) => dispatch =>{
    axios.patch(`/api/machines/${machine.id}/`, 
    {id: machine.id, name: machine.name, about: machine.about, status: status == 'FREE' ? 'REPAIR' : 'FREE', type: machine.type, timing_orders: machine.timing_orders}, {
        headers: {"X-CSRFToken": csrfToken},
    })
    .then(res => {
            dispatch({
                type: CHANGE_STATUS,
                payload: res.data
            });
        }).catch(err => console.log(err));
}

export const getFreeMachines = (csrfToken) => dispatch => { 
    return axios({
        method: 'get',
        url: '/api/freemachines/',
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