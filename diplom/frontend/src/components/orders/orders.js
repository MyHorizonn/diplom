import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getOrders, delOrder } from '../../actions/orders';

export class Orders extends Component {

    state = {
        filter: '',
    }

    static propTypes = {
        orders: PropTypes.array.isRequired,
        getOrders: PropTypes.func.isRequired,
        delOrder: PropTypes.func.isRequired,
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })};

    componentDidMount(){
        this.props.getOrders();
    }

    render() {
        const {filter} = this.state;
        return (
            <Fragment>
                <h2>Список заказов</h2>
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
                            <th>Дата заказа</th>
                            <th>Время заказа</th>
                            <th>Стоимость ₽</th>
                            <th>Номер телефона</th>
                            <th>ФИО клиента</th>
                            <th>Адрес</th>
                            <th/>
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.orders.filter((el) => {
                            const  new_filter = filter.toLowerCase()
                            return filter ?  el.client_fio.toLowerCase().includes(new_filter) || el.address.toLowerCase().includes(new_filter) : true
                        }
                        ).map((order) =>(   
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td width='25%'>{order.date_of_order}</td>
                                <td>{order.order_time}</td>
                                <td>{order.cost}</td>
                                <td>{order.client_num}</td>
                                <td>{order.client_fio}</td>
                                <td width='100%'>{order.address}</td>
                                <td><button
                                onClick={this.props.delOrder.bind(this, order.id)}
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
    orders: state.orders.orders
});

export default connect(mapStateToProps, {getOrders, delOrder})
(Orders);