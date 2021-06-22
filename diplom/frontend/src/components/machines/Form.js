import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import {createMachines} from '../../actions/machines'
import {getTypes} from '../../actions/machinetypes'


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

export class Form extends Component {
    state = {
        name: '',
        about: '',
        status: '',
    }

    static propTypes = {
        createMachines: PropTypes.func.isRequired,
        machinetypes: PropTypes.array.isRequired,
    };

    Clear(){
        
    }

    componentDidMount(){
        this.props.getTypes(getCookie('csrftoken'))
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });
    onSubmit = (e) => {
        e.preventDefault();
        var type = document.getElementById("machinetypes").value;
        const {name, about, status} = this.state;
        const machines = {name, about, status, type};
        if(!type || !name || !about || !status){
            alert('Заполните поля!')
        }
        else{
        this.props.createMachines(machines, getCookie('csrftoken'));
        this.Clear();
        alert('Техника успешно добавлена')
        this.props.getTypes(getCookie('csrftoken'));
        }
    }
 
    render() {
        const {name, about, status} = this.state;
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
                    <label>Состояние</label>
                    <select className="form-control" name="status" value={status} onChange={this.onChange}>
                        <option value="" selected disabled hidden>-------------------</option>
                        <option value="FREE">Готова к работе</option>
                        <option value="REPAIR">Ремонт</option>
                    </select>
                    </div>
                    <div className='form-group'>
                    <label>Тип техники</label>
                    <select className='form-control' id="machinetypes">
                        <option value="" selected disabled hidden>----------------</option>
                            {this.props.machinetypes.map((type) =>(
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
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

const mapStateToProps = state => ({
    machinetypes: state.machinetypes.machinetypes
})

export default connect(mapStateToProps, {createMachines, getTypes})(Form);
