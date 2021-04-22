import { CREATE_MACHINELIST } from '../actions/types.js'

const initialState = {
    machinelists: []
}

export default function(state = initialState, action) {
    switch(action.type){
        case CREATE_MACHINELIST:
            return{
                ...state,
                machinelists: [...state.machinelists, action.payload]
            }
        default:
            return state;
    }
}