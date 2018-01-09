import React from 'react';
import ReactDOM from 'react-dom';
import ActionCreators from 'actions/ActionCreators';
import App from 'components/App';
import { getData } from 'api';

getData()
    .then(data => {
        ActionCreators.setGeneralStore(data);
        ReactDOM.render(<App />, document.getElementById('app'));
    });
