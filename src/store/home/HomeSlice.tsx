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
    audioRef:any,
    inCallExtNumber:string,
    inCallUserName:string,
    inCallStatus:string

}

const initialState: StateType = {
    outGoingUserName: '',
    outGoingExtNum: '',
    outgoingCallStatus: '',
    outgoingCallDialogVisiblity: false,
    incomingUserName: '',
    incomingExtNum: '',
    incomingCallStatus: '',
    incomingCallDialogVisiblity:false,
    inCall:false,
    audioRef:null,
    inCallExtNumber:'',
    inCallStatus:'',
    inCallUserName:""
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
        },
        setInCallStatus(state:StateType,action){
            state.inCallStatus = action.payload;
        }
        ,
        setInCallUsername(state:StateType,action){
            state.inCallUserName = action.payload;
        }
        ,
        setInCallExtNumber(state:StateType,action){
            state.inCallExtNumber = action.payload;
        }
        
    }
});

export const { setInCallExtNumber,setInCallStatus,setInCallUsername,setAudioSinkRef,setInCall,setOutGoingUserName, setOutGoingExtNum, setOutgoingDialogVisibilty,setOutgoingCallStatus,setIncomingCallStatus,setIncomingUserName, setIncomingExtNum, setIncomingDialogVisibilty } = HomeSlice.actions;

export default HomeSlice.reducer;