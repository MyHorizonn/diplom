import { CREATE_TIMNG, GET_TIMING } from '../actions/types.js'

const initialState = {
    timingtables: []
}

export default function(state = initialState, action) {
    switch(action.type){
        case CREATE_TIMNG:
            return{
                ...state,
                timingtables: [...state.timingtables, action.payload]
            }
        case GET_TIMING:
            return{
                ...state,
                timingtables: action.payload
            }
        default:
            return state;
    }
}