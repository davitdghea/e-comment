import { apiGetUserOrder, apiUpdateUserOrderAdmin } from 'Apis/Products'
import { CustomSelect, InputFrom, Pagination } from 'Comporen/Index'
import WithRase from 'hocs/withRase'
import useDebounce from 'Hooks/UseDebounce'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { statusOrders } from 'Ultils/Contants'
import { formatMoney } from 'Ultils/Hellpers'

const History = ({ navigate, location }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState(null)
  const [counts, setCounts] = useState(0)
  const [updateOrders, setUpdateOrders] = useState(false)
  const [totalPages, setTotalPages] = useState(0);
  const [params] = useSearchParams()
  const { register, formState: { errors }, watch } = useForm()
  const [deilProduct, setDeilProduct] = useState([])
  const status = watch('status')
  const fetchOrders = async (params) => {
    const response = await apiGetUserOrder({
      ...params,
      page: currentPage,
      limit: process.env.REACT_APP_PRODUCT_LIMIT,
    })
    if (response.success) {
      setTotalPages(Math.ceil(response.counts / process.env.REACT_APP_PRODUCT_LIMIT));
      setOrders(response.orders)
      setCounts(response.counts)
    }
  }
  const queriesDebounce = useDebounce(watch('q'), 800)
  useEffect(() => {
    const pr = Object.fromEntries([...params])
    if (queriesDebounce) pr.q = queriesDebounce
    fetchOrders(pr)
  }, [params, currentPage, queriesDebounce, updateOrders])
  const handleSearchStatus = (selectedOption) => {
    const value = selectedOption?.value || '';
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ status: value }).toString()
    })
  }
  const updateOrder = async ({ oid, order }) => {
    if (order === 'Order' || order === 'Available') {
      const response = await apiUpdateUserOrderAdmin({ oid, status: 'Cancelled' })
      if (response.success) {
        setUpdateOrders(!updateOrders)
        toast.success(response.mes)
      }
      else toast.error(response.mes)
    }
  }
  console.log(deilProduct)
  return (
    <div>
      <header className='top-0 z-30 right-0 left-0 fixed sm:relative text-3xl font-semibold py-4 bg-gray-100 border-b border-b-blue-200'>
        <p className='ml-[55px] sm:ml-0'>History</p>
      </header>
      
      <div className='mt-10'>
        <div className='flex justify-end items-center  mt-3'>
          <form className='w-[45%] flex items-center gap-4'>
            <div className='col-span-1'>
              <InputFrom
                id='q'
                register={register}
                errors={errors}
                FullWidth
                placeholder={'Search orders by title, description...'}
              ></InputFrom>
            </div>
            <div className=''>
              <CustomSelect
                wrapClassName='w-full'
                options={statusOrders}
                value={status}
                onChange={handleSearchStatus}
              />
            </div>
          </form>
        </div>
        { counts !== 0 ? <table className='w-[97%] m-auto text-left'>
          <thead>
            <tr className='border-b pb-5'>
              <th className='text-[12px] sm:text-[15px]'>STT</th>
              <th className='text-center text-[12px] sm:text-[15px]'>Product</th>
              <th className='text-[12px] sm:text-[15px]'>Total</th>
              <th className='text-[12px] sm:text-[15px]'>Status</th>
              <th className='text-[12px] sm:text-[15px]'>Time Order</th>
              <th className='text-[12px] sm:text-[15px]'>Annuler</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((el, idx) => (
              <tr key={el._id} className='border-b py-2'>
                <td className='text-center'>
                  {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                    process.env.REACT_APP_LIMIT +
                    idx + 1}</td>
                <td className=' text-center py-2 max-w-[500px] relative'>
                  <span className='flex justify-center'>
                    <img src={el.products[0].thumb} alt='thumb' className='w-8 h-8 rounded-md object-cover' />
                  </span>
                  <span onClick={() => setDeilProduct(el.products)} className='text-gray-100 cursor-pointer absolute top-0 bottom-0 left-0 right-0 bg-overlay flex items-center justify-center'>
                    +{el.products.length}
                  </span>
                </td>
                <td className='text-[12px] sm:text-[15px]'>{formatMoney(Math.round(el.total))}</td>
                <td className='text-[12px] sm:text-[15px]'>{el.status}</td>
                <td className='text-[12px] sm:text-[15px]'>{moment(el.updatedAt).format('DD/MM/YYYY')}</td>
                {el.status === 'Order' || el.status === 'Available' && <td className='text-[12px] sm:text-[15px] cursor-pointer' onClick={() => updateOrder({oid: el._id})}>Cancel</td>}
              </tr>
            ))}
          </tbody>
        </table> : <div className=' mt-10 sm:mt-0 w-full mx-auto text-center flex justify-center items-center'>
          <p>Bạn chưa mua sản phẩm nào!!!</p>
        </div> }</div>
      {deilProduct.length > 0 && <div onClick={() => setDeilProduct([])} className='flex justify-center items-center  h-full absolute top-0 bottom-0 left-0 right-0 bg-overlay' >
        <table onClick={ e => e.stopPropagation()} className='bg-slate-200 py-10 px-5 rounded-sm'>
          <tr>
            <th className='p-2'>Product</th>
            <th className='p-2'>Color</th>
            <th className='p-2'>Quantity</th>
            <th className='p-2'>Price</th>
            <th className='p-2'>Supported</th>
          </tr>
          {deilProduct?.map(item => (
            <tr key={item?._id} className='gap-2 '>
              <td className='px-2 py-3'>
                <span className='flex'>
                  <img src={item.thumb} alt='thumb' className='w-8 h-8  object-cover' />
                  <span className='flex items-center text-xs ml-2'>{item.title}</span>
                </span>                
              </td>              
              <td className='text-center px-2 py-3'>
                <span className='text-[12px] text-center'>{item.color}</span>
              </td>
              <td className='text-center px-2 py-3'>                
                <span>{item.quantity}</span>
              </td>
              <td>
                <span>{item.price}</span>
              </td>
              <td  className='text-center cursor-pointer text-red-500 hover:underline px-2 py-3'>
                Support
              </td>
            </tr>))}
        </table>

      </div >}
      <div className='w-full text-center mr-[26px] mt-1'>
        <Pagination
          totalCount={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  )
}
export default WithRase(History)
