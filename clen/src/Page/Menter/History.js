import { apiGetUserOrder } from 'Apis/Products'
import { CustomSelect, InputFrom } from 'Comporen/Index'
import WithRase from 'hocs/withRase'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import { statusOrders } from 'Ultils/Contants'

const History = ({ navigate, location }) => {
  const [orders, setOrders] = useState(null)
  const [counts, setCounts] = useState(0)
  const [params] = useSearchParams()
  const { register, formState: { errors }, watch } = useForm()
  const q = watch('q')
  const status = watch('status')
  const fetchOrders = async (params) => {
    const response = await apiGetUserOrder({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    })
    if (response.success) {
      setOrders(response.orders)
      setCounts(response.counts)
    }
  }
  useEffect(() => {
    const pr = Object.fromEntries([...params])
    fetchOrders(pr)
  }, [params])
  const handleSearchStatus = (value) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ status: value }).toString()
    })
  }
  console.log(counts)
  return (
    <div>
      <header className='text-3xl font-semibold py-4 border-b border-b-blue-200'>
        History
      </header>
      {counts === 0  && <div className='w-main mx-auto text-center'>
        <p>Bạn chưa mua sản phẩm nào!!!</p>
      </div>}
      {counts !== 0 && <div>
      <div className='flex justify-end items-center px-4'>
        <form className='w-[45%] flex items-center gap-4'>
          <div className='col-span-1'>
            <InputFrom
              id='q'
              register={register}
              errors={errors}
              FullWidth
              className
              placeholder={'Search orders by title, description...'}
            ></InputFrom>
          </div>
          <div className='col-span-1'>

            <CustomSelect
              wrapClassName='w-full'
              option={statusOrders}
              value={status}
              onChange={(val) => handleSearchStatus(val)}
            />
          </div>
        </form>
      </div>
      <table className='w-[97%] m-auto text-left'>
        <thead>
          <tr className='border-b pb-5'>
            <th className='text-center'>product</th>
            <th>Total</th>
            <th>Status</th>
            <th>created AI</th>
            <th>Actions</th>
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
                      <img src={el.products?.thumb} alt='thumb' className='w-8 h-8 rounded-md object-cover' />
                      <span className='flex flex-col'>
                        <span>{el.products?.title}</span>
                        <span className='flex items-center text-xs'>
                          <span>Quantity:</span>
                          <span>{el.product?.quantity}</span>
                        </span>
                      </span>
                    </span>))}
                </span>
              </td>
              <td>{el.total + '$'}</td>
              <td>{el.status}</td>
              <td>{el.createdAt}</td>
              <td>{moment(el.updatedAt).format('DD/MM/YYYY')}</td>

            </tr>
          ))}
        </tbody>
      </table></div>}
    </div>
  )
}

export default WithRase(History)