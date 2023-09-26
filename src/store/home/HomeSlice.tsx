import { createSlice } from "@reduxjs/toolkit"
import User from "../../types/auth/User";
import { AppDispatch } from "../Store";

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
    inCallStatus:string,
    errorDialogVisibility:boolean,
    errorDialogMessage:string,
    errorDialogTitle:string,
    inCallUser:User|null,
    inCallTimer:any
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
    inCallUserName:"",
    errorDialogVisibility:false,
    errorDialogTitle:"Error",
    errorDialogMessage:"Error Message",
    inCallUser:null,
    inCallTimer:0

}


export const HomeSlice = createSlice({
    name: "Home",
    initialState: initialState,
    reducers: {
        resetTimer(state:StateType,action){
            state.inCallTimer = 0;
        },
        setIncreamentTimer(state:StateType,action){
            state.inCallTimer = state.inCallTimer + 1;
            //(state.inCallTimer);
        },
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
        },
        setGlobalError(state:StateType,action){
            const {visibility,title,message} = action.payload;
            state.errorDialogVisibility = visibility;
            state.errorDialogMessage = message??'';
            state.errorDialogTitle = title??'';
        }
        ,
        setInCallUser(state:StateType,action){
            state.inCallUser = action.payload;
        }
        
    }
});

export const  startTimer=() => async(dispatch:AppDispatch)=>{
    dispatch(resetTimer(0));
    setInterval(()=>{dispatch(setIncreamentTimer(0))},1000);
}


export const {setGlobalError,setIncreamentTimer,resetTimer, setInCallExtNumber,setInCallStatus,setInCallUsername,setAudioSinkRef,setInCall,setOutGoingUserName, setOutGoingExtNum, setInCallUser,setOutgoingDialogVisibilty,setOutgoingCallStatus,setIncomingCallStatus,setIncomingUserName, setIncomingExtNum, setIncomingDialogVisibilty } = HomeSlice.actions;

export default HomeSlice.reducer;