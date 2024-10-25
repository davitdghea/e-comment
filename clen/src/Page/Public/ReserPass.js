import React,{useState} from 'react'
import { Button } from '../../Comporen/Index'
import { useNavigate, useParams } from 'react-router-dom'
import { apiResetPassWord } from '../../Apis/User'
import { toast } from 'react-toastify'
import path from '../../Ultils/Path'
import { validate } from 'Ultils/Hellpers'
import Swal from 'sweetalert2'
const ReserPass = () => {
  const [password,setPassword] = useState('')
  const navigate = useNavigate()
  const { token } = useParams()
  const [invalidFields, setInvalidFields] = useState([])
  const handleForgotPassword = async()=>{
    const invalids = validate({password}, setInvalidFields) 
    if (invalids === 0){
      try{
        const response = await apiResetPassWord({ password, token })
        if (response.success === true) {
          toast.success(response.mess)
        } else toast.info(response.mes)
        navigate(`/${path.LOGIN}`)
      }
      catch{
        Swal.fire('!', 'đã qua thời gian vui lòng gửi lại yêu cầu.', 'false').then(() => {
          navigate(`/${path.LOGIN}`);
        });
      }
    }
  }
  
  return (
    <div className={`absolute animate-slide-right top-0  left-0 bottom-0 right-0 bg-white flex flex-col py-8 z-50 items-center`}>
      <div className={`flex flex-col gap-4 `}>
        <label htmlFor='email'>Enter your new password:</label>
        <input
          type="text"
          id="email"
          className='w-[800px] p-4 border-b outline-none pb-2 placeholder:text-sm'
          placeholder='type here'
          value={password}
          onFocus={() =>  setInvalidFields([])}
          onChange={e => setPassword(e.target.value)}/>

        {invalidFields?.some(el => el.name === 'password')
          && <small className='text-red-500 italic '>{invalidFields.find(el => el.name === 'password')?.mes}
          </small>}
      </div>
      <div className=' flex items-center justify-end w-[800px] m-[10px] gap-4'>
        <div>
          <Button
            Style={"bg-blue-500 text-white rounded-md py-2 px-4"}
            
            handleOnclick={handleForgotPassword}
          >
           Submit
            </Button>
        </div>
      </div>
    </div>
  )
}

export default ReserPass