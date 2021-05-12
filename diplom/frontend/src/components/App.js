import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import Header from './layout/header.js';
import Dashboard_machines from './machines/Dashboard';
import { Provider } from "react-redux";
import store from '../store';
import Dashboard_orders from './orders/Dashboard';
import Dashboard_main from './main/Dashboard';


class App extends Component{

    render(){
        return(
            <Provider store={store}>
                <Router>
                <Fragment>
                    <Header />
                    <div className="container">
                        <Switch>
                            <Route exact path="/machines" component={Dashboard_machines}/>
                            <Route exact path="/orders" component={Dashboard_orders} />
                            <Route exact path="/" component={Dashboard_main}/>
                        </Switch> 
                    </div>
                </Fragment>
                </Router>
            </Provider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));