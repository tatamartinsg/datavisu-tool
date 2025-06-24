import React, { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  ColorMode,
  ConnectionLineType,
} from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';
import { useTheme } from 'next-themes'

import CustomNode from './custom-node';
import DownloadButton from './react-flow/download-button';
import { v4 as uuidv4 } from "uuid";

const spacingY = 80; // Define o espaçamento vertical entre os nós
const nodeX = 250;   // Todos os nós ficarão alinhados à direita nesse x

 
const initNodes = [
  {
    id: '1',
    type: 'custom',
    data: { name: 'Categorias', emoji: '😎' },
    position: { x: 0, y: 50 },
  },
];

const initEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
];

const connectionLineStyle = { stroke: '#fff' };
const snapGrid = [25, 25];
const nodeTypes = {
  custom: CustomNode,
};
const defaultEdgeOptions = {
  animated: true,
  type: 'smoothstep',
};
const defaultViewport = { x: 0, y: 0, zoom: 0.5 };

interface ClassificationInfoProps {
  categories?: Record<string, string[]>;
}
export default function Flow({ categories }: ClassificationInfoProps) {
  const { setTheme, theme  } = useTheme()
  const [colorMode, setColorMode] = useState<ColorMode>('dark');
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
 
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    if(theme){
        const newTheme: ColorMode = theme === 'dark' ? 'dark' : 'light';
        setColorMode(newTheme)
    }
  }, [theme]);

  useEffect(() => {
    console.log("Categories =>", categories)
  }, [categories])

  useEffect(() => {
    if (categories && Object.keys(categories).length > 0) {
      const newNodes = Object.entries(categories).map(([category, items], index) => ({
        id: uuidv4(),
        sourcePosition: 'left',
        targetPosition: 'right',
        type: 'custom',
        data: { name: category, emoji: '📚' },
        position: {
          x: nodeX,
          y: index * spacingY, // cada um abaixo do outro
        },
      }));
      // const newNodes = categories.map((item, index) => ({
      //   id: (index + 2).toString(),
      //   type: 'custom',
      //   data: { name: item, emoji: '📚' },
      //   position: { x: (index % 3) * 200, y: Math.floor(index / 3) * 200 + 50 },
      // }));
      console.log("New Nodes: ", newNodes);
      newNodes.unshift(
        {
          id: '1',
          sourcePosition: 'right',
          // targetPosition: 'right',
          type: 'custom',
          data: { name: 'Categorias', emoji: '😎' },
          position: {
            x: 0,
            y: ((newNodes.length - 1) * spacingY) / 2, // centraliza verticalmente em relação aos filhos
          },
          targetPosition: ''
        }
      )

      const newEdges = newNodes.map((node) => ({
        id: `e-${node.id}`,
        source: '1',
        target: node.id,
        type: 'smoothstep',
      }));
      setNodes((nds) => [...newNodes]);
      setEdges((eds) => [...newEdges]);
    }
  }, [categories, setNodes, setEdges]);

  // useEffect(() => {
  //   console.log("Categories: ", categories);
  //   if (categories && categories.data.length > 0) {
  //     const newNodes = categories.data.map((item, index) => ({
  //       id: (index + 4).toString(),
  //       type: 'custom',
  //       data: { name: item.category_name, emoji: '📚' },
  //       position: { x: (index % 3) * 200, y: Math.floor(index / 3) * 200 + 50 },
  //     }));
  //     const newEdges = newNodes.map((node, index) => ({
  //       id: `e1-${node.id}`,
  //       source: '1',
  //       target: node.id,
  //     }));
  //     console.log("New Nodes: ", newNodes);
  //     console.log("New Edges: ", newEdges);
  //     setNodes((nds) => [...nds, ...newNodes]);
  //     setEdges((eds) => [...eds, ...newEdges]);
  //   }
  // }, [categories, setNodes]);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={connectionLineStyle}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        colorMode={colorMode}
        snapToGrid={true}
        snapGrid={[25, 25]}
        defaultViewport={defaultViewport}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-left"
        className="bg-yellow-600"
      >
        <MiniMap />
        <Background className='dark:bg-red-800' variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <DownloadButton />
      </ReactFlow>
    </div>
  );
}