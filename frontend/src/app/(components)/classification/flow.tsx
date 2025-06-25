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
  MarkerType,
} from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';
import { useTheme } from 'next-themes'

import CustomNode from './custom-node';
import DownloadButton from './react-flow/download-button';
import { v4 as uuidv4 } from "uuid";
import ClassificationFlow from './form';

const spacingY = 60; // espaçamento vertical entre os nós
const spacingX = 250;
const titleYOffset = 60; // Espaçamento abaixo do nó da categoria

 
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


const snapGrid = [25, 25];


// Removed invalid edgeTypes definition
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


  // ============= Interatividade =============
    const [nodeColor, setNodeColor] = useState("#ff0000"); //

    const [defaultEdgeOptions, setDefaultEdgeOptions] = useState({
      animated: true,
      type: 'smoothstep',
      style: { stroke: "#00ffff" }, // cor da linha
    });

    const nodeTypes = {
      custom: CustomNode,
    };

    const connectionLineStyle = { stroke: '#fff' };

  useEffect(() => {
    if(theme){
        const newTheme: ColorMode = theme === 'dark' ? 'dark' : 'light';
        setColorMode(newTheme)
    }
  }, [theme]);

  useEffect(() => {
    console.log("Categories =>", categories)
  }, [categories])

  // useEffect(() => {
  //   if (categories && Object.keys(categories).length > 0) {
  //     const newNodes = Object.entries(categories).map(([category, items], index) => ({
  //       id: uuidv4(),
  //       sourcePosition: 'left',
  //       targetPosition: 'right',
  //       type: 'custom',
  //       data: { name: category, emoji: '📚' },
  //       position: {
  //         x: nodeX,
  //         y: index * spacingY, // cada um abaixo do outro
  //       },
  //     }));
  //     console.log("New Nodes: ", newNodes);
  //     newNodes.unshift(
  //       {
  //         id: '1',
  //         sourcePosition: 'right',
  //         // targetPosition: 'right',
  //         type: 'custom',
  //         data: { name: 'Categorias', emoji: '😎' },
  //         position: {
  //           x: 0,
  //           y: ((newNodes.length - 1) * spacingY) / 2, // centraliza verticalmente em relação aos filhos
  //         },
  //         targetPosition: ''
  //       }
  //     )

  //     const newEdges = newNodes.map((node) => ({
  //       id: `e-${node.id}`,
  //       source: '1',
  //       target: node.id,
  //       type: 'smoothstep',
  //     }));
  //     setNodes((nds) => [...newNodes]);
  //     setEdges((eds) => [...newEdges]);
  //   }
  // }, [categories, setNodes, setEdges]);

  useEffect(() => {
    if (categories && Object.keys(categories).length > 0) {
      const newNodes: any[] = [];
      const newEdges: any[] = [];

      const mainId = 'main';
      let yOffset = 100;

      newNodes.push({
        id: mainId,
        type: 'custom',
        data: { name: 'Categorias', emoji: '😎' },
        position: { x: 0, y: yOffset },
        sourcePosition: 'right',
      });

      Object.entries(categories).forEach(([categoryName, titles], i) => {
        const categoryId = `cat-${i}`;
        const titleNodeId = `${categoryId}-titulo`;

        yOffset += spacingY;

        // Categoria node
        newNodes.push({
          id: categoryId,
          type: 'custom',
          data: { name: categoryName, emoji: '📚' },
          position: { x: spacingX, y: (yOffset) },
          targetPosition: 'left',
          sourcePosition: 'right',
        });
        newEdges.push({ id: `e-${mainId}-${categoryId}`, source: mainId, target: categoryId });


        // Títulos reais
        titles.forEach((title, index) => {
          const titleId = uuidv4();
          const titleNode = {
            id: titleId,
            sourcePosition: 'right',
            targetPosition: 'left',
            type: 'custom',
            data: { name: title, emoji: '📄' },
            position: {
              x: (spacingX * 2) + 80,
              y: (yOffset + titleYOffset+ index * 100),
            },
            style: {
              backgroundColor: '', // <- prioridade máxima
              borderRadius: '8px',
            }
          };
            newNodes.push(titleNode);
            newEdges.push({
              id: `e-${categoryId}-${titleId}`,
              source: categoryId,
              target: titleId,
              type: 'smoothstep',
            });
          });

          yOffset += Math.max(titles.length * 100, spacingY);
      });

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [categories, setNodes, setEdges]);



  return (
    <div className='pb-8' style={{ width: '100%', height: '100vh' }}>
      <ClassificationFlow 
        setDefaultEdgeOptions={setDefaultEdgeOptions} 
        setNodeColor={setNodeColor} 
        setNodes={setNodes}
      />
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
        defaultEdgeOptions={defaultEdgeOptions}
        
        // edgeTypes prop removed as it was invalid
        defaultViewport={defaultViewport}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-left"
        className="bg-yellow-600 py-2"
        style={{ height: '100%' }}
      >
        <MiniMap />
        <Background bgColor={theme === "dark" ? "#1d293d" : ""} className='dark:bg-red-800' variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <DownloadButton />
      </ReactFlow>
    </div>
  );
}