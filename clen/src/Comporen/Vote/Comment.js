import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { IoPersonCircleOutline } from "react-icons/io5";
import { renderStarFromNumber } from 'Ultils/Hellpers';
import { useSelector } from 'react-redux';
import { apiupdateReplist } from 'Apis/Products';
import { Button } from 'Comporen/Index';

const CommentList = ({ comments, pid, }) => {
    const [visibleComments, setVisibleComments] = useState(2); 

    const showMoreComments = () => {
        setVisibleComments(prev => prev + 5); 
    };
    const showLessComments = () => {
        setVisibleComments(2); 
    };
    const sortedComments = [...comments].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
   
    return (
        <div className='flex flex-col justify-center '>
            {sortedComments.slice(0, visibleComments).map((comment, index) => (
                <Comment
                    repList={comment.repList}
                    pid={pid}
                    key={index}
                    rid={comment._id}
                    name={comment.name}
                    content={comment.comment}
                    updatedAt={comment.updatedAt}
                    star={comment.star}
                />
            ))}
            {visibleComments < comments.length && (
                <button onClick={showMoreComments} className="mt-4 text-blue-500 ">
                    Xem thêm
                </button>
            )}
            {visibleComments > 2 && (
                <button onClick={showLessComments} className="mt-4 text-blue-500 ml-4">
                    Ẩn bớt
                </button>
            )}
        </div>
    );
};
 
const Comment = ({ name = "Biên Nguyên", content, updatedAt, star, rid, pid, repList }) => {
    const { current } = useSelector(state => state.user)
    const modalRef = useRef();
    console.log(current)
    const [showRep, setShowRep] = useState(false)
    const [contentrep,setContentrep] = useState()
    const [rep, setRep] = useState(false)
    const Replist = async () => {
        const response = await apiupdateReplist({ rid, content: contentrep, pid })
        if (response.success){
            setRep(false)
            setContentrep()
        }
    }
    useEffect(() => {
        if (rep && modalRef.current) {
            modalRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }, [rep]);
    return (
        <div className='gap-4 flex my-2 ml-2 '>
            <div className=' flex-none'>
                {current.avatar !== "" ? <img className='w-[35px] h-[35px] rounded-[50px]' src={current.avatar} alt=''/> : <IoPersonCircleOutline size={35} />}
            </div>
            <div className='flex flex-col flex-auto'>
                <div className='flex justify-between items-center w-[98%]'>
                    <h3 className='font-semibold'>{current.lastname} {current.firstname}</h3>
                    <span>{moment(updatedAt)?.fromNow()}</span>
                </div>
                <div className='flex flex-col gap-2 pl-4 text-sm mt-4 border border-gray-300 py-2 bg-gray-100 w-[98%]'>
                    <span className='flex item-center gap-1'>
                        <span className='font-semibold'>Vote:</span>
                        <span className='flex items-center gap-1'>
                            {renderStarFromNumber(star)?.map((el, index) => (
                                <span key={index}>{el}</span>
                            ))}
                        </span>
                    </span>
                    <span className='flex gap-1'>
                        <span className='font-semibold'>Comment:</span>
                        <span className='flex items-center gap-1'>
                            {content}
                        </span>
                    </span>
                    
                </div>
                 <div className='flex'>
                    {current.role === '1945' && <span className='text-[10px] cursor-pointer hover:underline' onClick={() => setRep(true)}>Rep list</span>}
                    {repList.length > 0 && <span className='text-[10px] ml-5 cursor-pointer hover:underline' onClick={() => setShowRep(!showRep)}>Show rep</span>}
                </div>
                {showRep && (repList.length > 0 && <div>
                    
                {repList.map(el => (
                    <div className='flex w-full'>
                        <div className=' flex-none'>
                            <IoPersonCircleOutline size={35} />
                        </div>
                        <div className='ml-5 w-full'>
                            <div className='flex justify-between items-center w-[98%]'>
                                <h3 className='font-semibold'>Admin</h3>
                                <span>{moment(el.updatedAt)?.fromNow()}</span>
                            </div>
                            <div className='flex flex-col gap-2 pl-4 text-sm my-4 border border-gray-300 py-2 bg-gray-100 w-[98%]'>
                                <span className='flex gap-1'>
                                    <span className='font-semibold'>Comment:</span>
                                    <span className='flex items-center gap-1'>
                                        {el.comment}
                                    </span>
                                </span>

                            </div>
                        </div>
                    </div>
                    
                ))
                
                }
            </div>)}
            </div>
            {rep && <div onClick={() => setRep(false)} className='absolute flex justify-center items-center bg-overlay top-0 bottom-0 left-0 right-0'>
                <div
                    onClick={e => e.stopPropagation()}
                    ref={modalRef}
                    className='bg-white w-[700px] rounded-md p-4 flex-col h-[500px]'
                >
                    <img
                        src="https://ecomall-be87.kxcdn.com/ecomall/wp-content/themes/ecomall/images/logo.png"
                        alt='logo'
                        className='w-[300px] object-contain my-8'
                    />
                    <h2 className='text-center text-medium text-lg'>{`Replist ${name}`}</h2>
                    <textarea
                        className='h-[150px] mt-[10px] form-textarea w-full border'
                        onChange={(e) => setContentrep(e.target.value)} value={contentrep}
                    ></textarea>
                    <Button handleOnclick={() =>  Replist()} fw>
                        Submit
                    </Button>
                </div>
            </div>}
        </div>
    );
};

export default CommentList;
