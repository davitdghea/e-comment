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
const ManageProducts = () => {
  const [customzeVarriant, setCustomzeVarriant] = useState(null)
  const [params] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { register, watch, formState: { errors }, handleSubmit, reset } = useForm()
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
    if (queriesDebounce) queries.q = queriesDebounce
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
        else toast.errors(response.mes)
     render()
      }
    })

  }
  return (
    <div className='w-full flex flex-col gap-4 relative'>
      {editProduct && <div className='absolute inset-0 min-h-screen '>
        <UpdateProducts
          editProduct={editProduct}
          render={render}
          setEditProduct={setEditProduct}
        />
      </div>
      }
      {customzeVarriant && <div className='absolute inset-0 min-h-screen '>
        <Variants
          customzeVarriant={customzeVarriant}
          render={render}
          setCustomzeVarriant={setCustomzeVarriant}
        />
      </div>
      }
      <div className='px-2 flex-col border-b w-full flex justify-between '>
        <h1 className='text-2xl font-bold tracking-tight'>ManageProducts</h1>
      </div>
      <div>
        <div className='p-4 flex w-full justify-end items-center'>
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
              <tr className='border-b pb-5'>
                <th className='text-center'>Order</th>
                <th>thumb</th>
                <th>Title</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Sold</th>
                <th>Color</th>
                <th>Rating</th>
                <th>Variants</th>
                <th>UpdateAt</th>
                <th>Actions</th>
              </tr>

            </thead>
            <tbody>
              {products?.map((el, idx) => (
                <tr key={el._id} className='border-b py-2'>
                  <td className='text-center'>{idx + 1}</td>
                  <td>
                    <img src={el.images[0]} alt='thumb' className='w-10 h-14 object-cover py-2' />
                  </td>
                  <td>{el.title}</td>
                  <td>{el.brand}</td>
                  <td>{el.category}</td>
                  <td>{el.price}</td>
                  <td>{el.quantity}</td>
                  <td>{el.soId}</td>
                  <td>{el.color}</td>
                  <td>{el.totalRatings}</td>
                  <td>{el?.Variants?.length}</td>
                  <td>{moment(el.updatedAt).format('DD/MM/YYYY')}</td>
                  <td>
                    <span onClick={() => setEditProduct(el)} className='text-orange-500 mr-5'>Edit</span>
                    <span onClick={() => handleDeleteProduct(el._id)} className='text-red-500'>Delete</span>
                    <span onClick={() => setCustomzeVarriant(el)} className='text-red-500'>Variants</span>
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