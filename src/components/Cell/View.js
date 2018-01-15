import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import moment from 'moment';
import InlineSVG from 'svg-inline-react';
import classNames from 'classnames';
import ActionCreators from 'actions/ActionCreators';
import Button from 'components/Button';
import { minuteWidth } from 'core/utils';

import './style.scss';

export default class View extends Component {

    static propTypes = {
        users: PropTypes.array,
        events: PropTypes.instanceOf(Immutable.List),
        rooms: PropTypes.array,
        date: PropTypes.instanceOf(Date),
        roomId: PropTypes.number,
        timeStart: PropTypes.number,
        duration: PropTypes.number,
        eventId: PropTypes.string,
        hasBorder: PropTypes.bool
    }

    state = {
        showTooltip: false
    }

    componentWillMount = () => {
        moment.locale('ru');
    }

    componentDidMount = () => {
        if (!this.props.eventId) {
            this.cell.addEventListener('mouseenter', this._handleMouseEnter);
            this.cell.addEventListener('mouseleave', this._handleMouseLeave);
        }
    }

    componentWillUpdate = (nextProps, nextState) => {
        if (nextState.showTooltip) {
            document.addEventListener('click', this._handleClickOutside);
        } else {
            document.removeEventListener('click', this._handleClickOutside);
        }

        if (!nextProps.eventId) {
            this.cell.addEventListener('mouseenter', this._handleMouseEnter);
            this.cell.addEventListener('mouseleave', this._handleMouseLeave);
        } else {
            document.removeEventListener('mouseenter', this._handleMouseEnter);
            document.removeEventListener('mouseleave', this._handleMouseLeave);
        }
    }

    componentWillUnmount = () => {
        document.removeEventListener('click', this._handleClickOutside);
        document.removeEventListener('mouseenter', this._handleMouseEnter);
        document.removeEventListener('mouseleave', this._handleMouseLeave);
    }

    _getTooltipPosition = () => {
        if (this.props.timeStart < 150) {
            return 'left';
        } else if (this.props.timeStart + this.props.duration > 1350) {
            return 'right';
        }
    }

    _isPastTime = () => {
        const hour = Math.floor(this.props.timeStart / 60);
        const minute = this.props.timeStart % 60;
        const time = moment(this.props.date).set({
            'hour': hour,
            'minute': minute
        }).toDate();
        const currentTime = moment();

        let result = false;

        if (currentTime.isAfter(time, 'hour')) {
            result = true;
        }

        if (currentTime.isSame(time, 'hour') && currentTime.minute() > 45) {
            result = true;
        }

        return result;
    }

    _handleMouseEnter = () => {
        const roomTitle = document.getElementById(`room-${this.props.roomId}`);

        if (roomTitle && roomTitle.style) {
            roomTitle.style.color = '#0070E0';
        }
    }

    _handleMouseLeave = () => {
        const roomTitle = document.getElementById(`room-${this.props.roomId}`);

        if (roomTitle && roomTitle.style) {
            roomTitle.style.color = '';
        }
    }

    _handleClickOutside = (event) => {
        if (this.tooltip && !this.tooltip.contains(event.target)) {
            this.setState({ showTooltip: false });
        }
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
        if (this.state.showTooltip && this.props.eventId) {
            let eventTitle = '';
            let roomTitle = '';
            let date = null;
            let membersIds = [];

            this.props.events.forEach(event => {
                if (this.props.eventId === event.id) {
                    eventTitle = event.title;
                    date = moment(event.dateStart).format('D MMMM, LT—') + moment(event.dateEnd).format('LT');
                    membersIds = event.users;

                    this.props.rooms.forEach(room => {
                        if (event.room.id === room.id) {
                            roomTitle = room.title;
                        }
                    });
                }
            });

            const members = this.props.users.filter(user => {
                let result = false;

                membersIds.forEach(member => {
                    if (member.id === user.id) {
                        result = true;
                    }
                });

                return result;
            });
            const randomNumber = Math.floor(Math.random() * members.length);
            const randomMember = members[randomNumber];
            const membersCount = members.length;
            const memberPhoto = randomMember.avatarUrl ? (
                <img src={randomMember.avatarUrl} className="cell__modal-img" alt={randomMember.login}/>
            ) : (
                <div className="cell__modal-img cell__modal-img--empty"/>
            );
            const editButton = !this._isPastTime() ? (
                <Button className="cell__modal-icon"
                        isIcon={true}
                        onClick={this._editEvent}>
                    <InlineSVG src={require(`!svg-inline-loader?removeSVGTagAttrs=false!./edit.svg`)} />
                </Button>
            ) : null;
            const tooltipPosition = this._getTooltipPosition();
            const tooltipClassNames = classNames(
                "cell__modal",
                {"cell__modal--left": tooltipPosition === 'left'},
                {"cell__modal--right": tooltipPosition === 'right'}
            )

            return (
                <div ref={node => this.tooltip = node}>
                    <div className="cell__modal-triangle"/>
                    <div className={tooltipClassNames}>
                        {editButton}
                        <div className="cell__modal-title">{eventTitle}</div>
                        <div>
                            <span>{date}</span>
                            <span className="cell__modal-separator">·</span>
                            <span>{roomTitle}</span>
                        </div>
                        <div className="cell__modal-info">
                            {memberPhoto}
                            <div>{randomMember.login}</div>
                            <div className="cell__modal-members">
                                {`и ещё ${this._getAllMembers(membersCount - 1)}`}
                            </div>
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
            {"cell--free": !this.props.eventId},
            {"cell--active": this.state.showTooltip},
            {"cell--disabled": this.props.duration < 15 || (this._isPastTime() && !this.props.eventId)},
            {"cell--border": this.props.hasBorder}
        );
        const tooltip = this._renderTooltip();
        const actionOnClick = !this.props.eventId ? this._addEvent : this._toggleTooltip;

        return (
            <div className={cellClassNames}
                 style={{ width: cellWidth}}
                 onClick={actionOnClick}
                 ref={node => this.cell = node}>
                {tooltip}
            </div>
        );
    }
}
