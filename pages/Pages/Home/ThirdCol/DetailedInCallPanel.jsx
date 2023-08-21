/* eslint-disable react/prop-types */

import {
  Backspace,
  CallEnd,
  Close,
  Dialpad,
  Keyboard,
  List,
  Merge,
  Outbound,
  People,
  PhoneForwarded,
  PlayArrow,
  SecurityRounded,
  Settings,
} from "@mui/icons-material";
import { useState } from "react";
import {
  BsFillTelephoneFill,
  BsFillPauseFill,
  BsXCircle,
  BsLockFill,
  BsMicMute,
  BsMic,
} from "react-icons/bs";
import {
  AttendedTransfer,
  BlindTransfer,
  CancelTransferSession,
  CompleteTransfer,
  ConferenceDial,
  MuteSession,
  UnmuteSession,
  clearObjs,
  holdSession,
  mergeConferenceCalls,
  sendDTMF,
  terminateAttendedTransfer,
  unholdSession,
} from "../../../SipDiamond";

import { Avatar, Dialog, Switch } from "@mui/material";
import { setStop } from "../../../data/storageHelper";
import MyTabbedLayout from "../../../TabbedLayout";
import dayjs from "dayjs";
import AudioDeviceList from "../../AudioDevicesList";

const DetailedInCallLayout = ({
  visible,
  triggerEndCall,
  callerNumber,
  callDuration,
  setInCall,
}) => {
  const [onHold, setOnHold] = useState(false);
  const [transferVisible, setTransferVisiblity] = useState(false);
  const [count, setCount] = useState(0);
  const [dialpadInput, setDialpadInput] = useState("");
  const [isAttendedTransfer, setIsAttendedTransfer] = useState(false);
  const [subSession, setSubSession] = useState(null);
  const [mainSession, setMainSession] = useState(null);
  const [transferId, setTransferId] = useState(null);
  const [transferCallStatus, setTransferCallStatus] = useState("None");
  const [transferAdvanceLayout, setTransferAdvanceLayout] = useState(false);
  const [transferNum, setTransferNum] = useState("1234");
  const [isDTMFOpen, setDTMFVisibility] = useState(false);
  const [isMute, setMute] = useState(false);
  const [conferenceCallMember, setConferenceCallMember] = useState(null);
  const [conferenceCallStatus, setConferenceCallStatus] = useState("Calling");
  const [isMerged, setMerged] = useState();
  const [conferenceCall, setConferenceCall] = useState(false);
  const [openQuickSettings, setOpenQuickSettings] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState({});

  const openSettings = (event) => {
    const xPos = event.clientX;
    const yPos = event.clientY;
    setAnchorPosition({ x: xPos, y: yPos });
    setOpenQuickSettings(true);
  };

  const handleClick = (e) => {
    const num = e;
    if (count < 20) {
      setDialpadInput(dialpadInput + num);
      setCount(count + 1);
    }
  };
  const handleRemoveLast = () => {
    if (count > 0) {
      setDialpadInput(dialpadInput.slice(0, -1));
      setCount(count - 1);
    }
  };

  function transferCall(type, num) {
    console.log(type, num);
    setTransferNum(num);
    if (type === "blind") {
      BlindTransfer(num, {
        onAccept: () => {
          setInCall(false);
          setTransferVisiblity(false);
          clearObjs();
        },
        onReject: () => {
          setTransferVisiblity(false);
          setOnHold(false);
        },
      });
    } else if (type === "attended") {
      setTransferAdvanceLayout(true);
      AttendedTransfer(num, {
        onSessionReceived: (mainSession, subSession, tid) => {
          setMainSession(mainSession);
          setSubSession(subSession);
          setTransferId(tid);
        },
        onTrying: () => {
          setTransferCallStatus("Trying..");
        },
        onRinging: () => {
          setTransferCallStatus("Ringing..");
        },
        onRedirect: () => {
          setTransferCallStatus("Redirecting..");
        },
        onAccept: (mainSession, tid) => {
          setTransferCallStatus("Accepted..");
          setMainSession(mainSession);
          setTransferId(tid);
          //mainSession=> you can use it to complete the transfer
        },
        onBye: () => {
          setTransferCallStatus("Ended");
        },
      });
    }
  }

  function completeTransfer() {
    CompleteTransfer(mainSession, subSession, transferId, {
      onAccept: () => {
        //task completed
        setInCall(false);
        setStop(true);
        setTransferVisiblity(false);
      },
      onReject: () => {
        endAttendedTransfer();
        //failed, cancel transfer
      },
    });
  }

  //handle terminate attended transfer
  function endAttendedTransfer() {
    //changeUI
    setTransferCallStatus("Ended");
    setTransferVisiblity(false);
    setTransferAdvanceLayout(false);
    terminateAttendedTransfer(mainSession, subSession, transferId);
    setStop(true);
    setInCall(false);
    clearObjs();
  }

  const [callMembers] = useState([]);

  function cancelTransferSession() {
    CancelTransferSession({
      onDone: () => {
        //do the unhold
      },
      onError: (e) => {
        console.log(e);
        //can do unhold with warning
      },
    });
  }

  function mergeConferenceCall() {
    mergeConferenceCalls();
    setMerged(true);
    unholdSession();
    setOnHold(false);
  }
  function removeConferenceMember() {
    conferenceCallMember.session.bye().catch(function (e) {
      console.warn("Failed to bye the session!", e);
    });
    console.log("New call session end");
    var confCallId = conferenceCallMember.session.data.confcalls.length - 1;
    conferenceCallMember.session.data.confcalls[confCallId].accept.disposition =
      "bye";
    conferenceCallMember.session.data.confcalls[confCallId].accept.eventTime =
      dayjs().format();
  }

  function addCallMember(num) {
    setOnHold(true);
    holdSession();
    ConferenceDial({
      dstNo: dialpadInput,
      onData: (session, num) => {
        const data = {
          session: session,
          number: num,
        };
        setConferenceCallMember(data);
      },
      onEnd: () => {
        setConferenceCallMember(null);
        setMerged(false);
        setConferenceCallStatus("Ended");
      },

      onAccept: () => {
        setConferenceCallStatus("In Progress");
        //accepted now can merge call
      },
      onReject: () => {
        setConferenceCallStatus("Rejected");
        setConferenceCallMember(null);
      },
      onRedirect: (sip) => {
        setConferenceCallStatus("Redirecting to " + sip);
      },
      onTry: () => {
        setConferenceCallStatus("Calling..");
      },
      onRinging: () => {
        setConferenceCallStatus("Ringing..");
      },
    });
  }

  return (
    <div>
      {visible ? (
        <div className="bg-base-100 shadow-xl p-4 rounded-xl mb-4">
          <Dialog
            open={transferVisible}
            onClose={() => {
              setTransferVisiblity(false);
            }}
          >
            {transferAdvanceLayout ? (
              <div className="flex flex-col p-3 w-96 items-center">
                <p className="font-bold mb-3 w-full">Attended Transfering</p>
                <Avatar sx={{ width: "120px", height: "120px" }} />
                <p className="font-semibold text-lg mt-4">{transferNum}</p>
                <p className="font-bold text-lg mt-2">{transferCallStatus}</p>

                <div className="mt-2 justify-center align-middle flex">
                  <button
                    onClick={completeTransfer}
                    className="btn btn-sm bg-green-600 hover:bg-green-900 text-white rounded-full  text-xs mx-1"
                  >
                    <CallEnd /> Complete
                  </button>
                  <button
                    onClick={() => {
                      endAttendedTransfer();
                    }}
                    className="btn btn-sm bg-red-600 hover:bg-red-900 text-white rounded-full  text-xs mx-1"
                  >
                    <BsXCircle size="15px" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex flex-row justify-between pt-3 px-3">
                  <p
                    style={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "20px",
                    }}
                  >
                    <div>Call Transfer</div>
                  </p>

                  <Close
                    className="cursor-pointer"
                    onClick={() => {
                      setTransferVisiblity(false);
                      setOnHold(false);
                      unholdSession();
                    }}
                    sx={{ justifySelf: "end" }}
                  />
                </div>

                <div className="pb-6 px-3">
                  <div className="text-center max-w-sm ">
                    <div className="flex w-auto h-12 bg-gray-100 rounded-lg border justify-center mx-2 my-3 text-center items-center">
                      <h5
                        style={{ flex: 5 }}
                        className=" border-none font-bold text-xl"
                        type="number"
                        name=""
                        id=""
                      >
                        {" "}
                        {dialpadInput}{" "}
                      </h5>
                      <span style={{ flex: 1 }}>
                        {dialpadInput != "" ? (
                          <div className="bg-red-500 mx-auto justify-center flex hover:bg-red-400 items-center h-9 w-9 rounded-full">
                            <Backspace
                              style={{
                                marginInlineEnd: 3,
                                width: 20,
                                height: 20,
                                color: "white",
                              }}
                              onClick={handleRemoveLast}
                            />
                          </div>
                        ) : null}
                      </span>
                    </div>
                    <div className="w-full flex">
                      <Switch
                        onChange={(e) => {
                          setIsAttendedTransfer(e.target.checked);
                        }}
                        checked={isAttendedTransfer}
                      />{" "}
                      <span className="self-center ">Attended</span>
                    </div>
                    <hr />
                    <div className="flex flex-wrap mt-3">
                      <div className="w-1/3">
                        <button
                          onClick={() => handleClick("1")}
                          className="mx-2 rounded-full  w-12 h-12 text-xl text-gray-700 font-bold hover:bg-gray-400"
                        >
                          1
                        </button>
                      </div>
                      <div className="w-1/3">
                        <button
                          onClick={() => handleClick("2")}
                          className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                        >
                          2
                        </button>
                      </div>
                      <div className="w-1/3">
                        <button
                          onClick={() => handleClick("3")}
                          className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                        >
                          3
                        </button>
                      </div>
                      <div className="w-1/3">
                        <button
                          onClick={() => handleClick("4")}
                          className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                        >
                          4
                        </button>
                      </div>
                      <div className="w-1/3">
                        <button
                          onClick={() => handleClick("5")}
                          className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                        >
                          5
                        </button>
                      </div>
                      <div className="w-1/3">
                        <button
                          onClick={() => handleClick("6")}
                          className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                        >
                          6
                        </button>
                      </div>
                      <div className="w-1/3">
                        <button
                          onClick={() => handleClick("7")}
                          className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                        >
                          7
                        </button>
                      </div>
                      <div className="w-1/3">
                        <button
                          onClick={() => handleClick("8")}
                          className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                        >
                          8
                        </button>
                      </div>
                      <div className="w-1/3">
                        <button
                          onClick={() => handleClick("9")}
                          className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                        >
                          9
                        </button>
                      </div>
                      <div className="w-1/3">
                        <button
                          onClick={() => handleClick("*")}
                          className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                        >
                          *
                        </button>
                      </div>
                      <div className="w-1/3">
                        <button
                          onClick={() => handleClick("0")}
                          className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                        >
                          0
                        </button>
                      </div>
                      <div className="w-1/3">
                        <button
                          onClick={() => handleClick("#")}
                          className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                        >
                          #
                        </button>
                      </div>
                    </div>
                    <div className="bg-green-500 mx-auto mt-6 justify-center  flex hover:bg-green-400 items-center h-14 w-14 rounded-full">
                      <PhoneForwarded
                        onClick={() => {
                          transferCall(
                            isAttendedTransfer ? "attended" : "blind",
                            dialpadInput
                          );
                        }}
                        className="justify-center align-middle self-center"
                        sx={{ color: "white" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Dialog>
          <Dialog open={isDTMFOpen} onClose={() => setDTMFVisibility(false)}>
            <div className="flex flex-col w-52">
              <div className="flex flex-row justify-between pt-3 px-3">
                <p
                  style={{
                    color: "black",
                    fontWeight: "500",
                    fontSize: "20px",
                  }}
                >
                  <div>DTMF</div>
                </p>

                <Close
                  className="cursor-pointer"
                  onClick={() => setDTMFVisibility(false)}
                  sx={{ justifySelf: "end" }}
                />
              </div>

              <div className="pb-6 px-3">
                <div className="text-center max-w-sm ">
                  <div className="flex flex-wrap mt-3">
                    <div className="w-1/3">
                      <button
                        onClick={() => sendDTMF("1")}
                        className="mx-2 rounded-full  w-12 h-12 text-xl text-gray-700 font-bold hover:bg-gray-400"
                      >
                        1
                      </button>
                    </div>
                    <div className="w-1/3">
                      <button
                        onClick={() => sendDTMF("2")}
                        className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                      >
                        2
                      </button>
                    </div>
                    <div className="w-1/3">
                      <button
                        onClick={() => sendDTMF("3")}
                        className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                      >
                        3
                      </button>
                    </div>
                    <div className="w-1/3">
                      <button
                        onClick={() => sendDTMF("4")}
                        className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                      >
                        4
                      </button>
                    </div>
                    <div className="w-1/3">
                      <button
                        onClick={() => sendDTMF("5")}
                        className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                      >
                        5
                      </button>
                    </div>
                    <div className="w-1/3">
                      <button
                        onClick={() => sendDTMF("6")}
                        className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                      >
                        6
                      </button>
                    </div>
                    <div className="w-1/3">
                      <button
                        onClick={() => sendDTMF("7")}
                        className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                      >
                        7
                      </button>
                    </div>
                    <div className="w-1/3">
                      <button
                        onClick={() => sendDTMF("8")}
                        className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                      >
                        8
                      </button>
                    </div>
                    <div className="w-1/3">
                      <button
                        onClick={() => sendDTMF("9")}
                        className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                      >
                        9
                      </button>
                    </div>
                    <div className="w-1/3">
                      <button
                        onClick={() => sendDTMF("*")}
                        className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                      >
                        *
                      </button>
                    </div>
                    <div className="w-1/3">
                      <button
                        onClick={() => sendDTMF("0")}
                        className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                      >
                        0
                      </button>
                    </div>
                    <div className="w-1/3">
                      <button
                        onClick={() => sendDTMF("#")}
                        className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                      >
                        #
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Dialog>

          <Dialog
            PaperProps={{
              style: {
                position: "absolute",
                left: Math.min(
                  window.innerWidth - 400,
                  Math.max(0, anchorPosition.x - 200)
                ),
                top: Math.min(
                  window.innerHeight - 300,
                  Math.max(0, anchorPosition.y - 150)
                ),
              },
            }}
            open={openQuickSettings}
            onClose={() => setOpenQuickSettings(false)}
          >
            <div className="flex flex-col w-auto">
              <div className="flex flex-row justify-between pt-3 px-3">
                <p
                  style={{
                    color: "black",
                    fontWeight: "500",
                    fontSize: "20px",
                  }}
                >
                  <div>Select Devices</div>
                </p>

                <Close
                  className="cursor-pointer"
                  onClick={() => setOpenQuickSettings(false)}
                  sx={{ justifySelf: "end" }}
                />
              </div>
              <div className="px-2">
                <AudioDeviceList />
              </div>
            </div>
          </Dialog>

          <Dialog
            open={conferenceCall}
            onClose={() => {
              setConferenceCall(false);
            }}
          >
            {transferAdvanceLayout ? (
              <div className="flex flex-col p-3 w-96 items-center">
                <p className="font-bold mb-3 w-full">Attended Transfering</p>
                <Avatar sx={{ width: "120px", height: "120px" }} />
                <p className="font-semibold text-lg mt-4">{transferNum}</p>
                <p className="font-bold text-lg mt-2">{transferCallStatus}</p>

                <div className="mt-2 justify-center align-middle flex">
                  <button
                    onClick={completeTransfer}
                    className="btn btn-sm bg-green-600 hover:bg-green-900 text-white rounded-full  text-xs mx-1"
                  >
                    <CallEnd /> Complete
                  </button>
                  <button
                    onClick={() => {
                      endAttendedTransfer();
                    }}
                    className="btn btn-sm bg-red-600 hover:bg-red-900 text-white rounded-full  text-xs mx-1"
                  >
                    <BsXCircle size="15px" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-80">
                <div className="flex flex-row justify-between pt-3 px-3">
                  <p
                    style={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "20px",
                    }}
                  >
                    <div>Add Member</div>
                  </p>

                  <Close
                    className="cursor-pointer"
                    onClick={() => {
                      setConferenceCall(false);
                      setOnHold(false);
                      unholdSession();
                    }}
                    sx={{ justifySelf: "end" }}
                  />
                </div>

                <div className="pb-6 px-3">
                  <div className="text-center max-w-sm ">
                    <div className="flex w-auto h-12 bg-gray-100 rounded-lg border justify-center mx-2 my-3 text-center items-center">
                      <h5
                        style={{ flex: 5 }}
                        className=" border-none font-bold text-xl"
                        type="number"
                        name=""
                        id=""
                      >
                        {" "}
                        {dialpadInput}{" "}
                      </h5>
                      <span style={{ flex: 1 }}>
                        {dialpadInput != "" ? (
                          <div className="bg-red-500 mx-auto justify-center flex hover:bg-red-400 items-center h-9 w-9 rounded-full">
                            <Backspace
                              style={{
                                marginInlineEnd: 3,
                                width: 20,
                                height: 20,
                                color: "white",
                              }}
                              onClick={handleRemoveLast}
                            />
                          </div>
                        ) : null}
                      </span>
                    </div>

                    <hr />
                    <MyTabbedLayout
                      defaultSelection={0}
                      onSelection={(value) => {}}
                      tabs={[
                        {
                          title: <Dialpad />,
                          element: (
                            <div className=" flex flex-wrap mt-3">
                              <div className="w-1/3">
                                <button
                                  onClick={() => handleClick("1")}
                                  className="mx-2 rounded-full  w-12 h-12 text-xl text-gray-700 font-bold hover:bg-gray-400"
                                >
                                  1
                                </button>
                              </div>
                              <div className="w-1/3">
                                <button
                                  onClick={() => handleClick("2")}
                                  className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                                >
                                  2
                                </button>
                              </div>
                              <div className="w-1/3">
                                <button
                                  onClick={() => handleClick("3")}
                                  className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                                >
                                  3
                                </button>
                              </div>
                              <div className="w-1/3">
                                <button
                                  onClick={() => handleClick("4")}
                                  className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                                >
                                  4
                                </button>
                              </div>
                              <div className="w-1/3">
                                <button
                                  onClick={() => handleClick("5")}
                                  className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                                >
                                  5
                                </button>
                              </div>
                              <div className="w-1/3">
                                <button
                                  onClick={() => handleClick("6")}
                                  className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                                >
                                  6
                                </button>
                              </div>
                              <div className="w-1/3">
                                <button
                                  onClick={() => handleClick("7")}
                                  className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                                >
                                  7
                                </button>
                              </div>
                              <div className="w-1/3">
                                <button
                                  onClick={() => handleClick("8")}
                                  className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                                >
                                  8
                                </button>
                              </div>
                              <div className="w-1/3">
                                <button
                                  onClick={() => handleClick("9")}
                                  className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                                >
                                  9
                                </button>
                              </div>
                              <div className="w-1/3">
                                <button
                                  onClick={() => handleClick("*")}
                                  className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                                >
                                  *
                                </button>
                              </div>
                              <div className="w-1/3">
                                <button
                                  onClick={() => handleClick("0")}
                                  className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                                >
                                  0
                                </button>
                              </div>
                              <div className="w-1/3">
                                <button
                                  onClick={() => handleClick("#")}
                                  className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                                >
                                  #
                                </button>
                              </div>
                              <div className="w-full flex-row gap-3 justify-center flex">
                                {conferenceCallMember === null ? (
                                  <div
                                    onClick={() => {
                                      addCallMember(dialpadInput);
                                    }}
                                    className="bg-green-500  mt-6 justify-center  flex hover:bg-green-400 items-center h-14 w-14 rounded-full"
                                  >
                                    <PhoneForwarded
                                      className="justify-center align-middle self-center"
                                      sx={{ color: "white" }}
                                    />
                                  </div>
                                ) : (
                                  <>
                                    {" "}
                                    {isMerged ? (
                                      <div className="text-white w-16 h-12 justify-center align-middle flex  rounded-full  bg-red-500  hover:bg-red-600 shadow-md hover:shadow-xl">
                                        <CallEnd className="justify-center align-middle self-center" />
                                      </div>
                                    ) : (
                                      <div
                                        onClick={() => {
                                          mergeConferenceCall();
                                        }}
                                        className="bg-sky-500  mt-6 justify-center  flex hover:bg-sky-400 items-center h-14 w-14 rounded-full"
                                      >
                                        <Merge
                                          className="justify-center align-middle self-center"
                                          sx={{ color: "white" }}
                                        />
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          ),
                        },
                        {
                          title: <List />,
                          element: (
                            <div className="flex flex-row h-72 justify-center items-center ">
                              <div className="flex-1 flex w-full h-72 flex-col pt-2 overflow-auto">
                                <div
                                  onClick={() => {}}
                                  className="flex flex-row  mx-2 my-1 hover:bg-blue-200 cursor-pointer "
                                  style={{
                                    borderRadius: "6px",
                                    boxShadow:
                                      "0px 0px 2px 1px rgba(0,0,0,0.1)",
                                    padding: "6px",
                                  }}
                                >
                                  <div className="flex-1 flex-row flex">
                                    <Avatar
                                      sx={{
                                        width: "25px",
                                        height: "25px",
                                        marginInlineEnd: "4px",
                                        alignSelf: "center",
                                      }}
                                    />
                                    <div
                                      style={{
                                        color: "black",
                                        alignItems: "center",
                                      }}
                                      className="flex flex-col "
                                    >
                                      <p
                                        style={{
                                          fontSize: 12,
                                          fontWeight: "600",
                                          marginInlineStart: "4px",
                                        }}
                                      >
                                        Me
                                      </p>
                                      <p
                                        style={{
                                          fontSize: 10,
                                          fontWeight: "400",
                                          marginInlineStart: "4px",
                                          alignSelf: "start",
                                        }}
                                      >
                                        {905}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex-row flex flex-1 flex-right justify-end ">
                                    <div
                                      style={{
                                        color: "gray",
                                        alignSelf: "right",
                                      }}
                                      className="flex flex-col "
                                    >
                                      <p
                                        style={{
                                          fontSize: 10,
                                          fontWeight: "600",
                                          marginInlineStart: "4px",
                                        }}
                                      >
                                        {dayjs().format("hh:mm a")}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: 10,
                                          fontWeight: "600",
                                          marginInlineStart: "4px",
                                          alignSelf: "start",
                                          color: "green",
                                        }}
                                      >
                                        Connected
                                      </p>
                                    </div>
                                    <Outbound
                                      sx={{
                                        marginInlineStart: "10px",
                                        width: "18px",
                                        height: "18px",
                                      }}
                                      style={{ alignSelf: "center" }}
                                      color={"success"}
                                    />
                                  </div>
                                </div>
                                {conferenceCallMember !== null ? (
                                  <div
                                    onClick={() => {}}
                                    className="flex flex-row  mx-2 my-1 hover:bg-blue-200 cursor-pointer "
                                    style={{
                                      borderRadius: "6px",
                                      boxShadow:
                                        "0px 0px 2px 1px rgba(0,0,0,0.1)",
                                      padding: "6px",
                                    }}
                                  >
                                    <div className="flex-1 flex-row flex">
                                      <Avatar
                                        sx={{
                                          width: "25px",
                                          height: "25px",
                                          marginInlineEnd: "4px",
                                          alignSelf: "center",
                                        }}
                                      />
                                      <div
                                        style={{
                                          color: "black",
                                          alignItems: "center",
                                        }}
                                        className="flex flex-col "
                                      >
                                        <p
                                          style={{
                                            fontSize: 12,
                                            fontWeight: "600",
                                            marginInlineStart: "4px",
                                          }}
                                        >
                                          Member
                                        </p>
                                        <p
                                          style={{
                                            fontSize: 10,
                                            fontWeight: "400",
                                            marginInlineStart: "4px",
                                            alignSelf: "start",
                                          }}
                                        >
                                          {conferenceCallMember.number}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex-row flex flex-1 flex-right justify-end ">
                                      <div
                                        style={{
                                          color: "gray",
                                          alignSelf: "right",
                                        }}
                                        className="flex flex-col "
                                      >
                                        <p
                                          style={{
                                            fontSize: 10,
                                            fontWeight: "600",
                                            marginInlineStart: "4px",
                                          }}
                                        >
                                          {dayjs().format("hh:mm a")}
                                        </p>
                                        <p
                                          style={{
                                            fontSize: 10,
                                            fontWeight: "600",
                                            marginInlineStart: "4px",
                                            alignSelf: "start",
                                            color: "green",
                                          }}
                                        >
                                          {conferenceCallStatus}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          ),
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}
          </Dialog>

          <div className="flex items-center justify-between gap-4 mb-3 ">
            <div className="text-black w-1/5 flex flex-row justify-center items-center">
              <p className="text-l " style={{ fontWeight: "500" }}>
                {" "}
                {callerNumber ?? "+123456"}
              </p>
              <div className=" items-center justify-start self-center flex">
                <div>
                  <BsFillTelephoneFill
                    size="20px"
                    className="text-black  bg-green-300 rounded-full ml-5 mr-2 p-1"
                  />
                </div>
                <div className="">{callDuration}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={(e) => openSettings(e)}
                className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-full  text-xs mx-1"
              >
                <Settings size="15px" />
              </button>
              <button
                onClick={() => {
                  setOnHold(!onHold);
                  if (onHold) {
                    unholdSession();
                  } else holdSession();
                }}
                className="btn btn-sm bg-gray-200 text-black rounded-full  text-xs mx-1"
              >
                {!onHold ? <BsFillPauseFill size="15px" /> : <PlayArrow />}{" "}
                {onHold ? "Unhold" : "Hold"}
              </button>
              <button
                onClick={() => {
                  setConferenceCall(true);
                  setOnHold(true);
                  holdSession();
                }}
                className="btn btn-sm bg-orange-600 hover:bg-orange-800 text-white rounded-full text-xs mx-1"
              >
                <People
                  sx={{ height: "18px", width: "18px", color: "white" }}
                />{" "}
                Add
              </button>
              <button
                onClick={() => setDTMFVisibility(true)}
                className="btn btn-sm bg-sky-600 hover:bg-sky-800 text-white rounded-full text-xs mx-1"
              >
                <Keyboard
                  sx={{ height: "18px", width: "18px", color: "white" }}
                />{" "}
                DTMF
              </button>
              <button
                onClick={() => {
                  setTransferVisiblity(true);
                  setOnHold(true);
                  holdSession();
                }}
                className="btn btn-sm bg-green-700 hover:bg-green-800 text-white rounded-full text-xs mx-1"
              >
                <PhoneForwarded
                  sx={{ height: "18px", width: "18px", color: "white" }}
                />{" "}
                Transfer
              </button>
              <button
                onClick={() => {
                  setMute(!isMute);
                  if (isMute) UnmuteSession();
                  else MuteSession();
                }}
                className="btn btn-sm bg-gray-200 text-black rounded-full  text-xs mx-1"
              >
                {isMute ? <BsMic size="15px" /> : <BsMicMute />}{" "}
                {isMute ? "Unmute" : "Mute"}
              </button>
            </div>
          </div>
          <hr />
          <div>
            <div className="flex  flex-wrap text-sm  items-center gap-5 p-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p>
                    Phone Number{" "}
                    <SecurityRounded
                      color="success"
                      sx={{ width: "15px", height: "15px", mb: "4px" }}
                    />
                  </p>
                  <p>Queue </p>
                  <p>Queue Name </p>
                  <p>
                    Address <BsLockFill size="15px" className="inline" />
                  </p>
                </div>
                <div>
                  <p>: {callerNumber}</p>
                  <p>: 12</p>
                  <p>: IVR_Queue_1</p>
                  <p>
                    : 3772 AVE NE SERRA ROAD, <br /> Long Long Country, San
                    Farisisco, CA 94001.
                  </p>
                </div>
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p>DNIS </p>
                  <p>VIR Path </p>
                  <p>RONA </p>
                  <p className="">
                    Alternate Number{" "}
                    <BsLockFill size="15px" className="inline" />
                  </p>
                </div>
                <div>
                  <p>: +1-800-900-8989</p>
                  <p>: VIR_Path1</p>
                  <p>: 32</p>
                  <p>: 00083472385</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row-reverse">
            <button className="btn btn-sm lowercase bg-gray-200 text-black rounded-full  text-sm mx-1">
              Save
            </button>
            <button className="btn btn-sm lowercase bg-gray-200 text-black rounded-full  text-sm mx-1">
              Revert
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DetailedInCallLayout;
