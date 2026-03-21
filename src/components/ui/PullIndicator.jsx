import React from 'react';
import { RefreshCw } from 'lucide-react';

const PullIndicator = React.forwardRef(function PullIndicator(_, ref) {
  return (
    <div
      ref={ref}
      style={{ transform: 'translateY(0px)', opacity: 0, willChange: 'transform, opacity' }}
      className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none z-40 pt-2 select-none"
      aria-hidden="true"
    >
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-md">
        <RefreshCw className="w-4 h-4 text-primary" />
      </div>
    </div>
  );
});

export default PullIndicator;