import React, { useState } from 'react';
import { FaRegComment } from "react-icons/fa";
import { BsFillTelephoneFill, BsShare, BsTelephone, BsEnvelope, BsChat, BsTrash3 } from "react-icons/bs";
import DialPad from '../Components/DialPad/DialPad';
import { Call, CallEnd, Message } from '@mui/icons-material';
import History from '../../../History';
import { earlyHangUp, endSession } from '../../../SipDiamond';



function CallInProgressSmallComponent({ visible, onHang, state }) {
    function convertSecondsToHMS(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const formattedHours = hours.toString().padStart(2, "0");
        const formattedMinutes = minutes.toString().padStart(2, "0");
        const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    function OnHangClick() {
        // console.log('End Clicked')
        if(state=='init'){
            earlyHangUp();
        }else{
            endSession();
        }

    }


    const [callDuration, setCallDuration] = useState("0:02")
    const [callerNumber, setCallerNumber] = useState('+(92) 3400755136');
    // const [state, setState] = useState('init');
    return (
        <div>
            {visible == true ? <div className="bg-base-100 shadow-md p-4 rounded-lg flex-wrap m-2">
                <div className="flex items-center justify-between">

                    <div className="text-white w-12 h-12 justify-center align-middle  rounded-full p-3 bg-red-500  hover:bg-red-600 shadow-md hover:shadow-xl">
                        <CallEnd onClick={OnHangClick} className='justify-center align-middle self-center' />
                    </div>
                    <div>
                        <p>{callerNumber}</p>
                        {state == 'init' ? <p className='text-xs mt-1'>Ringing</p> : <p className='text-xs mt-1'>Connected</p>}

                    </div>
                    <div className="">
                        <button className="btn btn-sm text-black">{callDuration}</button>
                    </div>
                </div>
            </div> : null}
        </div>


    );
}





const SecondCol = () => {


    const [inCall, setInCall] = useState(true);

    return (
        <div style={{ height: window.innerHeight }} className='bg-gray-100 overflow-auto'>
            <div className=' py-1'>
                <CallInProgressSmallComponent visible={inCall} />
                <div className="bg-base-100 shadow-md p-4 rounded-lg m-2">
                    <div className="flex items-center justify-between">
                        <div className="text-white h-12 justify-center  flex  w-12 bg-blue-400 rounded-full p-2">
                            <Message sx={{ width: 20, height: 20, alignSelf: "center" }} />
                        </div>
                        <div>
                            <p>Johan Smith</p>
                            <p className='text-xs'>IVR_Queue_1-00:01</p>
                        </div>
                        <div className="">
                            <button className="btn btn-sm bg-green-800 text-white">Accepted</button>
                        </div>
                    </div>
                </div>

            </div>

            <DialPad />

            <History />





        </div>
    );
};

export default SecondCol;