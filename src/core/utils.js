import moment from 'moment';

export const minuteWidth = 1.1; // bc 1 minute == 1.1px (layout)

export const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
];

export default (date, members, db) => {
    const eventsOnThisDay = db.events.filter(event => {
        return moment(event.dateStart).isSame(date.day, 'day');
    });
    const timeStart = date.timeStart[0] * 60 + Number(date.timeStart[1]) - 1;
    const timeEnd = date.timeEnd[0] * 60 + Number(date.timeEnd[1]);
    const duration = timeEnd - timeStart;
    const result = {
        rooms: [],
        newTime: null
    };

    let floor = 0;

    db.users.forEach(user => {
        members.forEach(member => {
            if (user.id === member) {
                floor += user.homeFloor;
            }
        });
    });

    const middleFloor = Math.round(floor / members.length);
    const suitableRooms = db.rooms.filter(room => {
        return !(room.capacity < members.length);
    }).sort((a, b) => {
        return Math.abs(middleFloor - a.floor) > Math.abs(middleFloor - b.floor);
    });

    if (suitableRooms.length === 0) {
        return result;
    }

    suitableRooms.forEach(room => {
        const eventsOnThisFloor = eventsOnThisDay.filter(event => {
            return room.id === event.room.id;
        });

        let isFreeForEvent = true;

        eventsOnThisFloor.forEach(event => {
            let eventStart = moment(event.dateStart).hour() * 60 + moment(event.dateStart).minute();
            const eventEnd = moment(event.dateEnd).hour() * 60 + moment(event.dateEnd).minute();

            while (eventStart < eventEnd) {
                if (eventStart > timeStart && eventStart < timeEnd) {
                    isFreeForEvent = false;
                }
                eventStart += 1;
            }
        });

        if (isFreeForEvent) {
            result.rooms.push(room.id);
        }
    });

    if (result.rooms.length === 0) {
        const sortedEvents = eventsOnThisDay.sort((a, b) => {
            const endOfA = moment(a.dateEnd).hour() * 60 + moment(a.dateEnd).minute();
            const endOfB = moment(b.dateEnd).hour() * 60 + moment(b.dateEnd).minute();

            return Math.abs(timeStart - endOfA) > Math.abs(timeStart - endOfB);
        });

        sortedEvents.forEach(event => {
            if (result.rooms.length === 0) {
                const eventsOnThisFloor = eventsOnThisDay.filter(item => {
                    return event.room.id === item.room.id;
                }).sort((a, b) => {
                    const startOfA = moment(a.dateStart).hour() * 60 + moment(a.dateStart).minute();
                    const startOfB = moment(b.dateEnd).hour() * 60 + moment(b.dateEnd).minute();

                    return startOfA - startOfB;
                });
                const isCapacityOk = suitableRooms.find(room => {
                    return room.id === event.room.id;
                });

                if (isCapacityOk) {
                    for (let i = 0; i < eventsOnThisFloor.length; i++) {
                        if (eventsOnThisFloor[i].id === event.id) {
                            const thisEvent = eventsOnThisFloor[i];
                            const nextEvent = eventsOnThisFloor[i + 1];
                            const endOfThis = moment(thisEvent.dateEnd).hour() * 60 + moment(thisEvent.dateEnd).minute();

                            if (nextEvent) {
                                const startOfNext = moment(nextEvent.dateStart).hour() * 60 + moment(nextEvent.dateStart).minute();

                                if (startOfNext - endOfThis >= duration) {
                                    result.rooms.push(thisEvent.room.id);
                                    result.newTime = {
                                        start: endOfThis,
                                        end: endOfThis + duration - 1
                                    };
                                    break;
                                }
                            } else {
                                if (1440 - endOfThis >= duration) {
                                    result.rooms.push(thisEvent.room.id);
                                    result.newTime = {
                                        start: endOfThis,
                                        end: endOfThis + duration - 1
                                    };
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    return result;
};
