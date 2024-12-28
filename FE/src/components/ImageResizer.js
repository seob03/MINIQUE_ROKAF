import React, { useState } from "react";
import Resizer from "react-image-file-resizer";

const ImageResizer = (props) => {
  const [resizedImage, setResizedImage] = useState(null);

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        props.size, // 이미지 너비
        props.size, // 이미지 높이
        "PNG", // 파일 형식
        100, // 이미지 퀄리티
        0, // 회전
        (uri) => {
          resolve(uri); // 리사이즈된 이미지 URI 반환
        },
        "base64" // 출력 타입
      );
    });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const resizedImage = await resizeFile(file);
        setResizedImage(resizedImage);
      } catch (err) {
        console.error("Image resizing failed:", err);
      }
    }
  };

  return (
    <>
        {resizedImage ? (
          <img
            src={resizedImage}
            alt="Resized"
            style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover', /* 이미지를 잘라서 컨테이너에 맞춤 */
                position: 'absolute', /* 컨테이너 안에서의 위치 고정 */
                top: '0',
                left: '0'
            }}
          />
        ) : (
          <img
            src={props.img}
            alt="Card"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover', /* 이미지를 잘라서 컨테이너에 맞춤 */
                position: 'absolute', /* 컨테이너 안에서의 위치 고정 */
                top: '0',
                left: '0'
            }}
          />
        )}
    </>
  );
};

export default ImageResizer;
