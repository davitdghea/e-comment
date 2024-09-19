import React, { memo } from 'react'

const Countdown = ({unit, number}) => {
  return (
    <div className='w-[30%] h-[60px] border  justify-center items-center bg-gray-100 rounded-md flex flex-col'>
        <span>{number}</span>
        <span className='text-xs text-gray-700'>{unit}</span>
    </div>
  )
}

export default memo(Countdown)