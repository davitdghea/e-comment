import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate, createSearchParams, useLocation } from 'react-router-dom'
import { Breadcrumb, InputSelect, Product, Seach, Pagination } from '../../Comporen/Index'
import { apiGetProducts } from '../../Apis/Index'
import Masonry from 'react-masonry-css'
import { sorts } from '../../Ultils/Contants'
const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

const Products = () => {
  const location = useLocation();
  const { category } = useParams()
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(0);   
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [activeClick, SetactiveClick] = useState(null)
  const [products, setProducts] = useState(null)
  const [sort, setSort] = useState("")
  const fetProductsByCategory = async (queries) => {

    const response = await apiGetProducts({ ...queries, page: currentPage, limit: process.env.REACT_APP_PRODUCT_LIMIT })
    if (response?.success) {
      setProducts(response.producData)
      setTotalPages(Math.ceil(response.counts / process.env.REACT_APP_PRODUCT_LIMIT));
    } else {
      setProducts([]);
    }
  }

  useEffect(() => {
    console.log('Current params:', Array.from(params.entries()));
   
    const queries = Object.fromEntries([...params]);
    let priceQuery = {};
    if (queries.to && queries.from) {
      priceQuery = {
        $and: [
          { price: { gte: Number(queries.from) * 100 } },
          { price: { lte: Number(queries.to) * 100 } }
        ]
      }
      delete queries.price
    };
    if (queries.from) queries.price = { gte: Number(queries.from) * 100 }
    if (queries.to) queries.price = { lte: Number(queries.to) * 100 }
    delete queries.to
    delete queries.from
    const q = { ...priceQuery, ...queries };
    fetProductsByCategory(q);
    window.scrollTo(0, 0)
  }, [params, currentPage, category]);


  const changeActiveFitler = useCallback((name) => {
    if (activeClick === name) SetactiveClick(null)
    else SetactiveClick(name)
  }, [activeClick])
  const changeValue = useCallback((value) => {
    setSort(value)
  }, [ setSort])
  useEffect(() => {
    if (sort) {
      const params = new URLSearchParams(location.search);
      params.set('sort', sort);
      navigate({
        pathname: `/${category}`,
        search: params.toString() 
      })
    }
  }, [sort, category, navigate, location.search])
  
  return (
    <div className='w-full'>
      <div className='h-[81px] bg-gray-100 flex justify-center items-center'>
        <div className='w-main m-auto pt-3'>
          <p className='text-[20px] font-medium'>{category}</p>
          <Breadcrumb category={category} />
        </div>
      </div>
      <div className='w-full max-w-[1100px] border p-4 sm:flex  justify-between mt-8 m-auto'>
        <div className='sm:w-4/5  flex items-center gap-4'>
          <span className='font-semibold text-sm'>Filter by</span>
          <div className='flex items-center gap-3'>
            <Seach
              name='price'
              activeClick={activeClick}
              changeActiveFitler={changeActiveFitler}
              type='input'
            />
            <Seach
              name='color'
              activeClick={activeClick}
              changeActiveFitler={changeActiveFitler}
              type='checkbox'
            />
          </div>
        </div>
        <div className='sm:w-1/5 flex sm:flex-col gap-3 mt-2'>
          <span className='font-semibold text-sm'>Sort by:</span>
          <div className=' ml-1'>
            <InputSelect changeValue={changeValue} value={sort} options={sorts} />
          </div>
        </div>
      </div>
      {products?.length !== 0 && <div className='mt-8 w-full mx-auto max-w-[1100px]'>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column">
          {products?.map(el => (
            <Product
              key={el._id}
              pid={el._id}
              productData={el}
              normal={true} />
          ))}
        </Masonry>
      </div>}
      {products?.length === 0 && <div className='mt-8 w-full mx-auto max-w-[1100px] text-center min-h-[400px]'>
        <p>không tìm thấy sản phẩm !!!</p>
        </div>}
      {products?.length > 0 &&
        <div className=' w-full m-auto my-4 flex justify-end'>
          <Pagination
            totalCount={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>}
    </div>

  )
}

export default Products