import React from 'react'

const InputSelect = ({ value, changeValue, options }) => {
    return (
        <select className='from-select text-sm border outline-none' value={value} onChange={e => changeValue(e.target.value)}>
           <option value="">ranDom</option>
            {options?.map(el => (
                <option key={el.id} value={el.value}>{el.text}</option>
            ))}
        </select>
    )
}

export default InputSelect