import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

export default class View extends Component {

    static propTypes = {
        rooms: PropTypes.array
    }

    state = {
        isTitleVisible: true
    }

    componentDidMount = () => {
        if (document.body.clientWidth < 768) {
            const wrapper = document.querySelector('.wrapper');
            const roomsColumn = document.querySelector('.left-col');

            wrapper.onscroll = () => {
                if (this._checkElementVisible(roomsColumn)) {
                    this.setState({ isTitleVisible: true });
                } else {
                    this.setState({ isTitleVisible: false });
                }
            };
        }
    }

    _checkElementVisible = (element) => {
        const rect = element.getBoundingClientRect();
        const viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);

        return !(rect.right < 0 || rect.left - viewWidth >= 0);
    }

    _renderRooms = () => {
        const rooms = this.props.rooms.sort((a, b) => a.floor - b.floor);
        const floors = [];
        const roomsBlock = [];
        const titleClassNames = classNames(
            'rooms__item-title',
            {'rooms__item-title--sticky': !this.state.isTitleVisible}
        );

        rooms.forEach(room => {
            if (floors[floors.length - 1] !== room.floor) {
                floors.push(room.floor);
            }
        });

        for (let i = 0; i < floors.length; i++) {
            const roomsOnFloor = rooms.filter(room => room.floor === floors[i]);
            const roomsTitles = [];

            roomsOnFloor.forEach(room => {
                roomsTitles.push(
                    <div className="rooms__item" key={`room-${room.id}`}>
                        <div id={`room-${room.id}`} className={titleClassNames}>{room.title}</div>
                        <div>до {room.capacity} человек</div>
                    </div>
                );
            });

            roomsBlock.push(
                <div className="rooms__block" key={`floor-${floors[i]}`}>
                    <div className="rooms__floor">
                        <div className="rooms__floor-title">{floors[i]} этаж</div>
                    </div>
                    {roomsTitles}
                </div>
            );
        }

        return roomsBlock;
    }

    render() {
        const rooms = this._renderRooms();

        return (
            <div className="rooms">
                {rooms}
            </div>
        );
    }
}
