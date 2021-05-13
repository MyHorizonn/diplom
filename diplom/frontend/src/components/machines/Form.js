import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import {createMachines} from '../../actions/machines'

export class Form extends Component {
    state = {
        name: '',
        about: '',
        cost_to_hour: '',
        cost_to_day: '',
        status: '',
    }

    static propTypes = {
        createMachines: PropTypes.func.isRequired
    };

    Clear(){
        
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });
    onSubmit = (e) => {
        e.preventDefault();
        const {name, about, cost_to_hour, cost_to_day, status} = this.state;
        const machines = {name, about, cost_to_hour, cost_to_day, status};
        this.props.createMachines(machines);
        this.Clear();
        console.log("submit");
    }
 
    render() {
        const {name, about, cost_to_hour, cost_to_day, status} = this.state;
        return (
            <div className="card card-body mt-4 mb-4">
                <h2>Добавить технику</h2>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Название</label>
                        <input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={this.onChange}
                        value={name}
                        />
                    </div>
                    <div className="form-group">
                        <label>Описание</label>
                        <input
                        className="form-control"
                        type="text"
                        name="about"
                        onChange={this.onChange}
                        value={about}
                        />
                    </div>
                    <div className="form-group">
                        <label>Стоимость в час</label>
                        <input
                        className="form-control"
                        type="text"
                        name="cost_to_hour"
                        onChange={this.onChange}
                        value={cost_to_hour}
                        />
                    </div>
                    <div className="form-group">
                        <label>Стоимость в день</label>
                        <input
                        className="form-control"
                        type="text"
                        name="cost_to_day"
                        onChange={this.onChange}
                        value={cost_to_day}
                        />
                    </div>
                    <div className="form-group">
                    <label>Состояние</label>
                    <select className="form-control" name="status" value={status} onChange={this.onChange}>
                        <option value="" selected disabled hidden>-------------------</option>
                        <option value="FREE">Свободна</option>
                        <option value="NOT_FREE">Занята</option>
                        <option value="REPAIR">Ремонт</option>
                    </select>
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

export default connect(null, {createMachines})(Form);
