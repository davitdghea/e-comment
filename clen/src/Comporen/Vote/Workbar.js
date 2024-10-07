import React, { useRef,useEffect } from 'react'
import {AiFillStar} from "react-icons/ai"

const Workbar = ({number,ratingCount,ratingsTotal}) => {
  const percentRef = useRef()
  useEffect(()=>{
    const percent = Math.round(ratingCount * 100 / ratingsTotal) || 0
    percentRef.current.style.cssText = `right:${100 - percent}%`
  }, [ratingCount, ratingsTotal])
    return (
    <div className='flex items-center gap-2 text-gray-500'>
      <div className='flex w-1/12 items-center gap-1 text-sm'>
        <span>{number}</span>
        <AiFillStar color='orange'/>
      </div>
        <div className='w-[75%]'>
        <div className='w-full relative h-2 bg-gray-200 rounded-r-full'>
            <div ref={percentRef} className='absolute inset-0 bg-red-500 right-8'>

            </div>
        </div>
      </div>
          <div className=' text-xs text-400 flex justify-end w-[15%]'>
          <p className=' sm:hidden block'>{`${ratingCount || 0} rv`}</p>
          <p className='hidden sm:block'>{`${ratingCount || 0} reviewers`}</p>
          </div>
    </div>
  )
}

export default Workbar