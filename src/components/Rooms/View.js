import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export default class View extends Component {

    static propTypes = {
        rooms: PropTypes.array
    }

    _renderRooms = () => {
        const rooms = this.props.rooms.sort((a, b) => a.floor - b.floor);
        const floors = [];
        const roomsBlock = [];

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
                        <div id={`room-${room.id}`} className="rooms__item-title">{room.title}</div>
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
