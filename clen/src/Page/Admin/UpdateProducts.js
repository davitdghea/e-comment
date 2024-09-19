import { InputFrom, MarkdownEdison, Select,Button, Loading } from 'Comporen/Index'
import React, { memo, useCallback, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { getBase64, validate } from 'Ultils/Hellpers'
import { IoTrashBinSharp } from 'react-icons/io5'
import { useSelector, useDispatch } from 'react-redux'
import { apiUpdateProduct } from 'Apis/Products'
import { ShowModal} from 'St/App/Appslice'

const UpdateProducts = ({ editProduct, render, setEditProduct }) => {
   
    const { handleSubmit,watch, register, formState: { errors }, reset } = useForm()
    const { categories } = useSelector(state => state.app)
    const dispatch = useDispatch()
    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })
   
    useEffect(()=>{
        reset({
            title:editProduct?.title || '',
            price: editProduct?.price || '',
            quantity: editProduct?.quantity || '',
            color: editProduct?.color || '',      
            category: editProduct?.category || '',
            brand: editProduct?.brand.toLowerCase() || '',
        })
        setPreview({
            thumb: editProduct.images[0] || '',
            images: editProduct?.images || []
        })
        setPayload({description: typeof editProduct?.description === 'object' ? editProduct?.description?.join(',') : editProduct?.description })
    },[editProduct])
    const [payload, setPayload] = useState({
        description: ''
    })
    const [isFocusDescription, setIsFocusDescription] = useState(false);
    const [invalidFields, setInvalidFields] = useState([])
    const changeValue = useCallback((e) => {
        setPayload(e);
    }, [payload]);
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
            imgPreview.push(base64)
        }
        setPreview(prev => ({ ...prev, images: imgPreview }))
    }
    useEffect(() => {
        const thumbFile  = watch('thumb')
        if (watch('thumb') instanceof FileList && watch('thumb').length > 0) {
            handlePreviewThumb(thumbFile[0]);
        }
    }, [watch('thumb')]);

    useEffect(() => {
       const images = watch('images')
        if (watch('images') instanceof FileList && watch('images').length > 0) {
            handlePreviewImg(images);
        }
    }, [watch('images')]);



    const handleUpdateProduct = async (data) => {
        const invalids = validate(payload, setInvalidFields)
        if (invalids === 0) {
            if (data.category)
            { data.category = categories?.find(el => el.title === data.category)?.title }
             
            const finalPayload = { ...data, ...payload,... data.category }
            const formData = new FormData()
            for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
            
                if (finalPayload?.thumb) formData.append('thumb',data?.thumb?.length === 0 ? preview.thumb : finalPayload.thumb[0])
            if (finalPayload.images) {
               const images = finalPayload?.image?.length === 0 ? preview.images : finalPayload.images
                for (let image of images) formData.append('images', image)
            }
            dispatch(ShowModal({ isShowModal: true, moDalChildren: <Loading /> }))
            const response = await apiUpdateProduct(formData,editProduct._id)
            dispatch(ShowModal({ isShowModal: false, moDalChildren: null }))
            if (response.success) {
                toast.success(response.mes)
                render()
                setEditProduct(null)
                
            } else toast.error(response.mes)
        }


    }
    return (
        <div className='w-full flex flex-col gap-4 relative bg-slate-200'>
        <div className='h-[69px] w-full'></div>
        <div className='p-4 border-b w-full bg-gray-100 flex justify-between items-center fixed top-0 z-50'>
            <h1 className='text-2xl font-bold tracking-tight'>UpdateProducts</h1>
        </div>
            <div className='p-4 '>
                <form onSubmit={handleSubmit(handleUpdateProduct)}>
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
                    <div className='w-full my-6 flex gap-2'>
                        <InputFrom
                            label="Price"
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
                            type='text'

                        />
                    </div>
                    <div className='w-full my-6 flex gap-4'>
                        <Select
                            errors={errors}
                            label="Category"
                            options={categories?.map(el => ({ code: el.title, value: el.title }))}
                            register={register}
                            id='category'
                            style='flex-auto'
                            validate={{ required: "Need fill this field" }}
                            fullWidth

                        />
                        <Select
                            errors={errors}
                            label="Brand (Option)"
                            options={categories?.find(el => el.title.toLowerCase() == watch('category'))?.brand?.map(el => ({ code: el, value: el }))}
                            register={register}
                            id='brand'
                            style='flex-auto'
                            validate={{ required: "Need fill this field" }}
                            fullWidth

                        />
                    </div>
                    <MarkdownEdison
                        value={payload.description}
                        name='description'
                        changeValue={changeValue}
                        label="Description"
                        setIsFocusDescription={setIsFocusDescription}
                        invalidFields={invalidFields}
                    />
                    <div className='flex flex-col gap-2 my-2'>
                        <label className='font-semibold' htmlFor='thumb'>Upload thumb</label>
                        <input
                            type='file'
                            id='thumb'
                            {...register('thumb')}
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
                            {...register('images')}

                        />
                        {errors['images'] && <small className=''>{errors['images']?.message}</small>}
                    </div>

                    {preview?.images.length > 0 && <div className='my-4 flex '>
                        {preview.images?.map((el, idx) => (
                            <div
                                key={idx}
                
                                className='w-fit relative mx-1 '>
                                <img key={idx} src={el} alt='product' className='cursor-pointer w-[200px] object-contain' />
                               
                            </div>
                        ))}
                    </div>}
                    <div className=' flex justify-end'>
                        <button className='bg-red-500 px-5 py-2 rounded-lg text-white' onClick={()=>setEditProduct(null)}>Cancel</button>  
                        <Button style='bg-blue-500 text-white ml-5 px-3 rounded-lg' type='submit'>Update product</Button>             
                    </div>
                </form>
            </div>
    </div>
  )
}

export default memo(UpdateProducts)