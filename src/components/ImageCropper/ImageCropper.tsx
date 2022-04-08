import React, { useState } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import demoImage from "./default.png";
export type ImageCropperProps = {
    imageToCrop: any
    onImageCropped: (value: any) => void
}

export default function ImageCropper ({ imageToCrop, onImageCropped }: ImageCropperProps) {
    const [cropConfig, setCropConfig] = useState(
        {
            unit: '%',
            width: 30,
            aspect: 9 / 9
        }
    )
    const [imageRef, setImageRef] = useState()
    const cropImage = async (crop) => {
        if (imageRef && crop.width && crop.height) {
            const croppedImage = await getCroppedImage(
                imageRef,
                crop,
                'croppedImage.jpeg'
            )
            onImageCropped(croppedImage)
        }
    }

    const blobToFile = (theBlob: Blob, fileName:string): File => {
        const myFile = new File([theBlob], 'image.jpeg', {
            type: theBlob.type
        })
        return myFile
    }

    const getCroppedImage = (sourceImage, cropConfig, fileName) => {
        const canvas = document.createElement('canvas')
        const scaleX = sourceImage.naturalWidth / sourceImage.width
        const scaleY = sourceImage.naturalHeight / sourceImage.height
        canvas.width = cropConfig.width
        canvas.height = cropConfig.height
        const ctx = canvas.getContext('2d')

        ctx.drawImage(
            sourceImage,
            cropConfig.x * scaleX,
            cropConfig.y * scaleY,
            cropConfig.width * scaleX,
            cropConfig.height * scaleY,
            0,
            0,
            cropConfig.width,
            cropConfig.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
              // returning an error
              if (!blob) {
                reject(new Error("Canvas is empty"));
                return;
              }
              const file = blobToFile(blob, fileName)
              resolve(file);
            }, "image/jpeg");
        });
    }

    return (
        <>
            {imageToCrop && (
                <ReactCrop
                    src={imageToCrop}
                    crop={cropConfig}
                    ruleOfThirds
                    onImageLoaded={(imageRef) => setImageRef(imageRef)}
                    onComplete={(cropConfig) => cropImage(cropConfig)}
                    onChange={(cropConfig) => setCropConfig(cropConfig)}
                    crossorigin="anonymous" // to avoid CORS-related problems
                />
            )}
        </>
    )
}