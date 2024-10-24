import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { createSearchParams, useParams } from 'react-router-dom'
import { GetProducts, apiGetProducts, apiUpdateCart, apiUpdateWithlist } from '../../Apis/Index'
import { Breadcrumb, Button, ProductInFormate, SelectQuantity, CustomSlider } from '../../Comporen/Index'
import Slider from 'react-slick'
import { formatMoney, renderStarFromNumber } from '../../Ultils/Hellpers'
import DOMPurify from 'dompurify'
import clsx from 'clsx'
import { getCurrent } from 'St/User/AsyncAction'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import path from 'Ultils/Path'
import { toast } from 'react-toastify'
import WithRase from 'hocs/withRase'
import { FaHeart } from 'react-icons/fa'

const DetailProduct = ({ isQuickView, data, location, navigate, dispatch }) => {

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
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
        thumb: product?.variants?.find(el => el.sku === variant)?.thumb,
        title: product?.variants?.find(el => el.sku === variant)?.title,
        color: product?.variants?.find(el => el.sku === variant)?.color,
        images: product?.variants?.find(el => el.sku === variant)?.images,
        price: product?.variants?.find(el => el.sku === variant)?.price
      })
    }
    else {
      setCurRenProduct({
        title: "",
        thumb: '',
        images: [],
        price: '',
        color: ""
      })
    }
  }, [variant, product])
  const fetchProducts = async () => {
    const response = await apiGetProducts({ category })
    if (response?.success) setRelateProducts(response.producData)
  }
  useEffect(() => {
    if (pid) {
      fetchProductData()
      fetchProducts()
    }
    titleRef.current.scrollIntoView({ block: 'center' })
    window.scroll(0, 0)
  }, [pid])
  useEffect(() => {
    if (pid) fetchProductData()
  }, [update])
  const rerender = useCallback(() => {
    setUpdate(!update)
  }, [update])
  const handleQuantity = useCallback((number) => {
    if (!Number(number) || Number(number) < 1 || Number(number) > product?.quantity) {
      return
    }
    else {
      setQuantity(number)
    }
  }, [quantity])
  const handleChangeQuantity = useCallback((flag) => {
    if (flag === 'minus' && quantity === 1) return
    if (flag === 'minus') setQuantity(prev => +prev - 1)
    if (flag === 'plus' && +quantity >= +product?.quantity) return
    if (flag === 'plus') setQuantity(prev => +prev + 1)
  }, [quantity])

  const handleClickImage = (el) => {
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
    try {
      const response = await apiUpdateCart({
        sol: product.quantity,
        pid,
        color: currentProduct.color || product?.color,
        quantity,
        price: currentProduct.price || product?.price,
        thumb: currentProduct.thumb || product?.thumb,
        title: currentProduct.title || product?.title
      })
      if (response.success) {
        toast.success(response.message)
        dispatch(getCurrent())
      }
      else toast.error(response.message)
    } catch (error) {
      toast.error('tổng số sản phảm trong giỏ và thêm vào qua số lượng trong kho')
    }
  }
  const addWishlist = async(flag) =>{
      if (flag === 'WISHLIST') {
        if (!current) return Swal.fire({
          title: 'Almost...',
          text: "Please login first!",
          icon: "info",
          showCancelButton: true,
          cancelButtonText: 'Not now!',
          confirmButtonText: "Go login page"
        }).then((rs) => {
          if (rs.isConfirmed) navigate({
            pathname: `/${path.LOGIN}`,
            search: createSearchParams({ redirect: location.pathname }).toString()
          })
        })
        const response = await apiUpdateWithlist({ pid: product._id || currentProduct._id, thumb: product.thumb || currentProduct.thumb, title: product.title || currentProduct.title, category: product.category || currentProduct.category, price: product.price || currentProduct.price, color: product.color || currentProduct.color})

        if (response.success) {

          dispatch(getCurrent())
          toast.success(response.rs)
        } else toast.error(response.rs)

      }
    }
  return (
    <div className='w-full  relative my-10'>
      {!isQuickView && <div className='h-[81px] bg-gray-100'>
        <div ref={titleRef} className='w-full m-auto pt-3 px-3'>
          <p className='text-[20px] font-medium'>{currentProduct?.title || product?.title}</p>
          <Breadcrumb title={currentProduct?.title || product?.title} category={category} />
        </div>
      </div>}
      <div className='sm:max-w-[1150px] sm:mx-auto'>
        <div className='w-full  mt-4 w-800:flex block mb-10'>
          <div className='w-full max-w-[550px] mx-auto h-full max-h-[950px]'>
            <div className=' border flex-4 sm:mr-4 rounded-lg'>
              <div className='w-full h-full sm:max-w-[450px] flex justify-center items-center'>
                <img src={currentProduct?.thumb || currentImage} className='sm:max-w-[430px] pl-[20px] object-cover' />
              </div>
            </div>
            <div className='w-full hidden sm:block  max-w-[540px] mt-[20px]'>
              <Slider className='image-slider' {...settings}>
                {currentProduct?.images?.length === 0 && product?.images?.length > 1 && product?.images?.map(el => (
                  <div onClick={()=>{setCurrentImage(el)}}
                    className={clsx('flex w-[180px] mb-[10px] gap-2 justify-around', variant === el.sku && 'border-red-500')}>
                    <img onClick={() => handleClickImage(el)} src={el} alt="sub-product" className='w-full sm:max-w-[180px] border border-gray-300 object-cover rounded-xl py-[10px]' />
                  </div>
                ))}
                {currentProduct?.images?.length > 2 && currentProduct?.images?.map(el => (
                  <div onClick={() => { setCurrentImage(el) }}
                    className={clsx('flex w-full max-w-[180px] pb-[20px] gap-2 justify-around', variant === el.sku && 'border-red-500')}>
                    <img onClick={() => handleClickImage(el)} src={el} alt="sub-product" className='w-full max-w-[180px] border border-gray-300 object-cover rounded-xl py-[10px]' />
                  </div>
                ))}
              </Slider>
            </div>
            <div className='w-full max-w-[540px]  border w-800:block hidden rounded-xl mt-5 sm:ml-3'>
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
          <div className=' flex-4 sm:mr-4 w-full max-w-[90%] mx-auto'>
            <div className='max-w-[90%] w-full flex justify-between'>
              <h2 className='text-[30px] font-semibold ml-2'>
                {product?.title}
              </h2>
              {<span className='text-sm text-red-500 right-0 mt-2'>{`(còn : ${product?.quantity})`}</span>}
            </div>
            <div className='flex items-center mt-8 ml-2'>
              {renderStarFromNumber(product?.totalRatings)?.map((el, index) => (
                <span key={index}>{el}</span>
              ))}
              <span>{`(đã bán : ${product?.soId} chiếc)`}</span>
            </div>
            <h2 className='text-[30px] font-normal ml-2 text-red-500'>
              {`${formatMoney(currentProduct?.price || product?.price)}  VNĐ`}
            </h2>
            <ul className=' ml-2 text-sm text-gray-500'>
              {product?.description?.length === 1 && <div className='text-sm' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[0]) }}></div>}
              {product?.description?.length > 1 && product?.description?.map(el => (<li className='leading-6 ml-[20px]' key={el}>{el}</li>))}
            </ul>
            <div className='my-6 flex items-center gap-4 sm:ml-6'>
              <span className='font-bold'>Color:</span>
              <div className='flex flex-wrap gap-4 items-center '>
                <div
                  onClick={() => setVariant(null)}
                  style={{ backgroundColor: product?.color.toLowerCase() }}
                  className={clsx(` bg-[${product?.color.toLowerCase()}] bg-${product?.color.toLowerCase()} bg-${product?.color.toLowerCase()}-500 flex w-[50px] h-6 gap-2 justify-around border-2  border-gray-300`, { 'border-gray-500': !variant })}
                >
                  <span className='flex flex-col'>
                    <span className='text-[12px]'>{ }</span>
                  </span>
                </div>
                {product?.variants?.map(el => (
                  <div
                    key={el.sku}
                    onClick={() => setVariant(el.sku)}
                    style={{ backgroundColor: el?.color.toLowerCase() }}
                    className={clsx(`flex bg-[${el?.color}] bg-${el?.color.toLowerCase()} bg-${el?.color.toLowerCase()}-500 w-[50px] h-6 flex-wrap gap-4 items-center border-2 border-gray-300`, { 'border-gray-500': variant === el.sku })} >
                    <span className='flex flex-col'>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className='flex flex-col  gap-8 mb-5 w-[90%] mx-auto'>
              <div className='flex'>
                <span className='font-bold mr-2'>Quantity:</span>
                <SelectQuantity
                  quantity={quantity}
                  handleQuantity={handleQuantity}
                  handleChanGeQuantity={handleChangeQuantity}
                />
              </div>
              <ul className='bg-blue-400 text-white p-3 rounded-md'>
                <li>Estimated delivery time 14-30 days</li>
                <li>18 months warranty at Genuine Warranty Center.</li>
                <li>Whats in the box: charging cable and block</li>
              </ul>
              {product?.quantity === 0 ? <p>Sản phẩm hiện đang hết hàng</p> : <Button handleOnclick={handleAddToCart} fw >
                Add To Cart
              </Button>}
              <div onClick={() => addWishlist('WISHLIST')} className='flex border-b pb-3'>
                <span><FaHeart color={current?.wishList?.some((i) => i.pid === product?._id) ? 'red' : "gray"} size={25}/></span>
                <span className='ml-3'>{current?.wishList?.some((i) => i.pid === product?._id) ? 'Browse wishlist' : "Add to wishlist"}</span>
              </div>
              <div className='flex flex-col'>
                <span>SKU:<span>MB001</span></span>
                <span>Tags:<span>Apple,iphone, Electronic, Mobile & Tablet</span></span>
                <span>Share:<span></span></span>
              </div>
            </div>
          </div>
         
        </div>
        {/* {!isQuickView && <div className='hidden sm:block border rounded-xl  flex-2 shadow-xl'>
            {ProductExtraInfoItemTion.map(el => (
              <ProductExtraInfoItem
                key={el.id}
                title={el.title}
                sub={el.sub}
                icon={el.icon}
              />
            ))}
          </div>} */}
        {/* <div className='w-full m-auto flex'> 
        </div> */}
        {!isQuickView && <div className='w-full m-auto mt-8'>
          <ProductInFormate
            totalRatings={product?.totalRatings}
            ratings={product?.ratings}
            nameProduct={product?.title}
            pid={product?._id}
            rerender={rerender}
          />
        </div>}
        {!isQuickView && <div className='w-full  sm:mb-0 sm:my-8 pb-[120px]'>
          <h3 className='text-[20px] font-semibold py-[15px] bottom-b-2 border-red-500'>
            Other Customers also buy:
          </h3>
          <CustomSlider normal={true} product={relateProducts} />
        </div>}
      </div>
    </div>
  )
}
export default memo(WithRase(DetailProduct))
