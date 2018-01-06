import Actions from 'constants/Actions';
import Dispatcher from 'core/Dispatcher';

const actionCreators = {
    setGeneralStore(result) {
        Dispatcher.dispatch({
            type: Actions.SET_GENERAL_STORE,
            payload: { result }
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
    }
};

export default actionCreators;
