import React, { useEffect }  from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import path from '../../Ultils/Path'
import Swal from 'sweetalert2'
const Finalregister = () => {
  const {status} = useParams()
  const navigate = useNavigate()
  useEffect(()=>{
    if (status === "failed") Swal.fire("Oop!","ko thành cônng","error").then(()=>{
      navigate(`/${path.LOGIN}`)
    })
    if (status === "success") Swal.fire("Coogratudation!", " thành cônng", "success").then(() => {
      navigate(`/${path.LOGIN}`)
    })
  },[])
  return (
    <div>

    </div>
    
  )
}

export default Finalregister