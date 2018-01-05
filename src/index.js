import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import App from './components/App';

axios.get('/api/events')
    .then(response => console.log(response.data))
    .catch(error => console.log(error));

ReactDOM.render(<App />, document.getElementById('root'));
