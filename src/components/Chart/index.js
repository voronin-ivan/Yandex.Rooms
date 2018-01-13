import React, { Component } from 'react';
import GeneralStore from 'stores/GeneralStore';
import UIStore from 'stores/UIStore';
import { Container } from 'flux/utils';
import View from './View';

class Chart extends Component {

    static getStores() {
        return [GeneralStore, UIStore];
    }

    static calculateState(prevState) {
        const GeneralStoreState = GeneralStore.getState();
        const UIStoreState = UIStore.getState();

        return {
            users: GeneralStoreState.get('users'),
            rooms: GeneralStoreState.get('rooms'),
            events: GeneralStoreState.get('events'),
            date: UIStoreState.get('date')
        }
    }

    render() {
        return <View {...this.state}/>;
    }
}

export default Container.create(Chart);
