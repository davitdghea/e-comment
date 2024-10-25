import React, { memo, useEffect, useRef, useState } from 'react';
import { voteOptions } from '../../Ultils/Contants';
import { AiFillStar } from 'react-icons/ai';
import Button from '../Button/Button';

const VoteOptions = ({ nameProduct, handleSubmitVoteOption }) => {
  const modalRef = useRef();
  const [chosenScore, setChosenScore] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    modalRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, []);

  return (
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
      <h2 className='text-center text-medium text-lg'>{`Voting the product ${nameProduct}`}</h2>
      <textarea
        className='h-[150px] mt-[10px] form-textarea w-full border'
        value={comment}
        onChange={e => setComment(e.target.value)}
      ></textarea>
      <p className='flex items-center justify-center text-[20px] mt-[10px]'>
        How do you like this product
      </p>
      <div className='flex items-center cursor-pointer gap-4 justify-center'>
        {voteOptions.map(el => (
          <div
            key={el.id}
            className='w-[60px] h-[60px] flex items-center justify-center flex-col gap-2 my-[20px]'
            onClick={() => setChosenScore(el.id)}
          >
            <AiFillStar
              color={chosenScore >= el.id ? 'orange' : 'gray'}
              size={40}
            />
            <span>{el.text}</span>
          </div>
        ))}
      </div>
      <Button handleOnclick={() => handleSubmitVoteOption({ comment, score: chosenScore })} fw>
        Submit
      </Button>
    </div>
  );
};

export default memo(VoteOptions);

