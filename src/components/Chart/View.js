import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import moment from 'moment';
import Cell from 'components/Cell';
import { minuteWidth } from 'core/utils';

import './style.scss';

export default class View extends Component {

    static propTypes = {
        events: PropTypes.instanceOf(Immutable.List),
        rooms: PropTypes.array,
        date: PropTypes.instanceOf(Date)
    }

    _renderLines = () => {
        const lines = [];

        for (let i = 0; i < 24; i++) {
            const date = this.props.date;
            const firstCondition = moment().isSame(date, 'day');
            const secondCondition = date.getHours() === i;
            const position = date.getMinutes() * minuteWidth;
            const currentTimeBlock = (
                <div className="chart__item-time" style={{left: `${position}px`}}>
                    <div className="chart__item-current">{moment(date).format('HH:mm')}</div>
                </div>
            );

            lines.push(
                <div className="chart__lines-item" key={`line-${i}`}>
                    { (firstCondition && secondCondition) ? currentTimeBlock : null }
                </div>
            );
        }

        return lines;
    }

    _renderEvents = () => {
        const rooms = this.props.rooms.sort((a, b) => a.floor - b.floor);
        const floors = [];
        const events = this.props.events.toJS().filter(event => {
            return moment(this.props.date).isSame(event.dateStart, 'day');
        });
        const eventsBlocks = [];

        rooms.forEach(room => {
            if (floors[floors.length - 1] !== room.floor) {
                floors.push(room.floor);
            }
        });

        for (let i = 0; i < floors.length; i++) {
            const roomsOnFloor = rooms.filter(room => room.floor === floors[i]);
            const rows = [];

            roomsOnFloor.forEach(room => {
                const roomEvents = events.filter(event => event.room.id === room.id);

                roomEvents.sort((a, b) => {
                    return moment(a.dateStart).isBefore(b.dateStart) ? 1 : -1;
                });

                const cells = this._renderCells(0, roomEvents, +room.id);

                rows.push(
                    <div className="chart__row" key={`room-row-${room.id}`}>
                        {cells}
                    </div>
                );
            });

            eventsBlocks.push(
                <div key={`row-${i}`}>{rows}</div>
            );
        }

        return eventsBlocks;
    }

    _renderCells = (time, events, roomId, createdCells) => {
        const cells = createdCells ? createdCells : [];

        if (time === 1440) { // === 00:00
            return cells;
        }

        if (events.length === 0) {
            const cellsCount = Math.floor((1440 - time) / 60);
            const hourRest = time % 60;

            if (hourRest !== 0) {
                const eventDuration = 60 - hourRest;

                cells.push(
                    <Cell key={`cell-${time}-${roomId}`}
                          roomId={roomId}
                          timeStart={time}
                          duration={eventDuration}/>
                );

                time += eventDuration;
            }

            for (let i = 0; i < cellsCount; i++) {
                cells.push(
                    <Cell key={`cell-${time}-${roomId}`}
                          roomId={roomId}
                          timeStart={time}
                          duration={60}/>
                );

                time += 60;
            }
        } else {
            const event = events[events.length - 1];
            const dateStart = moment(event.dateStart).toDate();
            const dateEnd = moment(event.dateEnd).toDate();
            const eventStart = moment(dateStart).hour() * 60 + moment(dateStart).minutes();
            const eventEnd = moment(dateEnd).hour() * 60 + moment(dateEnd).minutes();
            const eventDuration = eventEnd - eventStart;
            let beforeStartFromHour = 0;

            /*
                Для правильного вывода пограничных случаев, к примеру:
                Одна встреча заканчивается в 22:45, а другая начинается в 23:05
                (seems legit :D)
            */
            if (eventStart - time <= 20) {
                beforeStartFromHour = eventStart - time;
            } else {
                beforeStartFromHour = eventStart % 60;
            }

            const beforeEventHour = eventStart - beforeStartFromHour - time;

            if (beforeEventHour > 0) {
                const freeCellsCount = Math.floor(beforeEventHour / 60);

                if (beforeEventHour % 60 !== 0) {
                    cells.push(
                        <Cell key={`cell-${time}-${roomId}`}
                              roomId={roomId}
                              timeStart={time}
                              duration={beforeEventHour % 60}/>
                    );

                    time += beforeEventHour % 60;
                }

                for (let i = 0; i < freeCellsCount; i++) {
                    cells.push(
                        <Cell key={`cell-${time}-${roomId}`}
                              roomId={roomId}
                              timeStart={time}
                              duration={60}/>
                    );

                    time += 60;
                }
            }

            if (beforeStartFromHour) {
                cells.push(
                    <Cell key={`cell-${time}-${roomId}`}
                          roomId={roomId}
                          timeStart={time}
                          duration={beforeStartFromHour}/>
                );

                time += beforeStartFromHour;
            }

            let hasBorder = false;

            if (events.length > 1) {
                const nextEvent = events[events.length - 2];
                let nextEventStart = moment(nextEvent.dateStart).toDate();

                nextEventStart = moment(nextEventStart).hour() * 60 + moment(nextEventStart).minutes();

                if (eventEnd === nextEventStart) {
                    hasBorder = true;
                }
            }

            cells.push(
                <Cell eventId={event.id}
                      duration={eventDuration}
                      hasBorder={hasBorder}
                      timeStart={time}
                      key={`cell-${time}-${roomId}`}/>
            );

            time += eventDuration;

            if (time > 1440) {
                time = 1440;
            }

            events = events.filter(item => {
                return item.id !== event.id;
            });
        }

        return this._renderCells(time, events, roomId, cells);
    }

    render() {
        const lines = this._renderLines();
        const events = this._renderEvents();

        return (
            <div className="chart">
                <div className="chart__lines">
                    {lines}
                </div>
                {events}
            </div>
        );
    }
}
