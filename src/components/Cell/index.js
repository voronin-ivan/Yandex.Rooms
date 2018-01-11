import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ActionCreators from 'actions/ActionCreators';
import Button from 'components/Button';
import { minuteWidth } from 'core/utils';

export default class Cell extends Component {

    static propTypes = {
        isFree: PropTypes.bool,
        room: PropTypes.number,
        timeStart: PropTypes.number,
        duration: PropTypes.number,
    }

    _addEvent = () => {
        let startHour = Math.floor(this.props.timeStart / 60);
        let startMinute = this.props.timeStart % 60;
        let endHour = Math.floor((this.props.timeStart + this.props.duration) / 60);
        let endMinute = (this.props.timeStart + this.props.duration) % 60;

        if (startHour < 10) {
            startHour = `0${startHour}`;
        }

        if (startMinute < 10) {
            startMinute = `0${startMinute}`;
        }

        if (endHour < 10) {
            endHour = `0${endHour}`;
        }

        if (endMinute < 10) {
            endMinute = `0${endMinute}`;
        }

        if (endHour === 24) {
            endHour = '23';
            endMinute = '59';
        }

        const timeStart = `${startHour}:${startMinute}`;
        const timeEnd = `${endHour}:${endMinute}`;

        ActionCreators.setShowForm(true);
        ActionCreators.setRoom(this.props.room);
        ActionCreators.setTimeStart(timeStart);
        ActionCreators.setTimeEnd(timeEnd);
    }

    render() {
        const cellWidth = this.props.duration * minuteWidth;
        const cellClassNames = classNames(
            "chart__element",
            {"chart__element--free": this.props.isFree},
            {"chart__element--disabled": this.props.duration < 15}
        );

        return (
            <div className={cellClassNames}
                 style={{ width: cellWidth}}
                 onClick={this._addEvent} />
        );
    }
}
