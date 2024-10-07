import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { createSearchParams, useParams } from 'react-router-dom'
import { GetProducts, apiGetProducts, apiUpdateCart } from '../../Apis/Index'
import { Breadcrumb, Button, ProductInFormate, SelectQuantity, CustomSlider } from '../../Comporen/Index'
import Slider from 'react-slick'
import { formatMoney, renderStarFromNumber } from '../../Ultils/Hellpers'
import { ProductExtraInfoItemTion } from "../../Ultils/Contants"
import ProductExtraInfoItem from '../../Comporen/Product/ProductExtraInfoItem'
import DOMPurify from 'dompurify'
import clsx from 'clsx'
import { getCurrent } from 'St/User/AsyncAction'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import path from 'Ultils/Path'
import { toast } from 'react-toastify'
import WithRase from 'hocs/withRase'

const DetailProduct = ({ isQuickView, data, location, navigate, dispatch }) => {
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
  };
  const titleRef = useRef()
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const { current } = useSelector(state => state.user)
  const [variant, setVariant] = useState(null)
  const [pid, setPid] = useState(null)
  const [category, setCategory] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [product, setProduct] = useState(null)
  const [update, setUpdate] = useState(false)
  const [relateProducts, setRelateProducts] = useState(null)
  const [currentProduct, setCurRenProduct] = useState({
    title: "",
    thumb: '',
    images: [],
    price: '',
    color: ""
  })

  useEffect(() => {
    if (data) {
      setPid(data.pid)
      setCategory(data.category)
    }
    else if (params && params.pid) {
      setPid(params?.pid)
      setCategory(params.category)
    }
  }, [data, params])
  const fetchProductData = async () => {
    if (!pid) return;
    const response = await GetProducts(pid)

    if (response?.success) {
      setProduct(response.ProductData)
      setCurrentImage(response?.ProductData?.thumb)
    }
  }

  useEffect(() => {
    if (variant) {
      setCurRenProduct({
        thumb: product?.variant?.find(el => el.sku === variant)?.thumb,
        title: product?.variant?.find(el => el.sku === variant)?.title,
        color: product?.variant?.find(el => el.sku === variant)?.color,
        images: product?.variant?.find(el => el.sku === variant)?.images,
        price: product?.variant?.find(el => el.sku === variant)?.price
      })
    }
  }, [variant,product])
  const fetchProducts = async () => {
    const response = await apiGetProducts({ category })
    if (response?.success) setRelateProducts(response.producData)
  }
  useEffect(() => {
    if (pid) {
      fetchProductData()
      fetchProducts()
    }
    titleRef.current.scrollIntoView({block:'center'})
    window.scroll(0, 0)
  }, [pid])
  useEffect(() => {
    if (pid) fetchProductData()
  }, [update])
  const rerender = useCallback(() => {
    setUpdate(!update)
  }, [update])
  const handleQuantity = useCallback((number) => {
    if (!Number(number) || Number(number) < 1) {
      return
    } else {
      setQuantity(number)
    }
  }, [quantity])
  const handleChangeQuantity = useCallback((flag) => {
    if (flag === 'minus' && quantity === 1) return
    if (flag === 'minus') setQuantity(prev => +prev - 1)
    if (flag === 'plus') setQuantity(prev => +prev + 1)
  }, [quantity])

  const handleClickImage = ( el) => {
  
    setCurrentImage(el)
  }
  const handleAddToCart = async () => {

    if (!current) return Swal.fire({
      title: 'Almost...',
      text: "Please login first!",
      icon: "info",
      showCancelButton: true,
      cancelButtonText: 'Not now!',
      confirmButtonText: "Go login page"
    }).then(async (rs) => {
      if (rs.isConfirmed) navigate({
        pathname: `/${path.LOGIN}`,
        search: createSearchParams({ redirect: location?.pathname }).toString()
      })
    })
    const response = await apiUpdateCart({
      pid,
      color: currentProduct.color || product?.color,
      quantity,
      price: currentProduct.price || product?.price,
      thumb: currentProduct.thumb || product?.thumb,
      title: currentProduct.title || product?.title
    })
    if (response.success) {
      toast.success(response.mes)
      dispatch(getCurrent())
    }
    else toast.error(response.mes)
  }
  return (
    <div className='w-full relative'>
      {!isQuickView && <div className='h-[81px] bg-gray-100'>
        <div ref={titleRef} className='w-full m-auto pt-3'>
          <p className='text-[20px] font-medium'>{currentProduct?.title || product?.title}</p>
          <Breadcrumb title={currentProduct?.title || product?.title} category={category} />
        </div>
      </div>}
      <div className='w-full m-auto mt-4 sm:flex '>
        <div className=' border flex-4 shadow-xl sm:mr-4 rounded-lg'>
          <div className='w-full h-full max-h-[450px] sm:max-w-[450px] flex justify-center items-center'>
            <img src={currentProduct?.thumb || currentImage} className='max-h-[430px] sm:max-w-[430px] pl-[20px] object-cover' />
          </div>
        </div>
        <div className='block sm:hidden w-full max-w-[520px] mt-[20px]'>
          <Slider className='image-slider' {...settings}>
            {currentProduct?.images?.length === 0 && product?.images?.length > 1 && product?.images?.map(el => (
              <div onClick={() => { setCurrentImage(el) }}
                className={clsx('flex w-[160px]  gap-2 justify-around', variant === el.sku && 'border-red-500')}>
                <img onClick={() => handleClickImage(el)} src={el} alt="sub-product" className='h-[143px] w-[170px] border border-gray-300 object-cover shadow-xl rounded-xl py-[10px]' />
              </div>
            ))}
            {currentProduct?.images?.length > 2 && currentProduct?.images?.map(el => (
              <div onClick={() => { setCurrentImage(el) }}
                className={clsx('flex w-[160px]  gap-2 justify-around', variant === el.sku && 'border-red-500')}>
                <img src={el} alt="sub-product" className='h-[143px] w-[170px] border border-gray-300 object-cover shadow-xl rounded-xl py-[10px]' />
              </div>
            ))}
          </Slider>
        </div>
        <div className=' border shadow-xl flex-4 sm:mr-4 rounded-lg'>
          <div className=' flex justify-between'>
            <h2 className='text-[30px] font-semibold ml-2'>
              {`${formatMoney(currentProduct?.price || product?.price)}  VNĐ`}
            </h2>
            {<span className='text-sm text-red-500'>{`(còn : ${product?.quantity})`}</span>}
          </div>
          <div className='flex items-center mt-8 ml-2'>
            {renderStarFromNumber(product?.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
            <span>{`(đã bán : ${product?.soId} chiếc)`}</span>
          </div>
          <ul className=' ml-2 text-sm text-gray-500'>
            {product?.description?.length === 1 && <div className='text-sm' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[0]) }}></div>}
            {product?.description?.length > 1 && product?.description?.map(el => (<li className='leading-6 ml-[20px]' key={el}>{el}</li>))}
          </ul>
          <div className='my-6 flex items-center gap-4 sm:ml-6'>
            <span className='font-bold'>Color:</span>
            <div className='flex flex-wrap gap-4 items-center '>
              <div
                onClick={() => setVariant(null)}
                className={clsx('flex w-[160px] gap-2 justify-around border-gray-300', { 'border-red-500': variant === product?.variant?.sku })}>

                <img src={currentProduct?.thumb || currentImage} alt='thumb' className='w-10 h-8 rounded-md object-cover ' />
                <span className='flex flex-col'>
                  <span>{product?.color}</span>
                  <span className='text-sm'>{product?.price}</span>

                </span>
              </div>
              {product?.variant?.map(el => (
                <div
                  key={el.sku}
                  onClick={() => setVariant(el.sku)}
                  className={clsx('flex flex-wrap gap-4 items-center ', { 'border-red-500': variant === el.sku })} >
                  <img src={el.thumb} alt='thumb' className='w-10 h-8 rounded-md object-cover' />
                  <span className='flex flex-col'>
                    <span className='text-sm'>{el.color}</span>
                    <span className='text-sm'>{el.price}</span>

                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-8 mb-5 w-[90%] mx-auto'>
            <span>Quantity</span>
            <SelectQuantity
              quantity={quantity}
              handleQuantity={handleQuantity}
              handleChanGeQuantity={handleChangeQuantity}
            />
            <Button handleOnclick={handleAddToCart} fw >
              Add To Cart
            </Button>
          </div>
        </div>
        {!isQuickView && <div className='hidden sm:block border rounded-xl  flex-2 shadow-xl'>
          {ProductExtraInfoItemTion.map(el => (
            <ProductExtraInfoItem
              key={el.id}
              title={el.title}
              sub={el.sub}
              icon={el.icon}
            />
          ))}
        </div>}
      </div>
      <div className='w-full m-auto flex'>
        <div className='w-full hidden sm:block max-w-[440px] mt-[20px]'>
          <Slider className='image-slider' {...settings}>
            {currentProduct?.images?.length === 0 && product?.images?.length > 1 && product?.images?.map(el => (
              <div onClick={() => { setCurrentImage(el) }}
                className={clsx('flex w-[150px] mb-[10px] gap-2 justify-around', variant === el.sku && 'border-red-500')}>
                <img onClick={() => handleClickImage(el)} src={el} alt="sub-product" className=' w-[140px] border border-gray-300 object-cover shadow-xl rounded-xl py-[10px]'/>
              </div>
            ))}
            {currentProduct?.images?.length > 2 && currentProduct?.images?.map(el => (
              <div onClick={() => { setCurrentImage(el) }}
                className={clsx('flex w-[150px] pb-[20px] gap-2 justify-around', variant === el.sku && 'border-red-500')}>
                <img onClick={() => handleClickImage(el)} src={el} alt="sub-product" className=' w-[140px] border border-gray-300 object-cover shadow-xl rounded-xl py-[10px]'/>
              </div>
            ))}
          </Slider>
        </div>
        <div className='w-full sm:max-w-[67%] shadow-xl border  rounded-xl mt-5 sm:ml-3'>
          <div className='flex flex-col  py-[5px] bg-blue-300 rounded-t-xl text-white'>
            <span className='ml-[20px] text-[20px] font-semibold'>{`Địa chỉ uy tín mua ${product?.title}`}</span>
          </div>
          <div className='flex flex-col ml-[40px]'>
            <span>- Cơ sở 1: Số 215 Giáp Nhất, Nhân Chính, Thanh Xuân, Hà Nội Hotline: 0818.215.215</span>
            <span>- Cơ sở 2: 208 Xã Đàn, Đống Đa, Hà Nội Hotline: 0815.208.208</span>
            <span>- Cơ sở 3: 583 Lê Hồng Phong, Phường 10, Quận 10, tp Hồ Chí Minh Hotline: 0825.583.583</span>
            <span>- Cơ sở 4: 258 Hoàng Văn Thụ, Phường 4, Quận Tân Bình, tp Hồ Chí Minh Hotline: 0399.555.258</span>
          </div>
        </div>
      </div>
      {!isQuickView  && <div className='w-full m-auto mt-8'>
        <ProductInFormate
          totalRatings={product?.totalRatings}
          ratings={product?.ratings}
          nameProduct={product?.title}
          pid={product?._id}
          rerender={rerender}
        />
      </div>}
      {!isQuickView  && <div className='w-full  sm:mb-0 sm:my-8 mb-[120px]'>
        <h3 className='text-[20px] font-semibold py-[15px] bottom-b-2 border-red-500'>
          Other Customers also buy:
        </h3>
        <CustomSlider normal={true} product={relateProducts} />
      </div>}
    </div>
  )
}
export default memo(WithRase(DetailProduct))
