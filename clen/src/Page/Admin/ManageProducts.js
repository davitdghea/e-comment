import React, { useCallback, useEffect, useState } from 'react'
import { InputFrom, Pagination,Variants } from 'Comporen/Index'
import { useForm } from 'react-hook-form'
import { apiGetProducts, apiDeleteProduct } from 'Apis/Products'
import moment from 'moment'
import useDebounce from 'Hooks/UseDebounce'
import { useSearchParams } from 'react-router-dom'
import UpdateProducts from './UpdateProducts'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { FaEdit } from "react-icons/fa";
import { BiAddToQueue } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
const ManageProducts = () => {
  const [customzeVarriant, setCustomzeVarriant] = useState(null)
  const [params] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { register, watch, formState: { errors } } = useForm()
  const [products, setProducts] = useState(null)
  const [editProduct, setEditProduct] = useState(null)
  const [update, setUpdate] = useState(false)
  const render = useCallback(() => {
    setUpdate(!update)
  })
  const fetchProducts = async (params) => {
    const response = await apiGetProducts({ ...params, page: currentPage })
    if (response.success) {
      setProducts(response.producData)
      setTotalPages(Math.ceil(response.counts / process.env.REACT_APP_PRODUCT_LIMIT));
    } else {
      setProducts([]);
    }
  }
  const queriesDebounce = useDebounce(watch('q'), 800)
  useEffect(() => {
    const queries = Object.fromEntries([...params])
    if (queriesDebounce) queries.title = queriesDebounce
    fetchProducts(queries)
  }, [params, queriesDebounce, currentPage, update])
  const handleDeleteProduct = (pid) => {
    Swal.fire({
      title: "Are you sure",
      text: "Are you sure remote this product",
      icon: "warning", 
      showCancelButton: true
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteProduct(pid)
        if (response.success) toast.success(response.mes)
        else toast.error(response.mes)
     render()
      }
    })

  }
  
  return (
    <div className='w-full flex flex-col gap-4 relative'>
      {editProduct && <div className='absolute inset-0 min-h-screen z-20'>
        <UpdateProducts
          editProduct={editProduct}
          render={render}
          setEditProduct={setEditProduct}
        />
      </div>
      }
      {customzeVarriant && <div className='absolute inset-0 min-h-screen z-20'>
        <Variants
          customzeVarriant={customzeVarriant}
          render={render}
          setCustomzeVarriant={setCustomzeVarriant}
        />
      </div>
      }
      <div className='p-4 border-b w-full max-w-[1360px] bg-gray-100 flex justify-between items-center fixed top-0 z-10'>
        <h1 className='text-2xl font-bold tracking-tight w-200px ml-[45px] sm:ml-0' >ManageProducts</h1>
      </div>
      <div>
        <div className='p-4 flex w-full justify-end items-center mt-10'>
          <form className='w-[45%] outline-none'>
            <InputFrom
              id='q'
              register={register}
              errors={errors}
              fullWidth
              placeholder={'Search products by title,description...'}
            />
          </form>
        </div>
        <from>
          <table className='w-[97%] m-auto text-left'>
            <thead>
              <tr className='border-b  pb-5 text-center sm:grid sm:grid-cols-13 '>
                <th className='sm:grid'>Order</th>
                <th className='sm:grid'>thumb</th>
                <th className='sm:grid'>Title</th>
                <th className='sm:grid  hidden'>Brand</th>
                <th className='sm:grid  hidden'>Category</th>
                <th className='sm:grid  hidden'>Price</th>
                <th className='sm:grid  hidden'>Quantity</th>
                <th className='sm:grid  hidden'>Sold</th>
                <th className='sm:grid  hidden'>Color</th>
                <th className='sm:grid  hidden'>Rating</th>
                <th className='sm:grid  hidden'>Variants</th>
                <th className='sm:grid  hidden'>UpdateAt</th>
                <th className='sm:grid'>Actions</th>
              </tr>

            </thead>
            <tbody>
              {products?.map((el, idx) => (
                <tr key={el._id} className='border-b py-2 sm:grid sm:grid-cols-13 text-center'>
                  <td className='sm:grid mt-5'>{idx + 1}</td>
                  <td className='sm:grid'>
                    <img src={el.thumb} alt='thumb' className='w-10 h-14 object-cover py-2' />
                  </td>
                  <td className='sm:grid text-[12px] mt-3'>{el.title}</td>
                  <td className='sm:grid hidden text-[12px] mt-5'>{el.brand}</td>
                  <td className='sm:grid hidden text-[12px] mt-5'>{el.category}</td>
                  <td className='sm:grid hidden text-[12px] mt-5'>{el.price}</td>
                  <td className='sm:grid hidden text-[12px] mt-5'>{el.quantity}</td>
                  <td className='sm:grid hidden text-[12px] mt-5'>{el.soId}</td>
                  <td className='sm:grid hidden text-[12px] mt-5'>{el.color}</td>
                  <td className='sm:grid hidden text-[12px] mt-5'>{el.totalRatings}</td>
                  <td className='sm:grid hidden text-[12px] mt-5'>{el?.variants?.length}</td>
                  <td className='sm:grid hidden text-[12px] mt-5'>{moment(el.updatedAt).format('DD/MM/YYYY')}</td>
                  <td className='flex items-center ml-4 mt-5 sm:mt-0'>
                    <span onClick={() => setEditProduct(el)} className='text-orange-500 mr-1' title="Edit"><FaEdit/></span>
                    <span onClick={() => handleDeleteProduct(el._id)} className='text-red-500 mr-1' title="Delete"><AiOutlineDelete/></span>
                    <span onClick={() => setCustomzeVarriant(el)} className='text-blue-500' title="Variants"><BiAddToQueue/></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </from>
      </div>
      <div className='w-full text-center mr-[26px] my-[20px]'>
        <Pagination
          totalCount={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  )
}

export default ManageProducts