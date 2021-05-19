import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getMachines, delMachines } from '../../actions/machines';
import {getOrders} from '../../actions/orders';


function date_print(order, ord){
    if(order.hour_or_day == 'DAY'){
        var date1 = new Date(ord.date_of_order)
        console.log(date1)
        date1.setDate(date1.getDate() + order.duration)
        var date2 = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate()
        return(
            <tr>
                <td>{ord.date_of_order}</td>
                <td>{ord.order_time}</td>
                <td>{date2}</td>
                <td>{ord.order_time}</td>
            </tr>
        )
    }
    else{
        var date1 = new Date(ord.date_of_order + 'T' + ord.order_time)
        console.log(date1)
        date1.setHours(date1.getHours() + order.duration)
        console.log(date1)
        var date2 = date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds()
        var date3 = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate()
        return(
            <tr>
                <td>{ord.date_of_order}</td>
                <td>{ord.order_time}</td>
                <td>{date3}</td>
                <td>{date2}</td>
            </tr>
        )
    }
    
}


export class Machines extends Component {
    static propTypes = {
        machines: PropTypes.array.isRequired,
        getMachines: PropTypes.func.isRequired,
        delMachines: PropTypes.func.isRequired,
        getOrders: PropTypes.func.isRequired,
    };

    componentDidMount(){
        this.props.getMachines();
        this.props.getOrders();
    }

    render() {
        return (
            <Fragment>
                <h2>Список техники</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Стоимость в час</th>
                            <th>Стоимость в день</th>
                            <th>Состояние</th>
                            <th>Заказы</th>
                            <th/>
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.machines.map((machine) =>(
                            <tr key={machine.id}>
                                <td>{machine.name}</td>
                                <td>{machine.about}</td>
                                <td>{machine.cost_to_hour}</td>
                                <td>{machine.cost_to_day}</td>
                                <td>{machine.status}</td>
                                <td style={{flex: 1}}>{machine.orders.map((order) =>(
                                        this.props.orders.map((ord) =>(
                                            ord.id == order.order &&
                                                <div className="card card-body mt-4 mb-4">
                                                    <table>
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
                                <td><button
                                onClick={this.props.delMachines.bind(this, machine.id)}
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