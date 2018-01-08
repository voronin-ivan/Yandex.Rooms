import React, { Component } from 'react';
import GeneralStore from 'stores/GeneralStore';
import UIStore from 'stores/UIStore';
import { Container } from 'flux/utils';
import View from './View';

class Form extends Component {

    static getStores() {
        return [GeneralStore, UIStore];
    }

    static calculateState(prevState) {
        const GeneralStoreState = GeneralStore.getState();
        const UIStoreState = UIStore.getState();

        return {
            users: GeneralStoreState.get('users'),
            rooms: GeneralStoreState.get('rooms'),
            show_form: UIStoreState.get('show_form'),
            event_for_edit: UIStoreState.get('event_for_edit')
        }
    }

    render() {
        return <View {...this.state}/>;
    }
}

export default Container.create(Form);
