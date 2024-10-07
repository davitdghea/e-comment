import { memo, useState } from "react"
import React from 'react'
import { renderStarFromNumber } from 'Ultils/Hellpers'
import { Workbar, Button, Comment } from "Comporen/Index"
import { tabs } from "Ultils/DataFormate"
import { apiRatings } from "Apis/Products"
import { useDispatch, useSelector } from "react-redux"
import { ShowModal } from 'St/App/Appslice'
import Swal from "sweetalert2"
import path from "Ultils/Path"
import { useNavigate } from "react-router-dom"
import VoteOptions from "Comporen/Vote/VoteOptions"

const ProductInFormate = ({ rerender, totalRatings, ratings, nameProduct, pid }) => {
  const navigate = useNavigate()
  const [activetion, setActivetion] = useState(1)
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector(state => state.user)
  const handleSubmitVoteOption = async ({ comment, score }) => {
    if (!comment || !pid || !score) {
      alert("please vote when click submit")
      return
    }
    await apiRatings({ star: score, comment, pid, updatedAt: Date.now() })
    rerender()
    dispatch(ShowModal({ isShoModal: false, moDalChildren: null }))
  }

  const handleVoteNow = () => {
    if (!isLoggedIn) {
      Swal.fire({
        text: "Login to vote!",
        cancelButtonText: "Cancel",
        confirmButtonText: "Go login",
        showCancelButton: true,
        title: "Oops!",
      }).then((rs) => {
        if (rs.isConfirmed) navigate(`/${path.LOGIN}`)
      })
    } else {
      dispatch(ShowModal({
        isShowModal: true,
        moDalChildren:
          <VoteOptions
            nameProduct={nameProduct}
            handleSubmitVoteOption={handleSubmitVoteOption}
          />
      })
      )
    }
  }

  return (
    <div >
      <div className="shadow-xl w-full mt-[20px] border min-h-[420px] rounded-xl">
        <div className="flex items-center gap-2 relative bottom-[-1px] ml-[13px] mt-[10px]">
          {tabs.map(el => (
            <span
              onClick={() => { setActivetion(el.id) }}
              className={`py-2 text-[10px] px-2 sm:px-4 ${activetion === el.id ? "bg-white border border-b-0" : "bg-gray-200"}`}
            >
              {el.name}
            </span>
          ))}

        </div>
        <div className=" p-4  border mb-[20px] min-h-[380px] w-[98%] mx-auto ">
          {tabs.filter(el => el.id === activetion).map(el => (
            <p className="p-2">{el.content}</p>
          ))}


        </div>
      </div>

      <div className="flex flex-col pb-8 w-full sm:max-w-[1360px] shadow-xl rounded-xl mt-[20px] sm:mt-[80px] border">
        <span className={`py-2  px-4  bg-[#f7f7f7] `}>
          CUSTOMER REVIEW
        </span>
        <div className="flex w-[98%] mx-auto mt-[10px]">
          <div className="w-4/12 flex flex-col items-center justify-center border border-red-500">
            <span className="font-semibold text-3xl">{`${totalRatings}/5`}</span>
            <span className="flex items-center gap-1">{renderStarFromNumber(totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}</span>
            <span className="text-sm">{`${ratings?.length} reviewer and commetntors`}</span>
          </div>
          <div className="w-8/12 flex flex-col gap-4 border p-4">
            {Array.from(Array(5).keys()).reverse().map(el => (
              <Workbar
                key={el}
                number={el + 1}
                ratingsTotal={ratings?.length}
                ratingCount={ratings?.filter(i => i.star === el + 1)?.length}
              />
            ))}
          </div>
        </div>
        <div className="p-4 flex items-center justify-center text-sm flex-col gap-2">
          <span>Do you review this products?</span>
          <Button
            handleOnclick={() => handleVoteNow()}
          >
            Vote now!
          </Button>
        </div>
        <div className="flex flex-col gap-4 border w-[97%] m-auto rounded-xl">
          {ratings?.map(el => (
            <Comment
              key={el._id}
              content={el.comment}
              updatedAt={el.updatedAt}
              star={el.star}
              name={el?.postedBy?.lastname && el?.postedBy?.firstname ? `${el.postedBy.lastname} ${el.postedBy.firstname}` : "ẩn danh"} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(ProductInFormate)