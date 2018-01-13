import fetch from 'isomorphic-fetch';

export const getData = () => {
    return fetch('/graphql', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `{
                users {id login homeFloor avatarUrl}
                rooms {id title capacity floor}
                events {id title dateStart dateEnd room{id} users{id}}
            }`
        })
    })
    .then(res => res.json())
    .then(res => res.data)
    .catch(error => console.error(error));
};

export const addEvent = (title, dateStart, dateEnd, roomId, users) => {
    return fetch('/graphql', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `mutation {
                createEvent(
                    input: {
                        title: "${title}"
                        dateStart: "${dateStart}"
                        dateEnd: "${dateEnd}"
                    }
                    roomId: ${roomId}
                    usersIds: [${users}]
                )
                { id }
            }`
        })
    })
    .then(res => res.json())
    .then(res => res.data.createEvent)
    .catch(error => console.error(error));
};

export const removeEvent = eventId => {
    return fetch('/graphql', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `mutation {
                removeEvent(
                    id: ${eventId}
                )
                { id }
            }`
        })
    })
    .catch(error => console.error(error));
};
