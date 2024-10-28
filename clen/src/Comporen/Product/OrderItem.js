import { GetProducts } from 'Apis/Products'
import { apiUpdateCart } from 'Apis/User'
import { SelectQuantity } from 'Comporen/Index'
import WithRase from 'hocs/withRase'
import React, { useEffect, useState } from 'react'
import { updateCart } from 'St/User/Userslice'
import { closestColor, formatMoney } from 'Ultils/Hellpers'

const OrderItem = ({ el, defaultQuantity = 1, dispatch, handCallBack, selectedProducts }) => {
    const [quantity, setQuantity] = useState(() => defaultQuantity)
    const [quantityGoc, setQuantityGoc] = useState(null)
    const [isSelected, setIsSelected] = useState(selectedProducts.includes(el._id))
    const ApiProduct = async () => {
        const response = await GetProducts(el.product)
        if (response.success) {
            setQuantityGoc(response.ProductData.quantity)
            setQuantity(el.quantity)
        }
    }
    const updateQuantity = async() =>{
       await apiUpdateCart({ updateQuantity: true, pid: el.product, quantity, color: el.color })
    }
   
    useEffect(() => {
        ApiProduct()    
    }, [])  
    const handleQuantity = (number) => {
        if (!isSelected && +number > 1 ) setQuantity(number)
    }

    const handleChanGeQuantity = async(flag) => {
        
        if (!isSelected) {
            if (flag === 'minus' && quantity === 1) return
            if (flag === 'minus') setQuantity(prev => +prev - 1)
            if (flag === 'plus' && quantity < quantityGoc) setQuantity(prev => +prev + 1)
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
            <span className='sm:col-span-5 col-span-4  w-full'>
                <div className='flex gap-2'>
                    <img src={el?.thumb} alt='thumb' className='w-16 h-16 object-cover'></img>
                    <div className='flex flex-col gap-1'>
                        <span className='text-main'>{el.title}</span>
                        <span className='text-xs'>{closestColor(el.color)}</span>
                    </div>
                </div >
            </span>
            <span className='col-span-2 sm:col-span-1 relative w-full'>
                <div className='flex items-center justify-start mt-[22px] '>
                    <SelectQuantity
                        updateQuantity={updateQuantity}
                        quantity={quantity}
                        handleQuantity={handleQuantity}
                        handleChanGeQuantity={handleChanGeQuantity}
                    />
                </div>
            </span>
            <span className='col-span-3 w-full h-full mt-5'>
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
