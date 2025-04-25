import React, { useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";


const Allotcharges = () => {


    const location = useLocation();
    const { filteredData, conread } = location.state || { filteredData: [], conread: {} };
    
    // Ensure filteredData is treated as an array of objects correctly
    const [rows, setRows] = useState(filteredData);
    const [data, setData] = useState(conread);
    
    // console.log("Rows:", rows);  // Should print array of objects
    // console.log("Data:", data); 
    

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

    // const handleSubmit = () => {
    //     console.log("Submitted Data:", rows);
    //     // Perform further actions (e.g., API call) here.
    // };
      const navigate = useNavigate();
      // Example function to navigate with data
      const handleNavigate = () => {
        navigate("/Allotsave", { state: { filteredData, conread } });
      };

    return (
        <div className="p-6">
           <div className="text-center font-Montserrat font-bold"> <h1>CHARGES ENTRY</h1> </div>
            <div className="w-full font-Montserrat">
                <div className="pl-4 relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="overflow-y-auto" style={{ maxHeight: "700px" }}>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-green-200">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">ID</th>
                                    <th className="border border-gray-300 px-4 py-2">GEN PLANT NAME</th>
                                    <th className="border border-gray-300 px-4 py-2">GEN PLANT HTSCNO</th>
                                    {/* <th className="border border-gray-300 px-4 py-2">TOTAL</th> */}
                                    <th className="border border-gray-300 px-4 py-2">AMR</th>
                                    <th className="border border-gray-300 px-4 py-2">O&M</th>
                                    <th className="border border-gray-300 px-4 py-2">TRANS</th>
                                    <th className="border border-gray-300 px-4 py-2">SOC</th>
                                    <th className="border border-gray-300 px-4 py-2">RKVAH</th>
                                    <th className="border border-gray-300 px-4 py-2">IEC</th>
                                    <th className="border border-gray-300 px-4 py-2">SC</th>
                                    <th className="border border-gray-300 px-4 py-2">OC</th>
                                    <th className="border border-gray-300 px-4 py-2">DSM</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={row.id}>
                                        <td className="border border-gray-300 px-4 py-2">{row.id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{row.gen_name}</td>
                                        <td className="border border-gray-300 px-4 py-2">{row.weg_htscno}</td>
                                        {/* <td className="border border-gray-300 px-4 py-2">{row.total}</td> */}
                                        {["amr", "om", "trans", "soc", "rkvah", "iec", "sch", "other", "dsm"].map((field) => (
                                            <td className="border border-gray-300 px-4 py-2" key={field}>
                                                <input
                                                    type="number"
                                                    placeholder={`Enter ${field.toUpperCase()}`}
                                                    value={row[field] || "0"}
                                                    onChange={(e) =>
                                                        handleInputChange(index, field, e.target.value)
                                                    }
                                                    className="peer block w-24 border-0 border-b-2 border-transparent text-center bg-transparent px-0 py-1 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex p-4 mx-5 justify-center">
                  <button onClick={handleNavigate} type="submit"
                    className="font-bold py-2 px-4 rounded-md h-10 w-30 bg-green-800 hover:bg-sky-600 text-white shadow-xl"
                  >NEXT</button>
                </div>
                    {/* <div className="mt-4 mb-4 text-center">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 rounded"
                        >
                            Submit
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default Allotcharges;
