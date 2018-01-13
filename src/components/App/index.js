import React, { Component } from 'react';
import GeneralStore from 'stores/GeneralStore';
import UIStore from 'stores/UIStore';
import { Container } from 'flux/utils';
import View from './View';

class App extends Component {

    static getStores() {
        return [UIStore];
    }

    static calculateState(prevState) {
        const GeneralStoreState = GeneralStore.getState();
        const UIStoreState = UIStore.getState();

        return {
            events: GeneralStoreState.get('events'),
            show_form: UIStoreState.get('show_form')
        }
    }

    render() {
        return <View {...this.state}/>;
    }
}

export default Container.create(App);
