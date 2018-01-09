import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InlineSVG from 'svg-inline-react';
import moment from 'moment';
import classNames from 'classnames';
import TimeField from 'react-simple-timefield';
import { addEvent } from 'api';
import ActionCreators from 'actions/ActionCreators';
import Button from 'components/Button';
import DatePicker from 'components/DatePicker';
import Modal from 'components/Modal';

import './style.scss';

export default class View extends Component {

    static propTypes = {
        users: PropTypes.array,
        rooms: PropTypes.array,
        event_for_edit: PropTypes.number
    }

    state = {
        showDatePicker: false,
        showMemberList: false,
        showAlertModal: true,
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
        room: 2,
        roomError: ''
    }

    componentWillMount = () => {
        moment.locale('ru');
    }

    _showDatePicker = () => {
        this.setState({ showDatePicker: true });
        this._hideMemberList();
    }

    _hideDatePicker = () => {
        this.setState({ showDatePicker: false });
    }

    _showMemberList = () => {
        this.setState({ showMemberList: true });
        this._hideDatePicker();
    }

    _hideMemberList = () => {
        this.setState({ showMemberList: false });
    }

    _hideAllPickers = () => {
        this._hideDatePicker();
        this._hideMemberList();
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
        this.setState({ date });
        this.setState({ dateError: ''});
        this._hideDatePicker();
    }

    _changeTimeStart = (time) => {
        this.setState({ timeStart: time });
        this.setState({ timeError: ''});
    }

    _changeTimeEnd = (time) => {
        this.setState({ timeEnd: time });
        this.setState({ timeError: ''});
    }

    _addMember = (id) => {
        const members = this.state.members;

        members.push(id);
        this.setState({ members });
        this.setState({ membersError: '' });

        if (members.length === this.props.users.length) {
            this._hideMemberList();
        }
    }

    _removeMember = (id) => {
        const members = this.state.members.filter(member => member !== id);

        this.setState({ members });
    }

    _validateForm = () => {

    }

    _addEvent = () => {
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

        if (members.length < 3) {
            isFormValid = false;
            this.setState({ membersError: 'Для встречи необходимо минимум 2 участника'});
        }

        if (!room) {
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

        addEvent(theme, dateStart, dateEnd, room, members);
    }

    _closeForm = () => {
        ActionCreators.setShowForm(false);
    }

    _renderThemeBlock = () => {
        const error = this.state.themeError ? (
            <div className="form__error">{this.state.themeError}</div>
        ) : null;

        return (
            <div className="form__row-block">
                <label htmlFor="theme" className="form__label">Тема</label>
                <input type="text"
                       id="theme"
                       className="form__input form__input--with-icon"
                       value={this.state.theme}
                       onChange={this._changeTheme}
                       onFocus={this._hideAllPickers}
                       placeholder="О чём будете говорить?"/>
                {error}
                <InlineSVG className="form__input-icon form__input-icon--remove"
                           src={require(`!svg-inline-loader?removeSVGTagAttrs=false!./close.svg`)}
                           onClick={this._clearTheme} />
            </div>
        )
    }

    // bc DayPickerInput has bug with input focus...
    _renderDateBlock = () => {
        const date = this.state.date;
        const inputValue = date ? moment(date).format('LL') : '';
        const pickerDate = date ? date : new Date();
        const datePicker = this.state.showDatePicker ? (
            <DatePicker className="form__date-picker"
                        date={pickerDate}
                        onFocus={this._showDatePicker}
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

        return (
            <div className="form__date-wrapper">
                <label htmlFor="date" className="form__label">Дата</label>
                <input id="date"
                       className={inputClassNames}
                       value={inputValue}
                       onFocus={this._showDatePicker}
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
            <input className="form__input form__input--small" onFocus={this._hideAllPickers}/>
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
            <div className="form__row-block form__row-block--members">
                <label htmlFor="members" className="form__label">Участники</label>
                <input type="text"
                       id="members"
                       className={inputClassNames}
                       onFocus={this._showMemberList}
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

    _renderButtonsBlock = () => {
        let isButtonDisabled = true;

        if (this.state.theme && this.state.date && this.state.members.length > 0 && this.state.room) {
            isButtonDisabled = false;
        }

        return (
            <div className="form__buttons">
                <Button className="form__buttons-item" onClick={this._closeForm}>Отмена</Button>
                <Button className="form__buttons-item"
                        color="blue"
                        onClick={this._addEvent}
                        disabled={isButtonDisabled}>Создать встречу</Button>
            </div>
        );
    }

    _renderAlertModal = () => {
        const date = '14 декабря';
        const room = 'Готем 4 этаж';


        return (
            <Modal isAlert={true}
                   date='14 декабря'
                   timeStart={this.state.timeStart}
                   timeEnd={this.state.timeEnd}
                   room='Готем · 4 этаж' />
        )
    }

    render() {
        const formTitle = this.props.event_for_edit ? 'Редактирование встречи' : 'Новая встреча';
        const roomBlockTitle = this.state.room ? 'Ваша переговорка' : 'Рекомендуемые переговорки';
        const themeBlock = this._renderThemeBlock();
        const dateBlock = this._renderDateBlock();
        const timeBlock = this._renderTimeBlock();
        const membersBlock = this._renderMembersBlock();
        const buttonsBlock = this._renderButtonsBlock();
        const alertModal = this._renderAlertModal();

        if (this.state.showAlertModal) {
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
                        <div className="form__row-block">
                            <div className="form__rooms-title">{roomBlockTitle}</div>
                        </div>
                    </div>
                </div>
                {buttonsBlock}
            </section>
        );
    }
}
