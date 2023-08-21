/* eslint-disable no-unused-vars */
import { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import DialPad from "./DialPad/DialPad";
import { Backspace, Call, Close, Forward, PhoneForwarded } from "@mui/icons-material";
import styled from "@emotion/styled";

export default function TransferCallDialog() {

  if (onChange) onChange(dialpadInput);

  return (
    <Dialog open={visible} onClose={handleClose}>
      <div className="flex flex-row justify-between pt-3 px-3">
        <p style={{ color: "black", fontWeight: "500", fontSize: "20px" }}>
          <div>Call Transfer</div>
        </p>

        <Close className="cursor-pointer" onClick={onClose} sx={{ justifySelf: "end" }} />
      </div>

      <div className="pb-6 px-3">
        <div className="text-center max-w-sm ">

          <div className='flex w-auto h-12 bg-gray-100 rounded-lg border justify-center mx-2 my-3 text-center items-center'>
            <h5 style={{ flex: 5 }} className=' border-none font-bold text-xl' type="number" name="" id=""> {dialpadInput} </h5>
            <span style={{ flex: 1 }}>
              {dialpadInput != '' ?
                <div className="bg-red-500 mx-auto justify-center flex hover:bg-red-400 items-center h-9 w-9 rounded-full">
                  <Backspace style={{ marginInlineEnd: 3, width: 20, height: 20, color: 'white' }} onClick={handleRemoveLast} />
                </div>
                : null}
            </span>
          </div>
          <div className="w-full flex">
            <Switch onChange={(e) => { setIsAttendedTransfer(e.target.checked) }} checked={isAttendedTransfer} /> <span className="self-center ">Attended</span>
          </div>
          <hr />
          <div className="flex flex-wrap mt-3">
            <div className="w-1/3">
              <button onClick={() => handleClick('1')} className="mx-2 rounded-full  w-12 h-12 text-xl text-gray-700 font-bold hover:bg-gray-400">1</button>
            </div>
            <div className="w-1/3">
              <button onClick={() => handleClick('2')} className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400">2</button>
            </div>
            <div className="w-1/3">
              <button onClick={() => handleClick('3')} className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400">3</button>
            </div>
            <div className="w-1/3">
              <button onClick={() => handleClick('4')} className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400">4</button>
            </div>
            <div className="w-1/3">
              <button onClick={() => handleClick('5')} className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400">5</button>
            </div>
            <div className="w-1/3">
              <button onClick={() => handleClick('6')} className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400">6</button>
            </div>
            <div className="w-1/3">
              <button onClick={() => handleClick('7')} className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400">7</button>
            </div>
            <div className="w-1/3">
              <button onClick={() => handleClick('8')} className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400">8</button>
            </div>
            <div className="w-1/3">
              <button onClick={() => handleClick('9')} className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400">9</button>
            </div>
            <div className="w-1/3">
              <button onClick={() => handleClick('*')} className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400">*</button>
            </div>
            <div className="w-1/3">
              <button onClick={() => handleClick('0')} className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400">0</button>
            </div>
            <div className="w-1/3">
              <button onClick={() => handleClick('#')} className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400">#</button>
            </div>


          </div>
          <div className="bg-green-500 mx-auto mt-6 justify-center  flex hover:bg-green-400 items-center h-14 w-14 rounded-full">
            <PhoneForwarded onClick={() => { transferCall(isAttendedTransfer ? 'attended' : 'blind', dialpadInput) }} className='justify-center align-middle self-center' sx={{ color: 'white' }} />
          </div>

        </div>
      </div>
    </Dialog>
  );


}

