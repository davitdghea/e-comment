import React, { useEffect, Fragment, useState, memo } from 'react'
import path from 'Ultils/Path'
import { getCurrent } from 'St/User/AsyncAction'
import { useSelector } from 'react-redux'
import { clearMessage, logout } from 'St/User/Userslice'
import icons from 'Ultils/Icons'
import Swal from 'sweetalert2'
import WithRase from 'hocs/withRase'
import { ShowCart } from 'St/App/Appslice'
import { apiGetProducts } from 'Apis/Products'
import { keywordMap } from 'Ultils/Hellpers'
import { Link } from 'react-router-dom'
const { LuMenuSquare, IoIosSearch, BsPersonCircle, RiPhoneFill, BsHandbagFill, FaRegHeart } = icons
const TopHearder = ({ handleClickMenu, dispatch, navigate }) => {
  const [InformationUser, setInformationUser] = useState(false)
  const [dataSearch, setDataSeach] = useState('')
  const { isLoggedIn, current, mes } = useSelector(state => state.user)

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
    const queryParams = new URLSearchParams();
    if (params.category) {
      queryParams.append('category', params.category);
    }
    if (params.title) {
      queryParams.append('title', params.title);
    }   
      navigate({
        pathname: `/${path.PRODUCTS }`,
        search: queryParams.toString()
      })   
    }
  const clearLocalStorage = () => {
    localStorage.clear()
  }
  return (
    <div className='sm:h-[100px] h-[70px] sm:w-full bg-white fixed shadow-md z-40 top-0 left-0 right-0 '>
      <div className='m-auto sm:w-full flex justify-center sm:justify-between sm:py-[35px] py-[10px] sm:h-[110px] h-[70px]'>
        <Link to='/' className='mt-1 sm:mt-0 sm:max-w-[340px] w-full max-w-[50px]'>
          <img className='w-full sm:block hidden' src="https://digital-world-2.myshopify.com/cdn/shop/files/logo_digital_new_250x.png?v=1613166683" alt="logo" />
          <p className='block  sm:hidden text-red-500 text-center font-extrabold text-[30px]'>W</p>
        </Link>
        <div className="flex text-[13px] ">
          <div onClick={() => handleClickMenu(true)} className='hidden sm:flex items-center justify-center border-x p-2 cursor-pointer'>
            <span><LuMenuSquare size={24} className='mr-3' /></span>
            <span className='flex flex-col'><span>Danh</span><span>mục</span> </span>
          </div>
          <div className='cursor-pointer flex flex-col sm:px-4 px-2 sm:border-r items-center mt-2 sm:mt-0'>
            <span className='flex items-center'>
              <span className='bg-slate-300 sm:p-3 p-2 rounded-l-md' onClick={() => Seach(dataSearch)}><IoIosSearch color='red' size={20} /></span>
              <input onChange={el => setDataSeach(el.target.value)} placeholder='Bạn cần gì?' className='w-full max-w-[150px] sm:max-w-[250px] outline-none  sm:p-3 p-2 rounded-r-md  flex  bg-slate-300 ' value={dataSearch} />
            </span>
          </div>
          <div className='  flex-col px-4 sm:border-r items-center hidden lg:block'>
            <span className='flex items-center'>
              <RiPhoneFill color="red" />
              <span className='font-semibold ml-3 text-base'> (+1800) 000 8808</span>
            </span>
            <span>Online Support 24/7</span>
          </div>
          <div onClick={() => navigate(`/${path.MEMBER}/${path.WISHLIST}`)} className='cursor-pointer hidden sm:flex items-center sm:border-r justify-end '>
            <span className='mx-3'><FaRegHeart size={24} color='red' /></span>
          </div>
          <div onClick={() => dispatch(ShowCart())} className='cursor-pointer flex items-center justify-center  sm:p-2  sm:border-r sm:mr-2'>
            <span className='flex relative items-center '>
              <BsHandbagFill color='red' size={25} />
              <span className=' absolute left-2.5  sm:top-none top-2'>{current?.cart?.length || 0}</span>
              {/* <span className='hidden  sm:flex flex-col ml-1'><span>Giỏ</span><span>hàng</span></span> */}
            </span>
          </div>
          <div className='hidden sm:block'>
            {isLoggedIn && current ? (<div onClick={() => setInformationUser(!InformationUser)} className='rounded-sm  sm:flex flex-col justify-center items-center relative'>
              {current && <Fragment>
                <div className='flex items-center cursor-pointer justify-center  flex-col'>
                  <BsPersonCircle size={25} />
                  <span>{`${current?.lastname} ${current?.firstname}`}</span>
                </div>
                {InformationUser && (<div className='bg-white absolute bottom-[-50px] right-[0px] shadow-xl border'>
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
  )
}

export default WithRase(memo(TopHearder))