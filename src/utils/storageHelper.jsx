


export function getData(){
    return localStorage.getItem('saved_data')??"";
}


export function saveData(){
    localStorage.setItem('saved_data');
}



var calls = null;

var counter = 0;

export function getCounter() {
    return counter;
}

export function setCounter(value) {
    counter = value;
}
var stop = false;
export function isStop() {
    return stop;
}

export async function setStop(bool) {
    stop = bool;
    counter=0;
    const id = setInterval(() => { stop = false; clearInterval(id) }, 2000)
}



export function saveAudioOutputDeviceId(id){
    localStorage.setItem('output_audio_device_id',id);
}

export function saveAudioInputDeviceId(id){
    localStorage.setItem('audio_device_id',id);
}



export async function getDevicesData(){
    var audioDeviceID = localStorage.getItem('audio_device_id');
    var audioOutDeviceID = localStorage.getItem('output_audio_device_id');
    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputDevices = devices.filter(
      (device) => device.kind === "audioinput"
    );
    const outputDevices = devices.filter(
      (device) => device.kind === "audiooutput"
    );
    var isInputDeviceOkay = false;
    var isOutPutDeviceOkay = false;
    inputDevices?.map((dev)=>{
        if(dev.deviceId==audioDeviceID) isInputDeviceOkay = true;
    })

    outputDevices?.map((dev)=>{
        if(dev.deviceId==audioOutDeviceID) isOutPutDeviceOkay = true;
    })

    if(!isInputDeviceOkay) audioDeviceID = "default";
    if(!isOutPutDeviceOkay) audioOutDeviceID = "default";
    return {
        input:audioDeviceID,output:audioOutDeviceID
    }
}




export function loadCallsHistory() {

    calls = JSON.parse(localStorage.getItem('calls'));
    if (calls === null) {
        calls = [];
        calls.push({ 'event': 'Dialed Call', 'type': "Call", 'number': '1234', 'time': '10:11am', 'date': '20/02/23' });
    }


    return calls.reverse();
}

export function clearStorage() {
    localStorage.clear();
}

function saveChanges(list) {

    localStorage.setItem('calls', JSON.stringify(list));
}

export function saveToHistory(object) {
    try {
        var list = loadCallsHistory().reverse();
        list.push(object);
        saveChanges(list);
        return loadCallsHistory();
    } catch (e) {
        return loadCallsHistory();
    }

}