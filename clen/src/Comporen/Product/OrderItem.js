import { SelectQuantity } from 'Comporen/Index'
import WithRase from 'hocs/withRase'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { updateCart } from 'St/User/Userslice'
import { formatMoney } from 'Ultils/Hellpers'

const OrderItem = ({ el, defaultQuantity = 1, dispatch, handCallBack, selectedProducts }) => {
    const { currentCart, current } = useSelector(state => state.user)
    console.log(currentCart)
    console.log(current)
    const [quantity, setQuantity] = useState(() => defaultQuantity)
    const [isSelected, setIsSelected] = useState(selectedProducts.includes(el._id))

    useEffect(() => {
        setQuantity(el.quantity)
    }, [el])

    const handleQuantity = (number) => {
        if (!isSelected && +number > 1) setQuantity(number)
    }

    const handleChanGeQuantity = (flag) => {
        if (!isSelected) {
            if (flag === 'minus' && quantity === 1) return
            if (flag === 'minus') setQuantity(prev => +prev - 1)
            if (flag === 'plus') setQuantity(prev => +prev + 1)
        }
    }

    useEffect(() => {
        if (quantity > 0) {
            dispatch(updateCart({ pid: el.product, quantity, color: el.color }))
        }
    }, [quantity, dispatch])

    const handleSelectProduct = (productId) => {
        setIsSelected(prev => !prev)
        handCallBack(prev =>
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        )
    }

    return (
        <div key={el._id} className='w-full  mx-auto font-bold  border-b py-3 grid grid-cols-10  '>
            <span className='sm:col-span-6 col-span-5 w-full'>
                <div className='flex gap-2'>
                    <img src={el?.thumb} alt='thumb' className='w-16 h-16 object-cover'></img>
                    <div className='flex flex-col gap-1'>
                        <span className='text-main'>{el.title}</span>
                        <span className='text-xs'>{el.color}</span>
                    </div>
                </div >
            </span>
            <span className='col-span-2 sm:col-span-1 relative w-full'>
                <div className='flex items-center justify-start mt-[22px] '>
                    <SelectQuantity
                        quantity={quantity}
                        handleQuantity={handleQuantity}
                        handleChanGeQuantity={handleChanGeQuantity}
                    />
                </div>
            </span>
            <span className='col-span-2 w-full h-full mt-5'>
                <span className='sm:text-lg text-[10px]'>{formatMoney(el.price * quantity)}</span>
            </span>
            <span className='col-span-1 w-full h-full mt-5 text-center' >
                <input
                    checked={isSelected}
                    onChange={() => handleSelectProduct(el._id)}
                    type='checkbox' />
            </span >
        </div>
    )
}

export default WithRase(OrderItem)
