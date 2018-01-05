import { ReduceStore } from 'flux/utils';
import { Map } from 'immutable';

class MyReduceStore extends ReduceStore {

    getInitialState() {
        return Map({});
    }

    updateState(state, payload = {}) {
        return state.withMutations(state => {
            for (let key in payload) {
                let value = payload[key];
                state.set(key, value);
            }

            if (state.has('errors')) {
                state.set('errors', Map({}));
            }
        });
    }

    reduce(state, action) {
        switch (action.type) {
            default:
                return state;
        }
    }
}

export default MyReduceStore;
