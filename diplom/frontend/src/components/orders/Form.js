import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import {createOrder} from '../../actions/orders'
import {getMachines} from '../../actions/machines'

const blocks = 0;

function twoDigits(num) {
    if(num < 10){
        return "0" + num.toString()
    }
    return num.toString()
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

function endDate(date, time, hd, d) {
    if(hd.value == 'DAY'){
        var date1 = new Date(date)
        date1.setDate(date1.getDate() + parseInt(d.value))
        var date2 = date1.getFullYear() + '-' + twoDigits(date1.getMonth() + 1) + '-' + twoDigits(date1.getDate())
        return [date2, time]
    }
    else{
        var date1 = new Date(date + 'T' + time)
        date1.setHours(date1.getHours() + parseInt(d.value))
        var date2 = twoDigits(date1.getHours()) + ':' + twoDigits(date1.getMinutes()) + ':' + twoDigits(date1.getSeconds())
        var date3 = date1.getFullYear() + '-' + twoDigits(date1.getMonth() + 1) + '-' + twoDigits(date1.getDate())
        return [date3, date2]
    }
}

export class Form extends Component {
    state = {
        date_of_order: '',
        order_time: '',
        cost: '',
        client_num: '',
        client_fio: '',
        address: '',
    }

    static propTypes = {
        createOrder: PropTypes.func.isRequired,
        machines: PropTypes.array.isRequired,
    };

    componentDidMount(){
        this.props.getMachines(getCookie('csrftoken'))
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });
    onSubmit = (e) => {
        e.preventDefault();
        var coordinate = {
            "lat": '',
            "lon": '',
        }
        var m = document.getElementById("machine-0");
        var hd = document.querySelector('input[name=hd-0]:checked');
        var d = document.getElementById("duration-0");
        var machines = {hour_or_day: hd.value, duration: d.value, machine: m.value}
        const {date_of_order, order_time, client_num, client_fio, address} = this.state;
        var end_date = endDate(date_of_order, order_time, hd, d)
        fetch('https://nominatim.openstreetmap.org/search?q=' + address.split(' ').join('+') + '&format=json&limit=1')
        .then((response) => response.json())
        .then((data) =>{
            if(data[0]){
                coordinate.lat = data[0].lat
                coordinate.lon = data[0].lon
                const orders = {date_of_order, order_time, end_date, cost: 0, client_num, client_fio, address, coordinate, machines};
                console.log(getCookie('csrftoken'))
                this.props.createOrder(orders, getCookie('csrftoken'));
            }
            else{
                alert("Адрес не найден.")
            }
        })
    }
 
    render() {
        const {date_of_order, order_time, client_num, client_fio, address} = this.state;
        return (
            <div className="card card-body mt-4 mb-4">
                <h2>Добавить заказ</h2>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Дата заказа</label>
                        <input
                        className="form-control"
                        type="date"
                        name="date_of_order"
                        onChange={this.onChange}
                        value={date_of_order}
                        />
                    </div>
                    <div className="form_group">
                        <label>Время заказа</label>
                        <input
                        className="form-control"
                        type="time"
                        name="order_time"
                        onChange={this.onChange}
                        value={order_time}
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
                                                    <div className="form-check">
                                                        <input type="radio" value="DAY" name="hd-0" className="form-check-input"/> День
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="form-check">
                                                        <input type="radio" value="HOUR" name="hd-0" className="form-check-input"/> Час
                                                    </div>
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

export default connect(mapStateToProps, {createOrder, getMachines})(Form);
