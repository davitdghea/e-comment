import { clsx } from 'clsx'
import React, { memo } from 'react'

const InputFrom = ({ 
  className='flex flex-col h-[78px]',
  label, 
  disabled, 
  FullWidth, 
  register, 
  errors, 
  id, 
  validate, 
  type = 'text', 
  placeholder, 
  defaultValue,
  layoutUser,
readOnly
}) => {
  
  return (
    <div className={label === 'Color' ? 'flex justify-start items-center' : className }>
      {label && <label className={`mb-1 ${label === 'Price (nhập hai số thập thân VD: 14 000 000 là 1400000000)' || label === 'Name product' ? 'w-full' : 'w-[100px]'} font-medium `} htmlFor={id}>{label}:</label>}
      <input
        type={type}
        id={id}
        {...register(id, validate)}
        disabled={disabled}
        placeholder={placeholder}
        className={clsx("form-input my-auto", FullWidth && 'w-full', ' p-1 outline-none border-2 ml-5', layoutUser && 'w-[80%]', label !== 'Name product' && label !== 'Quantity' && label !== 'Price (nhập hai số thập thân VD: 14 000 000 là 1400000000)' ? "ml-5" : "ml-0")}
        defaultValue={defaultValue}
        readOnly={readOnly}
      />
      {errors[id] && <small className='text-xs text-red-500'>{errors[id]?.message}</small>}
    </div>
  )
}

export default memo(InputFrom)