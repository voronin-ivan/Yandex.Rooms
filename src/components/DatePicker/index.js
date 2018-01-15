import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import moment from 'moment';

import './style.scss';

export default class DatePicker extends Component {

    static propTypes = {
        isForForm: PropTypes.bool,
        className: PropTypes.string,
        date: PropTypes.instanceOf(Date),
        onFocus: PropTypes.func,
        onDayClick: PropTypes.func
    }

    render() {
        const timeFrom = this.props.isForForm ? new Date() : moment().subtract(1.5, 'months').toDate();
        const timeTo = moment().add(1.5, 'months').toDate();
        const disabledDays = {
            before: timeFrom,
            after: timeTo
        };

        return (
            <DayPicker className={`date-picker ${this.props.className}`}
                       disabledDays={disabledDays}
                       fromMonth={timeFrom}
                       toMonth={timeTo}
                       initialMonth={this.props.date}
                       month={this.props.date}
                       selectedDays={this.props.date}
                       onDayClick={this.props.onDayClick}
                       localeUtils={MomentLocaleUtils}
                       locale='ru'/>
        );
    }
}
