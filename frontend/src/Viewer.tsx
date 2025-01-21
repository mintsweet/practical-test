import { useState, useRef } from 'react';

import type { ILine } from './types';
import { getWordPosition, checkWordInArea } from './utils';

const customWidth = 500;

interface Props {
  url: string;
  imgSize: {
    width: number;
    height: number;
  };
  lines: ILine[];
}

export const Viewer = ({ url, imgSize, lines }: Props) => {
  const [selecting, setSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    width: number;
    height: number;
    reverse: boolean;
  } | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const [scale, setScale] = useState(1);

  const rafRef = useRef<number>(0);
  const imgRef = useRef(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setSelecting(true);
    const { offsetX, offsetY } = e.nativeEvent;

    setSelectionBox({
      startX: offsetX * scale,
      startY: offsetY * scale,
      endX: offsetX * scale,
      endY: offsetY * scale,
      width: 0,
      height: 0,
      reverse: false,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!selecting) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!selectionBox) return;

      const { offsetX, offsetY } = e.nativeEvent;

      if (e.target !== imgRef.current) {
        return;
      }

      setSelectionBox({
        ...selectionBox,
        endX: offsetX * scale,
        endY: offsetY * scale,
        width: Math.abs(offsetX * scale - selectionBox.startX),
        height: Math.abs(offsetY * scale - selectionBox.startY),
        reverse: offsetX * scale < selectionBox.startX,
      });
    });
  };

  const handleMouseUp = () => {
    setSelecting(false);

    if (!selectionBox) {
      return;
    }

    const selected: string[] = [];

    lines.forEach((line) => {
      line.words.forEach((word) => {
        const isInArea = checkWordInArea({
          word,
          imgSize,
          customWidth,
          area: {
            left: !selectionBox.reverse
              ? selectionBox.startX
              : selectionBox.endX,
            top: !selectionBox.reverse
              ? selectionBox.startY
              : selectionBox.endY,
            width: selectionBox.width,
            height: selectionBox.height,
          },
          scale,
        });

        if (isInArea) {
          selected.push(word.text);
        }
      });
    });

    // setSelectionBox(null);
    setSelectedWords(selected);
    cancelAnimationFrame(rafRef.current);
  };

  const handleZoomIn = () => {
    if (scale >= 1.25) {
      return;
    }

    setScale((scale) => scale + 0.05);
  };

  const handleZoomOut = () => {
    if (scale <= 0.75) {
      return;
    }

    setScale((scale) => scale - 0.05);
  };

  return (
    <div className="flex-1 flex gap-6 p-6 bg-gray-200 overflow-hidden">
      <div className="flex justify-center flex-1">
        <div
          className="relative"
          style={{
            width: `${customWidth}px`,
            height: `${(customWidth / imgSize.width) * imgSize.height}px`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {selecting && selectionBox && (
            <div
              className="absolute border-2 border-indigo-500 bg-indigo-500/20 z-50"
              style={{
                top: `${!selectionBox.reverse ? selectionBox.startY : selectionBox.endY}px`,
                left: `${!selectionBox.reverse ? selectionBox.startX : selectionBox.endX}px`,
                width: `${selectionBox.width}px`,
                height: `${selectionBox.height}px`,
              }}
            />
          )}
          {selectionBox && !!selectedWords.length && (
            <div
              className="absolute border border-blue-400 bg-white z-40"
              style={{
                left: `${!selectionBox.reverse ? selectionBox.startX : selectionBox.endX}px`,
                top: `${(!selectionBox.reverse ? selectionBox.startY : selectionBox.endY) + selectionBox.height}px`,
              }}
            >
              {selectedWords.join(' ')}
            </div>
          )}
          <div className="absolute top-2 left-2 z-30 bg-slate-700 text-white">
            <ul className="flex">
              <li
                title="Zoom In"
                className="flex items-center justify-center w-8 h-8 cursor-pointer select-none border-r border-white"
                onClick={handleZoomIn}
              >
                +
              </li>
              <li
                title="Zoom Out"
                className="flex items-center justify-center w-8 h-8 cursor-pointer select-none last:border-none"
                onClick={handleZoomOut}
              >
                -
              </li>
            </ul>
          </div>
          <div
            ref={imgRef}
            style={{
              backgroundImage: `url(${url})`,
              width: '100%',
              height: '100%',
              backgroundSize: '100%',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              backgroundPosition: 'top left',
            }}
          />

          {lines.map((line) =>
            line.words.map((word, index: number) => {
              const { left, top, width, height } = getWordPosition({
                word,
                imgSize,
                customWidth,
                scale,
              });
              const isInArea =
                selectionBox &&
                checkWordInArea({
                  word,
                  imgSize,
                  customWidth,
                  area: {
                    left: !selectionBox.reverse
                      ? selectionBox.startX
                      : selectionBox.endX,
                    top: !selectionBox.reverse
                      ? selectionBox.startY
                      : selectionBox.endY,
                    width: selectionBox.width,
                    height: selectionBox.height,
                  },
                });
              return (
                <div
                  key={index}
                  className={`absolute cursor-pointer hover:border hover:border-blue-500 hover:bg-blue-500/20 hover:border-dashed
                    ${isInArea ? 'border border-blue-500 bg-red-500/20' : ''}
                    `}
                  style={{
                    left: `${left}px`,
                    top: `${top}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                  }}
                />
              );
            }),
          )}
        </div>
      </div>
      <div className="hidden md:block">
        <div className="min-w-80 p-6 bg-white">
          <h3 className="mb-2 text-xl">Textarea</h3>
          <textarea
            rows={4}
            className="block p-2 w-full rounded-md border border-gray-300 shadow-sm resize-none bg-gray-50"
            value={selectedWords.join(' ')}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};
