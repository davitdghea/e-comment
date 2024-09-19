import React, { memo } from 'react'
import clsx from 'clsx'
const Select = ({label,options=[],register,errors,id,validate,style,fullWidth,defaultValue}) => {
  return (
    <div className='flex flex-col gap-0.5rem'>
      {label && <label className='mb-1' htmlFor={id}>{label}</label>}
      <select defaultValue={defaultValue} className={clsx('form-select',fullWidth && 'w-full',style,'py-1')}
       id={id} {...register(id,validate)}>
        <option value=''>----CHOOSE----</option>
        {options?.map(el=>(
          <option value={el.code}>{el.value.toLowerCase()}</option>
        ))}
      </select>
      {errors[id] && <small className='text-xs text-red-500 '>{errors[id]?.message}</small>}
    </div>
  )
}

export default memo(Select)