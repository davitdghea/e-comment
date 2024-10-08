import React, { memo } from 'react'

const SelectQuantity = ({ quantity, handleQuantity, handleChanGeQuantity }) => {
    return (
        <div className='flex items-center text-[12px]'>
            <span onClick={() => handleChanGeQuantity('minus')} className ="cursor-pointer">-</span>
            <p type="number"  className='border-x-2 sm:px-3 sm:mx-2 px-1 mx-1'>{quantity}</p>
            <span onClick={() => handleChanGeQuantity('plus')} className="cursor-pointer">+</span>
        </div>
    )
}

export default memo(SelectQuantity)