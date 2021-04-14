import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000'

export default class MachineService{

    constructor(){}

    getMachines(){
        const url = `${API_URL}/api/machines/`;
        return axios.get(url).then(response => response.data);
    }

    getMachineByUrl(link){
        const url = `${API_URL}${link}`;
        return axios.get(url).then(response => response.data);
    }

    getMachine(pk){
        const url = `${API_URL}/api/machines/${pk}`;
        return axios.get(url).then(response => response.data);
    }

    deleteMachine(machine){
        const url = `${API_URL}/api/machines/${machine.pk}`;
        return axios.delete(url);
    }

    createMachine(machine){
        const url = `${API_URL}/api/machines/`;
        return axios.post(url, machine);
    }

    updateMachine(machine){
        const url = `${API_URL}/api/machines/${machine.pk}`;
        return axios.put(url, machine);
    }
}