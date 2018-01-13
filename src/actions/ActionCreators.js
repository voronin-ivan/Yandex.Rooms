import Actions from 'constants/Actions';
import Dispatcher from 'core/Dispatcher';

const actionCreators = {
    setGeneralStore(result) {
        Dispatcher.dispatch({
            type: Actions.SET_GENERAL_STORE,
            payload: { result }
        });
    },
    setEvents(events) {
        Dispatcher.dispatch({
            type: Actions.SET_EVENTS,
            payload: { events }
        });
    },
    setDate(date) {
        Dispatcher.dispatch({
            type: Actions.SET_DATE,
            payload: { date }
        });
    },
    setShowForm(show_form) {
        Dispatcher.dispatch({
            type: Actions.SET_SHOW_FORM,
            payload: { show_form }
        });
    },
    setEventForEdit(event_for_edit) {
        Dispatcher.dispatch({
            type: Actions.SET_EVENT_FOR_EDIT,
            payload: { event_for_edit }
        });
    },
    setRoom(room) {
        Dispatcher.dispatch({
            type: Actions.SET_ROOM,
            payload: { room }
        });
    },
    setTimeStart(time_start) {
        Dispatcher.dispatch({
            type: Actions.SET_TIME_START,
            payload: { time_start }
        });
    },
    setTimeEnd(time_end) {
        Dispatcher.dispatch({
            type: Actions.SET_TIME_END,
            payload: { time_end }
        });
    }
};

export default actionCreators;
