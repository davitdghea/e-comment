import { Button, Product } from 'Comporen/Index'
import React from 'react'
import { useSelector } from 'react-redux'

const WishList = () => {
  const { current } = useSelector(s => s.user)
  console.log(current)
  return (
    <div className='relative'>
      <header className='fixed top-0 left-0 right-0 sm:relative z-30 text-3xl font-semibold bg-gray-100 py-4 border-b-2'>
        <p className='ml-[55px] sm:ml-0'>My Wishlist</p> 
      </header>
      <div className='p-4 w-full sm:grid sm:grid-cols-5 gap-4 sm:mt-0 mt-14'>
        {current?.wishList?.map(el => (
          <div className=' flex flex-col gap-3 rounded-md drop-shadow bg-white ' key={el._id}>
            <Product
            className="bg-white rounded-md drop-shadow"
            pid={el._id}
            productData={el}
         
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default WishList