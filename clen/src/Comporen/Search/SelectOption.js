import React from 'react'

const SelectOption = ({icon}) => {
  return (
    <div className='w-10 h-10 bg-white rounded-full flex items-center  border shadow-md justify-center hover:bg-black hover:text-white cursor-pointer hover:border-black'>{icon}</div>
  )
}

export default SelectOption