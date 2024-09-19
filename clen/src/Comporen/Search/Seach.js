import React, { memo, useEffect, useState } from 'react'
import icons from '../../Ultils/Icons'
import { colors } from '../../Ultils/Contants'
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { apiGetProducts } from '../../Apis/Index'
import useDebounce from '../../Hooks/UseDebounce'
const { AiOutlineDown } = icons
const Seach = ({ type, name, activeClick, changeActiveFitler }) => {
  const navigate = useNavigate()
  const { category } = useParams()
  const [params] = useSearchParams()
  const [price, SetPrice] = useState({
    from: "",
    to: ""
  })
  const [selected, setSelected] = useState([])
  const [bestPrice, setBestPrice] = useState()
  const handleSelect = (el) => {

    const alreadyEl = selected.find(e => e === el.target.value)
    if (alreadyEl) setSelected(prev => prev.filter(e => e !== el.target.value))
    else setSelected(prev => [...prev, el.target.value])
    changeActiveFitler(null)
  }
  const fetchBestPriceProduct = async () => {
    const response = await apiGetProducts({ sort: '-price', limit: 1 })
    if (response.success) setBestPrice(response.producData[0].price)
  }
  useEffect(() => {
    let param = []
    for (let i of params.entries()) param.push(i)
    const queries = {}
    for (let i of param) queries[i[0]] = i[1]
    if (selected.length > 0) {
      queries.color = selected.join(',')
      queries.page = 1
      navigate({
        pathname: `/${category}`,
        search: createSearchParams(queries).toString()
      })
    } else{
      navigate(`/${category}`)
    }
    
  }, [selected])
  const debouncePriceFRom = useDebounce(price.from, 500)
  const debouncePriceTo = useDebounce(price.to, 500)
  useEffect(() => {
    let param = []
    for (let i of params.entries()) param.push(i)
    const queries = {}
    for (let i of param) queries[i[0]] = i[1] 
    if (Number(price.from) > 0) queries.from = price.from
    else delete queries.from
    if (Number(price.to) > 0) queries.to = price.to
    else delete price.to  
    navigate({
        pathname: `/${category}`,
        search: createSearchParams(queries).toString()
      })
      navigate(`/${category}`)  
  }, [ debouncePriceFRom, debouncePriceTo])
  useEffect(() => {
    if (type === 'input') fetchBestPriceProduct()
  }, [type])
  return (
    <div
      className=' cursor-pointer items-center text-gray-400 p-3 gap-6 border border-gay-800 flex justify-between relative text-xs'
      onClick={() => { changeActiveFitler(name) }}
    >
      <span className='capitalize'>{name}</span>
      <AiOutlineDown />
      {activeClick === name && <div className='absolute bottom-[-1px] top-full border z-50 left-0 w-fit p-4 bg-white min-w-[150px] min-h-[400px]'>
        {type === 'checkbox' && <div className=''>
          <div className='bg-white p-4 items-center flex justify-between gap-8'>
            <span className='whitespace-nowrap '>{`${selected.length} selected`}</span>
            <span
              onClick={e => {
                e.stopPropagation()
                setSelected([])
                changeActiveFitler(null)
              }} className='underline cursor-pointer hover:text-red-500'>Reset</span>

          </div>
          <div onClick={e => e.stopPropagation()} className='bg-white flex flex-col gap-3 mt-4'>
            {colors.map((el, index) => (
              <div key={index} className='flex items-center gap-4'>
                <input
                  type='checkbox'
                  name={el}
                  value={el}
                  onClick={handleSelect}
                  checked={selected.some(selectedItem => selectedItem === el)}
                />
                <label htmlFor={el}>{el}</label>
              </div>

            ))}
          </div>
        </div>}
        {type === 'input' && <div onClick={e => e.stopPropagation()}>
          <div className='bg-white p-4 items-center flex justify-between gap-8'>
            <span className='whitespace-nowrap '>{`The highest price is ${Number(bestPrice).toLocaleString()} VND Default input value is USD`}</span>
            <span
              onClick={e => {
                e.stopPropagation()
                SetPrice({from:'',to:''})
                setSelected([])
              }} className='underline cursor-pointer hover:text-red-500'>Reset</span>

          </div>
          <div className='flex items-center p-2 gap-2'>
            <div className='flex item-center gap-2' >
              <label htmlFor='from'>from</label>
              <input
                className="form-input"
                type="number"
                id='from'
                value={price.from}
                onChange={e => SetPrice(prev => ({ ...prev, from: e.target.value }))}></input>
            </div>
            <div className='flex item-center gap-2'>
              <label htmlFor='to'>to</label>
              <input
                className="form-input"
                type="number"
                id='to'
                value={price.to}
                onChange={e => SetPrice(prev => ({ ...prev, to: e.target.value }))}></input>
            </div>
          </div>
        </div>}
      </div>}

    </div>
  )
}

export default memo(Seach)