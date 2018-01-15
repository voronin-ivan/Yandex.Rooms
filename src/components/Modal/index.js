import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ActionCreators from 'actions/ActionCreators';
import Button from 'components/Button';

import './style.scss';

export default class Modal extends Component {

    static propTypes = {
        type: PropTypes.string,
        date: PropTypes.string,
        room: PropTypes.string,
        onConfirm: PropTypes.func,
        onReject: PropTypes.func
    }

    state = {
        isAlert: true
    }

    componentWillMount = () => {
        if (!this.props.type) {
            this.setState({ isAlert: false });
        }
    }

    _getModalTitle = () => {
        switch(this.props.type) {
            case 'eventCreated':
                return 'Встреча создана!';
            case 'eventUpdated':
                return 'Встреча отредактирована!';
            case 'eventRemoved':
                return 'Встреча удалена!';
            default:
                return 'Встреча будет удалена безвозвратно';
       }
    }

    render() {
        const title = this._getModalTitle();
        const iconClassNames = classNames(
            "modal__body-icon",
            {"modal__body-icon--alert": this.state.isAlert}
        );

        return (
            <div className="modal">
                <div className="modal__body">
                    <div className={iconClassNames}/>
                    <div className="modal__body-title">{title}</div>
                    {this.state.isAlert && this.props.type !== 'eventRemoved' ? (
                        <div className="modal__body-message">
                            <div>{this.props.date}</div>
                            <div>{this.props.room}</div>
                        </div>
                    ) : null}
                    {this.state.isAlert ? (
                        <div className="modal__body-buttons">
                            <Button className="modal__button"
                                    color="blue"
                                    onClick={this.props.onConfirm}>Хорошо</Button>
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
