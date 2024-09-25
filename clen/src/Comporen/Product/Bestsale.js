import React, { useEffect, useState } from 'react'
import { apiGetProducts } from '../../Apis/Products'
import { CustomSlider } from '../Index'

import { getNewProducts } from '../../St/Products/AsyncAction'
import { useDispatch, useSelector } from 'react-redux'

const tabs = [
  { id: 1, name: "best saller" },
  { id: 2, name: "new arrivals" },
]

const Bestsale = () => {
  const [activedtab, setActivedtab] = useState(1)
  const [bestSale, setBestSale] = useState(null)
  const [products, setProduct] = useState(null)
  const dispatch = useDispatch()
  const { newproduct } = useSelector(state => state.products)
  const FetchProduct = async () => {
    const response = await apiGetProducts({ sort: '-soid' })

    if (response?.success) {
      setBestSale(response.producData)
      setProduct(response.producData)
    }
  }
  useEffect(() => {
    FetchProduct()
    dispatch(getNewProducts())
  }, [])
  useEffect(() => {
    if (activedtab == 1) setProduct(bestSale)
    if (activedtab == 2) setProduct(newproduct)
  }, [activedtab])
  return (
    <div>
      <div className='w-full flex text-[20px] gap-8 mt-4 justify-center sm:justify-none  items-center pl-4  mr-2'>
        {tabs.map((el) => (
          <span key={el.id}
            onClick={() => { setActivedtab(el.id) }}
            className={` rounded-md flex items-center p-2 justify-center cursor-pointer font-semibold capitalize   border-r shadow-md  ${activedtab === el.id ? "text-gray-900" : "text-gray-400"}`}>
            {el.name}
          </span>
        ))}
      </div>
      <div className='mt-4  '>
        <CustomSlider product={products} activedtab={activedtab} dispatch={dispatch} />
      </div>

    </div>
  )
}

export default Bestsale