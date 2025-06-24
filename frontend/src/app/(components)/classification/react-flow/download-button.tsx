import React from 'react';
import { Panel } from '@xyflow/react';
import { toPng } from 'html-to-image';

function downloadImage(dataUrl: string) {
  const a = document.createElement('a');
  a.setAttribute('download', 'reactflow.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

function DownloadButton() {
  const onClick = () => {
    const flow = document.querySelector('.react-flow');

    if (!flow) return;

    toPng(flow as HTMLElement, {
      cacheBust: true,
      backgroundColor: '#1a365d',
      pixelRatio: 2, // mais qualidade
    })
      .then(downloadImage)
      .catch((err) => {
        console.error('Erro ao gerar imagem:', err);
      });
  };

  return (
    <Panel position="top-right">
      <button className="download-btn xy-theme__button" onClick={onClick}>
        Download Image
      </button>
    </Panel>
  );
}

export default DownloadButton;
