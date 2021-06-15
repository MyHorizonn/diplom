import { GET_TYPE, CREATE_TYPE, DEL_TYPE } from '../actions/types.js'

const initialState = {
    machinetypes: []
}

export default function(state = initialState, action) {
    switch(action.type){
        case GET_TYPE:
            return{
                ...state,
                machinetypes: action.payload
            }
        case DEL_TYPE:
            return{
                ...state,
                machinetypes: state.machinetypes.filter(
                    machinetype => machinetype.id !== action.payload)
            }
        case CREATE_TYPE:
            return{
                ...state,
                machinetypes: [...state.machinetypes, action.payload]
            }
        default:
            return state;
    }
}