import { Button } from '@mui/material'
import { apiUpdate, apiUpdateCurrent } from 'Apis/User'
import { InputFrom } from 'Comporen/Index'
import WithRase from 'hocs/withRase'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getCurrent } from 'St/User/AsyncAction'

const Pesonal = ({navigate}) => {
  const {register, formState:{errors,isDirty},handleSubmit,reset} = useForm()
  const {current} =  useSelector(state => state.user)
 const dispatch = useDispatch()
 const [searchParams] = useSearchParams() 
 useEffect(()=>{
  reset({
    firstname: current?.firstname,
    lastname: current?.lastname,
    mobile: current?.mobile,
    email: current?.email,
    avatar: current?.avatar,
    address: current?.address,
  })
  },[])
  const handleUpdateInform = async(data) =>{
   const formData = new FormData()
    if (data.avatar.length > 0) formData.append('avatar', data.avatar[0])
      delete data.avatar
   for(let i of Object.entries(data)) formData.append(i[0],i[1]) 
    const response = await apiUpdateCurrent(formData)
    if (response.success) {
      dispatch(getCurrent())
      toast.success(response.mes)
      if (searchParams.get('redirect')) navigate(`/${searchParams.get('redirect')}`)
  }else toast.error(response.mes)}
  
  return (
    <div className='w-full relative'>
      <header className='text-3xl font-semibold py-4 border-b-2'>
         Pesonal
      </header>
      <form onSubmit={handleSubmit(handleUpdateInform)}>
        <InputFrom
          label='Firstname'
          register={register}
          errors={errors}
          id='firstname'
          validate={{
            required: "Need fill this field"
          }}
        />
        <InputFrom
          label='Lastname'
          register={register}
          errors={errors}
          id='lastname'
          validate={{
            required:"Need fill this field"
          }}
        />
        <InputFrom
          label='Email address'
          register={register}
          errors={errors}
          id='email'
          validate={{
            required: "Need fill this field",
           pattern:{
             value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
             message:'email invalid'
           }
          }}
        />
        <InputFrom
          label='Phone'
          register={register}
          errors={errors}
          id='Phone'
          validate={{
            required: "Need fill this field",
            pattern:{
              value: /^[0-9]{10}$/,
              message:'phone invalid'
            }
          }}
        />
        <InputFrom
          label='address'
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
        <div>
          <span className='font-me'>Account status:</span>
          <span>{current?.isBlocked ? 'Blocked' : 'Active'}</span>
        </div>
        <div>
          <span className='font-me'>Role:</span>
          <span>{current?.role === 1945 ? 'Admin' : 'User'}</span>
        </div>
        <div>
          <span className='font-me'>Created At:</span>
          <span>{moment(current?.createAt).fromNow()}</span>
        </div>
        <div className='flex items-center gap-2'>
        <span className='font-medium'>
         Profile image:
        </span>
       <label htmlFor='file'>
            <img src={current?.avatar || ""} alt='' className='w-10 h-10 object-cover rounded-full' />
       </label>
          <input type='file' id='file' {...register('avatar')} hidden/>
        </div>
        <div className='w-full flex justify-end'>
          <Button type="submit">Update Infomation</Button>
        </div>
      </form>
      
    </div>
  )
}

export default WithRase(Pesonal)