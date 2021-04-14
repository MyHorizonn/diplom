import React, {Component} from 'react';

import MachineService from './MachineService'

const machineService = new MachineService();

class MachineList extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            machines: [],
            nextPageURL: ''
        };
        this.nextPage = this.nextPage.bind(this);
        this.handleDelete = this.handleDelete(this);
    }
    componentDidMount() {
        var self = this;
        machineService.getMachine().then(function(result){
            self.setState({machines: result.data,nextPageURL: result.nextlink})
        });
    }
    
    handleDelete(e, pk){
        var self = this;
        machineService.deleteMachine({pk : pk}).then(()=> {
            var newArr = self.state.machines.filter(function(obj){
                return obj.pk !== pk;
            });
            self.setState({machines: newArr})
        });
    }
    
    nextPage(){
        var self = this;
        machineService.getMachineByUrl(this.state.nextPageURL).then((result)=>{
            self.setState({machines: result.data, nextPageURL: result.nextlink})
        });
    }
    
    render(){
        return(
            <div className="machines-list">
                <table className="table">
                    <thread key="thread">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>About</th>
                            <th>Cost in hour</th>
                            <th>Cost in day</th>
                            <th>Status</th>
                        </tr>
                    </thread>
                    <tbody>
                        {this.state.machines.map(c =>
                        <tr key={c.pk}>
                            <td>{c.name}</td>
                            <td>{c.about}</td>
                            <td>{c.cost_to_hour}</td>
                            <td>{c.cost_to_day}</td>
                            <td>{c.status}</td>
                            <td>
                            <button onClick={(e) => this.handleDelete(e, c.pk)}> Delete</button>
                            <a href={"/machines/" + c.pk}>Update</a>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
                <button className="btn btn-primary" onClick= {this.nextPage}>Next</button>
            </div>
        );
    }
}
export default MachineList;

