import  { useState } from "react";
import { getDevicesData, saveAudioInputDeviceId, saveAudioOutputDeviceId } from "../../../utils/storageHelper";
import { Check } from "@mui/icons-material";
import { changeMicrophone, changeSpeaker } from "../../../utils/SipDiamond";

const AudioDeviceList = () => {
  const [inputDevices, setInputDevices] = useState([]);
  const [outputDevices, setOutputDevices] = useState([]);
  const [devicesData, setDevicesData] = useState({});
  const [refresh,setRefresh] = useState(true);
  
  const fetchDevicesData = async () => {
    const savedData = await getDevicesData();
    setDevicesData(savedData);
  };

  const enumerateDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputDevices = devices.filter((device) => device.kind === "audioinput");
    const outputDevices = devices.filter((device) => device.kind === "audiooutput");
    setInputDevices(inputDevices);
    setOutputDevices(outputDevices);
  };
  if(refresh){
    fetchDevicesData();
    enumerateDevices();
    setRefresh(false);
  }
 
  return (
    <div className="rounded-xl bg-white shadow-xl p-2">
      <p style={{ color: "black", fontWeight: "600" }}>Audio Input Devices</p>
      <hr />
      <ul>
        {inputDevices.map((device) => (
          <p
            onClick={() => { saveAudioInputDeviceId(device.deviceId);setRefresh(true);changeMicrophone(device.deviceId) }}
            className={`${device.deviceId === devicesData.input ? "bg-green-600 text-white cursor-not-allowed" : "hover:bg-indigo-600 bg-white cursor-pointer hover:text-white"}  rounded-md px-2`}
            key={device.deviceId}
          >
            {device.label}{device.deviceId === devicesData.input ? <Check size='20px' className="inline" /> : ""}
          </p>
        ))}
      </ul>
      <p className="mt-1" style={{ color: "black", fontWeight: "600" }}>Audio Output Devices</p>
      <hr />
      <ul>
        {outputDevices.map((device) => (
          <p
            onClick={() => { saveAudioOutputDeviceId(device.deviceId);setRefresh(true);changeSpeaker(device.deviceId) }}
            className={`${device.deviceId === devicesData.output ? "bg-green-600 text-white cursor-not-allowed" : "hover:bg-indigo-600 bg-white cursor-pointer hover:text-white"}  rounded-md px-2`}
            key={device.deviceId}
          >
            {device.label} {device.deviceId === devicesData.output ? <Check size='20px' className="inline" /> : ""}
          </p>
        ))}
      </ul>
    </div>
  );
};

export default AudioDeviceList;
