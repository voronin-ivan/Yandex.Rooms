import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ActionCreators from 'actions/ActionCreators';
import Button from 'components/Button';

import './style.scss';

export default class View extends Component {

    static propTypes = {
        show_form: PropTypes.bool
    }

    _addNewEvent = () => {
        ActionCreators.setShowForm(true);
    }

    render() {
        const button = !this.props.show_form ? (
            <Button color="blue" onClick={this._addNewEvent}>Создать встречу</Button>
        ) : null;

        return (
            <header className="header">
                <a href="/" className="header__logo"/>
                {button}
            </header>
        );
    }
}
