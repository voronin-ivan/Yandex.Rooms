import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ActionCreators from 'actions/ActionCreators';
import Button from 'components/Button';

import './style.scss';

export default class Modal extends Component {

    static propTypes = {
        isAlert: PropTypes.bool,
        date: PropTypes.string,
        room: PropTypes.string,
        onConfirm: PropTypes.func,
        onReject: PropTypes.func
    }

    componentWillMount = () => {
        document.addEventListener('keyup', this._handleKeyUp);
    }

    componentWillUnmount = () => {
        document.removeEventListener('keyup', this._handleKeyUp);
    }

    _handleKeyUp = (event) => {
        if (event.keyCode === 27) {
            this.props.isAlert ? this._closeForm() : this.props.onReject();
        }
    };

    _closeForm = () => {
        ActionCreators.setShowForm(false);
    }

    render() {
        const title = this.props.isAlert ? 'Встреча создана!' : 'Встреча будет удалена безвозвратно';
        const iconClassNames = classNames(
            "modal__body-icon",
            {"modal__body-icon--alert": this.props.isAlert}
        );

        return (
            <div className="modal">
                <div className="modal__body">
                    <div className={iconClassNames}/>
                    <div className="modal__body-title">{title}</div>
                    {this.props.isAlert ? (
                        <div className="modal__body-message">
                            <div>{this.props.date}</div>
                            <div>{this.props.room}</div>
                        </div>
                    ) : null}
                    {this.props.isAlert ? (
                        <div className="modal__body-buttons">
                            <Button className="modal__button"
                                    color="blue"
                                    onClick={this._closeForm}>Хорошо</Button>
                        </div>
                    ) : (
                        <div className="modal__body-buttons">
                            <Button className="modal__button" onClick={this.props.onReject}>Отмена</Button>
                            <Button className="modal__button" onClick={this.props.onConfirm}>Удалить</Button>
                        </div>
                    )}
                </div>
                <div className="modal__backdrop"/>
            </div>
        );
    }
}
