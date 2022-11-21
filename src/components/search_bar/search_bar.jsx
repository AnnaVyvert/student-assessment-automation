import './search_bar.css';

const SearchBar = ({ elem, setSearchResults, type }) => {
  const handleSearchChange = (e) => {
    if (!e.target.value) return setSearchResults(elem);
    console.log(elem)
    const condition = (elem) => {
      const query = e.target.value.toLowerCase()
      
      switch (type) {
        case 'group':
          return (
            elem.cipher.toLowerCase().includes(query) ||
            elem.start_year.toString().includes(query) ||
            elem.number.toString().includes(query)
          );
        case 'student':
          return (
            elem.surname.toLowerCase().includes(query) ||
            elem.name.toString().includes(query) ||
            elem.patronym.toString().includes(query)
          );
        case 'subject':
          return (
            elem.name.toLowerCase().includes(query) ||
            elem.hours.toString().includes(query)
          );
        case 'final_list':
          return(
            elem.surname.toLowerCase().includes(query) ||
            elem.name.toString().includes(query) ||
            elem.patronym.toString().includes(query)
          )
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
    </div>
    
  );
};
export default SearchBar;
