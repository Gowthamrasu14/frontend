import React, { useState } from "react";



const ChargesEntry = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const options = [
    
{id:"1",planthtscno:"079494720030",mo_year:"2024-10-31",c1:"24586",c2:"12458",c3:"0",c4:"23564",c5:"2587",cc1:"24586",cc2:"12458",cc3:"0",cc4:"23564",cc5:"2587",amr:"430",om:"11311",trans:"1254",soc:"1254",rkvah:"225",iec:"0",sch:"1256",other:"0",dsm:"1896"},
{id:"2",planthtscno:"049514360023",mo_year:"2024-10-31",c1:"8000",c2:"65895",c3:"0",c4:"12456",c5:"12354",cc1:"8000",cc2:"65895",cc3:"0",cc4:"12456",cc5:"12354",amr:"430",om:"12456",trans:"125",soc:"1245",rkvah:"123",iec:"0",sch:"1451",other:"0",dsm:"2871"},
{id:"3",planthtscno:"079494720031",mo_year:"2024-10-31",c1:"24586",c2:"12458",c3:"0",c4:"23564",c5:"2587",cc1:"24586",cc2:"12458",cc3:"0",cc4:"23564",cc5:"2587",amr:"430",om:"11311",trans:"1254",soc:"1254",rkvah:"225",iec:"0",sch:"1256",other:"0",dsm:"1896"},
{id:"4",planthtscno:"049514360024",mo_year:"2024-10-31",c1:"8000",c2:"65895",c3:"0",c4:"12456",c5:"12354",cc1:"8000",cc2:"65895",cc3:"0",cc4:"12456",cc5:"12354",amr:"430",om:"12456",trans:"125",soc:"1245",rkvah:"123",iec:"0",sch:"1451",other:"0",dsm:"2871"}

  ];
  

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCheckboxChange = (item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const filteredOptions = options.filter((option) =>
    option.planthtscno.toLowerCase().includes(searchQuery.toLowerCase())
  );
















 


  
 
  const [filter, setFilter] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 2; // Number of rows per page

  const handleFilterChange = (e, column) => {
    setFilter({
      ...filter,
      [column]: e.target.value.toLowerCase(),
    });
    setCurrentPage(1); // Reset to the first page on filter change
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
    const data = [
        {
          name: "Xbox Series X",
          category: "Gaming Consoles",
          brand: "Microsoft",
          price: "$499",
          stock: "15",
          totalSales: "450",
          status: "Out of Stock",
        },
        {
            name: "Xbox Series X",
            category: "Gaming Consoles",
            brand: "Microsoft",
            price: "$250",
            stock: "20",
            totalSales: "450",
            status: "in Stock",
          },
        {
          name: "Nintendo Switch",
          category: "Gaming Consoles",
          brand: "Nintendo",
          price: "$299",
          stock: "40",
          totalSales: "600",
          status: "In Stock",
        },
        {
          name: "Apple MacBook Pro",
          category: "Computers",
          brand: "Apple",
          price: "$1,299",
          stock: "20",
          totalSales: "100",
          status: "In Stock",
        },
        {
            name: "Apple MacBook Pro",
            category: "Computers",
            brand: "Apple",
            price: "$1,599",
            stock: "25",
            totalSales: "450",
            status: "In Stock",
          },
      ];
    
  

      const columns = [
        "name",
        "category",
        "brand",
        "price",
        "stock",
        "totalSales",
        "status",
      ];
    
      const sortedData = [...data];
      if (sortConfig.key) {
        sortedData.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        });
      }
    
      const filteredData = sortedData.filter((row) =>
        columns.every(
          (col) =>
            !filter[col] ||
            row[col].toString().toLowerCase().includes(filter[col])
        )
      );
    
      const startIndex = (currentPage - 1) * rowsPerPage;
      const currentPageData = filteredData.slice(
        startIndex,
        startIndex + rowsPerPage
      );
    
      const totalPages = Math.ceil(filteredData.length / rowsPerPage);



















  return (


    <div className="p-6">
      <button
        id="dropdownSearchButton"
        onClick={toggleDropdown}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Dropdown search{" "}
        <svg
          className="w-2.5 h-2.5 ml-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {dropdownVisible && (
        <div
          id="dropdownSearch"
          className="z-10 bg-white rounded-lg shadow w-60 dark:bg-gray-700 mt-2"
        >
          {/* Selected Count Display */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-600">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {selectedItems.length}/{options.length}
            </span>
          </div>

          {/* Search Box */}
          <div className="p-3">
            <input
              type="text"
              id="input-group-search"
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search user"
            />
          </div>

          {/* Options List */}
          <ul
            className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownSearchButton"
          >
            {filteredOptions.map((option) => (
              <li key={option.id}>
                <div className="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                  <input
                    id={`checkbox-item-${option.id}`}
                    type="checkbox"
                    checked={selectedItems.some((i) => i.id === option.id)}
                    onChange={() => handleCheckboxChange(option)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor={`checkbox-item-${option.id}`}
                    className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                  >
                    {option.planthtscno}
                  </label>
                </div>
              </li>
            ))}
          </ul>

          {/* Clear Selection Button */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={clearSelection}
              className="text-red-600 hover:text-red-800 font-medium text-sm"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Display Selected Items */}
      {selectedItems.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-bold">Selected Items:</h4>
          <ul className="list-disc pl-6">
            {selectedItems.map((item) => (
              <li key={item.id}>{item.planthtscno},{item.id}</li>
            ))}
          </ul>
        </div>
      )}

















{selectedItems.length > 0 && (
       
       <div className="w-full">
       <div className="pl-4 relative overflow-x-auto shadow-md sm:rounded-lg">
         <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
           <table className="w-full border-collapse border border-gray-300">
             <thead className="bg-green-200">
               <tr>
               <th className="border border-gray-300 px-4 py-2">ID</th>
                 {/* <th className="border border-gray-300 px-4 py-2">PLANT NAME</th> */}
                
                 <th className="border border-gray-300 px-4 py-2">PLANT HTSCNO</th>
                 <th className="border border-gray-300 px-4 py-2">TOTAL</th>
                 <th className="border border-gray-300 px-4 py-2">AMR</th>
                 <th className="border border-gray-300 px-4 py-2">O&M</th>
                 <th className="border border-gray-300 px-4 py-2">TRANS</th>
                 <th className="border border-gray-300 px-4 py-2">SOC</th>
                 <th className="border border-gray-300 px-4 py-2">RKVAH</th>
                 <th className="border border-gray-300 px-4 py-2">IEC</th>
                 <th className="border border-gray-300 px-4 py-2">SC</th>
                 <th className="border border-gray-300 px-4 py-2">OC</th>
                 <th className="border border-gray-300 px-4 py-2">DSM</th>

                 {/* <th className="border border-gray-300 px-4 py-2" colSpan={2}>ACTION</th> */}
               </tr>
             </thead>
             <tbody>
               {/* {console.log(filteredData)} */}
               {selectedItems.map((item, index) => {
                 const rowId = index + 1;
                 // console.log(rowId); // Use a unique identifier for each row
                 return (
                   <tr key={rowId}>
                    <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                     {/* <td className="border border-gray-300 px-4 py-2">{item.planthtscno}</td> */}
                     <td className="border border-gray-300 px-4 py-2">{item.planthtscno}</td>
                     <td className="border border-gray-300 px-4 py-2">{Number(item.amr)+Number(item.om)+Number(item.trans)+Number(item.soc)+Number(item.rkvah)+Number(item.iec)+Number(item.sch)+Number(item.other)+Number(item.dsm)}</td>
                     <td className="border border-gray-300 px-4 py-2">{item.amr}</td>
                     <td className="border border-gray-300 px-4 py-2">{item.om}</td>
                     <td className="border border-gray-300 px-4 py-2">{item.trans}</td>
                     <td className="border border-gray-300 px-4 py-2">{item.soc}</td>
                     <td className="border border-gray-300 px-4 py-2">{item.rkvah}</td>
                     <td className="border border-gray-300 px-4 py-2">{item.iec}</td>
                     <td className="border border-gray-300 px-4 py-2">{item.sch}</td>
                     <td className="border border-gray-300 px-4 py-2">{item.other}</td>
                     <td className="border border-gray-300 px-4 py-2">{item.dsm}</td>
                    
                   </tr>
                 );
               })}
             </tbody>

           </table>
         </div></div></div>
   
      )}



































<div className="p-4">
<div>
      <table className="min-w-full border border-gray-300" id="filter-table">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSort(col)}
              >
                <span className="flex items-center">
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                  {sortConfig.key === col ? (
                    sortConfig.direction === "ascending" ? (
                      <svg
                        className="w-4 h-4 ms-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m8 15 4-4 4 4"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 ms-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m8 9 4 4 4-4"
                        />
                      </svg>
                    )
                  ) : (
                    <svg
                      className="w-4 h-4 ms-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m8 15 4 4 4-4m0-6-4-4-4 4"
                      />
                    </svg>
                  )}
                </span>
              </th>
            ))}
          </tr>
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-1"
                  placeholder={`Search ${col}`}
                  onChange={(e) => handleFilterChange(e, col)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="px-4 py-2 text-gray-900 dark:text-white"
                >
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded bg-gray-200"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
    </div>







    </div>
  );
};

export default ChargesEntry;
