import {combineReducers, createStore} from 'redux'
import reducer from './reducer'

// const rootReducer = combineReducers({
//     reducer
// })

// export default createStore(rootReducer)

export default createStore(reducer)