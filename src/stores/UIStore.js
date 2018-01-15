import { ReduceStore } from 'flux/utils';
import Dispatcher from 'core/Dispatcher';
import Actions from 'core/Actions';
import { Map } from 'immutable';

class UIStore extends ReduceStore {
    getInitialState() {
        return Map({
            date: new Date(),
            show_form: false,
            event_for_edit: null,
            room: null,
            time_start: '',
            time_end: ''
        });
    }

    reduce(state, action) {
        switch (action.type) {
            case Actions.SET_DATE:
                return state.set('date', action.payload.date);
            case Actions.SET_SHOW_FORM:
                return state.set('show_form', action.payload.show_form);
            case Actions.SET_EVENT_FOR_EDIT:
                return state.set('event_for_edit', action.payload.event_for_edit);
            case Actions.SET_ROOM:
                return state.set('room', action.payload.room);
            case Actions.SET_TIME_START:
                return state.set('time_start', action.payload.time_start);
            case Actions.SET_TIME_END:
                return state.set('time_end', action.payload.time_end);
            default:
                return state;
        }
    }
}

export default new UIStore(Dispatcher);
