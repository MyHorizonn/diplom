import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'

export class Form extends Component{
    state = {}
    static PropTypes = {

    };

    render(){
        return(
            <div className="card card-body mt-4 mb-4">
                <h2>Оставьте заявку</h2>
                
            </div>
        )
    }
}

export default connect()(Form);