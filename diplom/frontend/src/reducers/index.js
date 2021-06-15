import { combineReducers } from 'redux';
import machines from './machines'
import orders from './orders'
import machinetypes from './machinestype';
import timingtables from './timingtables'

export default combineReducers({
    machines,
    orders,
    machinetypes,
    timingtables,
});