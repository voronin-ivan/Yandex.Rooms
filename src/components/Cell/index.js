import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import InlineSVG from 'svg-inline-react';
import classNames from 'classnames';
import ActionCreators from 'actions/ActionCreators';
import Button from 'components/Button';
import { minuteWidth } from 'core/utils';

import './style.scss';

export default class View extends Component {

    static propTypes = {
        isFree: PropTypes.bool,
        roomId: PropTypes.number,
        timeStart: PropTypes.number,
        duration: PropTypes.number,
        disabled: PropTypes.bool,
        eventId: PropTypes.string,
        eventTitle: PropTypes.string,
        eventStart: PropTypes.instanceOf(Date),
        eventEnd: PropTypes.instanceOf(Date),
        eventMembers: PropTypes.array,
        eventRoom: PropTypes.string,
        hasBorder: PropTypes.bool
    }

    state = {
        showTooltip: false
    }

    componentWillMount = () => {
        moment.locale('ru');
    }

    _toggleTooltip = () => {
        this.setState((prevState) => {
            return {showTooltip: !prevState.showTooltip};
        });
    }

    _editEvent = () => {
        ActionCreators.setEventForEdit(this.props.eventId);
        ActionCreators.setShowForm(true);
    }

    _getAllMembers = (n) => {
        const arr = String(n).split('').map(a => +a);
        const lastNumber = arr[arr.length - 1];

        if (lastNumber === 1) {
            return '1 участник';
        } else if (lastNumber > 1 && lastNumber < 5) {
            return `${n} участника`;
        } else {
            return `${n} участников`;
        }
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
        ActionCreators.setRoom(this.props.roomId);
        ActionCreators.setTimeStart(timeStart);
        ActionCreators.setTimeEnd(timeEnd);
    }

    _renderTooltip = () => {
        if (this.state.showTooltip) {
            const date = moment(this.props.eventStart).format('D MMMM, LT—') + moment(this.props.eventEnd).format('LT');
            const randomNumber = Math.floor(Math.random() * this.props.eventMembers.length);
            const randomMember = this.props.eventMembers[randomNumber];
            const membersCount = this.props.eventMembers.length;
            const memberPhoto = randomMember.avatarUrl ? (
                <img src={randomMember.avatarUrl} className="cell__modal-img" alt={randomMember.login}/>
            ) : (
                <div className="cell__modal-img cell__modal-img--empty"/>
            );

            return (
                <div className="cell__modal">
                    <Button className="cell__modal-icon"
                            isIcon={true}
                            onClick={this._editEvent}>
                        <InlineSVG src={require(`!svg-inline-loader?removeSVGTagAttrs=false!./edit.svg`)} />
                    </Button>
                    <div className="cell__modal-title">{this.props.eventTitle}</div>
                    <div>
                        <span>{date}</span>
                        <span className="cell__modal-separator">·</span>
                        <span>{this.props.eventRoom}</span>
                    </div>
                    <div className="cell__modal-info">
                        {memberPhoto}
                        <div>{randomMember.login}</div>
                        <div className="cell__modal-members">
                            {`и ещё ${this._getAllMembers(membersCount - 1)}`}
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    }

    render() {
        const cellWidth = this.props.duration * minuteWidth;
        const cellClassNames = classNames(
            "cell",
            {"cell--free": this.props.isFree},
            {"cell--active": this.state.showTooltip},
            {"cell--disabled": this.props.duration < 15 || (this.props.disabled && this.props.isFree)},
            {"cell--border": this.props.hasBorder}
        );
        const tooltip = this._renderTooltip();
        const actionOnClick = this.props.isFree ? this._addEvent : this._toggleTooltip;

        return (
            <div className={cellClassNames}
                 style={{ width: cellWidth}}
                 onClick={actionOnClick}>
                {tooltip}
            </div>
        );
    }
}