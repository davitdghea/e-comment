
import { Button } from '@mui/material'
import { apiUpdateCurrent } from 'Apis/User'
import { InputFrom } from 'Comporen/Index'
import WithRase from 'hocs/withRase'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getCurrent } from 'St/User/AsyncAction'

const Dashboard = ({ navigate }) => {
  const { register, formState: { errors, isDirty }, handleSubmit, reset } = useForm()
  const { current } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  useEffect(() => {
    reset({
      firstname: current?.firstname,
      lastname: current?.lastname,
      mobile: current?.mobile,
      avatar: current?.avatar,
      address: current?.address,
    })
  }, [])
  const handleUpdateInform = async (data) => {
    const formData = new FormData()
    if (data.avatar.length > 0) formData.append('avatar', data.avatar[0])
    delete data.avatar
    for (let i of Object.entries(data)) formData.append(i[0], i[1])
    const response = await apiUpdateCurrent(formData)
    if (response.success) {
      dispatch(getCurrent())
      toast.success(response.mes)
      if (searchParams.get('redirect')) navigate(`/${searchParams.get('redirect')}`)
    } else toast.error(response.mes)
  }

  return (
    <div className='w-full relative'>
      <div className='w-full bg-gray-100'>
        <header className='flex items-center w-full bg-gray-100 text-3xl font-semibold h-[70px] border-b-2 pl-2 '>
          <p className='ml-[50px] sm:ml-0'>Pesonal</p>  
        </header>
      </div>

      <form className='mt-5 ml-20' onSubmit={handleSubmit(handleUpdateInform)}>
        <p className='flex '><span className='w-[120px]'>Email address:</span> <span>{current?.email}</span></p>
        <InputFrom
          layoutUser
          className='flex  w-full mt-[10px]'
          label='Firstname'
          register={register}
          errors={errors}
          id='firstname'
          validate={{
            required: "Need fill this field"
          }}
        />
        <InputFrom
          layoutUser
          className='flex  w-full mt-[10px]'
          label='Lastname'
          register={register}
          errors={errors}
          id='lastname'
          validate={{
            required: "Need fill this field"
          }}
        />

        <InputFrom
          layoutUser
          className='flex  w-full mt-[10px]'
          label='Mobile'
          register={register}
          errors={errors}
          id='mobile'
          validate={{
            required: "Need fill this field",
            pattern: {
              value: /^[0-9]{10}$/,
              message: 'phone invalid'
            }
          }}
        />
        <InputFrom
          className='flex  w-full mt-[10px]'
          label='Address'
          layoutUser
          register={register}
          errors={errors}
          id='address'
          validate={{
            required: "Need fill this field",
            pattern: {
              value: 'text',
              message: 'address invalid'
            }
          }}
        />
        <div className='mt-[10px]'>
          <span className='font-medium w-[120px] !important'>Account status:</span>
          <span className='ml-[10px]'>{current?.isBlocked ? 'Blocked' : 'Active'}</span>
        </div>
        <div className='mt-[10px]'>
          <span className='font-medium w-[120px] !important'>Role:</span>
          <span className='ml-[90px]'>{current?.role === 1945 ? 'Admin' : 'User'}</span>
        </div>
        <div className='mt-[10px]'>
          <span className='font-medium w-[120px] !important'>Created At:</span>
          <span className='ml-[40px]'>{moment(current?.createAt).fromNow()}</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='font-medium'>
            Profile image:
          </span>
          <label htmlFor='file'>
            <img src={current?.avatar || "https://static.vecteezy.com/system/resources/previews/005/005/788/original/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg"} alt='' className='w-10 h-10 object-cover rounded-full cursor-pointer' />
          </label>
          <input type='file' id='file' {...register('avatar')} hidden />
        </div>
        <div className='w-full flex'>
          <Button type="submit">Update Information</Button>
        </div>
      </form>

    </div>
  )
}

export default WithRase(Dashboard)