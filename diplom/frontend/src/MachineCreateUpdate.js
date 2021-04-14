import  React, { Component } from  'react';

import MachineService from './MachineService';

const machineSerivce = new MachineService();


class MachineCreateUpdate extends Component{

    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleCreate(){
        machineSerivce.createMachine({
            "name": this.refs.name.value,
            "about": this.refs.about.value,
            "cost_to_hour": this.refs.cost_to_hour.value,
            "cost_to_day": this.refs.cost_to_day.value,
            "status": this.refs.about.value
        }).then((result)=>{
            alert("Machine created!");
        }).catch(()=>{
            alert("Error");
        });
    }
    
    
    handleUpdate(pk){
        machineSerivce.updateMachine({
            "name": this.refs.name.value,
            "about": this.refs.about.value,
            "cost_to_hour": this.refs.cost_to_hour.value,
            "cost_to_day": this.refs.cost_to_day.value,
            "status": this.refs.about.value
        }).then((result)=> {
            alert('Machine updated');
        }).catch(()=>{
            alert('Error');
        });
    }
    
    
    handleSubmit(event){
        const{ match: {params}} = this.props;
        if(params && params.pk){
            this.handleUpdate(params.pk);
        }
        else{
            this.handleCreate();
        }
        event.preventDefault();
    }
    
    componentDidMount(){
        const {match: {params}} = this.props;
        if(params && params.pk){
            machineSerivce.getMachine(params.pk).then((c)=>{
                this.refs.name.value = c.name;
                this.refs.about.value = c.about;
                this.refs.cost_to_hour.value = c.cost_to_hour;
                this.refs.cost_to_day.value = c.cost_to_day
                this.refs.about.value = c.status;
            })
        }
    }
    
    
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label>
                        Name:</label>
                        <input className="form-control" type="text" ref='name'/>
                    <label>
                        About:</label>
                        <input className="form-control" type="text" ref='about'/>
                    <label>
                        Cost in hour:</label>
                    <input className="form-control" type="number" ref='cost_to_hour'/>
                        <label>
                        Cost in day:</label>
                        <input className="form-control" type="number" ref='cost_to_day'/>
                    <label>
                        Status:</label>
                        <input className="form-control" type="text" ref='status'/>
                    
                    <input className="btn btn-primary" type="submit" value="Submit"/>
                </div>
            </form>
        );
    }
}
export default MachineCreateUpdate;


