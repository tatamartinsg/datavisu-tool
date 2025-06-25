import React from 'react';
import { Panel } from '@xyflow/react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';

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
      backgroundColor: '#ffff',
      pixelRatio: 2, // mais qualidade
    })
      .then(downloadImage)
      .catch((err) => {
        console.error('Erro ao gerar imagem:', err);
      });
  };

  return (
    <Panel position="top-right">
      <Button variant={"outline"} className="download-btn xy-theme__button" onClick={onClick}>
        Baixar imagem
      </Button>
    </Panel>
  );
}

export default DownloadButton;
