import React, { Component } from 'react';
import GeneralStore from 'stores/GeneralStore';
import { Container } from 'flux/utils';
import View from './View';

class Rooms extends Component {

    static getStores() {
        return [GeneralStore];
    }

    static calculateState() {
        const GeneralStoreState = GeneralStore.getState();

        return {
            rooms: GeneralStoreState.get('rooms')
        }
    }

    render() {
        return <View {...this.state}/>;
    }
}

export default Container.create(Rooms);
