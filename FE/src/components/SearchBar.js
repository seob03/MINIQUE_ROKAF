import './style/SearchBar.css';

const SearchBar =() => {
    return(
    <div className='Search-Box'>
        <input type="text" className='Search-Input'/>
        <button id='Search-Header' className='Search-Button'>
            <img src= './img/Search.svg' className='Search-Button'/>
        </button>
    </div>
    );
}

export default SearchBar;