import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import ActionCreators from 'actions/ActionCreators';
import App from 'components/App';
import { getData } from 'api';

getData()
    .then(data => {
        data.events = Immutable.List(data.events);
        ActionCreators.setGeneralStore(data);
        ReactDOM.render(<App />, document.getElementById('app'));
    });
