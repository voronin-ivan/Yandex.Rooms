import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeneralStore from 'stores/GeneralStore';
import UIStore from 'stores/UIStore';
import { Container } from 'flux/utils';
import View from './View';

class Cell extends Component {

    static propTypes = {
        roomId: PropTypes.number,
        timeStart: PropTypes.number,
        duration: PropTypes.number,
        eventId: PropTypes.string,
        hasBorder: PropTypes.bool
    }

    static getStores() {
        return [GeneralStore, UIStore];
    }

    static calculateState(prevState, props) {
        const GeneralStoreState = GeneralStore.getState();
        const UIStoreState = UIStore.getState();

        return {
            events: GeneralStoreState.get('events'),
            rooms: GeneralStoreState.get('rooms'),
            users: GeneralStoreState.get('users'),
            date: UIStoreState.get('date'),
            roomId: props.roomId,
            timeStart: props.timeStart,
            duration: props.duration,
            eventId: props.eventId,
            hasBorder: props.hasBorder
        }
    }

    render() {
        return <View {...this.state}/>;
    }
}

export default Container.create(Cell, {withProps: true});
