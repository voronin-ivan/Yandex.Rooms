import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import InlineSVG from 'svg-inline-react';
import moment from 'moment';
import classNames from 'classnames';
import TimeField from 'react-simple-timefield'; // выпилить и написать свое нормальное решение
import { addEvent, updateEvent, removeEvent } from 'api';
import ActionCreators from 'actions/ActionCreators';
import { getRecommendation } from 'core/utils';
import Button from 'components/Button';
import DatePicker from 'components/DatePicker';
import Modal from 'components/Modal';

import './style.scss';

export default class View extends Component {

    static propTypes = {
        users: PropTypes.array,
        rooms: PropTypes.array,
        events: PropTypes.instanceOf(Immutable.List),
        date: PropTypes.instanceOf(Date),
        event_for_edit: PropTypes.string,
        room: PropTypes.number,
        time_start: PropTypes.string,
        time_end: PropTypes.string
    }

    state = {
        showDatePicker: false,
        showMemberList: false,
        showConfirmModal: false,
        theme: '',
        themeError: '',
        date: null,
        dateError: '',
        timeStart: '00:00',
        timeEnd: '00:00',
        timeError: '',
        members: [],
        membersError: '',
        room: null,
        roomError: '',
        modalType: null
    }

    componentWillMount = () => {
        moment.locale('ru');

        if (this.props.room) {
            this.setState({date: this.props.date});
            this.setState({timeStart: this.props.time_start});
            this.setState({timeEnd: this.props.time_end});
            this.setState({room: this.props.room});
        }

        if (this.props.event_for_edit) {
            this.props.events.toJS().forEach(event => {
                if (event.id === this.props.event_for_edit) {
                    const date = moment(event.dateStart).toDate();
                    const timeStart = moment(event.dateStart).format('HH:mm');
                    const timeEnd = moment(event.dateEnd).format('HH:mm');
                    const members = [];

                    event.users.forEach(user => {
                        members.push(user.id);
                    });

                    this.setState({
                        theme: event.title,
                        room: event.room.id,
                        date,
                        timeStart,
                        timeEnd,
                        members,
                    });
                }
            });
        }
    }

    componentDidMount = () => {
        document.addEventListener('click', this._clickOutsideDate);
        document.addEventListener('click', this._clickOutsideMembers);
    }

    componentWillUnmount = () => {
        ActionCreators.setEventForEdit(null);
        ActionCreators.setRoom(null);
        ActionCreators.setTimeStart('');
        ActionCreators.setTimeEnd('');

        document.removeEventListener('click', this._clickOutsideDate);
        document.removeEventListener('click', this._clickOutsideMembers);
    }

    _clickOutsideDate = (event) => {
        if (this.date && !this.date.contains(event.target) && this.state.showDatePicker) {
            this._toggleDatePicker();
        }
    }

    _clickOutsideMembers = (event) => {
        if (this.members && !this.members.contains(event.target) && this.state.showMemberList) {
            this._toggleMemberList();
        }
    }

    _toggleDatePicker = () => {
        this.setState(prevState => {
            return {showDatePicker: !prevState.showDatePicker}
        });
    }

    _toggleMemberList = () => {
        this.setState(prevState => {
            return {showMemberList: !prevState.showMemberList}
        });
    }

    _toggleConfirmModal = () => {
        this.setState(prevState => {
            return {showConfirmModal: !prevState.showConfirmModal}
        });
    }

    _changeTheme = (event) => {
        if (event.target.value.length > 3) {
            this.setState({ themeError: '' });
        }

        this.setState({ theme: event.target.value });
    }

    _clearTheme = () => {
        this.setState({ theme: ''});
    }

    _changeDate = (date) => {
        if (date !== this.state.date) {
            this.setState({
                date,
                dateError: '',
                room: null
            });
        }

        this._toggleDatePicker();
    }

    _changeTimeStart = (time) => {
        if (time !== this.state.timeStart) {
            this.setState({
                timeStart: time,
                timeError: '',
                room: null
            });
        }
    }

    _changeTimeEnd = (time) => {
        if (time !== this.state.timeEnd) {
            this.setState({
                timeEnd: time,
                timeError: '',
                room: null
            });
        }
    }

    _addMember = (id) => {
        const members = this.state.members;

        members.push(id);
        this.setState({
            members,
            membersError: '',
            room: null
        });

        if (members.length === this.props.users.length) {
            this._toggleMemberList();
        }
    }

    _removeMember = (id) => {
        const members = this.state.members.filter(member => member !== id);

        this.setState({
            members,
            room: null
        });
    }

    _addRoom = (roomId) => {
        this.setState({
            room: roomId,
            roomError: ''
        });
    }

    _removeRoom = () => {
        this.setState({ room: null });
    }

    _submitForm = () => {
        const theme = this.state.theme;
        const date = this.state.date;
        const timeStart = this.state.timeStart.split(':');
        const timeEnd = this.state.timeEnd.split(':');
        const members = this.state.members;
        const room = this.state.room;

        let dateStart = null;
        let dateEnd = null;
        let isFormValid = true;

        if (theme.length < 4) {
            isFormValid = false;
            this.setState({ themeError: 'Тема не может содержать менее 4х символов'});
        }

        if (members.length < 2) {
            isFormValid = false;
            this.setState({ membersError: 'Для встречи необходимо минимум 2 участника'});
        }

        if (!room && date) {
            isFormValid = false;
            this.setState({ roomError: 'Выберите комнату для встречи'});
        }

        if (this.state.timeStart === this.state.timeEnd) {
            isFormValid = false;
            this.setState({ timeError: 'Время начала и окончания встречи не могут быть одинаковыми' });
        }

        if (date) {
            const eventDuration = (timeEnd[0] * 60 + Number(timeEnd[1])) - (timeStart[0] * 60 + Number(timeStart[1]));

            dateStart = moment(date).set({
                hour: timeStart[0],
                minute: timeStart[1]
            }).toISOString();
            dateEnd = moment(date).set({
                hour: timeEnd[0],
                minute: timeEnd[1]
            }).toISOString();

            if (moment(dateEnd).isAfter(dateStart) && eventDuration < 15) {
                isFormValid = false;
                this.setState({ timeError: 'Длительность встречи должна быть не менее 15 минут' });
            } else if (moment(dateEnd).isBefore(dateStart)) {
                isFormValid = false;
                this.setState({ timeError: 'Время окончания встречи не может быть меньше времени начала' });
            } else if (moment().isAfter(dateStart)) {
                isFormValid = false;
                this.setState({ timeError: 'Время начала встречи уже в прошлом' });
            }
        } else {
            isFormValid = false;
            this.setState({ dateError: 'Выберите дату'});
        }

        if (!isFormValid) {
            return null;
        }

        if (this.props.event_for_edit) {
            this._updateEvent(this.props.event_for_edit, theme, dateStart, dateEnd, room, members);
        } else {
            this._addEvent(theme, dateStart, dateEnd, room, members);
        }
    }

    _addEvent = (theme, dateStart, dateEnd, room, members) => {
        addEvent(theme, dateStart, dateEnd, room, members)
            .then(data => {
                const users = [];

                members.forEach(member => {
                    users.push({
                        id: member
                    });
                });

                const event = {
                    id: data.id,
                    title: theme,
                    users,
                    dateStart,
                    dateEnd,
                    room: {
                        id: String(room)
                    }
                };

                const events = this.props.events.push(event);

                ActionCreators.setEvents(events);
                this.setState({ modalType: 'eventCreated' });
            });
    }

    _updateEvent = (eventId, theme, dateStart, dateEnd, room, members) => {
        updateEvent(eventId, theme, dateStart, dateEnd, room, members)
            .then(() => {
                const users = [];

                members.forEach(member => {
                    users.push({
                        id: member
                    });
                });

                const event = {
                    id: eventId,
                    title: theme,
                    users,
                    dateStart,
                    dateEnd,
                    room: {
                        id: String(room)
                    }
                };

                let events = this.props.events;

                for (let i = 0; i < events.size; i++) {
                    if (events.get(i).id === eventId) {
                        events = events.set(i, event);
                    }
                }

                ActionCreators.setEvents(events);
                this.setState({ modalType: 'eventUpdated' });
            });
    }

    _removeEvent = () => {
        const events = this.props.events.filterNot(event => {
            return event.id === this.props.event_for_edit;
        });

        removeEvent(this.props.event_for_edit)
            .then(() => {
                ActionCreators.setEvents(events);
                this.setState({ modalType: 'eventRemoved' });
            });
    }

    _closeForm = () => {
        ActionCreators.setShowForm(false);
    }

    _renderThemeBlock = () => {
        const error = this.state.themeError ? (
            <div className="form__error">{this.state.themeError}</div>
        ) : null;
        const removeIcon = this.state.theme ? (
            <InlineSVG className="form__input-icon form__input-icon--remove"
                       src={require(`!svg-inline-loader?removeSVGTagAttrs=false!./close.svg`)}
                       onClick={this._clearTheme} />
        ) : null;

        return (
            <div className="form__row-block">
                <label htmlFor="theme" className="form__label">Тема</label>
                <input type="text"
                       id="theme"
                       className="form__input form__input--with-icon"
                       value={this.state.theme}
                       onChange={this._changeTheme}
                       placeholder="О чём будете говорить?"/>
                {error}
                {removeIcon}
            </div>
        )
    }

    _renderDateBlock = () => {
        const date = this.state.date;
        const inputValue = date ? moment(date).format('LL') : '';
        const pickerDate = date ? date : new Date();
        const datePicker = this.state.showDatePicker ? (
            <DatePicker className="form__date-picker"
                        isForForm={true}
                        date={pickerDate}
                        onFocus={this._toggleDatePicker}
                        onDayClick={this._changeDate} />
        ) : null;
        const inputClassNames = classNames(
            "form__input",
            "form__input--medium",
            "form__input--with-icon",
            "form__input--select",
            {"form__input--focus": this.state.showDatePicker}
        );
        const error = this.state.dateError ? (
            <div className="form__error">{this.state.dateError}</div>
        ) : null;

        // custom input bc DayPickerInput has bug whit focus...
        return (
            <div className="form__date-wrapper" ref={node => this.date = node}>
                <label htmlFor="date" className="form__label">Дата</label>
                <input id="date"
                       className={inputClassNames}
                       value={inputValue}
                       onChange={this._changeDate}
                       onFocus={this._toggleDatePicker}
                       placeholder='Выберите дату'/>
                {datePicker}
                {error}
                <InlineSVG className="form__input-icon"
                           src={require(`!svg-inline-loader?removeSVGTagAttrs=false!./calendar.svg`)} />
            </div>
        )
    }

    _renderTimeBlock = () => {
        const input = (
            <input className="form__input form__input--small"/>
        );
        const error = this.state.timeError ? (
            <div className="form__error">{this.state.timeError}</div>
        ) : null;

        return (
            <div className="form__time-wrapper">
                <div>
                    <label htmlFor="time-start" className="form__label form__label--time">Начало</label>
                    <TimeField id="time-start"
                               input={input}
                               value={this.state.timeStart}
                               onChange={this._changeTimeStart}/>
                </div>
                <div className="form__time-separator">—</div>
                <div>
                    <label htmlFor="time-end" className="form__label form__label--time">Конец</label>
                    <TimeField id="time-end"
                               input={input}
                               value={this.state.timeEnd}
                               onChange={this._changeTimeEnd}/>
                </div>
                {error}
            </div>
        );
    }

    _renderMembersBlock = () => {
        const allUsers = this.props.users;
        const members = this.state.members;
        const availableUsers = [];
        const selectedUsers = [];
        const inputClassNames = classNames(
            "form__input",
            "form__input--members",
            "form__input--select",
            {"form__input--focus": this.state.showMemberList}
        );
        const error = this.state.membersError ? (
            <div className="form__error">{this.state.membersError}</div>
        ) : null;

        for (let i = 0; i < allUsers.length; i++) {
            const userId = allUsers[i].id;
            const userName = allUsers[i].login;
            const homeFloor = `· ${allUsers[i].homeFloor} этаж`;
            const userPhoto = allUsers[i].avatarUrl ? (
                <img src={allUsers[i].avatarUrl} className="form__option-img" alt={userName}/>
            ) : (
                <div className="form__option-img form__option-img--empty"/>
            );

            let isUserSelected = false;

            members.forEach(member => {
                if (member === userId) {
                    isUserSelected = true;
                }
            });

            if (isUserSelected) {
                continue;
            }

            availableUsers.push(
                <div className="form__select-option"
                     onClick={this._addMember.bind(this, userId)}
                     key={`option-${i}`}>
                    {userPhoto}
                    <span>{userName}</span>
                    <span className="form__option-floor">{homeFloor}</span>
                </div>
            );
        }

        for (let i = 0; i < members.length; i++) {
            allUsers.forEach(user => {
                if (user.id === members[i]) {
                    const memberName = user.login;
                    const memberPhoto = user.avatarUrl ? (
                        <img src={user.avatarUrl} className="form__member-photo" alt={memberName}/>
                    ) : (
                        <div className="form__member-photo form__member-photo--empty"/>
                    );

                    selectedUsers.push(
                        <div className="form__member" key={`member-${user.id}`}>
                            {memberPhoto}
                            <span>{memberName}</span>
                            <InlineSVG className="form__member-remove"
                                       src={require(`!svg-inline-loader?removeSVGTagAttrs=false!./close.svg`)}
                                       onClick={this._removeMember.bind(this, user.id)} />
                        </div>
                    );
                }
            });
        }

        return (
            <div className="form__row-block form__row-block--members" ref={node => this.members = node}>
                <label htmlFor="members" className="form__label">Участники</label>
                <input type="text"
                       id="members"
                       className={inputClassNames}
                       onFocus={this._toggleMemberList}
                       placeholder="Выберите участников"/>
                {this.state.showMemberList ? (
                    <div className="form__select">
                        {availableUsers.length > 0 ? availableUsers : 'Нет доступных для выбора участников'}
                    </div>
                ) : null}
                {this.state.members.length > 0 ? (
                    <div className="form__members">
                        {selectedUsers}
                    </div>
                ) : null}
                {error}
            </div>
        );
    }

    _renderRoomBlock = () => {
        if (this.state.room) {
            let roomInfo = null;

            this.props.rooms.forEach(room => {
                if (room.id == this.state.room) {
                    roomInfo = `${room.title} · ${room.floor} этаж`;
                }
            });

            return (
                <div className="form__row-block">
                    <div className="form__rooms-title">Ваша переговорка</div>
                    <div className="form__rooms-item form__rooms-item--choosed">
                        <div className="form__room-wrapper">
                            <div className="form__room-time">{this.state.timeStart}—{this.state.timeEnd}</div>
                            <div className="form__room-name">{roomInfo}</div>
                        </div>
                        <InlineSVG className="form__room-remove"
                                   src={require(`!svg-inline-loader?removeSVGTagAttrs=false!./close.svg`)}
                                   onClick={this._removeRoom}/>
                    </div>
                </div>
            );
        }

        const recommendatedRooms = [];
        const error = this.state.roomError ? (
            <div className="form__error">{this.state.roomError}</div>
        ) : null;

        if (!this.state.room && this.state.date && this.state.members.length > 0) {
            const date = {
                day: this.state.date,
                timeStart: this.state.timeStart.split(':'),
                timeEnd: this.state.timeEnd.split(':')
            };
            const db = {
                users: this.props.users,
                rooms: this.props.rooms,
                events: this.props.events.toJS(),
                eventForEdit: this.props.event_for_edit
            };
            const recommendatations = getRecommendation(date, this.state.members, db);

            if (recommendatations.newTime) {
                const start = recommendatations.newTime.start;
                const end = recommendatations.newTime.end;
                const startHour = start / 60 > 9 ? Math.floor(start / 60) : `0${Math.floor(start / 60)}`;
                const startMinute = start % 60 > 9 ? start % 60 : `0${start % 60}`;
                const endHour = end / 60 > 9 ? Math.floor(end / 60) : `0${Math.floor(end / 60)}`;
                const endMinute = end % 60 > 9 ? end % 60 : `0${end % 60}`;

                this.setState({
                    timeStart: `${startHour}:${startMinute}`,
                    timeEnd: `${endHour}:${endMinute}`
                });
            }

            if (recommendatations.rooms.length > 0) {
                recommendatations.rooms.forEach(recommendatedRoom => {
                    this.props.rooms.forEach(room => {
                        if (recommendatedRoom == room.id) {
                            recommendatedRooms.push(
                                <div className="form__rooms-item"
                                     key={`recommendatedRoom-${room.id}`}
                                     onClick={this._addRoom.bind(this, room.id)}>
                                    <div className="form__room-wrapper">
                                        <div className="form__room-time">{this.state.timeStart}—{this.state.timeEnd}</div>
                                        <div className="form__room-name">{`${room.title} · ${room.floor} этаж`}</div>
                                    </div>
                                </div>
                            );
                        }
                    });
                });
            } else {
                recommendatedRooms.push(
                    <div className="form__rooms-error" key="room-error">К сожалению, не удается подобрать вам комнату. Попробуйте установить другую дату/время или сократить список участников.</div>
                )
            }
        }

        return (
            <div className="form__row-block">
                {recommendatedRooms.length > 0 ? (
                    <div>
                        <div className="form__rooms-title">Рекомендуемые переговорки</div>
                        <div>{recommendatedRooms}</div>
                        {error}
                    </div>
                ) : null}
            </div>
        );
    }

    _renderButtonsBlock = () => {
        let isButtonDisabled = true;

        if (this.state.theme && this.state.date && this.state.members.length > 0 && this.state.room) {
            isButtonDisabled = false;
        }

        return (
            this.props.event_for_edit ? (
                <div className="form__buttons">
                    <Button className="form__buttons-item" onClick={this._closeForm}>Отмена</Button>
                    <Button className="form__buttons-item" onClick={this._toggleConfirmModal}>Удалить встречу</Button>
                    <Button className="form__buttons-item"
                            onClick={this._submitForm}
                            disabled={isButtonDisabled}>Сохранить</Button>
                </div>
            ) : (
                <div className="form__buttons">
                    <Button className="form__buttons-item" onClick={this._closeForm}>Отмена</Button>
                    <Button className="form__buttons-item"
                            color="blue"
                            onClick={this._submitForm}
                            disabled={isButtonDisabled}>Создать встречу</Button>
                </div>
            )
        );
    }

    _renderAlertModal = () => {
        const date = `${moment(this.props.date).format('D MMMM')}, ${this.state.timeStart}—${this.state.timeEnd}`;
        let roomInfo = null;

        this.props.rooms.forEach(room => {
            if (room.id == this.state.room) {
                roomInfo = `${room.title} · ${room.floor} этаж`;
            }
        });

        return (
            <Modal type={this.state.modalType}
                   date={date}
                   room={roomInfo}
                   onConfirm={this._closeForm} />
        );
    }

    _renderConfirmModal = () => {
        return (
            <Modal onConfirm={this._removeEvent} onReject={this._toggleConfirmModal}/>
        );
    }

    render() {
        const formTitle = this.props.event_for_edit ? 'Редактирование встречи' : 'Новая встреча';
        const themeBlock = this._renderThemeBlock();
        const dateBlock = this._renderDateBlock();
        const timeBlock = this._renderTimeBlock();
        const membersBlock = this._renderMembersBlock();
        const roomBlock = this._renderRoomBlock();
        const buttonsBlock = this._renderButtonsBlock();
        const alertModal = this._renderAlertModal();
        const confirmModal = this.state.showConfirmModal ? this._renderConfirmModal() : null;

        if (this.state.modalType) {
            return alertModal;
        }

        return (
            <section className="form">
                <div className="form__container">
                    <div className="form__header">
                        <div className="form__header-title">{formTitle}</div>
                        <Button className="form__header-icon" isIcon={true} onClick={this._closeForm}>
                            <InlineSVG src={require(`!svg-inline-loader?removeSVGTagAttrs=false!./close.svg`)} />
                        </Button>
                    </div>
                    <div className="form__row">
                        {themeBlock}
                        <div className="form__row-block form__row-block--date">
                            {dateBlock}
                            {timeBlock}
                        </div>
                    </div>
                    <div className="form__row">
                        {membersBlock}
                        {roomBlock}
                    </div>
                </div>
                {buttonsBlock}
                {confirmModal}
            </section>
        );
    }
}
