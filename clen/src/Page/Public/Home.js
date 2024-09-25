import React, { useEffect, useState } from 'react'
import { Banner, Dealdeally, FeatureProduct, Sideba, CustomSlider, Bestsale } from "../../Comporen/Index"
import { useSelector } from 'react-redux'
import icons from '../../Ultils/Icons'
import { apiGetProducts } from 'Apis/Products'
import WithRase from 'hocs/withRase'
import { memo } from 'react'
const Home = ({ navigate }) => {
    const { IoIosArrowForward } = icons
    const { newproduct } = useSelector(state => state.products)
    const { categories } = useSelector(state => state.app)
    const [seachTh, setSeachTh] = useState({
        category: null,
        brand: null
    })
    console.log(seachTh)
    const queryParams = new URLSearchParams();
    const seachhang = async (params) => {
        const response = await apiGetProducts(params)
        if (response.success) {
            queryParams.append('brand', seachTh.brand);
            navigate({
                pathname: `/${seachTh.category}`,
                search: queryParams.toString()
            })
        }else{
           alert("sản phẩm hiện đang hết hàng")
        }
    }
    useEffect(() => {
        console.log('useEffect triggered, seachTh:', seachTh);
        if (seachTh.category) {
            seachhang(seachTh)
        }
    }, [seachTh])


    return (
        <div >
            <div className='sm:w-main w-full flex m-auto'>
                <div className='hidden sm:flex flex-col gap-5 w-[25%] flex-auto border'>
                    <Sideba />
                    <Dealdeally />
                </div>
                <div className='flex flex-col gap-5 pl-5 w-full sm:w-[75%] flex-auto border'>
                    <Banner />
                    <Bestsale />
                </div>
            </div>
            <div className='my-8 w-full'>
                <FeatureProduct />
            </div>
            <div className='my-8 w-full'>
                <div className=' m-auto sm:w-main '>
                    <h3 className='text-20px py-[15px] border-b-2 uppercase border-black font-medium'>NEW ARRIVALS</h3>
                    <CustomSlider
                        product={newproduct}
                    />
                </div>
                <div className='w-full'>
                    <h3 className='sm:w-main m-auto text-20px py-[15px] border-b-2 uppercase border-black font-bold'>Hot colecttion</h3>
                    <div className='flex flex-wrap sm:w-main m-auto'>
                        {categories?.filter(el => el.title.toLowerCase() !== 'camera' && el.title.toLowerCase() !== 'speaker').map(el => (
                            <div key={el._id}
                                className='sm:max-w-[430px] xs:max-w-[300px] w-full flex-initial p-2 shadow border mx-1 my-1'>
                                <div className='flex'>
                                    <img src={el.image} className='object-contain flex-1 w-[144px] h-[129px] mt-[10px]' />
                                    <div>
                                        <h3 className='text-20px uppercase text-gray-800 font-bold'>{el.title}</h3>
                                        <ul>

                                            {el.brand?.map(item => (
                                                <span className='flex gap-1 items-center text-gay-400 no-underline hover:underline'>
                                                    <li onClick={() => {if (el.title && item) {
                                                        setSeachTh({ category: el.title, brand: item });
                                                    } else {
                                                        console.error("el.title or item is undefined");
                                                    }}
                                                    } key={item}>{item}</li>
                                                    <IoIosArrowForward size={14} />
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

