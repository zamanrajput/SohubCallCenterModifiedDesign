/* eslint-disable react/prop-types */

import "./DialPad.css";
import { Backspace, Call } from "@mui/icons-material";
import ExpandableComponent from "../../../ExpandableComponent";
import { useState } from "react";
const DialPad = ({ triggerCall, onChange, hidelabel, openDefault }) => {
  function Pad() {
    const [count, setCount] = useState(0);
    const [dialpadInput, setDialpadInput] = useState("");

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

    if (onChange) onChange(dialpadInput);

    return (
      <div className="text-center mb-10 w-full">
        <div className="flex w-auto h-12 bg-gray-100 rounded-lg border justify-center mx-2 my-4 text-center items-center">
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
        <div className="flex flex-wrap w-full mt-3">
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
          <Call
            onClick={() => {
              if (dialpadInput !== "905") triggerCall(dialpadInput);
            }}
            className="justify-center align-middle self-center"
            sx={{ color: "white" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="">
        <ExpandableComponent
          openDefault={openDefault}
          title={hidelabel ? null : "Dialpad"}
          Child={<Pad />}
        />
      </div>
    </div>
  );
};

export default DialPad;
