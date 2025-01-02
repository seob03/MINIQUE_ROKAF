import { useNavigate } from 'react-router-dom';
import {useState} from 'react';
import './style/SearchBar.css';

const SearchBar =() => {
    let navigate = useNavigate();
    let [searchData, setSearchData]=useState(''); 

    return(

    <div className='Search-Box'>
        <input placeholder="찾는 상품명을 입력해주세요." onChange={(e) => {
                    setSearchData(e.target.value);
                }} type="text" className='Search-Input'/>
        <button onClick={()=>{navigate('/search',  {state: {data: searchData} })}} id='Search-Header' className='Search-Button'>
            <img src= './img/Search.svg' className='Search-Button'/>
        </button>
    </div>
    
    );
}

export default SearchBar;