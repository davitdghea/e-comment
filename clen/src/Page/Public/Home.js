import React from 'react'
import { Banner, Dealdeally, FeatureProduct, Sideba, CustomSlider, Bestsale } from "../../Comporen/Index"
import { useSelector } from 'react-redux'
import icons from '../../Ultils/Icons'
import WithRase from 'hocs/withRase'
import { memo } from 'react'
import { createSearchParams } from 'react-router-dom'
const Home = ({ navigate }) => {
    const { IoIosArrowForward } = icons
    const { newproduct } = useSelector(state => state.products)
    const { categories } = useSelector(state => state.app)
    return (
        <div className='w-full sm:max-w-[1100px] ml-4 sm:mx-auto'>
            <div className=' w-full sm:max-w-[1100px] flex sm:mt-[50px]'>
                <div className='hidden sm:flex flex-col gap-5 w-[25%] flex-auto border'>
                    <Sideba />
                    <Dealdeally />
                </div>
                <div className='flex flex-col gap-5 sm:pl-5 w-full sm:w-[75%] border'>
                    <Banner />
                    <Bestsale />
                </div>
            </div>
            <div className='my-8 w-full'>
                <FeatureProduct />
            </div>
            <div className='my-8 w-full'>
                <div className=' m-auto  '>
                    <h3 className='text-20px py-[15px] border-b-2 uppercase border-black font-medium'>NEW ARRIVALS</h3>
                    <CustomSlider
                        product={newproduct}
                    />
                </div>
                <div className='w-full'>
                    <h3 className=' m-auto text-20px py-[15px] border-b-2 uppercase border-black font-bold'>Hot colecttion</h3>
                    <div className='flex flex-wrap  m-auto'>
                        {categories?.filter(el => el.title.toLowerCase() !== 'camera' && el.title.toLowerCase() !== 'speaker').map(el => (
                            <div key={el._id}
                                className='sm:max-w-[350px] xs:max-w-[300px] w-full flex-initial p-2 shadow border mx-1 my-1'>
                                <div className='flex w-full'>
                                    <div className='w-full max-w-[62%] flex items-center justify-center'>
                                        <img src={el.image} alt='' className='object-contain flex-1 w-[144px] h-[129px]' />
                                    </div>
                                    
                                    <div className='w-full max-w-[38%]'>
                                        <h3 className='text-20px uppercase text-gray-800 font-bold'>{el.title}</h3>
                                        <ul>
                                            {el.brand?.map(item => (
                                                <span className='flex gap-1 items-center text-gay-400 no-underline hover:underline'>
                                                    <IoIosArrowForward size={14} />
                                                    <li onClick={() => navigate({
                                                        pathname: `/${el.title}`,
                                                        search: createSearchParams({brand: item}).toString(),
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

        </div >
    )
}

export default memo(WithRase(Home))

