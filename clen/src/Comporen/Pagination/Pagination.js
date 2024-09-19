import ReactPaginate from 'react-paginate';
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa";
const Pagination = ({ totalCount, currentPage, onPageChange }) => {
  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    if (newPage !== currentPage) { // Chỉ thay đổi nếu trang mới khác với trang hiện tại
      onPageChange(newPage);
    }
  };

  return (
    <ReactPaginate
      previousLabel={<FaAngleLeft />}
      nextLabel={<FaAngleRight />}
      breakLabel={'...'}
      pageCount={totalCount} // Số lượng trang tổng
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={handlePageClick}
      containerClassName={'pagination'}
      activeClassName={'active'}
      forcePage={currentPage - 1} // Để đảm bảo trang hiện tại được highlight
    />
  );
};


export default Pagination;


// import React from 'react';
// import usePagination from '../../Hooks/usePagination';
// import PagiItem from './PagiItem';
// import { useSearchParams} from 'react-router-dom';


// const Pagination = ({ totalCount }) => {
//   const [params] = useSearchParams();
//   const pagination = usePagination(totalCount, 2);

//   const range = () => {
//     const currentPage = +params.get('page')
//     const pageSize = +process.env.REACT_APP_LIMIT || 10;
//     const start = ((currentPage - 1) * pageSize) + 1;
//     const end = Math.min(currentPage * pageSize, totalCount);
//     return `${start} - ${end}`;
//   };

 

//   return (
//     <div className='flex justify-between items-center'>
//       {!+params.get('page') && 
//         <span className='text-sm italic'>
//           {`Show products 1 - ${Math.min(+process.env.REACT_APP_LIMIT, totalCount) || 10} of ${totalCount}`}
//         </span>
//       }
//       {+params.get('page') && (
//         <span className='text-sm italic'>{`Show products ${range()} of ${totalCount}`}</span>
//       )}
//       <div className='flex items-center'>
//         {pagination?.map((el, index) => (
//           <PagiItem key={index}>
//             {el}
//           </PagiItem>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Pagination;
