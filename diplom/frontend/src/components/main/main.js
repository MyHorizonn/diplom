import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Fragment } from 'react';

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

export class Login extends Component{
    
    static propTypes = {
    };

    state = {
        username: '',
        pass: '',
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    onSubmit = (e) => {
        e.preventDefault();
        const {username, pass} = this.state;
        if(!username || !pass){
            alert('Заполните поля!')
        }
        else{
        fetch('http://localhost:8000/api/users/', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": getCookie('csrftoken'),
            },
            body: JSON.stringify({
                username: username,
                password: pass
            }),

        })
        .then((response) => {
            if(response.status == 400)
            {
                alert('Пользователь не найден!')
            }
            else{
                return response.json()
            }
            
        })
        .then((data) =>{
            if(data){
                document.cookie = `group=${data['group']}`
                if(data['group'] == 1){
                    window.location.href = 'http://localhost:8000/#/machines'
                }
                if(data['group'] == 2){
                    window.location.href = 'http://localhost:8000/#/orders'
                }
                if(data['group'] == 3){
                    window.location.href = 'http://localhost:8000/#/map'
                }
                if(!data['group']){
                    window.location.href = 'http://localhost:8000/admin'
                }
            }
        })
    }
    }

    render(){
        const {username, pass} = this.state;
        return(
            <Fragment>
                <div className="card card-body mt-4 mb-4" style={{margin: 'auto', width: '700px'}}>
                    <form onSubmit={this.onSubmit} style={{width: '600px', margin: 'auto'}}>
                        <div className="form-group">
                            <label>Логин</label>
                            <input
                            className='form-control'
                            type='text'
                            name='username'
                            onChange={this.onChange}
                            value={username}
                            />
                        </div>
                        <div className='form-group'>
                        <label>Пароль</label>
                            <input
                            className='form-control'
                            type='password'
                            name='pass'
                            onChange={this.onChange}
                            value={pass}
                            />
                        </div>
                        <div className="form-group">
                        <button type="submit"  className="btn btn-primary" 
                        style={{position: 'relative', left: '43%'}}>
                            Войти
                        </button>
                        </div>
                    </form>
                </div>
                </Fragment>
        )
    }
}

export default connect()(Login);