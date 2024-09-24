import { apiAddVarriant, apiCreateProduct } from 'Apis/Products'
import { Button, InputFrom, Loading } from 'Comporen/Index'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { ShowModal } from 'St/App/Appslice'
import Swal from 'sweetalert2'
import { getBase64 } from 'Ultils/Hellpers'

const Variants = ({ customzeVarriant, setCustomzeVarriant, render }) => {
    const [preview,setPreview] = useState({
        thumb:"",
        images:''
    })
    const dispatch = useDispatch()
    const { register, watch, formState: { errors }, handleSubmit, reset } = useForm()
    useEffect(()=>{
        reset({
            title:customzeVarriant?.title || '',
            color: customzeVarriant?.color || '',
            price: customzeVarriant?.price || '',
        })
    },[customzeVarriant])
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
  
    const handleAddVarriant = async(data) =>{
        if (data.color === customzeVarriant?.color) Swal.fire('Oops!', 'Color not changed','into' )
        else {
            const formData = new FormData()
            for (let i of Object.entries(data)) formData.append(i[0], i[1])
            if (data?.thumb) formData.append('thumb', data.thumb[0])
            if (data.images) {
                for (let image of data.images) formData.append('images', image)
            }
            dispatch(ShowModal({ isShowModal: true, moDalChildren: <Loading /> }))
            const response = await apiAddVarriant(formData,customzeVarriant._id)
            dispatch(ShowModal({ isShowModal: false, moDalChildren: null }))
       if(response.success){
        toast.success(response.mes)
        reset()
            setPreview()
       }
        }
        }
    useEffect(() => {

        if (watch('thumb') instanceof FileList && watch('thumb').length > 0) {
            handlePreviewThumb(watch('thumb')[0]);
        }

    }, [watch('thumb')]);

    useEffect(() => {
        if (watch('images') instanceof FileList && watch('images').length > 0) {
            handlePreviewImg(watch('images'));
        }
    }, [watch('images')]);
    return (
        <div className='w-full h-full flex flex-col gap-4 relative bg-slate-200'>
            <div div className='h-[69px] w-full' ></div>
            <div className='p-4 border-b w-full max-w-[1360px] bg-gray-100 flex justify-between items-center fixed top-0 z-50'>
                <h1 className='text-2xl font-bold tracking-tight w-200px'>Variants</h1>
                <span
                    onClick={() => { setCustomzeVarriant(null) }}>
                    Cancel
                </span>
            </div>
            <form onSubmit={handleSubmit(handleAddVarriant)}>
                <div className='ml-5 w-main'>
                    <InputFrom
                        label="Name product"
                        register={register}
                        errors={errors}
                        id="title"
                        
                        validate={{
                            required: "Need fill this field"
                        }}
                        placeholder='title of new product'
                        style='flex-auto'
                    />
                    
                </div>
                <div className='flex flex-col gap-4 ml-5'>
                    <div className='flex'>
                        <InputFrom
                            label="Price product"
                            register={register}
                            errors={errors}
                            id="price"
                            validate={{
                                required: "Need fill this field"
                            }}
                            fullWidth
                            placeholder='Price of new product'
                            style='flex-auto'
                            type='number'
                        />
                        <InputFrom
                            label="Color product"
                            register={register}
                            errors={errors}
                            id="color"
                            validate={{
                                required: "Need fill this field"
                            }}
                            fullWidth
                            placeholder='Color of new product'
                            style='flex-auto ml-2'
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
                            <div 
                                key={idx}
                                
                                className='w-fit relative mx-1 '>
                                <img key={idx} src={el} alt='product' className='cursor-pointer w-[200px] object-contain' />
                                
                            </div>
                        ))}
                    </div>}
                    <div><Button type='submit'>Create new product</Button></div>
                </div>
            </form>
        </div>
    )
}

export default Variants