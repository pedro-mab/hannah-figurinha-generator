import classNames from "classnames";
import { useEffect, useState } from "react";

const arialFont = 'Arial'
const comicSansFont = 'Comic Sans MS'

const FontSelector = ({ onValueChange }) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const [selectedFont, setSelectedFont] = useState()

  const handleChange = (font) => {
    onValueChange(font)
  }

  return (
    <div className="w-full col-span-2">
      <div
        className={classNames({
          'bg-white flex p-2 justify-between items-center border-2 border-gray-300 rounded': true,
          'border-purple-500 rounded-b-none border-b-0': isSelectorOpen
        })}        
        onClick={() => setIsSelectorOpen(!isSelectorOpen)}
      >
        <span className="text-black select-none">{selectedFont || "Selecionar Fonte"}</span>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          data-slot="icon"
          aria-hidden="true"
          className={classNames({
            "rotate-180": isSelectorOpen,
            "-mr-1 size-5 text-gray-400": true
          })}
        >
            <path d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" fillRule="evenodd" />
        </svg>
    </div>
    <ul
      className={classNames({
        "grid gap-2 bg-white overflow-y-auto max-h-0 border-purple-500 rounded text-black select-none": true,
        "px-2 py-2 max-h-60 border-2 rounded-t-none": isSelectorOpen,
      })}
    >
      <li onClick={() => {setSelectedFont(arialFont); handleChange(arialFont); setIsSelectorOpen(!isSelectorOpen)}}>{arialFont}</li>
      <li onClick={() => {setSelectedFont(comicSansFont); handleChange(comicSansFont); setIsSelectorOpen(!isSelectorOpen)}}>{comicSansFont}</li>
    </ul>
  </div>
  )
};

export default FontSelector;