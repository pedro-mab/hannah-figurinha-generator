'use client'

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image, Transformer, Text } from 'react-konva';
import useImage from 'use-image'
import FontSelector from './FontSelector'

const defaultFontSize = 120
const stageHeightWidth = 700

export default function Home() {
  const stageRef = useRef(null);
  const defaultImagePath = 'assets/1.jpg'
  const [displayedImage, setDisplayedImage] = useState(defaultImagePath);
  const [bgImage] = useImage(displayedImage, 'anonymous');
  const bgImageRef = useRef();
  const [images, setImages] = useState([]);
  const [imgScale, setImgScale] = useState(1);
  const [imgSaturation, setImgSaturation] = useState(0);
  const [selectedImgKey, setSelectedImgKey] = useState('1.jpg')

  const updateCanvasImage = (newImage) => {
    setDisplayedImage(newImage)
  };

  const handleExport = () => {
    if (transformerRef.current) {
      transformerRef.current.hide();
    };
    const dataURL = stageRef.current.toDataURL({
      pixelRatio: 1 // double resolution
    });
    
    const link = document.createElement('a');
    link.download = `figurinha_${displayedText}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (transformerRef.current) {
      transformerRef.current.show();
    };
  };

  useEffect(() => {
    fetch('images.json').then(res => res.json()).then(data => {
      const newImages = [];
      for (const imageFile in data) {
        const imageFilePath = 'assets/' + data[imageFile]
        const image =
        <img
          key={imageFile}
          onClick={() => {updateCanvasImage(imageFilePath); setSelectedImgKey(imageFile)}}
          src={imageFilePath}
          className={`w-[128px] h-[128px] min-w-[128px] bg-gray-300 border-3 cursor-pointer ${imageFile === selectedImgKey ? 'border-purple-500' : 'border-gray-300'}`}
        />
        newImages.push(image);
      }
      setImages(newImages);
    })
  }, [selectedImgKey]);

  const textLayerRef = useRef();
  const transformerRef = useRef();  
  const [displayedText, setDisplayedText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [mainTextColor, setMainTextColor] = useState("#00ffdd");
  const [blurTextColor, setBlurTextColor] = useState("#ffffff");
  const [shadowTextColor, setShadowTextColor] = useState("#ff00dd");
  const [strokeTextColor, setStrokeTextColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(4)
  const [textFont, setTextFont] = useState('Comic Sans MS');

  const handleFontChange = (value) => {
    setTextFont(value)
  }

  const handleStageClick = () => {
      setIsEditing(false);
  };

  const handleTextClick = () => {
      setIsEditing(true);
  };

  useEffect(() => {
    if (bgImage) {
      bgImageRef.current.cache();
    }
  }, [bgImage]);

  useEffect(() => {
    if (isEditing) {
      transformerRef.current.nodes([textLayerRef.current]);
    }
  }, [displayedText, isEditing]);

  return (
    <div className="grid items-center min-h-screen p-8 font-comic justify-items-center bg-[url(/assets/header-bg.png)] bg-no-repeat">
      <img className='justify-self-start h-60' src='assets/logo.png'></img>      
      <main className="flex gap-10 items-start">
        <div className='flex flex-col px-5 py-5 -skew-y-3 -skew-x-1 bg-card'>
          <div className="grid grid-cols-2 gap-8 px-5 py-5 skew-y-3 skew-x-1 justify-items-center">
            <p className="col-span-2 text-2xl">Imagem</p>
            <div className="grid grid-cols-2 col-span-2 gap-5 px-3 py-3 overflow-auto max-h-100 border-1">
              {images}
            </div>
            <div className="grid justify-items-center">
              <p>Zoom:</p>
              <input type="range" min="1" max="4" step="any" value={imgScale} onChange={(e) => setImgScale(parseFloat(e.target.value))}/>
            </div>
            <div className="grid justify-items-center">
              <p>Saturação:</p>
              <input type="range" min="0" max="10" step="any" value={imgSaturation} onChange={(e) => setImgSaturation(parseFloat(e.target.value))}/>
            </div>
          </div>
        </div>        
        <div className="col-start-2 row-span-2 border-4">
          <Stage
            width={stageHeightWidth}
            height={stageHeightWidth}
            ref={stageRef}
          >
            <Layer onClick={handleStageClick} >
              <Image
                ref={bgImageRef}
                filters={[Konva.Filters.HSL]}
                saturation={imgSaturation}
                image={bgImage}
                draggable
                scaleX={imgScale}
                scaleY={imgScale}
                x={stageHeightWidth / 2}
                y={stageHeightWidth / 2}
                offsetX={stageHeightWidth / 2}
                offsetY={stageHeightWidth / 2}
                />
            </Layer>

            <Layer
              x={stageHeightWidth / 3}
              y={stageHeightWidth / 2}
              ref={textLayerRef}
              draggable
              onClick={handleTextClick}
              onDragStart={handleTextClick}
            >
              <Text
                text={displayedText}
                fontSize={defaultFontSize}
                fontFamily={textFont}
                fill={shadowTextColor}
                offsetX={-5}
                offsetY={-5}
              />

              <Text
                text={displayedText}
                fontSize={defaultFontSize}
                fontFamily={textFont}
                shadowColor={blurTextColor}
                shadowEnabled={true}
                shadowOpacity={10}
                shadowBlur={15}
                fill={blurTextColor}
              />

              <Text
                fillAfterStrokeEnabled
                text={displayedText}
                fontSize={defaultFontSize}
                fontFamily={textFont}
                fill={mainTextColor}
                stroke={strokeTextColor}
                strokeWidth={strokeWidth}
              />
            </Layer>
            <Layer>
              {isEditing &&
              <Transformer
                centeredScaling
                ref={transformerRef}
                rotateEnabled={false}
              />
              }
            </Layer>
          </Stage>
        </div>
        <div className='grid justify-items-center gap-4'>
          <div className='flex flex-col px-5 py-5 bg-card skew-1'>
            <div className="grid grid-cols-2 gap-5 px-5 py-5 rounded justify-items-center -skew-1">
              <p className="col-span-2 text-2xl">Texto</p>
              <textarea
                className="border-1 border-white px-3 py-3 col-span-2 h-[50px] w-full"
                type="text"
                value={displayedText}
                onChange={(e) => setDisplayedText(e.target.value)}
                placeholder="Insira uma doença..."
              />
              <FontSelector onValueChange={handleFontChange}></FontSelector>
              <div className="grid justify-items-center w-full">
                <p>Principal:</p>
                <input className="w-full" type="color" value={mainTextColor} onChange={(e) => setMainTextColor(e.target.value)}/>
              </div>
              <div className="grid justify-items-center w-full">
                <p>Brilho:</p>
                <input className="w-full" type="color" value={blurTextColor} onChange={(e) => setBlurTextColor(e.target.value)}/>
              </div>
              <div className="grid justify-items-center w-full">
                <p>Fundo:</p>
                <input className="w-full" type="color" value={shadowTextColor} onChange={(e) => setShadowTextColor(e.target.value)}/>
              </div>
              <div className="grid justify-items-center w-full">
                <p>Contorno:</p>
                <input className="w-full" type="color" value={strokeTextColor} onChange={(e) => setStrokeTextColor(e.target.value)}/>
              </div>
            </div>          
          </div>
          <button className='bg-card p-4 text-2xl cursor-pointer' onClick={handleExport}>Salvar</button>
        </div>        
      </main>
    </div>
  );
}