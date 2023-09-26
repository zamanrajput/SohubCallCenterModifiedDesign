
import { useRef, useState } from "react";
import { Call, CallEnd, Message } from "@mui/icons-material";
import History from "../../src/components/pages/home/History";

import DialPad from "../../src/components/pages/home/DialPad/DialPad.jsx";
import { useEffect } from "react";
import {
  AnswerAudioCall,
  CreateUserAgent,
  DialByLine,
  RejectCall,
  bindIncomingCallBacks,
  bindOutgoingBacks,
  clearObjs,
  earlyHangUp,
  endSession,
  rejectInvite,
} from "../../src/utils/SipDiamond.js";

import {
  BsCalendar2Day,
  BsCheckLg,
  BsClock,
  BsFilter,
  BsPencil,
  BsTextCenter,
  BsThreeDotsVertical,
} from "react-icons/bs";
import DetailedInCallLayout from "./ThirdCol/DetailedInCallPanel";
import {
  getCounter,
  isStop,
  loadCallsHistory,
  saveToHistory,
  setCounter,
  setStop,
} from "../../src/utils/storageHelper";
import dayjs from "dayjs";
import ExpandableComponent from "../../src/components/pages/home/ExpandableComponent";
import AudioDeviceList from "../../src/components/pages/home/AudioDevicesList";
import { ContextMenu } from "react-contextmenu";
import { useDispatch } from "react-redux";

const Home = () => {
  const [inCall, setInCall] = useState(false);
  const [incomingCall, setInComingCall] = useState(false);
  const [incomingCallerNumber, setIncomingCallerNumber] =
    useState("+(92) 3400755136");

  const [callStatus, setCallStatus] = useState("None");

  const [callDuration, setCallDuration] = useState(0);
  const [calls, setCalls] = useState(loadCallsHistory());
  const [callCount, setCallCount] = useState(0);
  const [callerNumber, setCallerNumber] = useState("+(92) 3400755136");

  const ref = useRef(null);

  const incomingCallbacks = {
    onStatusChange: function onStatusChange(string) {
      //("incomingCallbacks", "status:" + string);
      setCallStatus(string);
    },
    onEnd: function onEnd() {
      //("incomingCallbacks", "onEnd");
      setInCall(false);
      setCallStatus("None");
      setStop(true);
    },
    onSuccess: function onSuccess() {
      //call started now or established now
      //("incomingCallbacks", "Success");
      setCallStatus("Established");
      if (getCounter() === 0) {
        startTimer();
      }
    },
    onInvite: function onInvite(inviterId) {
      //working fine
      setCallStatus("Incoming Call..");
      setIncomingCallerNumber(inviterId);
      setInComingCall(true);
    },
    onCancleInvite: function onCancleInvite() {
      //WORKING FINE
      //("incomingCallbacks", "Invite Cancelled");
      setInComingCall(false);
    },
  };
  const outgoingCallbacks = {
    onTry: () => {
      setInCall(true);
      setCallStatus("Calling..");
      //("outgoinCallbacks", "onTry");
    },
    onRinging: () => {
      setInCall(true);
      setCallStatus("Ringing..");
      //("outgoinCallbacks", "onRinging");
    },
    onAccept: () => {
      setInCall(true);
      //("outgoinCallbacks", "onAccept");
      setCallStatus("Established");
      startTimer();
    },
    onReject: () => {
      setCallStatus("Call Ended");
      //("outgoinCallbacks", "onReject");
      clearObjs();
    },
    onEnd: () => {
      //("outgoinCallbacks", "onEnd");
      setCallStatus("Call Ended");
      setStop(true);
      clearObjs();
    },

    onRedirect: () => {
      setInCall(true);
      setCallStatus("Redirecting..");
      //("outgoinCallbacks", "onRedirect");
    },
    onHang: () => {
      setInCall(false);
      clearObjs();
    },
  };

  useEffect(() => {
    bindIncomingCallBacks(incomingCallbacks, ref.current);
    bindOutgoingBacks(outgoingCallbacks, ref.current);
  }, []);

  function convertSecondsToHMS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }



  function onCallButtonClick(number) {
    DialByLine({
      type: "audio",
      num: number,
      audioElementRef: ref.current,
    });
    setCallerNumber(number);
    setCalls(
      saveToHistory({
        event: "Dialed Call",
        type: "Call",
        number: number,
        time: dayjs().format("hh:mm:ss"),
        date: dayjs().format("DD/MM/YY"),
      })
    );
  }


  function startTimer() {
    const seconds = getCounter();
    setCounter(seconds + 1);
    //(`${getCounter()}s`);
    setCallDuration(convertSecondsToHMS(getCounter()));
    const iid = setInterval(() => {
      if (!isStop()) startTimer();
      else {
        setCallDuration(null);
      }
      clearInterval(iid);
    }, 1000);
  }

  function onRejectClick() {
    //("Rejected by you");
    setInComingCall(false);
    RejectCall();
    clearObjs();
  }
  function onAcceptClick() {
    //("Accepted by you");
    AnswerAudioCall();
    setInComingCall(false);
    setCallerNumber(incomingCallerNumber);
    setInCall(true);
  }

  function endCall() {
    if (callStatus === "Established") endSession();
    else {
      earlyHangUp();
    }
  }

  function CallInProgressSmallComponent() {
    return (
      <div>
        {inCall == true ? (
          <div className="bg-base-100 shadow-xl p-4 rounded-xl flex-wrap mb-2">
            <div className="flex items-center justify-between ">
              <div className="text-white w-12 h-10 justify-center align-middle flex  rounded-full  bg-red-500  hover:bg-red-600 shadow-md hover:shadow-xl">
                <CallEnd
                  onClick={endCall}
                  className="justify-center align-middle self-center"
                />
              </div>
              <div>
                <p>{callerNumber}</p>
                <p className="text-xs mt-1">{callStatus}</p>
              </div>
              <div className="">
                <button className="btn btn-sm text-black">
                  {callDuration}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  function IncomingCallSmallComponent() {
    return (
      <div>
        {incomingCall == true ? (
          <div className="bg-base-100 shadow-xl p-4 rounded-xl flex flex-row  mb-2">
            <div className="flex flex-1 flex-row">
              <div className="flex-row flex gap-3 flex-1 ">
                <div className="text-white w-12 h-10 justify-center align-middle flex  rounded-full  bg-red-500  hover:bg-red-600 shadow-md hover:shadow-xl">
                  <CallEnd
                    onClick={onRejectClick}
                    className="justify-center align-middle self-center"
                  />
                </div>

                <div className="text-white w-12 h-10 justify-center align-middle flex rounded-full  bg-green-600  hover:bg-green-700 shadow-md hover:shadow-xl">
                  <CallEnd
                    onClick={onAcceptClick}
                    className="justify-center align-middle self-center"
                  />
                </div>
              </div>

              <div className="flex flex-col flex-1">
                <p>{incomingCallerNumber}</p>
                <p className="text-xs mt-1">{callStatus}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  const dispatch = useDispatch();

  useEffect(() => {
  

  }, []);
  return (
    <>
      {/* Navbar ..  */}
      <div id="navBar" className="hidden">
        <div className=" px-4 pt-3">
          {/* Navbar  */}
          <div className="flex justify-center items-center gap-4 w-auto bg-white rounded-lg shadow-xl">

            <ul className="flex flex-row">
              {/* Home */}
              <li>
                <a href="/message" className="flex items-center">
                  <span className="flex items-center justify-center text-indigo-700 hover:text-white hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      ></path>
                    </svg>
                  </span>
                </a>
              </li>
              {/* MESSAGE */}
              <li>
                <a href="/message" className="flex items-center">
                  <span className="flex items-center justify-center text-indigo-700 hover:text-white hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      ></path>
                    </svg>
                  </span>
                </a>
              </li>
              {/* CALENDAR */}
              <li>
                <a href="#" className="flex items-center">
                  <span className="flex items-center justify-center text-indigo-700 hover:text-white hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </span>
                </a>
              </li>
              {/* SETTINGS */}
              <li>
                <a href="#" className="flex items-center">
                  <span className="flex items-center justify-center text-indigo-700 hover:text-white hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* ---------------- */}
      <div className="grid sm:grid-cols-6 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 2xl:grid-cols-12 gap-1  dark:bg-slate-100 p-2">
        <div className="sm:col-span-3 md:col-span-4 lg:col-span-4 xl:col-span-4 2xl:col-span-4 flex gap-2">
          <div id="sideBar" className="flex justify-center col-span-1 pt-20">
            {/* Side Navigator  */}
            <div className="flex flex-col items-center py-4 flex-shrink-0 w-20 bg-white rounded-3xl h-96 shadow-xl">
              <button className=" flex items-center justify-center rounded-full shadow-xl bg-indigo-700 hover:text-indigo-700 text-white h-10 w-10">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  ></path>
                </svg>
              </button>
              <ul className="flex flex-col space-y-2 mt-12">
                {/* "HOME" */}
                <li>
                  <a href="/" className="flex items-center cursor-not-allowed">
                    <span className="flex items-center justify-center text-white bg-indigo-700 h-12 w-12 rounded-2xl">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        ></path>
                      </svg>
                    </span>
                  </a>
                </li>
                {/* MESSAGE */}
                <li>
                  <a href="/message" className="flex items-center">
                    <span className="flex items-center justify-center text-indigo-700 hover:text-white hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        ></path>
                      </svg>
                    </span>
                  </a>
                </li>
                {/* CALENDAR */}
                <li>
                  <a href="#" className="flex items-center">
                    <span className="flex items-center justify-center text-indigo-700 hover:text-white hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </span>
                  </a>
                </li>
                {/* SETTINGS */}
                <li>
                  <a href="#" className="flex items-center">
                    <span className="flex items-center justify-center text-indigo-700 hover:text-white hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="sm:col-span-2 md:col-span-3 lg:col-span-3 xl:col-span-3 2xl:col-span-3">
            <div className=" overflow-y-auto px-2 pt-3">
              <div className="py-1">
                <IncomingCallSmallComponent />
                <CallInProgressSmallComponent />
                <div className="bg-white shadow-xl p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="text-white h-10 justify-center  flex  w-12 bg-indigo-700 rounded-full p-2">
                      <Message
                        sx={{ width: 20, height: 20, alignSelf: "center" }}
                      />
                    </div>
                    <div>
                      <p>Johan Smith</p>
                      <p className="text-xs">IVR_Queue_1-00:01</p>
                    </div>
                    <div className="">
                      <button className="btn btn-sm bg-green-800 text-white">
                        Accepted
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <audio
                autoPlay
                ref={ref}
                controls
                style={{ display: "none" }}
              ></audio>
              <div className="my-2">
                <DialPad openDefault={true} triggerCall={onCallButtonClick} />
              </div>
              <div className="my-2">
                <History calls={calls} makeCall={onCallButtonClick} />
              </div>
            </div>
          </div>
        </div>
        <div className="sm:col-span-3 md:col-span-8 lg:col-span-8 xl:col-span-8 2xl:col-span-8 border-gray-950 p-1">
          <ContextMenu id="my-context-menu">
            <AudioDeviceList />
          </ContextMenu>

          <DetailedInCallLayout
            visible={inCall}
            triggerEndCall={endCall}
            callerNumber={callerNumber}
            callDuration={callDuration}
            setInCall={setInCall}
          />
          <ExpandableComponent
            openDefault={true}
            title={
              <div className="flex items-center justify-center ">
                <div className="text-black rounded-full mx-2">
                  <div className="flex items-start justify-between gap-5 ">
                    <p>
                      <BsClock className="inline" /> Customer Journey (TBD)
                    </p>
                    <p>
                      <BsTextCenter className="inline" /> VIR Transcript
                    </p>
                    <div className="">
                      <button className="border rounded-full">
                        <BsThreeDotsVertical size="15px" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
            Child={
              <div className="bg-base-100  p-3 rounded mt-1 text-sm ">
                <hr />
                <div>
                  <div className="border rounded-md p-2 mt-2">
                    <p className="font-bold">Customer Informations</p>
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold">
                          <p>
                            Michael Littlefood <BsPencil className="inline" />
                          </p>
                        </div>
                        <div>
                          <p>Contacts within 24 hours</p>
                          <p className="font-bold">4</p>
                        </div>
                        <div className="">
                          <p>Contacts within last 10 days</p>
                          <p className="font-bold">9</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-md p-2 mt-2">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">Contacts and Activities</p>
                      <p className="font-bold text-xs">
                        <div className="form-control w-32">
                          <label className="cursor-pointer label">
                            <span className="label-text">LiveStrem</span>
                            <input
                              type="checkbox"
                              className="toggle toggle-accent toggle-sm"
                              checked
                            />
                          </label>
                        </div>
                      </p>
                    </div>
                    <div>
                      <div className="border rounded-md p-2 mt-1 bg-slate-50">
                        <div className="">
                          <p className="text-xs">Most Recent</p>
                        </div>
                        <div className="flex gap-20 mt-3">
                          <div>
                            <p className="font-bold">Now</p>
                            <p className="">15</p>
                          </div>
                          <div className="">
                            <p className="font-bold">
                              <BsCalendar2Day className="inline" /> Activity
                            </p>
                            <p className="">
                              14:50 PM Failedto renew auto insurance
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-md p-2 mt-1">
                        <div className="flex flex-wrap gap-2 mt-3">
                          <div>
                            <button className="btn btn-sm text-xs">
                              <BsFilter className="inline" /> Filters
                            </button>
                          </div>
                          <div>
                            <button className="btn btn-sm text-xs rounded-full">
                              <BsCheckLg className="inline" /> Last 30 Days
                            </button>
                          </div>
                          <div>
                            <button className="btn btn-sm text-xs rounded-full">
                              <BsCheckLg className="inline" /> Contacts and
                              Activities
                            </button>
                          </div>
                          <div>
                            <button className="btn btn-sm text-xs rounded-full">
                              <BsCheckLg className="inline" /> Voice
                            </button>
                          </div>
                        </div>
                        {/* card   */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between">
                            <div className="text-black">
                              <div className="bg-indigo-500 mx-auto mt-6 justify-center  flex items-center h-14 w-14 rounded-full">
                                <Call
                                  className="justify-center align-middle self-center"
                                  sx={{ color: "white" }}
                                />
                              </div>
                            </div>
                            <div>
                              <p>Johan Smith</p>
                              <p className="text-xs">IVR_Queue_1-00:01</p>
                            </div>
                            <div className="">
                              <button className="btn btn-sm bg-slate-100 text-black">
                                Call
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default Home;
