import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
        const headerClassNames = classNames(
            "header",
            {"header--index": !this.props.show_form}
        );
        const button = !this.props.show_form ? (
            <Button className="header__button"
                    color="blue"
                    onClick={this._addNewEvent}>Создать встречу</Button>
        ) : null;

        return (
            <header className={headerClassNames}>
                <a href="/" className="header__logo"/>
                {button}
            </header>
        );
    }
}
