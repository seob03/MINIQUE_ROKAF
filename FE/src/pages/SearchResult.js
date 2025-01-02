import {useState, useEffect} from 'react';
import Slider from '../components/Slider';
import './style/NewsList.css';
import { useLocation } from 'react-router-dom';

function SearchResult(){
    const location = useLocation();
    const searchData = location.state?.data || ''; // 이게 문제여씀 (optional chaining 문법)
    console.log('searchData:', searchData);
    let [searchPostData, setSearchPostData] = useState([]);
    let [loading, setLoading] = useState(true);
    
    useEffect(() => {
      if (!searchData) {
        setLoading(false)
        return
      };  // searchData가 빈 문자열이면 요청하지 않고, 결과 없음을 출력

      setLoading(true); // 데이터 로딩 시작
        console.log("searchResult 페이지가 그냥 열려버려")
        fetch('/searchPost?searchData=' + searchData)
            .then(response => response.json())
            .then(data => {           
              if (data && Array.isArray(data)) {  // 예시: 데이터가 배열일 때
                console.log('서버 응답:', data);
                setSearchPostData(data);
            } else {
                console.error('서버 응답이 예상과 다릅니다:', data);
                setSearchPostData([]);
            }
            })
            .catch(error => {
            console.error('fetch 오류:', error);
            setSearchPostData([]);
            })
            .finally(() => setLoading(false)); // 데이터 로딩 종료
    }, [searchData]);
    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!searchPostData.length) {
      return <div>검색 결과가 없습니다.</div>;
    }


    return (
    <div>
      <div>
        <div className="Recommend-Title">
          {searchData}에 대한 검색 결과입니다.
        </div>
        <div className="Recommend-Carousel">
          <div className="Recommend-Container">
            <Slider data={searchPostData}/>
          </div>
        </div>
      </div>
      <div>
        <div className="Recommend-Title">
          지금, 회원님의 지역 상품
        </div>
        <div className="Recommend-Container"></div>
      </div>
    </div>
    );
}

export default SearchResult;