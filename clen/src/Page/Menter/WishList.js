import { Button, Product } from 'Comporen/Index'
import React from 'react'
import { useSelector } from 'react-redux'

const WishList = () => {
  const { current } = useSelector(s => s.user)

  return (
    <div>
      <header className='text-3xl font-semibold py-4 border-b-2'>
        My Wishlist
      </header>
      <div className='p-4 w-full grid grid-cols-5 gap-4'>
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