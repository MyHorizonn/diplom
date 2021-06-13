import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getMachines, delMachines } from '../../actions/machines';
import {getOrders} from '../../actions/orders';


function date_print(order, ord){
    if(order.hour_or_day == 'DAY'){
        var date1 = new Date(ord.date_of_order)
        date1.setDate(date1.getDate() + parseInt(order.duration))
        var date2 = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate()
        return(
            <tr key={ord}>
                <td>{ord.date_of_order}</td>
                <td>{ord.order_time}</td>
                <td>{date2}</td>
                <td>{ord.order_time}</td>
            </tr>
        )
    }
    else{
        var date1 = new Date(ord.date_of_order + 'T' + ord.order_time)
        date1.setHours(date1.getHours() + parseInt(order.duration))
        var date2 = date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds()
        var date3 = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate()
        return(
            <tr key={ord}>
                <td>{ord.date_of_order}</td>
                <td>{ord.order_time}</td>
                <td>{date3}</td>
                <td>{date2}</td>
            </tr>
        )
    }
    
}

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
        getMachines: PropTypes.func.isRequired,
        delMachines: PropTypes.func.isRequired,
        getOrders: PropTypes.func.isRequired,
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })};

    componentDidMount(){
        this.props.getMachines(getCookie('csrftoken'));
        this.props.getOrders();
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
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Стоимость в час</th>
                            <th>Стоимость в день</th>
                            <th>Состояние</th>
                            {getCookie('group') != 1 ? 
                            <th>Заказы</th>
                            :
                            <></>}
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
                                <td>{machine.cost_to_hour}</td>
                                <td>{machine.cost_to_day}</td>
                                <td>{machine.status}</td>
                                {getCookie('group') != 1 ? 
                                <td>{machine.orders.map((order) =>(
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
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {date_print(order, ord)}
                                                </tbody>
                                                </table>
                                            </div>      
                                    ))
                            ))}</td> 
                                : 
                                <></>}
                                <td><button
                                onClick={this.props.delMachines.bind(this, machine.id, getCookie('csrftoken'), getCookie('group'))}
                                className="btn btn-danger btn-sm">
                                    Удалить</button></td>
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
    orders: state.orders.orders
});

export default connect(mapStateToProps, {getMachines, delMachines, getOrders})
(Machines);