
export const LoadingReducer = (prevState = {
    loading: false
}, action) => {
    let {type, payload} = action
    switch(type) {
        case 'change_loading':
            let newState = {...prevState}
            newState.loading = payload
            return newState
        default:
            return prevState
    }
}