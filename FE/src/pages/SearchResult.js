import {useState, useEffect} from 'react';
import Slider from '../components/Slider';
import './style/NewsList.css';
import { useLocation } from 'react-router-dom';

function SearchResult(){
    const location = useLocation();
    const searchData = location.state.data
    
    let [searchPostData, setSearchPostData] = useState([]);

    useEffect(() => {
        console.log("searchResult 페이지가 그냥 열려버려")
        fetch('/searchPost?searchData=' + searchData)
            .then(response => response.json())
            .then(data => {
            console.log('서버 응답:', data);
            setSearchPostData(data);
            })
            .catch(error => {
            console.error('fetch 오류:', error);
            });
    }, [searchData]);

    return (
    <div>
      <div>
        <div className="Recommend-Title">
          {searchData} 대한 검색 결과입니다.
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