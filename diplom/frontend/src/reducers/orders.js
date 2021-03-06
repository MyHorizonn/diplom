import { CREATE_ORDER, DELETE_ORDER, GET_ORDERS } from '../actions/types.js'

const initialState = {
    orders: []
}

export default function(state = initialState, action) {
    switch(action.type){
        case GET_ORDERS:
            return{
                ...state,
                orders: action.payload
            }
        case DELETE_ORDER:
            return{
                ...state,
                orders: state.orders.filter(
                    order => order.id !== action.payload)
            }
        case CREATE_ORDER:
            return{
                ...state,
                orders: [...state.orders, action.payload]
            }
        default:
            return state;
    }
}