import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getMachines, delMachines } from '../../actions/machines';
import {getOrders} from '../../actions/orders';
import {getTypes} from '../../actions/machinetypes';
import {delTiming} from '../../actions/timingtables';

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}




export class Machines extends Component {

    state = {
        filter: '',
    }

    static propTypes = {
        machines: PropTypes.array.isRequired,
        machinetypes: PropTypes.array.isRequired,
        getTypes: PropTypes.func.isRequired,
        getMachines: PropTypes.func.isRequired,
        delMachines: PropTypes.func.isRequired,
        getOrders: PropTypes.func.isRequired,
        delTiming: PropTypes.func.isRequired,
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })};
    
    temp = (e) =>{
        e.preventDefault()
        this.props.delTiming(e.target.id, getCookie('csrftoken'), getCookie('group'))
        // добавить удаление div'а
    }

    componentDidMount(){
        this.props.getMachines(getCookie('csrftoken'))
        this.props.getTypes(getCookie('csrftoken'))
        if(getCookie('group') != 1){
            this.props.getOrders();
        }
    }

    render() {
        const {filter} = this.state;
        return (
            <Fragment>
                <h2>Список техники</h2>
                <div className='form-group'>
                    <label>Поиск</label>
                    <input
                        className="form-control"
                        type="text"
                        name="filter"
                        onChange={this.onChange}
                        value={filter}
                    />
                </div>
                <table className="table" style={{width: '100%'}}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Состояние</th>
                            <th>Тип техники</th>
                            {getCookie('group') != 1 &&
                            <th>Заказы</th>}
                            <th/>
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.machines.filter((el) => {
                            const  new_filter = filter.toLowerCase()
                            return filter ?  el.name.toLowerCase().includes(new_filter) : true
                        }
                        ).map((machine) =>(
                            <tr key={machine.id}>
                                <td>{machine.id}</td>
                                <td>{machine.name}</td>
                                <td>{machine.about}</td>
                                {machine.status == 'FREE' ? 
                                <td>Готова к работе</td>
                                :
                                <td>На ремонте</td>}
                                <td>{this.props.machinetypes.map((type) =>(
                                    type.id == machine.type &&
                                    type.name
                                ))}</td>
                                {getCookie('group') != 1 ?
                                machine.timing_orders.length != 0 ? 
                                <td>{machine.timing_orders.map((order) =>(
                                    this.props.orders.map((ord) =>(
                                        ord.id == order.order &&
                                            <div className="card card-body mt-4 mb-4">
                                                <table width="525px">
                                                <thead>
                                                    <tr>
                                                        <th>Дата заказа</th>
                                                        <th>Время заказа</th>
                                                        <th>Дата окончания</th>
                                                        <th>Время окончания</th>
                                                        <th/>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                <tr key={ord.id}>
                                                    <td>{ord.date_of_order}</td>
                                                    <td>{ord.order_time}</td>
                                                    <td>{ord.end_date_of_order}</td>
                                                    <td>{ord.end_order_time}</td>
                                                    <td><button
                                                    id={order.id}
                                                    onClick={this.temp} 
                                                    className="btn btn-danger btn-sm">Удалить</button></td>
                                                </tr>
                                                </tbody>
                                                </table>
                                            </div>      
                                    ))
                            ))}</td>
                                :
                                <td>Заказов нет</td>
                                : 
                                <></>}
                                {getCookie('group') == 1 &&
                                <td><button
                                onClick={this.props.delMachines.bind(this, machine.id, getCookie('csrftoken'), getCookie('group'))}
                                className="btn btn-danger btn-sm">
                                    Удалить</button></td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    machines: state.machines.machines,
    orders: state.orders.orders,
    machinetypes: state.machinetypes.machinetypes,
});

export default connect(mapStateToProps, {getMachines, delMachines, getOrders, getTypes, delTiming})
(Machines);