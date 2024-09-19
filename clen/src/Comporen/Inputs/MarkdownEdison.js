// src/components/Editor.js
import React, { memo } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MarkdownEdison = ({ invalidFields, setInvalidFields, label, name, value, changeValue, setIsFocusDescription }) => {

    return (
        <div className='flex flex-col '>
            <span className='mb-1'>{label}</span>
            <Editor
                apiKey="7i1tkevpjd16czb6d6k2uwebbcpy35w9u24cx438umrhj4ay"
                value={value}
                init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                        'advlist autolink lists link image charmap preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                         alignleft aligncenter alignright alignjustify | \
                         bullist numlist outdent indent | removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onChange={e => changeValue(prev => ({ ...prev, [name]: e.target.getContent() }))}
                onFocus={() => {
                    setInvalidFields && setInvalidFields([])
                    setIsFocusDescription &&  setIsFocusDescription(true)
                }}
               
            />
            {invalidFields?.some(el => el.name === name) && <small className='text-main text-sm'>{invalidFields?.find(el => el.name === name)?.mess}</small>}
        </div>
    );
};

export default memo(MarkdownEdison);
