import React, { memo } from 'react'

const SelectQuantity = ({ quantity, handleQuantity, handleChanGeQuantity }) => {
    return (
        <div className='flex'>
            <span onClick={() => handleChanGeQuantity('minus')} className ="cursor-pointer">-</span>
            <p type="number"  className='border-x-2 px-3 mx-2'>{quantity}</p>
            <span onClick={() => handleChanGeQuantity('plus')} className="cursor-pointer">+</span>
        </div>
    )
}

export default memo(SelectQuantity)