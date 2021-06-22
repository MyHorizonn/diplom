import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTypes, delTypes } from '../../actions/machinetypes';

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


export class MachineTypes extends Component {

    state = {
        filter: '',
    }

    static propTypes = {
        machinetypes: PropTypes.array.isRequired,
        getTypes: PropTypes.func.isRequired,
        delTypes: PropTypes.func.isRequired,
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })};

    componentDidMount(){
        this.props.getTypes(getCookie('csrftoken'));
    }

    render() {
        const {filter} = this.state;
        return (
            <Fragment>
                <h2>Список типов техники</h2>
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
                <table className="table" style={{width: '1200px', maxHeight:'500px', overflowY: 'scroll', overflowX:'hidden', display: 'inline-block'}}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Стоимость в час</th>
                            <th>Стоимость в день</th>
                            <th/>
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.machinetypes.filter((el) => {
                            const  new_filter = filter.toLowerCase()
                            return filter ?  el.name.toLowerCase().includes(new_filter) : true
                        }
                        ).map((type) =>(
                            <tr key={type.id}>
                                <td width='5%'>{type.id}</td>
                                <td width='10%'>{type.name}</td>
                                <td width='20%'>{type.about}</td>
                                <td width='20%'>{type.cost_to_hour}</td>
                                <td width='20%'>{type.cost_to_day}</td>
                                <td width='10%'><button
                                onClick={this.props.delTypes.bind(this, type.id, getCookie('csrftoken'), getCookie('group'))}
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
    machinetypes: state.machinetypes.machinetypes,
});

export default connect(mapStateToProps, {getTypes, delTypes})
(MachineTypes);