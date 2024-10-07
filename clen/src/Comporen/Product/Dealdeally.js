import React, { useEffect, useState, memo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { apiGetProducts } from 'Apis/Products'; 
import { formatMoney } from 'Ultils/Hellpers'; 
import { getDealDaily } from 'St/Products/Productslice'; 
import { Countdown } from 'Comporen/Index';   // Import Countdown
import { renderStarFromNumber, secondsToHms } from 'Ultils/Hellpers';
import WithRase from 'hocs/withRase';
import { AiFillHome, AiFillStar } from 'react-icons/ai';

const Dealdeally = ({ dispatch }) => {
    const dealDaily = useSelector(state => state.products.dealDaily);
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);
    const [dealdaily, setDealdaily] = useState(dealDaily?.data);
    const idInterval = useRef(null);

    const fetchDealDaily = async () => {
        const response = await apiGetProducts({ limit: 20, sort: '-totalRating' });
        if (response?.success) {
            const pr = response.producData[Math.floor(Math.random() * response.producData.length)];
            const dealData = {
                data: pr,
                expireTime: Date.now() + 12 * 3600 * 1000,  
            };
            localStorage.setItem('dealDaily', JSON.stringify(dealData));
            setDealdaily(pr);
            dispatch(getDealDaily(dealData));
        }
    };

    useEffect(() => {
        const storedDealDaily = localStorage.getItem('dealDaily');
        if (storedDealDaily) {
            const parsedDealDaily = JSON.parse(storedDealDaily);
            if (parsedDealDaily.expireTime > Date.now()) {
                setDealdaily(parsedDealDaily.data);
                dispatch(getDealDaily(parsedDealDaily));
            } else {
                localStorage.removeItem('dealDaily');
                fetchDealDaily();
            }
        } else {
            fetchDealDaily();
        }
    }, [dispatch]);

    useEffect(() => {
        if (dealDaily?.expireTime) {
            const deltaTime = dealDaily.expireTime - Date.now();
            const timeLeft = secondsToHms(deltaTime);
            setHour(timeLeft.h);
            setMinute(timeLeft.m);
            setSecond(timeLeft.s);
        }
    }, [dealDaily]);

    useEffect(() => {
        if (idInterval.current) clearInterval(idInterval.current);

        idInterval.current = setInterval(() => {
            setSecond(prevSecond => {
                if (prevSecond > 0) return prevSecond - 1;
                if (minute > 0) {
                    setMinute(prevMinute => prevMinute - 1);
                    return 59;
                }
                if (hour > 0) {
                    setHour(prevHour => prevHour - 1);
                    setMinute(59);
                    return 59;
                }
                clearInterval(idInterval.current);
                fetchDealDaily();
                return 0;
            });
        }, 1000);

        return () => clearInterval(idInterval.current);
    }, [hour, minute, second, dealDaily]);

    return (
        <div className='border w-full flex-auto rounded-lg'>
            <div className='flex items-center justify-between'>
                <span className='flex-2 flex justify-center mt-[4px] '>
                    <AiFillStar size={20} color='#DD1111' />
                </span>
                <span className='flex-5 font-bold text-[20px] text-center'>Deal Deally</span>
                <span className='flex-3'></span>
            </div>
            {dealdaily && (
                <div className='w-full flex flex-col items-center'>
                    <img
                        src={dealdaily?.thumb || "https://th.bing.com/th/id/OIP.CaLENRpDWR6DvqXLUqlrJgAAAA?rs=1&pid=ImgDetMain"}
                        alt=""
                        className='w-[223px] h-[223px] object-cover'
                    />
                    <span className='flex h-4'>
                        {renderStarFromNumber(dealdaily?.totalRatings)?.map((el, index) => (
                            <span key={index}>{el}</span>
                        ))}
                    </span>
                    <span>{dealdaily?.title}</span>
                    <span>{`${formatMoney(dealdaily?.price)} VNĐ`}</span>
                </div>
            )}
            <div className='px-4 mt-4'>
                <div className='flex gap-2 justify-center items-center mb-4'>
                    <Countdown unit={"Hours"} number={hour} />
                    <Countdown unit={"Minutes"} number={minute} />
                    <Countdown unit={"Seconds"} number={second} />
                </div>
                <Link to={`${dealdaily?.category?.toLowerCase()}/${dealdaily?._id}/${dealdaily?.title}`}>
                    <button
                        type="button"
                        className='flex gap-2 items-center justify-center w-full bg-blue-500 hover:bg-gray-800 text-white py-2 mb-4'>
                        <AiFillHome />
                        <span>Options</span>
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default memo(WithRase(Dealdeally));
