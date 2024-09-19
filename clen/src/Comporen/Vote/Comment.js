import React from 'react'
import moment from 'moment'
import { IoPersonCircleOutline } from "react-icons/io5";
import { renderStarFromNumber } from 'Ultils/Hellpers';
const Comment = ({  name="Biên Nguyên", content,updatedAt,star }) => {
    return (
        <div className='gap-4 flex'>
            <div className=' flex-none'>
                <IoPersonCircleOutline size={35}/>
            </div>
            <div className='flex flex-col flex-auto'>
                <div className='flex justify-between items-center w-[98%]'>
                    <h3 className='font-semibold'>{name}</h3>
                    <span>{moment(updatedAt)?.fromNow()}</span>
                </div>
                <div className='flex flex-col gap-2 pl-4 text-sm my-4 border border-gray-300 py-2 bg-gray-100 w-[98%]'>
                    <span className='flex item-center gap-1'>
                        <span className='font-semibold'>Vote:</span>
                        <span className='flex items-center gap-1'>
                            {renderStarFromNumber(star)?.map((el, index) => (
                                <span key={index}>{el}</span>
                            ))}
                        </span>
                    </span>
                    
                    <span className='flex  gap-1'>
                        <span className='font-semibold'>Comment:</span>
                        <span className='flex items-center gap-1'>
                            {content}
                        </span>
                    </span>
                    
                </div>
            </div>
        </div>
    )
}

export default Comment