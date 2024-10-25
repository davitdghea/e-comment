import React from 'react'
import clsx from 'clsx'

const InputField = ({ setError,error= false,value, setValue, nameKey, placeholder, type, invalidFields, setInvalidFields, style, fullWidth,isShowed }) => {
  return (
    <div onClick={setError ? () => setError(false) : undefined} className={clsx('flex flex-col relative mb-2', fullWidth && 'w-full')}>
      {/* {!isShowed && value?.trim() !== "" && <label htmlFor={nameKey}>{nameKey.slice(0, 1).toUpperCase() + nameKey.slice(1)}</label>} */}
      <input
        type={type || 'text'}
        className={clsx('px-4 py-2 rounded-sm  w-full my-2 outline-none',style)}
        placeholder={placeholder || nameKey.slice(0, 1).toUpperCase() + nameKey.slice(1)}
        value={value}
        onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
        onFocus={() => setInvalidFields && setInvalidFields([])}
      />
      
      {invalidFields?.some(el => el.name === nameKey)
        && <small className='text-red-500 italic '>{invalidFields.find(el => el.name === nameKey)?.mes}
        </small>}
      {error && <small className='text-red-500'>User has existed</small>}
    </div>
  )
}

export default InputField