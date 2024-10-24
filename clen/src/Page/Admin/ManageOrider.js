import { apiGetUserOrderAdmin,apiUpdateUserOrderAdmin } from 'Apis/Products'
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

const ManageOrider = ({ navigate, location }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState(null)
  const [counts, setCounts] = useState(0)
  const [totalPages, setTotalPages] = useState(0);
  const [params] = useSearchParams()
  const { register, formState: { errors }, watch } = useForm()
  const [updateOrders,setUpdateOrders] = useState(false)
  const [deilProduct, setDeilProduct] = useState({
    deilProduct:[],
    order: null,
    orderId: null,
  })
  const status = watch('status')
  const fetchOrders = async (params) => {
    const response = await apiGetUserOrderAdmin({
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
  }, [params, currentPage, queriesDebounce,  updateOrders ])
  const handleSearchStatus = (selectedOption) => {
    const value = selectedOption?.value || '';
    if (value === '') {
      navigate({
        pathname: location.pathname,

      })
    }
    else {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ status: value }).toString()
      })
    }
  }
  const updateOrder = async ({ oid, status, order }) =>{
    
    
    if (deilProduct?.order === 'Order') {
      const response = await apiUpdateUserOrderAdmin({ oid, status: 'Available' })
      if (response.success) {
        setUpdateOrders(!updateOrders)
        toast.success(response.mes)
      }
      else toast.error(response.mes)
    }
    if (order === 'Order') {
      toast.error('vui lòng ấn đã chuẩn bị hàng trc khi giao')
    }
    if (order === 'Available' ){
      const response = await apiUpdateUserOrderAdmin({ oid, status:'Transport'})
      if (response.success) {
        setUpdateOrders(!updateOrders)
        toast.success(response.mes)
      }
      else toast.error(response.mes)
    }
    if (order === 'Transport') {
      const response = await apiUpdateUserOrderAdmin({ oid, status })
      if (response.success) {
        setUpdateOrders(!updateOrders)
        toast.success(response.mes)
      }
      else toast.error(response.mes)
    }
    
   
}
  console.log(orders)
  return (
    <div>
      <header className='top-0 z-30 right-0 left-0 fixed sm:relative text-3xl font-semibold py-4 bg-gray-100 border-b border-b-blue-200'>
        <p className='ml-[55px] sm:ml-0'>ManageOrider</p>
      </header>

      <div className='mt-10'>
        <div className='flex justify-end items-center mt-3'>
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
        {counts !== 0 ? <table className='w-[97%] m-auto text-left'>
          <thead>
            <tr className='border-b pb-5'>
              <th className='text-[12px] sm:text-[15px]'>STT</th>
              <th className='text-center text-[12px] sm:text-[15px]'> Code Unique</th>
              <th className='text-center text-[12px] sm:text-[15px]'>Product</th>
              <th className='text-[12px] sm:text-[15px] text-center'>Total</th>
              <th className='text-[12px] sm:text-[15px]'>Status</th>
              <th className='text-[12px] sm:text-[15px]'>Order date</th>
              <th className='text-[12px] sm:text-[15px]'>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((el, idx) => (
              <tr key={el._id} className='border-b py-2'>
                <td className='text-center'>
                  {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                    process.env.REACT_APP_LIMIT +
                    idx + 1}</td>
                <td className=' text-center'>{el._id}</td>
                <td className=' text-center py-2 max-w-[500px] relative'>
                  <span className='flex justify-center'>
                    <img src={el.products[0].thumb} alt='thumb' className='w-8 h-8 rounded-md object-cover' />
                  </span>
                  <span onClick={() => { setDeilProduct({ deilProduct: el.products, order: el.status, orderId: el._id })}} className='text-gray-100 cursor-pointer absolute top-0 bottom-0 left-0 right-0 bg-overlay flex items-center justify-center'>
                    +{el.products.length}
                  </span>
                </td>
                <td className='text-[12px] sm:text-[15px] text-center'>{formatMoney(Math.round(el.total))}</td>
                <td className={`text-[12px] ${(el.status === 'Cancelled' || el.status === 'False') && 'text-red-500'} ${(el.status === 'Order' || el.status === 'Available' || el.status === 'Transport') && 'text-yellow-400'} ${(el.status === 'Succeed') && 'text-blue-500'  } sm:text-[15px]`} >{el.status}</td>
                <td className='text-[12px] sm:text-[15px]'>{moment(el.updatedAt).format('DD/MM/YYYY')}</td>
                {el.status !== 'Succeed' && el.status !== 'Cancelled' && el.status !== 'False' && el.status !== 'Transport' && 
                  <td className='text-[12px] sm:text-[15px]' onClick={() => { updateOrder({ oid: el._id, order: el.status }) }}><span className='bg-red-500 cursor-pointer px-2 py-1 text-center rounded-md text-white'>Update</span> </td>}
                {el.status === 'Transport' &&
                  <td className='text-[12px] sm:text-[15px]' ><span className='bg-red-500 cursor-pointer px-2 py-1 rounded-md text-white' onClick={() => { updateOrder({ oid: deilProduct.orderId, order: el.status, status: 'False' }) }}>False</span> <span onClick={() => { updateOrder({ oid: el._id, order: el.status, status: 'Succeed' }) }} className='bg-blue-500 px-2 py-1 rounded-md cursor-pointer text-white ml-2'>Succeed</span></td>}
              </tr>
            ))}
          </tbody>
        </table> : <div className=' mt-10 sm:mt-0 w-full mx-auto text-center flex justify-center items-center'>
          <p>Chưa ai mua sản phẩm này!!!</p>
        </div>}</div>
      {deilProduct.deilProduct.length > 0 && 
      <div onClick={() => {
        setDeilProduct({
          deilProduct: [],
          order:null,
          orderId: null,
        }) }} className='flex justify-center items-center  h-full absolute top-0 bottom-0 left-0 right-0 bg-overlay' >
        <table onClick={e => e.stopPropagation()} className='bg-slate-200 py-10 px-5 rounded-sm'>
          <tr>
            <th className='p-2'>Product</th>
            <th className='p-2'>Color</th>
            <th className='p-2'>Quantity</th>
            <th className='p-2'>Price</th>
            <th className='p-2'>Supported</th>
          </tr>
            {deilProduct.deilProduct?.map(item => (
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
                <td onClick={() => updateOrder({ oid: deilProduct.orderId })} className='text-center cursor-pointer text-blue-500 hover:underline px-2 py-3'>
                Đã chuẩn bị hàng
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
export default WithRase(ManageOrider)
