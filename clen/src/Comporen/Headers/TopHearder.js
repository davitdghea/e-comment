import React, { useEffect, Fragment, useState, memo } from 'react'
import path from 'Ultils/Path'
import { getCurrent } from 'St/User/AsyncAction'
import { useSelector } from 'react-redux'
import { clearMessage, logout } from 'St/User/Userslice'
import icons from 'Ultils/Icons'
import Swal from 'sweetalert2'
import WithRase from 'hocs/withRase'
import { ShowCart } from 'St/App/Appslice'
import { LuUser } from "react-icons/lu";
import { Link } from 'react-router-dom'
import { keywordMap } from 'Ultils/Hellpers';
const { BsHandbagFill, FaRegHeart } = icons
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

  const clearLocalStorage = () => {
    localStorage.clear()
  }
  const totalPrice = current?.cart?.reduce((total, item) => total + Number(item.price), 0);
  const result = (Math.round(totalPrice / 25530) / 100)
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
      pathname: `/${path.PRODUCTS}`,
      search: queryParams.toString()
    })
  }
  return (
    <div className='sm:h-[100px] h-[70px] sm:w-full bg-white fixed shadow-md z-40 top-0 left-0 right-0 '>
      <div className='m-auto w-full max-w-[1250px] flex justify-around sm:py-[35px] py-[10px] sm:h-[110px] h-[70px]'>
        <Link to='/' className='mt-1 sm:mt-0 sm:max-w-[340px] w-full max-w-[50px] sm:ml-10'>
          <img className='w-full max-w-[150px] sm:block hidden' src="https://ecomall-be87.kxcdn.com/ecomall/wp-content/themes/ecomall/images/logo.png" alt="logo" />
          <p className=' font-semibold text-blue-500 text-[20px] mt-2 w-full ml-2 max-w-[150px] block sm:hidden'>Ecoml</p>
        </Link>
        <div className='flex justify-around w-full sm:max-w-[550px] max-w-[200px]'>
          <span className='flex items-center w-full'>
            <span className=' text-white sm:p-3 bg-blue-500 flex items-center justify-center font-medium  p-2 rounded-l-md w-full max-w-[100px] sm:max-w-[150px]' onClick={() => Seach(dataSearch)}>SEARCH</span>
            <input onChange={el => setDataSeach(el.target.value)} placeholder='Bạn cần gì?' className='max-w-[250px] sm:max-w-[550px] w-full outline-none  sm:p-3 p-2 rounded-r-md  flex  bg-slate-300 ' value={dataSearch} />
          </span>
        </div>
        <div onClick={() => navigate(`/${path.MEMBER}/${path.WISHLIST}`)} className=' relative cursor-pointer hover:text-blue-500 hidden sm:flex items-center justify-end mr-4'>
          <span className='mx-3'><FaRegHeart size={25} /></span>
          <span className=' absolute right-1  sm:top-[1px] px-1 text-[10px] bg-blue-500 text-white rounded-lg'>{current?.wishList?.length || 0}</span>
        </div>
        <div onClick={() => dispatch(ShowCart())} className='cursor-pointer flex items-center justify-center  sm:p-2  sm:mr-2'>
          <span className='flex relative items-center hover:text-blue-500'>
            <BsHandbagFill size={25} />
            <span className=' absolute left-4  sm:top-[1px] px-1 text-[10px] bg-blue-500 text-white rounded-lg'>{current?.cart?.length || 0}</span>
            <span className='w1230:flex hidden flex-col ml-3 '>
              <span className='text-[12px] hover:text-black'>My Cart</span>
              <span className='hidden font-medium sm:flex flex-col ml-1'>{result || '0.00'} $</span>
            </span>
          </span>
        </div>
        <div className='hidden sm:block'>
          {isLoggedIn && current ? (<div onMouseEnter={() => setInformationUser(true)} onMouseLeave={() => setInformationUser(false)} className='rounded-sm  sm:flex flex-col justify-center items-center relative'>
            {current && <Fragment>
              <div onMouseEnter={() => setInformationUser(true)} onMouseLeave={() => setInformationUser(false)} className='flex items-center cursor-pointer justify-center   '>
                {current?.avatar ? <img src={current?.avatar} alt='avatar' className='w-[30px] h-[30px] mt-5 mr-4 w1234:mt-0' /> : <LuUser size={30} />}
                <span className='w1230:flex hidden flex-col mx-2'>
                  <span className='text-[12px]'>My Account</span>
                  <span className='text-[12px] font-medium hover:text-blue-500'>{`${current?.lastname} ${current?.firstname}`}</span>
                </span>
              </div>
              {InformationUser && (<div onMouseEnter={() => setInformationUser(true)} onMouseLeave={() => setInformationUser(false)} className='bg-white absolute bottom-[-70px] right-[10px] shadow-xl border rounded-md'>
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
              <div className='mt-5 mr-4 w1234:mt-0 flex items-center rounded-lg justify-center '>
                <LuUser  size={30} />
                <span className='flex flex-col mx-2'>
                  <span className='text-[12px]'>My Account</span>
                  <span className='text-[12px] font-medium '>Login</span>
                </span>
              </div>
            </Link>}
        </div>
      </div>
    </div>
  )
}

export default WithRase(memo(TopHearder))


// <div div className = "flex text-[13px] " >
//         <div onClick={() => handleClickMenu(true)} className='hidden sm:flex items-center justify-center border-x p-2 cursor-pointer'>
//           <span><LuMenuSquare size={24} className='mr-3' /></span>
//           <span className='flex flex-col'><span>Danh</span><span>mục</span> </span>
//         </div>
//
//         <div className='  flex-col px-4 sm:border-r items-center hidden lg:block'>
//           <span className='flex items-center'>
//             <RiPhoneFill color="red" />
//             <span className='font-semibold ml-3 text-base'> (+1800) 000 8808</span>
//           </span>
//           <span>Online Support 24/7</span>
//         </div>
//         <div onClick={() => navigate(`/${path.MEMBER}/${path.WISHLIST}`)} className='cursor-pointer hidden sm:flex items-center sm:border-r justify-end '>
//           <span className='mx-3'><FaRegHeart size={24} color='red' /></span>
//         </div>
//         <div onClick={() => dispatch(ShowCart())} className='cursor-pointer flex items-center justify-center  sm:p-2  sm:border-r sm:mr-2'>
//           <span className='flex relative items-center '>
//        <BsHandbagFill color='red' size={25} />
//             <span className=' absolute left-2.5  sm:top-none top-2'>{current?.cart?.length || 0}</span>
//             {/* <span className='hidden  sm:flex flex-col ml-1'><span>Giỏ</span><span>hàng</span></span> */}
//           </span>
//         </div>
//         <div className='hidden sm:block'>
//           {isLoggedIn && current ? (<div onClick={() => setInformationUser(!InformationUser)} className='rounded-sm  sm:flex flex-col justify-center items-center relative'>
//             {current && <Fragment>
//               <div className='flex items-center cursor-pointer justify-center  flex-col'>
//                 {current?.avatar ? <img src={current?.avatar} alt='avatar' className='w-[25px] h-[25px]' /> : <BsPersonCircle size={25} />}
//                 <span>{`${current?.lastname} ${current?.firstname}`}</span>
//               </div>
//               {InformationUser && (<div className='bg-white absolute bottom-[-50px] right-[0px] shadow-xl border'>
//                 <ul className=''>
//                   <Link to={+current?.role === 1945 ? `/${path.ADMIN}/${path.DASHBOARD}` : `/${path.MEMBER}/${path.PERSONAL}`}  >
//                     <li className='pt-2 pb-1 px-2 hover:text-white hover:bg-slate-500'>{+current?.role === 1945 ? 'Admin' : 'User'}</li>
//                   </Link>
//                   <li className='px-2 pt-1 cursor-pointer pb-2 text-red-500 hover:text-white hover:bg-slate-500' onClick={() => { dispatch(logout()); clearLocalStorage(); }}>Logout</li>
//                 </ul>

//               </div>)}
//             </Fragment>}

//           </div>) :
//             <Link to={`${path.LOGIN}`}>
//               <div className=' flex items-center rounded-lg justify-center flex-col'>
//                 <BsPersonCircle size={25} />
//                 <span>Đăng nhập</span>
//               </div>
//             </Link>}
//         </div>
//       </div >