import {
  BsShare,
  BsTelephone,
  BsEnvelope,
  BsChat,
  BsTrash3,
} from "react-icons/bs";
import ExpandableComponent from "./ExpandableComponent";
import { Avatar } from "@mui/material";
import { Outbound } from "@mui/icons-material";

export default function History({ calls, makeCall }) {
  return (
    <div className="">
      <div className="py-1">
        <div className="">
          <ExpandableComponent
            title={"History"}
            Child={
              <div className="h-auto">
                <div className="inline md:inline sm:inline px-2">
                  <button className="btn btn-sm">All</button>
                </div>
                <div className="inline-flex flex-wrap justify-around gap-2 mt-3 mb-2">
                  <div>
                    <button className="btn btn-sm rounded-full  bg-blue-100">
                      <BsTelephone />{" "}
                    </button>
                  </div>
                  <div>
                    <button className="btn btn-sm rounded-full  bg-blue-100">
                      <BsChat />
                    </button>
                  </div>
                  <div>
                    <button className="btn btn-sm rounded-full  bg-blue-100">
                      <BsShare />
                    </button>
                  </div>
                  <div>
                    <button className="btn btn-sm rounded-full  bg-blue-100">
                      <BsEnvelope />
                    </button>
                  </div>
                </div>
                <hr />

                <div className="flex flex-row justify-center items-center h-3/4">
                  {calls?.length === 0 ? (
                    <div
                      className="flex flex-col "
                      style={{ justifyItems: "center", alignItems: "center" }}
                    >
                      <BsTrash3 size="45px" />
                      <p> No History</p>
                    </div>
                  ) : (
                    <div className="flex-1 flex w-full h-full flex-col pt-2 overflow-auto">
                      {calls?.map((row, i) => {
                        return (
                          <div
                            key={i}
                            onClick={() => makeCall(row.number)}
                            className="flex flex-row  mx-2 my-1 hover:bg-blue-200 cursor-pointer "
                            style={{
                              borderRadius: "6px",
                              boxShadow: "0px 0px 2px 1px rgba(0,0,0,0.1)",
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
                                style={{ color: "black", alignItems: "center" }}
                                className="flex flex-col "
                              >
                                <p
                                  style={{
                                    fontSize: 12,
                                    fontWeight: "600",
                                    marginInlineStart: "4px",
                                  }}
                                >
                                  Unknown
                                </p>
                                <p
                                  style={{
                                    fontSize: 10,
                                    fontWeight: "400",
                                    marginInlineStart: "4px",
                                    alignSelf: "start",
                                  }}
                                >
                                  {row.number}
                                </p>
                              </div>
                            </div>
                            <div className="flex-row flex flex-1 flex-right justify-end ">
                              <div
                                style={{ color: "gray", alignSelf: "right" }}
                                className="flex flex-col "
                              >
                                <p
                                  style={{
                                    fontSize: 10,
                                    fontWeight: "600",
                                    marginInlineStart: "4px",
                                  }}
                                >
                                  {row.time}
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
                                  {row.date}
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
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
