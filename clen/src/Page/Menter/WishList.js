import { apiUpdateCart, apiUpdateWithlist } from 'Apis/User'
import WithRase from 'hocs/withRase'
import React, { memo} from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getCurrent } from 'St/User/AsyncAction'
import { closestColor, formatMoney } from 'Ultils/Hellpers'

const WishList = ({ dispatch }) => {
  const { current } = useSelector(s => s.user)
  const handleClickOptions = async(data)=>{
    const response = await apiUpdateWithlist({ pid: data })
    if (response.success){
      dispatch(getCurrent())
      toast.success(response.message)
    }
    else toast.error(response.message)
  }
  
  const handleClickCart = async ({ id, color, price, thumb, title }) => {
    const response = await apiUpdateCart({ pid: id, color: color, price: price, thumb: thumb, title: title })
    if (response.success) {
      toast.success(response.message)
    }
    else toast.error(response.message)
  }
  return (
    <div className='relative'>
      <header className='fixed top-0 left-0 right-0 sm:relative z-30 text-3xl font-semibold bg-gray-100 py-4 border-b-2'>
        <p className='ml-[55px] sm:ml-0'>My Wishlist</p> 
      </header>
      {current?.wishList.length >= 1 ?  <table className='p-4 w-full gap-4 sm:mt-5 mt-[80px] rounded-md ' >
        <tr className='font-bold bg-gray-700   text-white mt-5 border-b border-gray-100'>
          <th className='py-1'>Product</th>
          <th>Price</th>
          <th>Color</th>
          <th></th>
          <th></th>
        </tr>
        {current?.wishList?.map(el => (
          <tr className='gap-3 rounded-md drop-shadow border-b border-gray-100 ' key={el._id}>
            <Link to={`/${el.category}/${el.pid}/${el.title}`}>
            <td className='flex ml-2 py-2'>
                <img src={el.thumb} alt='' className='w-[50px] h-[50px] object-cover mr-2' />
              <span>{el.title}</span>
            </td>
            </Link>
            <td className='text-center'>{formatMoney(el.price)}</td>
            <td className='text-center'>{closestColor(el.color)}</td>
            <td className='text-blue-500 hover:underline cursor-pointer' onClick={() => handleClickCart({ id: el.pid, color:el.color, price:el.price, thumb:el.thumb, title:el.title })}>Add to cart</td>
            <td className='text-red-500 hover:underline cursor-pointer'  onClick={() =>  handleClickOptions(el.pid)}>Xóa</td>
          </tr>
        ))}
      </table> : <div className='w-full flex justify-center mt-5'>
        <p >Rỗng!!!</p>
      </div>}
    </div>
  )
}

export default memo(WithRase(WishList))