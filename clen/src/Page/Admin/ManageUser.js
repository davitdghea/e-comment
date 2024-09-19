import { apiGetUsers, apiUpdate, apiDelete } from 'Apis/User'
import React, { useCallback, useEffect, useState } from 'react'
import { roles, blockStatus } from 'Ultils/Contants'
import moment from 'moment'
import { InputField, Pagination, InputFrom, Select, Button } from 'Comporen/Index'
import useDebounce from 'Hooks/UseDebounce'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import clsx from 'clsx'
import { useSearchParams } from 'react-router-dom'
const ManageUser = () => {
  const { handleSubmit, register, formState: { errors }, reset } = useForm({
    email: '',
    firstname: '',
    lastname: '',
    role: '',
    isBlocked: ''
  })
  const [edit, setEdit] = useState(null)
  const [params] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1); // Số trang hiện tại
  const [totalPages, setTotalPages] = useState(0);   // Tổng số trang
  const [users, setUsers] = useState([])
  const [queries, setQueries] = useState({
    q: ''
  })
  const [update, setUpdate] = useState(false)
  const fetchUser = async (params) => {

    const response = await apiGetUsers({ ...params, page: currentPage, limit: process.env.REACT_APP_LIMIT })
    if (response.success) {
      setUsers(response);
      setTotalPages(Math.ceil(response.counts / process.env.REACT_APP_LIMIT));
    } else {
      setUsers([]);
    }
  }
  const render = useCallback(() => {
    setUpdate(!update)
  }, [update])


  const queriesDebounce = useDebounce(queries.q, 800)
  useEffect(() => {
    const queries = Object.fromEntries([...params])
    if (queriesDebounce) queries.q = queriesDebounce;
    fetchUser(queries);
  }, [queriesDebounce, params, update, currentPage]);
  const handleUpdate = async (data) => {
    const response = await apiUpdate(data, edit?._id)
    if (response.success) {
      render()
      toast.success(response.mes)
      setEdit(null)
    } else toast.error(response.mes)
  }
  const handleDelete = (uid) => {
    Swal.fire({
      title: 'Are you sure...',
      text: "Are you ready remove this user?",
      showCancelButton: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDelete(uid)
        if (response.success) {
          render()
          toast.success(response.mes)

        } else toast.error(response.mes)
      }
    })

  }
  const handleEdit = (user) => {
    setEdit(user)
    reset({
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      isBlocked: user.isBlocked,
    })
  }
  return (
    <div className={clsx('w-full' )}>
      <h1 className='px-4 h-[75px] flex justify-between items-center text-3xl font-bold border-b'>
        <span>ManageUser</span>
      </h1>
      <div className='w-full py-4'>
        <div className='flex justify-end py-4 mr-[25px]'>
          <InputField
            isShowed
            nameKey={"q"}
            value={queries.q}
            placeholder='Tìm kiếm'
            style={'w500'}
            setValue={setQueries}
          />
        </div>
        <form onSubmit={handleSubmit(handleUpdate)}>
          {edit && <div className='ml-[26px] mb-2'><Button type='submit'>Update</Button></div>}
          <table className='table auto mb-6 text-left w-[95%] mx-auto'>
            <thead className='font-bold bg-gray-700 text-[13px] border border-blue-300  text-white'>
              <tr>
                <th className='px-4 py-2'>#</th>
                <th className='px-4 py-2'>Email</th>
                <th className='px-4 py-2'>FirstName</th>
                <th className='px-4 py-2'>LastName</th>
                <th className='px-4 py-2'>Role</th>
                <th className='px-4 py-2'>Status</th>
                <th className='px-4 py-2'>Created At</th>
                <th className='px-4 py-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.producData?.map((el, index) => (
                <tr key={el._id} className='border border-gray-500 '>
                  <td className='py-2 px-4'>{index + 1}</td>
                  <td className='py-2 px-4'>
                    {edit?._id === el._id ?
                      <InputFrom
                        FullWidth
                        placeholder='Email'
                        register={register}
                        errors={errors}
                        id='email'
                        validate={{
                          required: 'Require fill',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        }}
                        defaultValue={edit?.email}
                      />
                      : <span>{el.email}</span>}
                  </td>
                  <td className='py-2 px-4'>
                    {edit?._id === el._id
                      ? <InputFrom
                        FullWidth
                        defaultValue={edit.firstname}
                        register={register}
                        errors={errors}
                        id={'firstname'}
                        validate={{ required: 'Require fill' }}
                      /> :
                      <span>{el.firstname}</span>}
                  </td>
                  <td className='py-2 px-4'>
                    {edit?._id === el._id
                      ? <InputFrom
                        defaultValue={edit.lastname}
                        register={register}
                        errors={errors}
                        FullWidth
                        id={'lastname'}
                        validate={{ required: 'Require fill' }}
                      /> : <span>{el.lastname}</span>}
                  </td>
                  <td className='py-2 px-4'>
                    {edit?._id === el._id
                      ? <Select
                        options={roles}
                        defaultValue={roles.find(role => +role.code === +el.role)?.value}
                        register={register}
                        errors={errors}
                        FullWidth
                        id={'role'}
                        validate={{ required: 'Require fill' }}
                      />
                      : <span>{roles.find(role => +role.code === +el.role)?.value}</span>}</td>
                  <td className='py-2 px-4'>{
                    edit?._id === el._id
                      ? <Select
                        defaultValue={el.isBlocked}
                        register={register}
                        errors={errors}
                        FullWidth
                        id={'isBlocked'}
                        validate={{ required: 'Require fill' }}
                        options={blockStatus}
                      />
                      : <span>{el.isBlocked ? 'Blocked' : 'Active'}</span>}</td>
                  <td className='py-2 px-4'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                  <td>
                    {edit?._id === el._id ? <span onClick={() => { setEdit(null) }} className='px-2 text-orange-600 hover:underline cursor-pointer'>Back</span>
                      : <span onClick={() => { handleEdit(el) }} className='px-2 text-orange-600 hover:underline cursor-pointer mr-4'>Edit</span>}
                    <span onClick={() => { handleDelete(el._id) }} className='px-2 text-red-600 hover:underline cursor-pointer'>Delete</span>
                  </td>
                </tr>

              ))}
            </tbody>

          </table>
        </form>
        <div className='w-full text-center mr-[26px]'>
          <Pagination
            totalCount={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

    </div>
  )
}

export default ManageUser