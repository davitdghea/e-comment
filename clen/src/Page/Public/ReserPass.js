import React,{useState} from 'react'
import { Button } from '../../Comporen/Index'
import { useNavigate, useParams } from 'react-router-dom'
import { apiResetPassWord } from '../../Apis/User'
import { toast } from 'react-toastify'
import path from '../../Ultils/Path'
const ReserPass = () => {
  const [password,setPassword] = useState('')
  const navigate = useNavigate()
  const { token } = useParams()
  const handleForgotPassword = async()=>{
     const response = await apiResetPassWord({password,token})
    if (response.success === true){
      toast.success(response.mess)
      
    }else toast.info(response.mes)
    navigate(`/${path.LOGIN}`)
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
          onChange={e => setPassword(e.target.value)}></input>
      </div>
      <div className=' flex items-center justify-end w-[800px] m-[10px] gap-4'>
        <div>
          <Button
            Style={"bg-blue-500 text-white rounded-md py-2 px-4"}
            name="submit"
            handleOnclick={handleForgotPassword}
          />
        </div>
      </div>
    </div>
  )
}

export default ReserPass