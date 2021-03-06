import React, { Component } from 'react';
import GeneralStore from 'stores/GeneralStore';
import UIStore from 'stores/UIStore';
import { Container } from 'flux/utils';
import View from './View';

class Form extends Component {

    static getStores() {
        return [GeneralStore, UIStore];
    }

    static calculateState() {
        const GeneralStoreState = GeneralStore.getState();
        const UIStoreState = UIStore.getState();

        return {
            users: GeneralStoreState.get('users'),
            rooms: GeneralStoreState.get('rooms'),
            events: GeneralStoreState.get('events'),
            event_for_edit: UIStoreState.get('event_for_edit'),
            date: UIStoreState.get('date'),
            time_start: UIStoreState.get('time_start'),
            time_end: UIStoreState.get('time_end'),
            room: UIStoreState.get('room')
        }
    }

    render() {
        return <View {...this.state}/>;
    }
}

export default Container.create(Form);
