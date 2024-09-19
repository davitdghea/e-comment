import React from 'react';
import clsx from 'clsx';
import { createSearchParams, useSearchParams, useNavigate, useParams } from 'react-router-dom';

const PagiItem = ({ children }) => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [params] = useSearchParams();

  const handlePagination = () => {
    let param = [];
    for (let i of params.entries()) param.push(i);
    const queries = {};
    for (let i of param) queries[i[0]] = i[1];

    if (Number(children)) queries.page = children;

    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString(),
    });
  };

  return (
    <button
      type="button"
      onClick={handlePagination}
      className={clsx(
        'px-3 py-1 mx-1 bg-gray-500 rounded-full',
        !Number(children) && 'items-end',
        Number(children) && 'items-center',
        +params.get('page') === +children && 'rounded-full bg-slate-300',
        !+params.get('page') && +children === 1 && 'rounded-full bg-gray-300' // Kiểm tra khi không có `page`
      )}
      disabled={!Number(children)}
    >
      {children}
    </button>
  );
};

export default PagiItem;
