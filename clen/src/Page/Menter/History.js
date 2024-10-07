import { apiGetUserOrder } from 'Apis/Products'
import { CustomSelect, InputFrom, Pagination } from 'Comporen/Index'
import WithRase from 'hocs/withRase'
import useDebounce from 'Hooks/UseDebounce'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import { statusOrders } from 'Ultils/Contants'
import { formatMoney } from 'Ultils/Hellpers'

const History = ({ navigate, location }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState(null)
  const [counts, setCounts] = useState(0)
  const [totalPages, setTotalPages] = useState(0);
  const [params] = useSearchParams()
  const { register, formState: { errors }, watch } = useForm()
 
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
  }, [params, currentPage, queriesDebounce])
  const handleSearchStatus = (selectedOption) => {
    const value = selectedOption?.value || '';
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ status: value }).toString()
    })
  }
  console.log(orders)
  return (
    <div>
      <header className='text-3xl font-semibold py-4 bg-gray-100 border-b border-b-blue-200'>
        <p className='ml-[55px] sm:ml-0'>History</p> 
      </header>
      {counts === 0  && <div className='w-full mx-auto text-center flex justify-center items-center'>
        <p>Bạn chưa mua sản phẩm nào!!!</p>
      </div>}
      {counts !== 0 && <div>
      <div className='flex justify-end items-center px-4 mt-3'>
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
          <div className='col-span-1'>

            <CustomSelect
              wrapClassName='w-full'
                options={statusOrders}
              value={status}
              onChange={handleSearchStatus}
            />
          </div>
        </form>
      </div>
      <table className='w-[97%] m-auto text-left'>
        <thead>
          <tr className='border-b pb-5'>
            <th>STT</th>
            <th className='text-center'>Product</th>
            <th>Total</th>
            <th>Status</th>
            <th>created AI</th>           
          </tr>
        </thead>
        <tbody>
          {orders?.map((el, idx) => (
            <tr key={el._id} className='border-b py-2'>
              <td className='text-center'>
                {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                  process.env.REACT_APP_LIMIT +
                  idx + 1}</td>
              <td className='text-center py-2 max-w-[500px]'>
                <span className='grid grid-cols-4 gap-4'>
                  {el.products?.map(item => (
                    <span key={item?._id} className='flex col-span-1 items-center gap-2'>
                      <img src={item.thumb} alt='thumb' className='w-8 h-8 rounded-md object-cover' title={item.title}/>
                      <span className='flex flex-col'>
                        <span className='flex items-center text-xs'>{item.color}</span>
                        <span className='flex items-center text-xs'>
                          <span>Quantity:</span>
                          <span>{item.quantity}</span>
                        </span>
                      </span>
                    </span>))}
                </span>
              </td>
              <td>{formatMoney(Math.round(el.total))} VNĐ</td>
              <td>{el.status}</td>
              <td>{moment(el.updatedAt).format('DD/MM/YYYY')}</td>
            </tr>
          ))}
        </tbody>
      </table></div>}
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