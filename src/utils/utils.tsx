

export  function navigateTo(path:string){
    window.location.href = path;
}



export const appName = "Call Center";


export   const  appDomain = "";

export  const   appLogo = 'path-to-logo'

export interface UserDataType {
    login_status: string;
    extension: string;
    password: string;
    domain: string;
    websocket_port: string;
    websocket_path: string;
  }
  


export function getData():UserDataType{
    
    const savedData = localStorage.getItem('saved_data');
  if (savedData) {
    return JSON.parse(savedData) as UserDataType;
  }
  const response: UserDataType = {
    login_status: "",
    extension: "",
    password: "",
    domain: "",
    websocket_port: "",
    websocket_path: "",
  };
  return response;
  
}


export function saveData(data:UserDataType){
    localStorage.setItem('saved_data',JSON.stringify(data));
    console.log('saved',getData());
}
export function clearDb(){
    localStorage.clear();
}
