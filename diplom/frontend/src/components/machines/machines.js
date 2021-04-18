import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getMachines, delMachines, createMachines } from '../../actions/machines';

export class Machines extends Component {
    static propTypes = {
        machines: PropTypes.array.isRequired,
        getMachines: PropTypes.func.isRequired,
        delMachines: PropTypes.func.isRequired,
    };

    componentDidMount(){
        this.props.getMachines();
    }

    render() {
        return (
            <Fragment>
                <h2>Machines</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>About</th>
                            <th>Cost per hour</th>
                            <th>Cost per day</th>
                            <th>Status</th>
                            <th/>
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.machines.map((machine) =>(
                            <tr key={machine.id}>
                                <td>{machine.id}</td>
                                <td>{machine.name}</td>
                                <td>{machine.about}</td>
                                <td>{machine.cost_to_hour}</td>
                                <td>{machine.cost_to_day}</td>
                                <td>{machine.status}</td>
                                <td><button
                                onClick={this.props.delMachines.bind(this, machine.id)}
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
    machines: state.machines.machines
});

export default connect(mapStateToProps, {getMachines, delMachines})
(Machines);