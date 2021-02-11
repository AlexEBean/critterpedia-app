const initialState = {
    user: {},
    isLoggedIn: false
}

const LOGIN_USER = "LOGIN_USER"
const LOGOUT_USER = "LOGOUT_USER"
const GET_USER = "GET_USER"

export function loginUser(user){
    return {
        type: LOGIN_USER,
        payload: user
    }
}

export function logoutUser() {
    return {
        type: LOGOUT_USER, 
        payload: initialState
    }
}

export function getUser(user){
    return {
        type: GET_USER,
        payload: user
    }
}

export default function reducer (state = initialState, action){
    const {type, payload} = action
    switch(type){
        case LOGIN_USER:
            return {...state, user: payload, isLoggedIn: true}
        case LOGOUT_USER: 
            return payload
        case GET_USER:
            return {...state, user: payload}
        default:
            return state
    }
}