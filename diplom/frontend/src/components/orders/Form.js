import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import {createOrder} from '../../actions/orders'
import {getFreeMachines} from '../../actions/machines'

export class Form extends Component {
    state = {
        date_of_order: '',
        cost: '',
        client_num: '',
        client_fio: '',
        address: '',
    }

    static propTypes = {
        createOrder: PropTypes.func.isRequired,
        machines: PropTypes.array.isRequired,
        getFreeMachines: PropTypes.func.isRequired
    };

    componentDidMount(){
        this.props.getFreeMachines();
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });
    onSubmit = (e) => {
        e.preventDefault();
        var m = document.getElementById("id_machines-0-machine");
        var hd = document.getElementById("hd");
        var d = document.getElementById("id_machins-0-duration");
        var machines = {hour_or_day: hd.value, duration: d.value, machine: m.value}
        const {date_of_order, cost, client_num, client_fio, address} = this.state;
        const orders = {date_of_order, cost, client_num, client_fio, address, machines};
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
                        <label>Cost ₽</label>
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
                    <table style={{ borderSpacing: '11px 7px', borderCollapse: 'separate'}}>
                        <thead>
                            <tr>
                                <th>Machine</th>
                                <th>Hour or day</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr id="machine-0">
                                <td className="field-machine">
                                    <select className='form-control' id="id_machines-0-machine">
                                        <option value="" selected disabled hidden>------------------</option>
                                        {this.props.machines.map((machine) =>(
                                            <option key={machine.id} value={machine.id}>{machine.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td id='field-hour_or_day'>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                <input type="radio" value="DAY" name="hd"/>День
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                <input type="radio" value="HOUR" name="hd"/>Час
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td className="field-duration">
                                    <input
                                    type="number"
                                    name="machines-0-duraion"
                                    id="id_machines-0-duration"
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

const mapStateToProps = state => ({
    machines: state.machines.machines
})

export default connect(mapStateToProps, {createOrder, getFreeMachines})(Form);
