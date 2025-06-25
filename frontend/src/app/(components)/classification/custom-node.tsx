import React, { memo, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
 
function CustomNode({ data, style  }: any) {
  useEffect(() => { console.log(style)}, [style]);
  return (
    //  
    <div style={{ backgroundColor: data.color }} className={`px-4 py-2 shadow-md rounded-md border-2 border-stone-400 
     dark:border-stone-500 dark:text-white `}>
      <div className="flex">
        {/* <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100">
          {data.emoji}
        </div> */}
        <div className="ml-2">
          <div className="text-lg font-bold">{data.name}</div>
          {/* <div className="text-gray-500">{data.job}</div> */}
        </div>
      </div>
 
      <Handle
        type="target"
        position={Position.Left}
        className="w-16 !bg-teal-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-16 !bg-teal-500"
      />
    </div>
  );
}
 
export default memo(CustomNode);