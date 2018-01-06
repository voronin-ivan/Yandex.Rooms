import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ActionCreators from 'actions/ActionCreators';
import App from 'components/App';

axios.get('/api/data')
    .then(response => {
        ActionCreators.setGeneralStore(response.data);
        ReactDOM.render(<App />, document.getElementById('app'));
    })
    .catch(error => console.log(error));
