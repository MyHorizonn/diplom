import { DELETE_MACHINES, GET_MACHINES, CREATE_MACHINES } from '../actions/types.js'

const initialState = {
    machines: []
}

export default function(state = initialState, action) {
    switch(action.type){
        case GET_MACHINES:
            return{
                ...state,
                machines: action.payload
            }
        case DELETE_MACHINES:
            return{
                ...state,
                machines: state.machines.filter(
                    machine => machine.id !== action.payload)
            }
        case CREATE_MACHINES:
            return{
                ...state,
                machines: [...state.machines, action.payload]
            }
        default:
            return state;
    }
}