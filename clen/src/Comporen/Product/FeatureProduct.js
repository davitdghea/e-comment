import React, { useEffect, useState } from 'react'
import ProductCart from './ProductCart'
import { apiGetProducts } from '../../Apis/Products'

const FeatureProduct = () => {
    const [products,setProducts] = useState(null)
    const fetchProduct = async ()=>{
        const response = await apiGetProducts({limit:9,sort:"-totalRatings"})
    if(response.success) setProducts(response.producData)
    }
     
    useEffect(()=>{
        fetchProduct()
    },[])
    return (
    <div className='sm:w-main m-auto'>
        <h3 className='text-20px py-[15px] border-b-2px uppercase border-black font-medium'>FeatureProduct</h3>
        <div className='flex flex-wrap mt-[15px]'>
            {products?.map(el =>(
                <ProductCart
                {...el}
                    style=' w-full xs:max-w-[200px] sm:max-w-[430px] flex shadow ml-2 mt-2 border rounded-sm'
                pid={el._id}
                images={el.thumb}
               key={el._id}
                price={el.price}
                />
            ))}
        </div>
    </div>
  )
}

export default FeatureProduct