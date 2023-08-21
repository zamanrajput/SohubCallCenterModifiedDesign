import React, { useState } from 'react';
import { FaHouseUser } from "react-icons/fa";
import { FaMap } from "react-icons/fa";
import { FaCommentAlt } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";
import { MdDialpad } from "react-icons/md";

const FirstCol = () => {
    const [count, setCount] = useState(0);
    const handleClickDialPad = () => {
        setCount(count + 1);
    };
    return (
        <div className='max-w-screen-lg m-auto'>
            <div className="flex sm:flex-col md:flex-col lg:flex-col justify-evenly lg:justify-between md:justify-between sm:justify-between gap-6 items-center py-2">
                <div className='sm:top-1 md:top-1 lg:top-1'>
                    <div className="text-black bg-slate-200 p-4 rounded-full mt-1">
                        <FaHouseUser size="20px" />
                    </div>

                    <div className="text-black bg-slate-200 p-4 rounded-full mt-2">
                        <FaMap size="20px" />
                    </div>
                
                </div>
                <div className='sm:bottom-0 md:bottom-0 lg:bottom-0'>
                    <div className="text-black bg-slate-200 p-4 rounded-full mt-2">
                        <FaCommentAlt size="20px" />
                    </div>

                    <div className="text-black bg-slate-200 p-4 rounded-full mt-2">
                        <FaQuestion size="20px" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FirstCol;