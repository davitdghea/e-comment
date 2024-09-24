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
    <div className={className}>
      {label && <label className='mb-1 w-[120px]' htmlFor={id}>{label}:</label>}
      <input
        type={type}
        id={id}
        {...register(id, validate)}
        disabled={disabled}
        placeholder={placeholder}
        className={clsx("form-input my-auto", FullWidth && 'w-full', 'p-1 outline-none border-2', layoutUser && 'w-[80%]')}
        defaultValue={defaultValue}
        readOnly={readOnly}
      />
      {errors[id] && <small className='text-xs text-red-500'>{errors[id]?.message}</small>}
    </div>
  )
}

export default memo(InputFrom)