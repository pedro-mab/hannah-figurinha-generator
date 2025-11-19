'use client'

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image, Transformer, Text } from 'react-konva';
import useImage from 'use-image'

const defaultFontSize = 120
const stageHeightWidth = 700
const textFontStyle = 'normal'

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
      if (file) {
        setDisplayedImage(URL.createObjectURL(file));
      }
  }

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
          className={`w-[128px] h-[128px] min-w-[128px] border-3 cursor-pointer ${imageFile === selectedImgKey ? 'border-border' : 'border-gray-300'}`}
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
  const [strokeWidth, setStrokeWidth] = useState(10);
  const [shadowDistanceX, setShadowDistanceX] = useState(0);
  const [shadowDistanceY, setShadowDistanceY] = useState(0);
  const [textFont, setTextFont] = useState('Arial');

  const handleFontChange = (event) => {
    setTextFont(event.target.value)
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
    <div className="grid items-center min-h-screen p-8 font-comic justify-items-center accent-foreground bg-[url(/hannah-figurinha-generator/assets/header-bg.png)] bg-no-repeat">
      <img className='justify-self-start h-60' src='assets/logo.png'></img>
      <main className="flex items-start gap-10">        
          <div className="grid gap-5 p-10 justify-items-center sidebar-left relative">
            <p className="text-2xl">Imagem</p>
            <div className='grid justify-items-center gap-3 p-3 bg-card-element'>
              <input className='border-1 w-full px-2 py-1' type='text' placeholder='Insira um link...' onChange={(e) => setDisplayedImage(e.target.value)}></input>
              <input className='' type='file' accept="image/*" onChange={handleImageUpload}></input>
            </div>
            <div className="grid grid-cols-2 gap-5 p-3 overflow-auto bg-card-element w-full max-h-100">
              {images}
            </div>
            <div className='flex gap-5'>
            <div className="grid justify-items-center">
              <p>Zoom</p>
              <input type="range" min="1" max="4" step="any" value={imgScale} onChange={(e) => setImgScale(parseFloat(e.target.value))}/>
            </div>
            <div className="grid justify-items-center">
              <p>Saturação</p>
              <input type="range" min="0" max="10" step="any" value={imgSaturation} onChange={(e) => setImgSaturation(parseFloat(e.target.value))}/>
            </div>
            </div>
          </div>
        <div className="col-start-2 row-span-2 border-4 shadow-2xl shadow-card">
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
              x={stageHeightWidth / 4}
              y={stageHeightWidth / 2}
              ref={textLayerRef}
              draggable
              onClick={handleTextClick}
              onDragStart={handleTextClick}
            >
              

              <Text
                text={displayedText}
                fontStyle={textFontStyle}
                fontSize={defaultFontSize}
                fontFamily={textFont}
                shadowColor={blurTextColor}
                shadowEnabled={true}
                shadowOpacity={1}
                shadowBlur={20}
                fill={blurTextColor}
              />

              <Text
                text={displayedText}
                fontStyle={textFontStyle}
                fontSize={defaultFontSize}
                fontFamily={textFont}
                shadowColor={blurTextColor}
                shadowEnabled={true}
                shadowOpacity={1}
                shadowBlur={20}
                fill={blurTextColor}
              />

              <Text
                text={displayedText}
                fontStyle={textFontStyle}
                fontSize={defaultFontSize}
                fontFamily={textFont}
                shadowColor={blurTextColor}
                shadowEnabled={true}
                shadowOpacity={1}
                shadowBlur={30}
                fill={blurTextColor}
              />

              <Text
                text={displayedText}
                fontStyle={textFontStyle}
                fontSize={defaultFontSize}
                fontFamily={textFont}
                fill={shadowTextColor}
                offsetX={shadowDistanceX}
                offsetY={shadowDistanceY}
              />

              <Text
                fillAfterStrokeEnabled
                text={displayedText}
                fontStyle={textFontStyle}
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
        <div>
          <div className='grid p-10 gap-2 sidebar-right relative'>
            <div className="justify-self-center text-2xl">Texto</div>
            <div className="flex flex-col p-3 gap-3 bg-card-element">              
              <textarea
                className="border-1 border-white px-3 py-3 h-[50px] w-full"
                type="text"
                value={displayedText}
                onChange={(e) => setDisplayedText(e.target.value)}
                placeholder="Insira uma doença..."
              />
              <select className='self-center py-2 px-2 bg-card border-1 w-full' value={textFont} onChange={handleFontChange}>
                <option value='Arial'>Arial</option>
                <option value='Comic Sans MS'>Comic Sans</option>
              </select>
            </div>
            <div className='justify-self-center text-2xl'>Cores</div>
            <div className='grid grid-cols-2 gap-3 p-3 bg-card-element'>
              <div className="flex flex-col items-center">
                <p>Principal</p>
                <input className="w-full" type="color" value={mainTextColor} onChange={(e) => setMainTextColor(e.target.value)}/>
              </div>
              <div className="flex flex-col items-center">
                <p>Brilho</p>
                <input className="w-full" type="color" value={blurTextColor} onChange={(e) => setBlurTextColor(e.target.value)}/>
              </div>
            </div>
            <div className='flex flex-col gap-2 p-3 bg-card-element'>
              <span className='self-center'>Contorno</span>
              <div className='flex items-center gap-2'>                
                <input className='' type="color" value={strokeTextColor} onChange={(e) => setStrokeTextColor(e.target.value)}/>                          
                <input type="range" min="0" max="20" step="any" value={strokeWidth} onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}/>
              </div>
            </div>
            <div className='flex flex-col gap-2 p-3 bg-card-element'>
              <span className="self-center">Fundo</span>
              <input className="w-20 self-center" type="color" value={shadowTextColor} onChange={(e) => setShadowTextColor(e.target.value)}/>
              <span>Distância Horizontal</span>
              <input type="range" min="-100" max="100" step="any" value={shadowDistanceX * -1} onChange={(e) => setShadowDistanceX(parseFloat(e.target.value) * -1)}/>
              <span>Distância Vertical</span>
              <input type="range" min="-100" max="100" step="any" value={shadowDistanceY} onChange={(e) => setShadowDistanceY(parseFloat(e.target.value))}/>
            </div>
          </div>
            <div className='justify-self-center p-4 m-4 text-2xl cursor-pointer bg-card' onClick={handleExport}>Salvar</div>
        </div>
      </main>
    </div>
  );
}