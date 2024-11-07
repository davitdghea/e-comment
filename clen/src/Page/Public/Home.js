import React, { useEffect, useState } from 'react'
import { Banner, Dealdeally, Sideba, CustomSlider, Bestsale } from "../../Comporen/Index"
import { useSelector } from 'react-redux'
import icons from '../../Ultils/Icons'
import WithRase from 'hocs/withRase'
import { memo } from 'react'
import 'animate.css'
import { createSearchParams, Link } from 'react-router-dom'
import { apiGetProducts } from 'Apis/Products'
import Chat from 'Comporen/Common/Chat'
import { IoMdChatboxes } from "react-icons/io";

const Home = ({ navigate }) => {
    const { IoIosArrowForward } = icons
    const [isExiting, setIsExiting] = useState(false);
    const [chatnow, setChatnow] = useState(false)
    const current = useSelector(state => state.user)
    const [newproduct, setNewpoduct] = useState([])
    const { categories } = useSelector(state => state.app)
    const FetchProduct = async () => {
        const so =  window.innerWidth >= 900 ? 6 : 4
        const response = await apiGetProducts({ sort: '-soid', limit: so })
        if (response?.success) {
            setNewpoduct(response.producData)

        }
    }
    useEffect(() => {
        // Gọi FetchProduct lần đầu khi component mount
        FetchProduct();

        // Hàm để xử lý sự kiện resize
        const handleResize = () => {
            FetchProduct(); // Gọi lại FetchProduct khi kích thước thay đổi
        };

        // Thêm sự kiện resize vào window
        window.addEventListener('resize', handleResize);

        // Cleanup sự kiện khi component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    return (
        <div className='w-full sm:max-w-[1150px] ml-4 sm:mx-auto'>
            <div className=' w-full sm:max-w-[1100px] flex mt-[25px] sm:mt-[50px] j'>
                <div className='hidden md:flex flex-col gap-5 w-[30%] flex-auto '>
                    <Sideba />

                </div>
                <div className='flex flex-col gap-5 sm:ml-10  w-full md:w-[75%] '>
                    <Banner />
                </div>
            </div>
            <div className='my-8 w-full'>
                <Bestsale />
                
            </div>
            <Link to={"Smartphone?brand=Xiaomi"} >
                <img src='https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/xiaomi.png' className='w-full rounded-md shadow-md h-full  object-cover' />
            </Link>
            <div className='sm:flex block mt-[50px]'>
                <div className='w-full md:max-w-[350px] flex flex-col'>
                    <h3 className='pb-3 border-b border-solid-2px font-bold'>Deal Of The Day</h3>
                    <div className='mt-5 flex sm:block'>
                        <div className='pb-2 w-full max-w-[90%] mx-auto'>
                            <Dealdeally />
                        </div>
                        <div className='hidden sm:block ml-3 '>
                            <Link to={"accessories/6704db128e836eb50d97e46f/APPLE%20WATCH%20EDITION%20SERIES%202" }>
                                <img className='my-5 rounded-md shadow-md' src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/right-banner-14-10.jpg" />
                            </Link>
                            <Link to={"Smartphone?brand=Apple" }>
                                <img className='my-5 rounded-md shadow-md' src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/apple-chinh-hang-home.jpg" />
                            </Link>  
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className='pb-3 ml-2 border-b border-solid-2px font-bold'>New Arrivals</h3>
                    <div className='flex  sm:ml-0 justify-between w-full mt-5'>
                        <CustomSlider product={newproduct} so={6} Css='flex  justify-between flex-wrap' />
                    </div>
                </div>
            </div>
            <div className='my-8 w-full'>
                <div className='w-full mb-[100px] sm:mb-0'>
                    <h3 className=' m-auto text-20px py-[15px] border-b-2 uppercase border-black font-bold'>Hot colecttion</h3>
                    <div className='flex flex-wrap  mx-auto justify-center'>
                        {categories?.filter(el => el.title.toLowerCase() !== 'camera' && el.title.toLowerCase() !== 'speaker').map(el => (
                            <div key={el._id}
                                className=' mt-4 sm:max-w-[400px] md:max-w-[365px]  w-full max-w-[300px] flex-initial p-2 shadow-md rounded-md border my-1 ' >
                                <div className='flex w-full'>
                                    <div className='w-full max-w-[62%] flex items-center justify-center'>
                                        <img src={el.image} alt='' className='object-contain flex-1 w-full  max-w-[144px] h-full max-h-[129px]' />
                                    </div>
                                    <div className='w-full max-w-[37%]'>
                                        <h3 className='text-20px uppercase text-gray-800 font-bold'>{el.title}</h3>
                                        <ul>
                                            {el.brand?.map(item => (
                                                <span className='flex gap-1 items-center text-gay-400 no-underline hover:underline'>
                                                    <IoIosArrowForward size={14} />
                                                    <li onClick={() => navigate({
                                                        pathname: `/${el.title}`,
                                                        search: createSearchParams({ brand: item }).toString(),
                                                    })
                                                    } key={item}>{item}</li>
                                                </span>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {current.current !== null && current?.current?.role !== '1945' && (chatnow ? <div className={`fadeInDown animate__animated animate__fadeInUp custom-animation w-full max-w-[349px] rounded-xl h-full max-h-[380px] border border-gray-300 fixed z-40 bottom-[120px] sm:bottom-5 right-5 bg-white custom-scrollbar ${isExiting ? 'animate__fadeOutDown' : ''}`}>
                <Chat 
                    StyleDiv='h-[250px] overflow-y-auto mt-4'
                    Style='relative'
                       onClose={() => {
                        setIsExiting(true);
                        setTimeout(() => {
                            setChatnow(false);
                            setIsExiting(false);
                        }, 500); 
                    }}
                      />
            </div> : <div className='cursor-pointer flex items-center fixed bg-blue-500 rounded-t-xl bottom-[100px] sm:bottom-0 right-0 px-3 text-white z-40' onClick={() => setChatnow(true)}>
                    <span><IoMdChatboxes/></span>
                    <span className='ml-3'>Chat với nhân viên tư vấn</span>
                </div>)}
        </div >
    )
}

export default memo(WithRase(Home))

