import axios from 'axios';

import { GET_MACHINES, DELETE_MACHINES, CREATE_MACHINES } from './types';

export const getMachines = () => dispatch => { 
    axios.get('/api/machines/')
    .then(res => {
        dispatch({
            type: GET_MACHINES,
            payload: res.data
        });
    }).catch(err => console.log(err));
};

export const delMachines = id => dispatch => { 
    axios.delete(`/api/machines/${id}/`)
    .then(res => {
        dispatch({
            type: DELETE_MACHINES,
            payload: id
        });
    }).catch(err => console.log(err));
};

export const createMachines = (machines) => dispatch =>{
    axios.post('/api/machines/', machines)
    .then(res =>{
        dispatch({
            type: CREATE_MACHINES,
            payload: res.data
        });
    }).catch(err => console.log(err));
};