import { Password } from "@mui/icons-material";
import {
  URL_LOGIN
} from "./API_LINKS";

import { clearDb, navigateTo } from "./utils";

/* eslint-disable @typescript-eslint/no-unused-vars */
const MakePostCall = (url:string, requestBody:object, callback:(error:any,result:any)=>any) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  // myHeaders.append("Authorization", "Bearer " + getToken());


  var raw = JSON.stringify(requestBody);

  fetch(url, {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  })
    .then((response) => response.json())
    .then((result) => callback(null, result))
    .catch((error) => callback(error, null));
};

const MakeGetWithAuthCall = (url:string, token:string,  callback:(error:any,result:any)=>any) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var t = "Bearer " + token;
  console.log("token", t);
  myHeaders.append("Authorization", "Bearer " + token);

  fetch(url, {
    method: "GET",
    headers: myHeaders,
    referrerPolicy:'unsafe_url' as ReferrerPolicy ,
    redirect: "follow",
  })
    .then((response) => {
        if(response.status===401){
            console.log('status',response.status)
            clearDb();
            navigateTo('/auth/login');
            // document.location.reload();
            return;
        }else{
            return response.json();
        }
     
    })
    .then((result) => callback(null, result))
    .catch((error) => callback(error, null));
};

export function loginWithPanel(username:string,password:string, onComplete:(error:any,result:any)=>any) {
  MakeGetWithAuthCall(URL_LOGIN+"?username="+username+"&password="+password,'', onComplete);
}
