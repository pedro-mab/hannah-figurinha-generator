'use client'

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image, Transformer, Text } from 'react-konva';
import useImage from 'use-image'

const defaultFontSize = 72
const stageHeightWidth = 700

export default function Home() {
  const defaultImagePath = '/assets/1.jpg'
  const [displayedImage, setDisplayedImage] = useState(defaultImagePath);
  const [images, setImages] = useState([]);
  const [imgScale, setImgScale] = useState(1)
  const [imgSaturation, setImgSaturation] = useState(0)
  const [displayedText, setDisplayedText] = useState('');

  const updateCanvasImage = (newImage) => {
    setDisplayedImage(newImage)
  };

  useEffect(() => {
    fetch('images.json').then(res => res.json()).then(data => {
      const newImages = [];
      for (const imageFile in data) {
        const imageFilePath = '/assets/' + data[imageFile]
        const image =
        <img
          key={imageFile}
          onClick={() => updateCanvasImage(imageFilePath)}
          src={imageFilePath}
          className='w-32 h-32 bg-gray-300'
        />
        newImages.push(image);
      }
      setImages(newImages);
    })
  }, []);

  const textLayerRef = useRef();
  const transformerRef = useRef();
  const [bgImage] = useImage(displayedImage, 'anonymous');
  const bgImageRef = useRef();
  const [isEditing, setIsEditing] = useState(false);  
  const [mainTextColor, setMainTextColor] = useState("#00ffdd");
  const [blurTextColor, setBlurTextColor] = useState("#ffffff");
  const [shadowTextColor, setShadowTextColor] = useState("#ff00dd")
  const [strokeTextColor, setStrokeTextColor] = useState("#000000")
  const [textFont, setTextFont] = useState('arial')

  
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
    <div className="font-sans grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex gap-[32px] max-h-[708px]">
        <div className='flex flex-col gap-10 border-1 px-5 py-5 bg-gray-900 rounded'>
          <div className="grid grid-cols-2 justify-items-center rounded gap-4">
            <p className="col-span-2">Imagem</p>
            <div className="grid grid-cols-2 gap-5 col-span-2 overflow-auto border-1 px-3 py-3">
              {images}
            </div>
            <div className="grid w-full">
              <p>Zoom:</p>
              <input type="range" min="1" max="4" step="any" value={imgScale} onChange={(e) => setImgScale(parseFloat(e.target.value))}/>
            </div>
            <div className="grid w-full">
              <p>Saturação:</p>
              <input type="range" min="0" max="10" step="any" value={imgSaturation} onChange={(e) => setImgSaturation(parseFloat(e.target.value))}/>
            </div>                  
          </div>
        </div>
        <div className="border-4 row-span-2 col-start-2">
          <Stage 
            width={stageHeightWidth} 
            height={stageHeightWidth}            
          >
            <Layer onClick={handleStageClick} >
              <Image 
                ref={bgImageRef}
                filters={[Konva.Filters.HSL]}
                saturation={imgSaturation}
                image={bgImage} 
                draggable
                scaleX={imgScale}
                scaleY={imgScale}/>
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
                opacity={0}
                text={displayedText}
                fontSize={defaultFontSize}
                fontStyle='bold'
                fontFamily='--font-fleur-de-leah'
                lineHeight={0.8}
                fill={shadowTextColor}
                offsetX={-5}
                offsetY={-3}
                strokeWidth={1}
              />            
              
              <Text
                text={displayedText}              
                fontSize={defaultFontSize}
                fontStyle='bold'
                fontFamily='arial'
                lineHeight={0.8}
                shadowColor={blurTextColor}
                shadowEnabled={true}
                shadowOpacity={1}
                shadowBlur={15}
                fill={blurTextColor}
              />

              <Text
              fillAfterStrokeEnabled
                text={displayedText}
                fontSize={defaultFontSize}
                fontFamily={"Arial"}
                lineHeight={0.8}
                fill={mainTextColor}              
                stroke={strokeTextColor}
                strokeWidth={4}
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
        <div className='flex flex-col gap-10 border-1 px-5 py-5 bg-gray-900 rounded'>
          <div className="grid grid-cols-2 justify-items-center rounded gap-4">
              <p className="col-span-2">Texto</p>
              <textarea
                className="border-1 px-3 py-3 col-span-2 h-[50px] w-full"
                type="text"
                value={displayedText}
                onChange={(e) => setDisplayedText(e.target.value)}
                placeholder="Insira uma doença"
              />
              <div className="grid w-full">
                <p className="w-full">Principal:</p>
                <input className="w-full" type="color" value={mainTextColor} onChange={(e) => setMainTextColor(e.target.value)}/>              
              </div>
              <div className="grid w-full">
                <p className="w-full">Brilho:</p>
                <input className="w-full" type="color" value={blurTextColor} onChange={(e) => setBlurTextColor(e.target.value)}/>
              </div>
              <div className="grid w-full">
                <p className="w-full">Fundo:</p>
                <input className="w-full" type="color" value={shadowTextColor} onChange={(e) => setShadowTextColor(e.target.value)}/>
              </div>
              <div className="grid w-full">
                <p className="w-full">Contorno:</p>
                <input className="w-full" type="color" value={strokeTextColor} onChange={(e) => setStrokeTextColor(e.target.value)}/>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}