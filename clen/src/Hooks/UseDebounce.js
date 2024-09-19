import React, { useEffect, useState } from 'react'

const useDebounce = (value,ms) => {
    const [descountValue,SetDesCountValue] = useState('')
    useEffect(()=>{
       const setTimeoutId = setTimeout(()=>{
            SetDesCountValue(value)
        },ms)
        return () =>{
            clearTimeout(setTimeoutId)
        }
        
    },[value,ms])
  return descountValue
}

export default useDebounce