import { createStore as reduxCreateStore } from 'redux';

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_DATA': return {
            ...state,
            data: action.data
        }
        case 'NEXT_PAGE': return {
            ...state,
            page: action.data
        }
        case "SET_ALL_DATA": return {
            ...state,
            allData: action.data
        }
        default:
            return state;
    }
}

const initialState = {
    allData: [],
    data: [],
    page: 1
}

const store = reduxCreateStore(reducer, initialState)

export default store;