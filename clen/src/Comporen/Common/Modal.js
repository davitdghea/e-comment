import React from 'react'
import { useDispatch } from 'react-redux' 
import { ShowModal } from 'St/App/Appslice'


const Modal = ({ children }) => {
    const dispatch = useDispatch()
  return (
      <div 
          onClick={() => dispatch(ShowModal({ isShowModal: false, moDalChildren:null}))} 
          className='absolute inset-0 bg-overlay h-[340vh] z-50 flex items-center justify-center'
      >
          {children}
      </div>
  )
}

export default Modal