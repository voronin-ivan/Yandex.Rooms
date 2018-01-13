import { ReduceStore } from 'flux/utils';
import Dispatcher from 'core/Dispatcher';
import Actions from 'constants/Actions';
import { Map } from 'immutable';

class GeneralStore extends ReduceStore {
    getInitialState() {
        return Map({});
    }

    reduce(state, action) {
        switch (action.type) {
            case Actions.SET_GENERAL_STORE:
                return Map(action.payload.result);
            case Actions.SET_EVENTS:
                return state.set('events', action.payload.events);
            default:
                return state;
        }
    }
}

export default new GeneralStore(Dispatcher);
