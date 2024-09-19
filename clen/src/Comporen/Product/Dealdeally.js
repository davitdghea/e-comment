import React, { useEffect, useState, memo } from 'react'
import icons from '../../Ultils/Icons'
import { apiGetProducts } from '../../Apis/Products'
import { formatMoney, renderStarFromNumber, secondsToHms } from '../../Ultils/Hellpers'
import { Countdown } from '../Index'
import { useSelector } from 'react-redux'
import WithRase from 'hocs/withRase'
import { getDealDaily } from 'St/Products/Productslice'
const { AiFillStar, AiFillHome } = icons
let idInterval
const Dealdeally = ({ dispatch }) => {
    const dealDaily = useSelector(state => state.product)
    console.log(dealDaily, "dealDaily");
    
    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [second, setSecond] = useState(0)
    const [expireTime, setExpireTime] = useState(false)
    const [dealdaily, setDealdaily] = useState(null)
    const fetchDealDaily = async () => {
        const response = await apiGetProducts({ limit: 20, sort:'-totalRating'})
        if (response?.success) {
            const pr = response.producData[Math.round(Math.random() * response.producData.length)]
            setDealdaily(pr)
            dispatch(getDealDaily({data:pr,time:Date.now() + 24 * 3600 * 1000}))
        }}    
    useEffect(()=>{
        if (dealDaily ?. dealDaily?.time){
            const deltaTime = dealDaily?.dealDaily?.time - Date.now()
            const number = secondsToHms(deltaTime)
            setHour(number.h)
            setMinute(number.m)
            setSecond(number.s)
        }
    }, [dealDaily])
    useEffect(() => {
        idInterval && clearInterval(idInterval)
        if (dealDaily?.time && dealDaily.time < Date.now()) fetchDealDaily()
    }, [expireTime, dealDaily])
    useEffect(() => {
        idInterval = setInterval(() => {
            if (second > 0) setSecond(prev => prev - 1)
            else {
                if (minute > 0) {
                    setMinute(prev => prev - 1)
                    setSecond(59)
                } else {
                    if (hour > 0) {
                        setHour(prev => prev - 1)
                        setMinute(59)
                        setSecond(59)
                    } else {
                        setExpireTime(!expireTime)
                    }
                }
            }
        }, 1000)
        return () => {
            clearInterval(idInterval)
        }
    }, [second, minute, hour, expireTime])
    return (
        <div className='border w-full flex-auto rounded-lg'>
            <div className='flex items-conter justify-betwen'>
                <span className='flex-2 flex justify-center mt-[4px] '><AiFillStar size={20} color='#DD1111' /></span>
                <span className='flex-5 font-bold text-[20px] text-center'>Deal Deally</span>
                <span className='flex-3'></span>
            </div>
            <div className='w-full flex flex-col items-center'>
                <img
                    src={dealdaily?.data?.thumb || "https://th.bing.com/th/id/OIP.CaLENRpDWR6DvqXLUqlrJgAAAA?rs=1&pid=ImgDetMain"}
                    alt=""
                    className='w-223px h-223px object-cover'
                />
                <span className='flex h-4'>{renderStarFromNumber(dealdaily?.data?.totalRatings)?.map((el, index) => (
                    <span key={index}>{el}</span>
                ))}</span>
                <span>{dealdaily?.data?.title}</span>
                <span>{`${formatMoney(dealdaily?.data?.price)} VNĐ`}</span>
            </div>
            <div className='px-4 mt-4'>
                <div className=' flex gap-2 justify-center items-center mb-4'>
                    <Countdown unit={"Hours"} number={hour} />
                    <Countdown unit={"Minutes"} number={minute} />
                    <Countdown unit={"Seconds"} number={second} />
                </div>
                <button
                    type="button"
                    className='flex gap-2 items-center justify-center w-full bg-blue-500 hover:bg-gray-800 text-white py-2 mb-4'>
                    <AiFillHome />
                    <span>Options</span>
                </button>
            </div>
        </div>
    )
}

export default memo(WithRase(Dealdeally))