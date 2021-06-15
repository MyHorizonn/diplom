import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import {createTypes} from '../../actions/machinetypes'


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

export class Form2 extends Component {
    state = {
        name: '',
        about: '',
        cost_to_hour: '',
        cost_to_day: '',
    }

    static propTypes = {
        createTypes: PropTypes.func.isRequired
    };

    Clear(){
        
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });
    onSubmit = (e) => {
        e.preventDefault();
        
        const {name, about, cost_to_hour, cost_to_day} = this.state;
        const type = {name, about, cost_to_hour, cost_to_day};
        this.props.createTypes(type, getCookie('csrftoken'));
        this.Clear();
        alert("Тип техники успешно добавлен")
    }
 
    render() {
        const {name, about, cost_to_hour, cost_to_day} = this.state;
        return (
            <div className="card card-body mt-4 mb-4">
                <h2>Добавить тип техники</h2>
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
                        <button type="submit" className="btn btn-primary">
                            Добавить
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default connect(null, {createTypes})(Form2);
