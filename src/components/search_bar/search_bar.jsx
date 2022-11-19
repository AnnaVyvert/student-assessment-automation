import './search_bar.css';

const SearchBar = ({ elem, setSearchResults, type }) => {
  const handleSearchChange = (e) => {
    if (!e.target.value) return setSearchResults(elem);
    console.log(elem)
    const condition = (elem) => {
      const query = e.target.value.toLowerCase()
      
      switch (type) {
        case 'competition':
          return elem.name.toLowerCase().includes(e.target.value.toLowerCase());
        case 'group':
          return (
            elem.cipher.toLowerCase().includes(query) ||
            elem.start_year.toString().includes(query) ||
            elem.number.toString().includes(query)
          );
        default:
          return false;
      }
    };

    const resultsArray = elem.filter((elem) => condition(elem));

    setSearchResults(resultsArray);
  };

  return (
    <div className='search-bar-container'>
      <input
        type="text"
        placeholder=" "
        className="search-bar"
        onChange={handleSearchChange}
        onBlur={(e)=>{
          e.target.value=''
          return setSearchResults(elem)
        }}
      />
      {/* <span>
        <img 
          alt='' 
          className='img-btn'
          src='https://cdn-icons-png.flaticon.com/512/2989/2989542.png' 
        />
      </span> */}
    </div>
    
  );
};
export default SearchBar;
