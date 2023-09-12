import { createSlice } from "@reduxjs/toolkit"

interface StateType {
    outGoingUserName: string,
    outGoingExtNum: string,
    outgoingCallStatus: string,
    outgoingCallDialogVisiblity: boolean,
    incomingUserName: string,
    incomingExtNum: string,
    incomingCallStatus: string,
    incomingCallDialogVisiblity: boolean,
    inCall:boolean,
    audioRef:any

}

const initialState: StateType = {
    outGoingUserName: 'Zaman',
    outGoingExtNum: '+121-122-2341',
    outgoingCallStatus: 'Calling...',
    outgoingCallDialogVisiblity: false,
    incomingUserName: 'Zaman',
    incomingExtNum: '+121-122-2341',
    incomingCallStatus: 'Unestablished',
    incomingCallDialogVisiblity:false,
    inCall:false,
    audioRef:null
}


export const HomeSlice = createSlice({
    name: "Home",
    initialState: initialState,
    reducers: {
        setOutGoingUserName(state: StateType, action) {
            state.outGoingUserName = action.payload;
        },
        setOutGoingExtNum(state: StateType, action) {
            state.outGoingExtNum = action.payload;
        },
        setOutgoingCallStatus(state: StateType, action) {
            state.outgoingCallStatus = action.payload;
        },
        setOutgoingDialogVisibilty(state: StateType, action) {
            state.outgoingCallDialogVisiblity = action.payload;
        },
        setIncomingUserName(state: StateType, action) {
            state.outGoingUserName = action.payload;
        },
        setIncomingExtNum(state: StateType, action) {
            state.incomingExtNum = action.payload;
        },
        setIncomingCallStatus(state: StateType, action) {
            state.incomingCallStatus = action.payload;
        },
        setIncomingDialogVisibilty(state: StateType, action) {
            state.incomingCallDialogVisiblity = action.payload;
        },
        setInCall(state:StateType,action){
            state.inCall = action.payload;
        },
        setAudioSinkRef(state:StateType,action){
            state.audioRef = action.payload;
        }
        
    }
});

export const { setAudioSinkRef,setInCall,setOutGoingUserName, setOutGoingExtNum, setOutgoingDialogVisibilty,setOutgoingCallStatus,setIncomingCallStatus,setIncomingUserName, setIncomingExtNum, setIncomingDialogVisibilty } = HomeSlice.actions;

export default HomeSlice.reducer;