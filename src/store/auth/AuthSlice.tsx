import { createSlice } from "@reduxjs/toolkit";
import User from "../../types/auth/User";
import { socketRequest } from "../../utils/WebSocket";
import { LoginRequest } from "../../types/request_schemas";
import { AppDispatch, dispatch, useDispatch } from "../Store";
import { navigateTo } from "../../utils/utils";
import { setChats } from "../apps/chat/ChatSlice";

interface AuthSliceType {
  email: string;
  password: string;
  user: User | null;
  error:false;
  message:string;
}

const initialState: AuthSliceType = {
  email: '',
  password: '',
  user: null,
  error:false,
  message:""
};

interface Creds {
  email: string;
  password: string;
}

export function getCreds(): Creds {
  const str = localStorage.getItem("creds");
  if (str != null) {
    const json = JSON.parse(str);
    return { email: json.email, password: json.password };
  } else {
    return { email: "", password: "" };
  }
}

export const AuthSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setEmailAndPassword(state, action) {
      const { email, password } = action.payload;
      state.email = email;
      state.password = password;
    },
    setUserData(state, action) {
      state.user = action.payload;
    },
    setCreds(state, action) {
      const { password, email } = action.payload;
      if(password=='' && email==''){
        localStorage.clear();
        return;
      }
      localStorage.setItem(
        "creds",
        JSON.stringify({ password: password, email: email })
      );
      state.email = email;
      state.password = password;
    },
    setWarning(state,action){
      state.message = action.payload;
    },
    setError(state,action){
      state.error = action.payload;
    },
  },
});

const AuthReducer = AuthSlice.reducer;

export const loadUser = (data: Creds,onSuccess:()=>void,onFail:()=>void) => async (dispatch: AppDispatch) => {

  const loginRequest: LoginRequest = {
    route: "login",
    data: {
      email: data.email,
      password: data.password,
    },
  };

  socketRequest({
    data: loginRequest,
    onResponse(response) {
      if(response.error==false){
        onSuccess();
        dispatch(setCreds(data))
        dispatch(setUserData(response["result"]['profile'] as User));
        dispatch(setChats(response['result']['chats']));
      }else{
        onFail();
        dispatch(setCreds({email:"",password:""}));
      }
     
      //(response);
    },
    onError(error) {
      //(error);
    },
  });
};

export const { setEmailAndPassword, setUserData, setCreds,setError,setWarning } = AuthSlice.actions;

export default AuthReducer;
