import { combineReducers } from 'redux';
import machines from './machines'
import orders from './orders'

export default combineReducers({
    machines,
    orders,
});