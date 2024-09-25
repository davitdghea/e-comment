import { apiGetProducts } from 'Apis/Products'
import WithRase from 'hocs/withRase'
import React, { Fragment, useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getCurrent } from 'St/User/AsyncAction'
import { clearMessage, logout } from 'St/User/Userslice'
import Swal from 'sweetalert2'
import icons from 'Ultils/Icons'
import { keywordMap } from 'Ultils/Hellpers'
import path from 'Ultils/Path'
import { IoHome } from "react-icons/io5";

const { LuMenuSquare, IoIosSearch, BsPersonCircle, RiPhoneFill, BsHandbagFill, FaRegHeart } = icons
const Footer = ({ dispatch, navigate, handleClickMenu }) => {
    const [InformationUser, setInformationUser] = useState(false)
    const [dataSearch, setDataSeach] = useState('')
    const { isLoggedIn, current, mes } = useSelector(state => state.user)
    const [data, setData] = useState()
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (isLoggedIn) dispatch(getCurrent());
        }, 300);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [dispatch, isLoggedIn]);
    useEffect(() => {
        if (mes) Swal.fire('Oops!', mes, 'info').then(() => {
            dispatch(clearMessage())
            navigate(`/${path.LOGIN}`)
        })
    }, [mes])

    const Seach = async (dataSearch) => {
        const normalizedSearch = keywordMap[dataSearch.toLowerCase()] || dataSearch.toLowerCase();
        const params = ["smartphone", "tablet", "laptop", "speaker", "television", "printer", "camera", "accessories"].includes(normalizedSearch)
            ? { category: normalizedSearch }
            : { title: normalizedSearch };
        const response = await apiGetProducts(params)
        const queryParams = new URLSearchParams();
        if (params.category) {
            queryParams.append('category', params.category);
        }
        if (params.title) {
            queryParams.append('title', params.title);
        }
        if (response.success) {
            setData(response.producData)
            navigate({
                pathname: `/${data[0].category}`,
                search: queryParams.toString()
            })
        }
    }
    const clearLocalStorage = () => {
        localStorage.clear()
    }
  return (
      <div className='relative'>
          <div className='hidden sm:block w-full bg-main'>
              <div className='flex items-center justufy-center h-[103px] m-auto w-main'>
                  <div className="flex flex-1  flex-col text-gray-200">
                      <span className='text-[20px]'>SIGN UP TO NEWSLETTER</span>
                      <small className='text-[13px]'>Subscribe now and receive weelky newsletter</small>
                  </div>
                  {/* <div className='flex-1 flex '>
            <input 
                className='p-4 rounded-l-full  flex w-full bg-[#F04646] outline-none text-gray-100'
                placeholder='Email address'/> 
            <div className='h-[56px] w-[56px] text-gray-200 flex items-center justify-center rounded-r-full bg-[#F04646]'><MdEmail size={16} /></div>
            </div> */}
              </div>
              <div className='flex items-center justufy-center h-[407px] bg-gray-800 w-full'>
                  <div className="w-main m-auto flex items-center">
                      <div className='flex-2 h-[250px]'>
                          <h1 className='md-[20px] mb-[10px] text-[15px] text-gray-300 border-l-2 border-[red] p-[15px] size-15px'>ABOUT US</h1>
                          <div className='flex flex-col text-gray-200'>
                              <span>
                                  <span>Address:</span>
                                  <span className='opacity-70'> 2 Nguyễn Thi Định, Lạc Long Quân, Hà Nội </span>
                              </span>
                              <span>
                                  <span> Phone:</span>
                                  <span className='opacity-70'> (+1234)56789xxx</span>
                              </span>
                              <span>
                                  <span> Mail:</span>
                                  <span className='opacity-70'> tadathemes@gmail.com</span>
                              </span>
                          </div>
                      </div>
                      <div className='h-[250px] flex-1 flex flex-col text-gray-300'>
                          <h1 className='md-[20px] mb-[10px] text-[15px] text-gray-300 border-l-2 border-[red] p-[15px] size-15px'>INFORMATION</h1>
                          <span className='opacity-70'>Typography</span>
                          <span className='opacity-70'>Gallery</span>
                          <span className='opacity-70'>Store Location</span>
                          <span className='opacity-70'>Today's Deals</span>
                          <span className='opacity-70'>Contact</span>
                      </div>
                      <div className='h-[250px] flex-1 flex flex-col text-gray-300'>
                          <h1 className='md-[20px] text-[15px] text-gray-300 border-l-2 border-[red] p-[15px] size-15px'>WHO WE ARE</h1>
                          <span className='opacity-70'>Help</span>
                          <span className='opacity-70'>Free Shipping</span>
                          <span className='opacity-70'>FAQs</span>
                          <span className='opacity-70'>Return & Exchange</span>
                          <span className='opacity-70'>Testimonials</span>
                      </div>
                      <div className='flex-1 h-[250px]'>
                          <h1 className='md-[20px] text-[15px] text-gray-300 border-l-2 border-[red] p-[15px] size-15px'>#DIGITALWORLDSTOR</h1>
                      </div>

                  </div>
              </div>
       </div>
          <div className='block border-t-2 border-gray-400 sm:hidden h-[100px] w-full bottom-0 left-0 right-0 bg-white fixed shadow-md z-40'>
              <div className='sm:w-main flex items-center justify-between text-xs m-auto'>
                  <div className='m-auto w-full sm:w-main flex justify-around h-[110px] py-[35px]'>
                      <div>
                          <span><IoHome size={24} color='red'/></span>
                          <span>Home</span>
                      </div>
                    
                          <div onClick={() => handleClickMenu(true)} className='flex flex-col items-center justify-center p-2 cursor-pointer'>
                              <span><LuMenuSquare size={24} className='mr-3' /></span>
                          <span className='flex flex-col'>Danh mục </span>
                          </div>
                          <div onClick={() => navigate(`/${path.MEMBER}/${path.WISHLIST}`)} className='cursor-pointer sm:flex items-center  justify-center'>
                              <span ><FaRegHeart size={24}/></span>
                              <span>Heart</span>
                          </div>
                          <div className=''>
                              {isLoggedIn && current ? (<div onClick={() => setInformationUser(!InformationUser)} className='rounded-sm  sm:flex flex-col justify-center items-center relative'>
                                  {current && <Fragment>
                                      <div className='flex items-center cursor-pointer justify-center  flex-col'>
                                          <BsPersonCircle size={25} />
                                          <span>{`${current?.lastname} ${current?.firstname}`}</span>
                                      </div>
                                      {InformationUser && (<div className='bg-white absolute bottom-[-50px] right-[-50px] shadow-xl border'>
                                          <ul className=''>
                                              <Link to={+current?.role === 1945 ? `/${path.ADMIN}/${path.DASHBOARD}` : `/${path.MEMBER}/${path.PERSONAL}`}  >
                                                  <li className='pt-2 pb-1 px-2 hover:text-white hover:bg-slate-500'>{+current?.role === 1945 ? 'Admin' : 'User'}</li>
                                              </Link>
                                              <li className='px-2 pt-1 cursor-pointer pb-2 text-red-500 hover:text-white hover:bg-slate-500' onClick={() => { dispatch(logout()); clearLocalStorage(); }}>Logout</li>
                                          </ul>

                                      </div>)}
                                  </Fragment>}

                              </div>) :
                                  <Link to={`${path.LOGIN}`}>
                                      <div className=' flex items-center rounded-lg justify-center flex-col'>
                                          <BsPersonCircle size={25} />
                                          <span>Đăng nhập</span>
                                      </div>
                                  </Link>}
                          </div>
                  </div>

              </div>
              <div>

              </div>
          </div>
        
    </div>
  )
}

export default WithRase(Footer)