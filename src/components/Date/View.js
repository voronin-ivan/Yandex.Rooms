import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InlineSVG from 'svg-inline-react';
import moment from 'moment';
import ActionCreators from 'actions/ActionCreators';
import { months } from 'core/utils';
import Button from 'components/Button';
import DatePicker from 'components/DatePicker';

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
        const date = this.props.date;
        const day = date.getDate();
        const month = date.getMonth();

        let monthName = months[month];

        if (moment(this.props.date).isSame(new Date(), 'day')) {
            monthName = `${monthName.substr(0, 3)} · Сегодня`;
        }

        return `${day} ${monthName}`;
    }

    _reduceDate = () => {
        const newDate = moment(this.props.date).subtract(1, 'days').toDate();
        const minDate = moment().subtract(1.5, 'months').toDate();

        if (!moment(newDate).isBefore(minDate, 'day')) {
            ActionCreators.setDate(newDate);
        }
    }

    _increaseDate = () => {
        const newDate = moment(this.props.date).add(1, 'days').toDate();
        const minDate = moment().add(1.5, 'months').toDate();

        if (!moment(newDate).isAfter(minDate, 'day')) {
            ActionCreators.setDate(newDate);
        }
    }

    _setNewDate = (date) => {
        const currenDate = new Date();

        if (moment(date).isSame(currenDate, 'day')) {
            date = moment(date).set({
                'hour': currenDate.getHours(),
                'minute': currenDate.getMinutes()
            }).toDate();
        }

        ActionCreators.setDate(date);
        this.setState({showDatePicker: false});
    }

    render() {
        const date = this._getDate();
        const datePicker = this.state.showDatePicker ? (
            <DatePicker className="date__picker"
                        date={this.props.date}
                        onDayClick={this._setNewDate} />
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
