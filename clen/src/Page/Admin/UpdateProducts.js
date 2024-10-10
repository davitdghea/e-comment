import { InputFrom, MarkdownEdison, Select,Button, Loading } from 'Comporen/Index'
import React, { memo, useCallback, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { getBase64, validate } from 'Ultils/Hellpers'
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
    const [payload, setPayload] = useState({
        description: ''
    })
    useEffect(()=>{
        reset({
            title:editProduct?.title || '',
            price: editProduct?.price || '',
            quantity: editProduct?.quantity || '',
            color: editProduct?.color || '',      
            category: editProduct?.category || '',
            brand: editProduct?.brand || '',
        })
        setPreview({
            thumb: editProduct.thumb || '',
            images: editProduct?.images || []
        })
        setPayload({description: typeof editProduct?.description === 'object' ? editProduct?.description?.join(',') : editProduct?.description })
    },[editProduct])
    
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
            imgPreview.push({ name: file.name, path: base64 })
        }
        setPreview(prev => ({ ...prev, images: imgPreview }))
    }
    useEffect(() => {
        const thumbFile  = watch('thumb')
        if (thumbFile && thumbFile.length > 0) {
            handlePreviewThumb(thumbFile[0]);
        }
    }, [watch('thumb')]);

    useEffect(() => {
       const images = watch('images')
        if (images && images.length > 0) {
            handlePreviewImg(images);
        }
    }, [watch('images')]);


    
    const handleUpdateProduct = async (data) => {
        const invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            if (data.category) {
                data.category = categories?.find(el => el.title === data.category)?.title;
            }
            const finalPayload = { ...data, ...payload };
            const formData = new FormData();
            for (let [key, value] of Object.entries(finalPayload)) {
                if (key !== 'images' && key !== 'thumb') {
                    formData.append(key, value);
                }
            }          
            if (finalPayload?.thumb?.length > 0) {  
                formData.append('thumb', finalPayload.thumb[0]);
            } else {
                formData.append('thumb', preview.thumb);
            }
            if (finalPayload?.images?.length > 0) {
                
                for (let img of finalPayload.images) {
                    formData.append('images', img);
                }
            } else {            
                for (let img of preview.images) {
                    formData.append('images', img);
                }
            }
            dispatch(ShowModal({ isShowModal: true, moDalChildren: <Loading /> }));        
            const response = await apiUpdateProduct(formData, editProduct._id);
            dispatch(ShowModal({ isShowModal: false, moDalChildren: null }));
            if (response.success) {
                toast.success(response.mes);
                render();
                setEditProduct(null);
            } else {
                toast.error(response.mes);
            }
        }
    };

    return (
        <div className='w-full flex flex-col gap-4 relative bg-slate-200'>
        <div className='h-[69px] w-full'></div>
        <div className='p-4 border-b w-full bg-gray-100 flex justify-between items-center fixed top-0 z-50'>
            <h1 className='text-2xl font-bold tracking-tights sm:ml-0 ml-10'>UpdateProducts</h1>
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
                    <div className='w-full my-6 sm:flex gap-2 block'>
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
                            type='color'

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
                            options={categories?.find(el => el.title == watch('category'))?.brand?.map(el => ({ code: el, value: el }))}
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
                                className='w-fit relative mx-1 flex flex-wrap'>
                                <img key={idx} src={el} alt='product' className='cursor-pointer w-[200px] object-contain' onError={(e) => e.target.src = el.path} />
                               
                            </div>
                        ))}
                    </div>}
                    <div className=' flex justify-end'>
                        <button className='bg-red-500 px-5 py-2 rounded-lg text-white' onClick={()=>setEditProduct(null)}>Cancel</button>  
                        <Button Style='bg-blue-500 text-white ml-5 px-3 rounded-lg' type='submit'>Update product</Button>             
                    </div>
                </form>
            </div>
    </div>
  )
}

export default memo(UpdateProducts)