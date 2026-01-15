import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReadMoreProps {
  text: string;
  maxLength: number;
  className?: string;
}

const ReadMore = ({ text, maxLength, className = '' }: ReadMoreProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const displayText = isExpanded ? text : `${text.slice(0, maxLength)}...`;
  const canExpand = text.length > maxLength;

  return (
    <div className={`${className}`}>
      <div className="text-gray-600 text-sm leading-relaxed">
        {displayText}
      </div>
      
      {canExpand && (
        <button
          onClick={toggleExpand}
          className="mt-2 flex items-center text-sm font-medium text-[#8609A3]  transition-colors"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Mostrar menos' : 'Ler mais'}
        >
          {isExpanded ? 'Mostrar menos' : 'Ler mais'}
          <motion.span
            className="ml-1 inline-block"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.span>
        </button>
      )}
    </div>
  );
};

export default ReadMore;