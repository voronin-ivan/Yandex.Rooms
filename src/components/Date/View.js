import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InlineSVG from 'svg-inline-react';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import ActionCreators from 'actions/ActionCreators';
import { months } from 'core/utils';
import Button from 'components/Button';

import './style.scss';
import 'react-day-picker/lib/style.css';

export default class View extends Component {

    static propTypes = {
        date: PropTypes.instanceOf(Date)
    }

    state = {
        showDatePicker: false
    }

    _toggleDatePicker = () => {
        this.setState((prevState) => {
            return {showDatePicker: !prevState.showDatePicker};
        });
    }

    _getDate = () => {
        const day = this.props.date.getDate();
        const month = this.props.date.getMonth();
        const year = this.props.date.getFullYear();
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        let monthName = months[month];

        if (day === currentDay && month === currentMonth && year === currentYear) {
            monthName = `${monthName.substr(0, 3)} · Сегодня`;
        }

        return `${day} ${monthName}`;
    }

    _reduceDate = () => {
        const newDate = new Date(this.props.date.valueOf() - 86400000);
        const currentDate = new Date().valueOf();

        ActionCreators.setDate(newDate);
    }

    _increaseDate = () => {
        const newDate = new Date(this.props.date.valueOf() + 86400000);

        ActionCreators.setDate(newDate);
    }

    render() {
        const date = this._getDate();
        const datePicker = this.state.showDatePicker ? (
            <DayPicker className="date__picker" localeUtils={MomentLocaleUtils} locale="ru"/>
        ) : null;

        return (
            <div className="date">
                <Button className="date__icon date__icon--left" isIcon={true} onClick={this._reduceDate}>
                    <InlineSVG src={require(`!svg-inline-loader?removeSVGTagAttrs=false!./arrow.svg`)} />
                </Button>
                <div className="date__info" onClick={this._toggleDatePicker}>{date}</div>
                <Button className="date__icon date__icon--right" isIcon={true} onClick={this._increaseDate}>
                    <InlineSVG src={require(`!svg-inline-loader?removeSVGTagAttrs=false!./arrow.svg`)} />
                </Button>
                {datePicker}
            </div>
        );
    }
}
