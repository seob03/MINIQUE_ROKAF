import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './style/SearchBar.css';

const SearchBar = () => {
    let navigate = useNavigate();
    let [searchData, setSearchData] = useState('');

    function GotoSearch() {
        navigate('/search', { state: { data: searchData } })
    }

    function activeEnter(e) {
        if (e.key === 'Enter') {
            GotoSearch();
        }
    }

    return (
        <div className='Search-Box'>
            <input
                placeholder=" 찾는 상품명을 입력해주세요."
                onChange={(e) => {
                    setSearchData(e.target.value);
                }}
                onKeyDown={activeEnter}
                type="text"
                className='Search-Input'
            />
            <button
                onClick={() => { GotoSearch() }}
                id='Search-Header'
                className='Search-Button'
                aria-label="검색버튼"
            >
                <img src='/img/Search.svg' className='Search-Button' />
            </button>
        </div>

    );
}

export default SearchBar;