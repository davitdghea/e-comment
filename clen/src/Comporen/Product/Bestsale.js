import React, { useEffect, useState } from 'react'
import { apiGetProducts } from '../../Apis/Products'
import { CustomSlider } from '../Index'
import { useDispatch } from 'react-redux'
import { TiThMenu } from "react-icons/ti";
// const tabs = [
//   { id: 1, name: "best saller" },
//   { id: 2, name: "new arrivals" },
// ]

const Bestsale = () => {
  const [activedtab, setActivedtab] = useState('Smartphone')
  const [bestSale, setBestSale] = useState(null)
  const [showButtons, setShowButtons] = useState(false)
  const dispatch = useDispatch()
  const FetchProduct = async () => {
    const response = await apiGetProducts({ sort: '-soid', category: activedtab })
    if (response?.success) {
      setBestSale(response.producData)

    }
  }
  useEffect(() => {
    FetchProduct()
  }, [activedtab])
  return (
    <div>
      <div  className='relative w-full flex text-[20px] gap-8 mt-4 justify-between border-b border-solid-2px pb-4  items-center pl-4  mr-2'>
        {/* {tabs.map((el) => (
          <span key={el.id}
            onClick={() => { setActivedtab(el.id) }}
            className={` rounded-md flex items-center p-2 justify-center cursor-pointer font-semibold capitalize   border-r shadow-md  ${activedtab === el.id ? "text-gray-900" : "text-gray-400"}`}>
            {el.name}
          </span>
        ))} */}
        <span className='font-semibold  text-[20px]'>Top Selling</span>
        <span
          className='flex sm:hidden '
          onClick={() => setShowButtons(!showButtons)}
        ><TiThMenu />
        </span>
        <span
          className={`absolute sm:relative right-0 bg-white sm:bg-none rounded-lg top-4 z-40 sm:z-0 justify-around ${showButtons ? 'flex flex-col' : 'hidden'} sm:flex `}
          >
          <span className={`font-medium ml-3 cursor-pointer hover:text-blue-500 ${activedtab === 'Smartphone' && "text-blue-500"}`} onClick={() => { setActivedtab('Smartphone') }}>Smartphone</span>
          <span className={`font-medium ml-3 cursor-pointer hover:text-blue-500 ${activedtab === 'Printer' && "text-blue-500"}`} onClick={() => { setActivedtab('Printer') }}>Headphones</span>
          <span className={`font-medium ml-3 cursor-pointer hover:text-blue-500 ${activedtab === 'Laptop' && "text-blue-500"}`} onClick={() => { setActivedtab('Laptop') }}>Laptops</span>
          <span className={`font-medium ml-3 cursor-pointer hover:text-blue-500 ${activedtab === 'Accessories' && "text-blue-500"}`} onClick={() => { setActivedtab('Accessories') }}>Accessories</span>
        </span>
      </div>
      <div className='mt-4  '>
        <CustomSlider product={bestSale} activedtab={activedtab} dispatch={dispatch} />
      </div>

    </div>
  )
}

export default Bestsale