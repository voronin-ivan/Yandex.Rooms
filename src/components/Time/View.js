import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import './style.scss';

export default class View extends Component {

    static propTypes = {
        date: PropTypes.instanceOf(Date)
    }

    _renderHours = () => {
        const hours = [];

        for (let i = 0; i < 24; i++) {
            const date = this.props.date;
            const currentDate = new Date();
            const firstCondition = moment(date).isBefore(currentDate, 'day');
            const secondCondition = moment(date).isSame(currentDate, 'day') && date.getHours() > i;
            const isPastTime = (firstCondition || secondCondition) ? true : false;
            const hour = i < 10 ? `0${i}` : i;
            const hourClassNames = classNames(
                "time__item",
                {"time__item--grey": isPastTime}
            );

            hours.push(
                <div className={hourClassNames} key={`hour-${i}`}>
                    <span>{hour}</span>
                    <span>:00</span>
                </div>
            )
        }

        return hours;
    }

    render() {
        const hours = this._renderHours();

        return (
            <div className="time">
                {hours}
            </div>
        );
    }
}
