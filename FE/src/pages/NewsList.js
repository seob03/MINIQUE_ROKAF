import { useState, useEffect } from 'react';
import Slider from '../components/Slider';
import './style/NewsList.css';
import CardSmall from '../components/CardSmall';

function NewsList() {
  let [postData, setpostData] = useState([]); // 최종 입력값
  // 백엔드에서 데이터 가져오기
  useEffect(() => {
    fetch('/getPostLists')
      .then((response) => response.json())
      .then((DB_result) => {
        setpostData(DB_result);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      }, []);
  }, []);  // 컴포넌트가 마운트될 때 한 번만 실행

  let today = new Date();

  return (
    <div>
      <div style={{ marginTop: '30px' }}>
        <div className="Recommend-Carousel">
          <div className="Banner-Container">
            <Slider />
          </div>
        </div>
      </div>
      <div style={{ marginTop: '60px' }}>
        <div className="Recommend-Title">
          {today.getMonth() + 1}월의 추천 상품
        </div>
        <div className="Recommend-Gallery">
          {
            (postData.length > 0) ? (
              postData.map(post => (
                <CardSmall
                  photo={post.productPhoto || undefined}
                  brand={'MONCLER'}
                  title={post.productName}
                  size={post.childAge}
                  price={Number(post.productPrice).toLocaleString()}
                  link={'/detail/' + post._id}
                />
              ))
            ) : <div>로딩중입니다...</div>
          }
        </div>
      </div>
    </div>
  );
}

export default NewsList;