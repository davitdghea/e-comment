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

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const [isVerifiedEmail, setIsVeriFieEmail] = useState(false)
  const [isRegister, SetIsRegister] = useState(false)
  const [invalidFields, setInvalidFields] = useState([])
  const [email, SetEmail] = useState('')
  const [token, setToken] = useState('')
  const [isForgotPass, SetIsForgotPass] = useState(false)
  const [payload, setPayload] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: ""
  })


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

  useEffect(() => {
    resetPayload()
  }, [isRegister])
  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, ...data } = payload
    const invalids = isRegister ? validate(payload, setInvalidFields) : validate(data, setInvalidFields)
    if (invalids === 0) {
      if (isRegister) {
        dispatch(ShowModal({ isShowModal: true, modalChildren: <Loading /> }))
        const response = await apiRegister(payload)
        dispatch(ShowModal({ isShowModal: false, modalChildren: null }))
        if (response?.success) {
          setIsVeriFieEmail(true)
        } else Swal.fire('Oops!', response?.mes, 'error')
      } else {
        try {
          const res = await apiLogin(data);
          console.log('Kết quả trả về từ API:', res);

          if (res.success) {
            dispatch(login({ isLoggedIn: true, token: res.accessToken, userData: res.userData }))
            localStorage.setItem('token', res.accessToken);
            console.log('token', res.accessToken)
            searchParams.get('redirect') ? navigate(searchParams.get('redirect')) : navigate(`/${path.HOME}`)
          } else {
            Swal.fire('Oops!', res?.mes || 'Có lỗi xảy ra', 'error');
          }
        } catch (error) {
          console.log('Lỗi xảy ra khi gọi API:', error);
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
      })
    } else {
      Swal.fire('Oops!', response.mes, 'error')
      setIsVeriFieEmail(false)
      setToken('')
    }
  }
  return (

    <div className='w-screen h-screen bg-gradient-to-t from-violet-400 to-violet-600 relative flex items-center justify-center bg-transparent'>
      {isVerifiedEmail &&
        <div onClick={() => setIsVeriFieEmail(false) } className='absolute top-0 left-0 right-0 bottom-0 bg-gray-300/50 flex items-center justify-center z-50'>
          <div onClick={e => e.stopPropagation()} className=' text-[20px] font-normal w-[500px] bg-white flex flex-col justify-center rounded-md p-8'>
            <h4>we sent a code to your mail. please check your mail and enter your code:</h4>
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
              style=" bg-blue-500 text-white rounded-md py-2 px-4 "
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

      <div className='absolute shadow-xl bg-white items-center rounded-lg justify-center flex z-10 w-full max-w-[550px]'>
        {/* <div className='   w-1/2 relative'>
          <img
            src="https://th.bing.com/th/id/OIP.RvOpgYypirRSnWaTgGvDlwHaFj?rs=1&pid=ImgDetMain"
            alt=''
            className='rounded-l-lg h-[420px]  w object-cover'
          />
          <div className='absolute  top-0 bottom-0 left-[20px] right-0'>
            <img className='mb-[50px] mt-[20px] ' src="https://digital-world-2.myshopify.com/cdn/shop/files/logo_digital_new_250x.png?v=1613166683" alt="logo" />
            <h1><span className='text-[26px]  font-bold'>WELCOME TO DIGITAL WORLD</span></h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua </p>
            <p className='mt-[180px] mb-[10px]'>Lorem ipsum dolor sit amet</p>
          </div>

        </div> */}
        <div className='p-8  rounded-md min-w-[300px] w-full max-w-[400px] h-full'>
          <h1 className='text-[28px] text-main mp-[8px] text-blue-500'><p className='text-shadow-md'>{isRegister ? "Register" : "Login"}</p></h1>
          {isRegister &&
            <div className='flex gap-3'>
              <InputField
                value={payload.firstname}
                setValue={setPayload}
                nameKey="firstname"
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}

              />
              <InputField
                value={payload.lastname}
                setValue={setPayload}
                nameKey="lastname"
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
            </div>
          }
          <InputField
            value={payload.email}
            setValue={setPayload}
            nameKey="email"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <InputField
            value={payload.password}
            setValue={setPayload}
            nameKey="password"
            type="password"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <Button style='w-full flex items-center p-3 text-white rounded-sm justify-center bg-green-500'
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