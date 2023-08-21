import {
    BsFillTelephoneFill, BsThreeDotsVertical, BsTextCenter, BsClock, BsPencil,
    BsCalendar2Day, BsCheckLg, BsFilter
} from "react-icons/bs";
const SecondSection = () => {
    return (
        <div className="bg-base-100 shadow-xl p-4 rounded mt-1 text-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-black rounded-full">
                            <div className='flex items-start justify-between gap-5'>
                                <p><BsClock className='inline' /> Customer Journey (TBD)</p>
                                <p><BsTextCenter className="inline" /> VIR Transcript</p>
                            </div>
                        </div>

                        <div className="">
                            <button className='border rounded-full'><BsThreeDotsVertical size="15px" /></button>
                        </div>
                    </div>
                    <hr />
                    <div style={{ overflowY: "scroll" }} className='max-h-80'>
                        <div className='border rounded-md p-2 mt-2'>
                            <p className='font-bold'>Customer Informations</p>
                            <div>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="font-bold">
                                        <p>Michael Littlefood <BsPencil className='inline' /></p>
                                    </div>
                                    <div>
                                        <p>Contacts within 24 hours</p>
                                        <p className='font-bold'>4</p>
                                    </div>
                                    <div className="">
                                        <p>Contacts within last 10 days</p>
                                        <p className='font-bold'>9</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='border rounded-md p-2 mt-2'>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Contacts and Activities</p>
                                <p className='font-bold text-xs'>

                                    <div className="form-control w-32">
                                        <label className="cursor-pointer label">
                                            <span className="label-text">LiveStrem</span>
                                            <input type="checkbox" className="toggle toggle-accent toggle-sm" checked />
                                        </label>
                                    </div>
                                </p>
                            </div>
                            <div>
                                <div className="border rounded-md p-2 mt-1 bg-slate-50">
                                    <div className="">
                                        <p className='text-xs'>Most Recent</p>
                                    </div>
                                    <div className='flex gap-20 mt-3'>
                                        <div>
                                            <p className='font-bold'>Now</p>
                                            <p className=''>15</p>
                                        </div>
                                        <div className="">
                                            <p className='font-bold'><BsCalendar2Day className='inline' /> Activity</p>
                                            <p className=''>14:50 PM  Failedto renew auto insurance</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-md p-2 mt-1">
                                    <div className='flex flex-wrap gap-2 mt-3'>
                                        <div>
                                            <button className="btn btn-sm text-xs"><BsFilter className="inline" /> Filters</button>
                                        </div>
                                        <div>
                                            <button className="btn btn-sm text-xs rounded-full"><BsCheckLg className="inline" /> Last 30 Days</button>
                                        </div>
                                        <div>
                                            <button className="btn btn-sm text-xs rounded-full"><BsCheckLg className="inline" /> Contacts and Activities</button>
                                        </div>
                                        <div>
                                            <button className="btn btn-sm text-xs rounded-full"><BsCheckLg className="inline" /> Voice</button>
                                        </div>
                                    </div>
                                    {/* card   */}
                                    <div className='mt-4'>
                                        <div className="flex items-center justify-between">
                                            <div className="text-black bg-stone-500 rounded-full p-4">
                                            <BsFillTelephoneFill size="15px" />
                                            </div>
                                            <div>
                                                <p>Johan Smith</p>
                                                <p className='text-xs'>IVR_Queue_1-00:01</p>
                                            </div>
                                            <div className="">
                                                <button className="btn btn-sm bg-slate-100 text-black">Call</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <div className="flex items-center justify-between">
                                            <div className="text-black bg-stone-500 rounded-full p-4">
                                            <BsFillTelephoneFill size="15px" />
                                            </div>
                                            <div>
                                                <p>Johan Smith</p>
                                                <p className='text-xs'>IVR_Queue_1-00:01</p>
                                            </div>
                                            <div className="">
                                                <button className="btn btn-sm bg-slate-100 text-black">Call</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <div className="flex items-center justify-between">
                                            <div className="text-black bg-stone-500 rounded-full p-4">
                                            <BsFillTelephoneFill size="15px" />
                                            </div>
                                            <div>
                                                <p>Johan Smith</p>
                                                <p className='text-xs'>IVR_Queue_1-00:01</p>
                                            </div>
                                            <div className="">
                                                <button className="btn btn-sm bg-slate-100 text-black">Call</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
    );
};

export default SecondSection;