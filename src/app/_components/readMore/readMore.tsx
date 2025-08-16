import { useState } from 'react';
import "../../../style/style.css"

const ReadMore = ({ text, maxLength }: any) => {
  const [isReadMore, setIsReadMore] = useState(true);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <div className='mt-2'>
      <span className='text-[1rem] text-black whitespace-pre-wrap break-words'>
        {isReadMore ? text.slice(0, maxLength) : text}
        {text.length > maxLength && (
          <h6 onClick={toggleReadMore} style={{ color: 'blue', cursor: 'pointer' }}>
            {isReadMore ? '... Ler mais' : ' Mostrar menos'}
          </h6>
        )}
      </span>
    </div>
  );
};

export default ReadMore;