'use client';

import dynamic from 'next/dynamic';

const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then(mod => mod.Excalidraw),
  { ssr: false }
);

export default function ExcalidrawWrapper() {
  return (
    <div className="h-[80vh] bg-[#1a1a1a] text-white p-4 rounded-xl overflow-hidden">
      <Excalidraw />
    </div>
  );
}
