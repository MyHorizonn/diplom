import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import {createOrder} from '../../actions/orders'
import {getFreeMachines} from '../../actions/machines'

const blocks = 0;

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
        var m = document.getElementById("machine-0");
        var hd = document.querySelector('input[name=hd-0]:checked');
        console.log(hd.value);
        var d = document.getElementById("duration-0");
        var machines = {hour_or_day: hd.value, duration: d.value, machine: m.value}
        const {date_of_order, client_num, client_fio, address} = this.state;
        const orders = {date_of_order, cost:0, client_num, client_fio, address, machines};
        this.props.createOrder(orders);
    }
 
    render() {
        const {date_of_order, client_num, client_fio, address} = this.state;
        return (
            <div className="card card-body mt-4 mb-4">
                <h2>Добавить заказ</h2>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Дата заказа</label>
                        <input
                        className="form-control"
                        type="datetime-local"
                        name="date_of_order"
                        onChange={this.onChange}
                        value={date_of_order}
                        />
                    </div>
                    <div className="form-group">
                        <label>Номер телефона</label>
                        <input
                        className="form-control"
                        type="text"
                        name="client_num"
                        onChange={this.onChange}
                        value={client_num}
                        />
                    </div>
                    <div className="form-group">
                        <label>ФИО клиента</label>
                        <input
                        className="form-control"
                        type="text"
                        name="client_fio"
                        onChange={this.onChange}
                        value={client_fio}
                        />
                    </div>
                    <div className="form-group">
                        <label>Адрес</label>
                        <input
                        className="form-control"
                        type="text"
                        name="address"
                        onChange={this.onChange}
                        value={address}
                        />
                    </div>
                    <div className="form-group">
                    <table style={{ borderSpacing: '30px 7px', borderCollapse: 'separate'}}>
                        <thead>
                            <tr>
                                <th>Техника</th>
                                <th>Режим</th>
                                <th>Длительность</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr id="block-0">
                                <td className="field-machine">
                                    <select className='form-control' id="machine-0">
                                        <option value="" selected disabled hidden>----------------</option>
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
                                                <input type="radio" value="DAY" name="hd-0"/>День
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                <input type="radio" value="HOUR" name="hd-0"/>Час
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td>
                                    <input
                                    type="number"
                                    id="duration-0"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Добавить
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
