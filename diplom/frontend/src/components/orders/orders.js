import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getOrders, delOrder } from '../../actions/orders';

export class Orders extends Component {
    static propTypes = {
        orders: PropTypes.array.isRequired,
        getOrders: PropTypes.func.isRequired,
        delOrder: PropTypes.func.isRequired,
    };

    componentDidMount(){
        this.props.getOrders();
    }

    render() {
        return (
            <Fragment>
                <h2>Orders</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date of order</th>
                            <th>Cost</th>
                            <th>Client phone</th>
                            <th>Client name</th>
                            <th>Address</th>
                            <th/>
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.orders.map((order) =>(
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.date_of_order}</td>
                                <td>{order.cost}</td>
                                <td>{order.client_num}</td>
                                <td>{order.client_fio}</td>
                                <td>{order.address}</td>
                                <td><button
                                onClick={this.props.delOrder.bind(this, order.id)}
                                className="btn btn-danger btn-sm">
                                    Delete</button></td>
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