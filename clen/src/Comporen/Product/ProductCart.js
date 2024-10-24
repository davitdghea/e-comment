import React, { memo } from 'react'
import { formatMoney, renderStarFromNumber } from '../../Ultils/Hellpers'
import WithRase from 'hocs/withRase'
const ProductCart = ({pid,navigate,category, images, title, totalRatings, price, style = 'w-1/3 flex border' }) => {
   
  return (

    <div className={style}
      onClick={() => navigate(`/${category?.toLowerCase()}/${pid}/${title}`)}
    >
        <img src={images} alt='' className='w-[90px] object-contain p-4'></img>
        <div className='mt-[15px]'>
        <span className='text-[10px] overflow-hidden truncate whitespace-nowrap overflow-ellipsis' title={title}>{title}</span>
        <span className='flex h-[15px] '>{renderStarFromNumber(totalRatings)?.map((el, index) => (
          <span key={index}>{el}</span>
        ))}</span>
        <span className='text-[10px]'>{`${formatMoney(price)} VNĐ`} </span>
        </div> 
    </div>
  )
}

export default memo(WithRase(ProductCart))