import React, { Component } from 'react';
import UIStore from 'stores/UIStore';
import { Container } from 'flux/utils';
import View from './View';

class Date extends Component {

    static getStores() {
        return [UIStore];
    }

    static calculateState(prevState) {
        const UIStoreState = UIStore.getState();

        return {
            date: UIStoreState.get('date')
        }
    }

    render() {
        return <View {...this.state}/>;
    }
}

export default Container.create(Date);
