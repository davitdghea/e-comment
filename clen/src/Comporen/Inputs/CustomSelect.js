import { clsx } from 'clsx'
import React from 'react'
import Select from 'react-select'

const CustomSelect = ({ wrapClassName, label, placeholder, onChange, options = [], value, className }) => {
  return (
    <div className={clsx(wrapClassName)}>
      {label && <h3 className='font-medium'>{label}</h3>}
      <Select
        placeholder={placeholder}
        options={options}
        value={value}
        isSearchable
        isClearable
        onChange={val => onChange(val)}
        formatOptionLabel={(option) => (
          <div className='flex text-black items-center gap-2'>
            <span>{option.label}</span>
          </div>
        )}
        className={clsx('custom-select', className)}
        classNamePrefix='custom-select'
      />
    </div>
  )
}

export default CustomSelect
