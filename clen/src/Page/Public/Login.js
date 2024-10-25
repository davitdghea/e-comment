import React, { useCallback, useEffect, useState } from 'react'
import { Button, InputField, Loading } from '../../Comporen/Index'
import { apiLogin, apiRegister, apiForgotPassword, apiFinalRegister } from '../../Apis/User'
import Swal from 'sweetalert2'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import path from '../../Ultils/Path'
import { login } from "../../St/User/Userslice"
import { useDispatch } from "react-redux"
import { toast } from 'react-toastify'
import { ShowModal } from 'St/App/Appslice'
import { validate } from 'Ultils/Hellpers'
import { FaEye } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const [isVerifiedEmail, setIsVeriFieEmail] = useState(false)
  const [isRegister, SetIsRegister] = useState(false)
  const [error, setError] = useState(false)
  const [invalidFields, setInvalidFields] = useState([])
  const [email, SetEmail] = useState('')
  const [token, setToken] = useState('')
  const [pass, setPass] = useState('password')
  const [isForgotPass, SetIsForgotPass] = useState(false)
  const [payload, setPayload] = useState({ 
    email: "",
    password: "",
    firstname: "",
    lastname: ""
  })
  const [minute, setMinute] = useState(2);
  const [second, setSecond] = useState(59);

  useEffect(() => {
    if (isVerifiedEmail)
   { const timerId = setTimeout(() => {
      if (second > 0) {
        setSecond(second => second - 1);
      } else if (second === 0) {
        if (minute > 0) {
          setMinute(minute => minute - 1);
          setSecond(59); // Reset lại giây về 59 khi giảm phút
        }
      }
    }, 1000);

    // Xóa bộ đếm khi không cần thiết (cleanup)
    return () => clearTimeout(timerId)};
  }, [second, minute, isVerifiedEmail]);

  // Nếu minute và second đều là 0, hiển thị "Hết giờ!"
  useEffect(() => {
    if (minute === 0 && second === 0) {
      setIsVeriFieEmail(false)
    }
  }, [minute, second]);


 
  const resetPayload = () => {
    setPayload({
      email: "",
      password: "",
      firstname: "",
      lastname: ""
    })
  }

  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email })
    if (response.success) {
      toast.success(response.mes, { theme: 'colored' })
    } else {
      toast.info(response.mes, { theme: 'colored' })
    }
  }
const handle = useCallback( (value) =>{
  setError(value)
}, [error])
  useEffect(() => {
    resetPayload()
  }, [isRegister])
  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, ...data } = payload
    const invalids = isRegister ? validate(payload, setInvalidFields) : validate(data, setInvalidFields)
    if (invalids === 0) {
      if (isRegister) {
        try {
        dispatch(ShowModal({ isShowModal: true, modalChildren: <Loading /> }))
        const response = await apiRegister(payload)
        dispatch(ShowModal({ isShowModal: false, modalChildren: null }))
        if (response?.success) {
          setIsVeriFieEmail(true)
        } else Swal.fire('Oops!', response?.mes, 'error')
        } catch (error) {
          
          setError(true)
        }
      } else {
        try {
          const res = await apiLogin(data);

          if (res.success) {
            dispatch(login({ isLoggedIn: true, token: res.accessToken, userData: res.userData }))
            localStorage.setItem('token', res.accessToken);
            searchParams.get('redirect') ? navigate(searchParams.get('redirect')) : navigate(`/${path.HOME}`)
          } else {
            Swal.fire('Oops!', res?.mes || 'Có lỗi xảy ra', 'error');
          }
        } catch (error) {
          Swal.fire('Oops!', 'tk hoặc mật khẩu không chính xác', 'error');
        }

      }
     
    }
  }, [payload, isRegister])
  
  const finalRegister = async () => {
    if (!token) {
      Swal.fire('Lỗi', 'Vui lòng nhập mã code', 'error')
      return
    }    
    const response = await apiFinalRegister(token)  
    if (response.success) {
      Swal.fire('Congratulation', response.mes, 'success').then(() => {
        SetIsRegister(false)
        resetPayload()
        setIsVeriFieEmail(false)
      })
    } else {
      Swal.fire('Oops!', response.mes, 'error')
      setToken('')
    }
  }
  return (
    <div className='w-screen h-screen bg-gradient-to-r from-blue-200 via-pink-200 to-orange-200 relative flex items-center justify-center bg-transparent'>
      {isVerifiedEmail &&
        <div className='absolute top-0 left-0 right-0 bottom-0 bg-gray-300/50 flex items-center justify-center z-50'>
          <div className='text-[20px] font-normal w-[500px] bg-white flex flex-col justify-center rounded-md p-8'>
            <h4>We sent a code to your mail. Please check your gmail and enter your code within 3 minutes {minute} : {second}</h4>
            <span className='mt-3  mx-auto'>
              <input type="text"
                value={token}
                onChange={e => setToken(e.target.value)}
                className='p-2 w-[300px] border rounded-lg outline-none'
              />
              <button onClick={finalRegister} type="button" className='ml-2 px-4 py-2 bg-blue-500 font-semibold text-white rounded-lg'>
                Submit
              </button>
             
            </span>
          </div>
        </div>
      }
      {isForgotPass && <div className={`absolute animate-slide-right top-0  left-0 bottom-0 right-0 bg-white flex flex-col py-8 z-50 items-center`}>
        <div className={`flex flex-col gap-4 `}>
          <label htmlFor='email'>Enter your email:</label>
          <input
            type="text"
            id="email"
            className='w-[800px] p-4 border-b outline-none pb-2 placeholder:text-sm'
            placeholder='Exp: email@gmail.com'
            value={email}
            onChange={e => SetEmail(e.target.value)}></input>
          
        </div>
        
        <div className=' flex items-center justify-end w-[800px] m-[10px] gap-4'>
          <div>
            <Button
              Style=" bg-blue-500 text-white rounded-md py-2 px-4 "
              handleOnclick={handleForgotPassword}
            >submit</Button>
          </div>
          <div>
            <Button
              handleOnclick={() => SetIsForgotPass(false)}
            >
              Back
            </Button>
          </div>
        </div>
      </div>}
         
      <div className=' sm:p-10   absolute  shadow-lg bg-white  items-center rounded-lg justify-center flex z-10 max-w-md w-full'>
        <div className='  rounded-md min-w-[300px] w-full max-w-[400px] h-full'>
          <h1 className='text-center text-2xl font-bold mb-6'>WELCOME</h1>
          {isRegister &&
            <div className='flex gap-3'>
              <InputField
                style='p-3 mb-4 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300'
                value={payload.firstname}
                setValue={setPayload}
                nameKey="firstname"
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}

              />
              <InputField
                style=' p-3 mb-4 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300'
                value={payload.lastname}
                setValue={setPayload}
                nameKey="lastname"
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
            </div>
          }
          <InputField
            style='w-full p-3 mb-4 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300'
            setError={handle}
            error={error}
            value={payload.email}
            setValue={setPayload}
            nameKey="email"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <div className='relative'>
            <InputField
              style='w-full p-3 mb-4 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300'
              value={payload.password}
              setValue={setPayload}
              nameKey="password"
              type={pass}
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
            {pass === 'password' ? <span className='absolute top-5 right-2' onClick={() => setPass('text')}><FaEye /></span> : <span className='absolute top-5 right-2' onClick={() => setPass('password')}><IoIosEyeOff /></span>}
          </div>
         
          <Button Style='w-full bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600'
            handleOnclick={handleSubmit}
            fw
          >
            {isRegister ? "Register" : "Login"}
          </Button>
          {!isRegister && <div className='flex items-center justify-between my-2 w-full text-sm'>
            <span className='text-blue-500 hover:underline cursor-pointer text-decoration-none' onClick={() => { SetIsForgotPass(true) }}>Forgot your password?</span>
            <span className='text-blue-500 hover:underline cursor-pointer text-decoration-none' onClick={() => { SetIsRegister(true) }}>Create Account</span>
          </div>}
          {isRegister && <div className='flex items-center justify-between my-2 w-full text-sm'>
            <span className='text-blue-500 hover:underline cursor-pointer text-decoration-none m-auto text-center' onClick={() => { SetIsRegister(false) }}>Go Login</span>
          </div>}
          <Link className='text-blue-500 hover:underline cursor-pointer text-decoration-none' to={`/${path.HOME}`}>Go Home?</Link>

        </div>

      </div>
    </div>
  )
}

export default Login


  
