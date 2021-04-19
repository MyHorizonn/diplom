import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import {createOrder} from '../../actions/orders'

export class Form extends Component {
    state = {
        date_of_order: '',
        cost: '',
        client_num: '',
        client_fio: '',
        address: '',
    }

    static propTypes = {
        createOrder: PropTypes.func.isRequired
    };

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });
    onSubmit = (e) => {
        e.preventDefault();
        const {date_of_order, cost, client_num, client_fio, address} = this.state;
        const orders = {date_of_order, cost, client_num, client_fio, address};
        this.props.createOrder(orders);
        console.log("submit");
    }
 
    render() {
        const {date_of_order, cost, client_num, client_fio, address} = this.state;
        return (
            <div className="card card-body mt-4 mb-4">
                <h2>Add Order</h2>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Date of order</label>
                        <input
                        className="form-control"
                        type="date"
                        name="date_of_order"
                        onChange={this.onChange}
                        value={date_of_order}
                        />
                    </div>
                    <div className="form-group">
                        <label>Cost</label>
                        <input
                        className="form-control"
                        type="text"
                        name="cost"
                        onChange={this.onChange}
                        value={cost}
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone number</label>
                        <input
                        className="form-control"
                        type="text"
                        name="client_num"
                        onChange={this.onChange}
                        value={client_num}
                        />
                    </div>
                    <div className="form-group">
                        <label>Client name</label>
                        <input
                        className="form-control"
                        type="text"
                        name="client_fio"
                        onChange={this.onChange}
                        value={client_fio}
                        />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input
                        className="form-control"
                        type="text"
                        name="address"
                        onChange={this.onChange}
                        value={address}
                        />
                    </div>
                    <div className="form-group">
                    <table>
                        <thead>
                            <tr>
                                <th className="columne-machine required">Machine</th>
                                <th className="column-hour_or_day required">Hour or day</th>
                                <th className="column-durations required">Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="form-row dynamic-machines" id="machine-0">
                                <td className="field-machine">
                                <select className="machines-0-machine" id="id_machines-0-machine">
                                    <option value="" selected disabled hidden>---------</option>
                                </select>
                                </td>
                                <td className="field-hour_or_day">
                                    <select>
                                        <option value="" selected disabled hidden>---------</option>
                                        <option value="HOUR">Hour</option>
                                        <option value="DAY">Day</option>
                                    </select>
                                </td>
                                <td>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="address"
                                    onChange={this.onChange}
                                    value={address}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default connect(null, {createOrder})(Form);
