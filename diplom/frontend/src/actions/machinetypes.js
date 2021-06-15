import axios from 'axios';

import { GET_TYPE, DEL_TYPE, CREATE_TYPE } from './types';

export const getTypes = (csrfToken) => dispatch => { 
    return axios({
        method: 'get',
        url: '/api/machinetypes/',
        headers: {"X-CSRFToken": csrfToken},
    })
    .then(res => {
        dispatch({
            type: GET_TYPE,
            payload: res.data
        });
    }).catch(err => console.log(err));
};

export const delTypes = (id, csrfToken, group) => dispatch => {
    if(group == '1'){
        axios.delete(`/api/machinetypes/${id}`, {
            headers: {"X-CSRFToken": csrfToken}
        })
        .then(res => {
            dispatch({
                type: DEL_TYPE,
                payload: id
            });
        }).catch(err => console.log(err));
    }
};

export const createTypes = (type, csrfToken) => dispatch =>{
    axios.post('/api/machinetypes/', type, {
        headers: {"X-CSRFToken": csrfToken}
    })
    .then(res =>{
        dispatch({
            type: CREATE_TYPE,
            payload: res.data
        });
    }).catch(err => console.log(err));
};