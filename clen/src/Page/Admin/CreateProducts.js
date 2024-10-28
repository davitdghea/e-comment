import React, { useCallback, useEffect, useState } from 'react'
import { MarkdownEdison,Loading, InputFrom, Select, Button } from 'Comporen/Index'
import { useForm } from 'react-hook-form'
import { useSelector,useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { getBase64, validate } from 'Ultils/Hellpers'
import { IoTrashBinSharp } from 'react-icons/io5'
import { apiCreateProduct } from 'Apis/Products'
import { ShowModal} from 'St/App/Appslice'
const CreateProducts = () => {
  const { categories } = useSelector(state => state.app)
  const { register, formState: { errors }, reset, handleSubmit, watch } = useForm();
const dispatch = useDispatch()
  const [preview, setPreview] = useState({
    thumb: null,
    images: []
  })
  const [payload, setPayload] = useState({
    description:''
  })
  const [invalidFields, setInvalidFields] = useState([])
  const changeValue = useCallback((e) => {
    setPayload(e);
  }, [payload]);
  const [hoverElm, setHoverElm] = useState(null)
  const handlePreviewThumb = async (file) => {
    const Base64Thumb = await getBase64(file)
    setPreview(prev => ({ ...prev, thumb: Base64Thumb }))
  }
  const handlePreviewImg = async (files) => {
    const imgPreview = []
    for (let file of files) {
      if (file.type !== 'image/png' && file.type !== "image/jpeg") {
        toast.warning('File not supported!')
        return
      }
      const base64 = await getBase64(file)
      imgPreview.push({ name: file.name, path: base64 })
    }
    setPreview(prev => ({ ...prev, images: imgPreview }))
  }
  useEffect(() => {
  
    const thumbFile = watch('thumb');


    if (thumbFile && thumbFile.length > 0) {
      handlePreviewThumb(thumbFile[0]);
    }
  }, [watch('thumb')]);

  useEffect(() => {

    const images = watch('images');


    if (images && images.length > 0) {
      handlePreviewImg(images);
    }
  }, [watch('images')]);


  const handleCreateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields)

    if (invalids === 0) {

        {data.category = categories?.find(el => el._id === data.category)?.title}
      const finalPayload = { ...data, ...payload }
      const formData = new FormData()
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
      if (finalPayload?.thumb) formData.append('thumb', finalPayload.thumb[0])
      if (finalPayload.images) {
        for (let image of finalPayload.images) formData.append('images', image)
      }
      dispatch(ShowModal({ isShowModal: true, moDalChildren:<Loading/>}))
      const response = await apiCreateProduct(formData)
      dispatch(ShowModal({ isShowModal: false, moDalChildren: null }))
      if(response.success) {
        toast.success(response.mes)
        reset()
        setPayload({
          thumb:'',
          image:[]
        })
      } else toast.error(response.mes)
    }


  }
  const handleRemoteImg = (name) => {
    const files = [...watch('images')]
    reset({
      images: files?.filter(el => el.name !== name)
    })

    if (preview.images?.some(el => el.name === name)) setPreview(prev => ({ ...prev, images: prev.images?.filter(el => el.name !== name) }))
  }
  return (
    
    <div>
      <div className='p-4 border-b w-full bg-gray-100 flex justify-between items-center fixed top-0 z-20 '>
        <h1 className='text-2xl font-bold tracking-tight w-200px ml-10 sm:ml-2'>CreateProducts</h1>
      </div>
     
      <div className='p-4 mt-14'>
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputFrom
            style='flex-1'
            label="Name product"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: 'Need fill this field'
            }}
            placeholder='Name of new product'
            fullWidth

          />
          <div className='w-full my-6 flex flex-col  gap-2'>
            <InputFrom
              label="Price (nhập hai số thập thân VD: 14 000 000 là 1400000000)"
              register={register}
              errors={errors}
              id="price"
              validate={{
                required: 'Need fill this field'
              }}
              placeholder='Price of new product'
              style='flex-auto'
              type='number'

            />
            <InputFrom
              label="Quantity"
              register={register}
              errors={errors}
              id="quantity"
              validate={{
                required: 'Need fill this field'
              }}
              placeholder='Quantity of new product'
              style='flex-auto'
              type='number'

            />
            
          </div>
         <div className='w-full my-6 flex gap-4'>
             <Select
              errors={errors}
              label="Category"
              options={categories?.map(el => ({ code: el._id, value: el.title }))}
              register={register}
              id='category'
              style='flex-auto'
              validate={{ required: "Need fill this field" }}
              fullWidth

            /> 
            <Select
              errors={errors}
              label="Brand (Option)"
              options={categories?.find(el => el._id === watch('category'))?.brand?.map(el => ({ code: el, value: el }))}
              register={register}
              id='brand'
              style='flex-auto'
              validate={{ required: "Need fill this field" }}
              fullWidth

            />
          </div>
          <MarkdownEdison
            name='description'
            changeValue={changeValue}
            label="Description"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <div className='mt-5'>
            <InputFrom
              label="Color"
              register={register}
              errors={errors}
              id="color"
              validate={{
                required: 'Need fill this field'
              }}
              placeholder='Color of new product'
              style='flex-auto'
              type='color'
            />
          </div>
          
          <div className='flex flex-col gap-2 my-2'>
            <label className='font-semibold' htmlFor='thumb'>Upload thumb</label>
            <input
              type='file'
              id='thumb'
              {...register('thumb', { required: 'need fill' })}
            />
            {errors['thumb'] && <small className=''>{errors['thumb']?.message}</small>}
          </div>
          {preview?.thumb && <div className='my-4'>
            <img src={preview.thumb} alt='thumbnail' className='w-[200px] ' />
          </div>}
          <div className='flex flex-col gap-2 mb-2'>
            <label className='font-semibold' htmlFor='product'>Upload images of product</label>
            <input
              type='file'
              id='products'
              multiple
              {...register('images', { required: 'need fill' })}

            />
            {errors['images'] && <small className=''>{errors['images']?.message}</small>}
          </div>
          
           {preview?.images.length > 0 && <div className='my-4 flex '>
            {preview.images?.map((el, idx) => (
              <div onMouseEnter={() => setHoverElm(el.name)}
                key={idx}
                onMouseLeave={() => setHoverElm(null)}
                className='w-fit relative mx-1 '>
                <img key={idx} src={el.path} alt='product' className='cursor-pointer w-[200px] object-contain' />
                {hoverElm === el.name && <div className='absolute top-0 right-0'
                  onClick={() => handleRemoteImg(el.name)}>
                  <IoTrashBinSharp size={24}/>
                </div>}
              </div>
            ))}
          </div>}
          <div><Button type='submit'>Create new product</Button></div>
        </form>
      </div>
    </div>
  )
}

export default CreateProducts