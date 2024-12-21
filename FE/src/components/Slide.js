import React from "react";
import styled from "styled-components";

export default function Slide({ img }) {
  return (
      <img src={img} />
  );
}
const IMG = styled.img`
  width: 240px;
  height: 240px;
`;

const Container = styled.div`
  width: 60%;
  overflow: hidden; // 선을 넘어간 이미지들은 보이지 않도록 처리합니다.
`;

const SliderContainer = styled.div`
  width: 100%;
  display: flex; //이미지들을 가로로 나열합니다.
`;