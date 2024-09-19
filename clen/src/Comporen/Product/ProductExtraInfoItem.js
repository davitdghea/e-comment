import React, { memo } from 'react'

const ProductExtraInfoItem = ({title, sub, icon}) => {
  return (
    <div className='flex items-center border shadow-xl my-[10px] w-[95%] mx-auto rounded-xl'>
      <p className='mx-[10px]'>{icon}</p>
      <p className='flex flex-col'><span>{title}</span><span className='text-gray-400'>{sub}</span></p>
    </div>
  )
}

export default memo(ProductExtraInfoItem)