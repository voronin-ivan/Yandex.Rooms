import MyReduceStore from 'core/MyReduceStore';
import Dispatcher from 'core/Dispatcher';
import Actions from 'constants/Actions';
import { Map } from 'immutable';

class UIStore extends MyReduceStore {
    getInitialState() {
        return Map({
            show_form: false,
            event_for_edit: null
        });
    }

    reduce(state, action) {
        switch (action.type) {
            case Actions.SET_SHOW_FORM:
                return state.set('show_form', action.payload.show_form);
            case Actions.SET_EVENT_FOR_EDIT:
                return state.set('event_for_edit', action.payload.event_for_edit);
            default:
                return state;
        }
    }
}

export default new UIStore(Dispatcher);
