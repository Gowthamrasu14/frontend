import axios from "axios";
import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate,Link } from "react-router-dom";
import { LuView } from "react-icons/lu";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import * as XLSX from "xlsx";

const GenBulk = () => {
    const [ip, setip] = useState(localStorage.getItem("localIp"));
    const [fileError, setFileError] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [htData, sethtData] = useState([]);  // Initialize with empty array
    const [plantData, setplantData] = useState([]);  // Initialize with empty array
    const [openSection, setOpenSection] = useState(null);
    const [newEntry, setNewEntry] = useState({
        htscno: '',
        date: '',
        c1: 0,
        c2: 0,
        c4: 0,
        c5: 0,
        amr: '',
        om: '',
        trans: '',
        soc: '',
        rkvah: '',
        iec: '',
        sch: '',
        other: '',
        dsm: ''
    });
    const [excelData, setExcelData] = useState([]); // Store uploaded data  

    const [error, setError] = useState(""); // Store error messages

    // Expected headers
    const requiredHeaders = [
        "PLANTHTSCNO", "DATE", "C1", "C2", "C4", "C5","TOTAL","AMR", "OM",
        "TRANS", "SOC", "RKVAH", "IEC", "SCH", "OTHER", "DSM"
    ];

    const excelSerialToDate = (serial) => {
        const excelEpoch = new Date(1899, 11, 30);
        const date = new Date(excelEpoch.getTime() + serial * 86400000);
        return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    };

    const formatDateString = (dateStr) => {
        if (typeof dateStr === "string" && dateStr.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
            const [year, month, day] = dateStr.split("/");
            return `${day}/${month}/${year}`;
        }
        return dateStr;
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(sheet, {
                raw: false,
                defval: "",
                dateNF: "DD/MM/YYYY",
            });

            // Validate headers
            const fileHeaders = Object.keys(jsonData[0] || {});
            const missingHeaders = requiredHeaders.filter(header => !fileHeaders.includes(header));

            if (missingHeaders.length > 0) {
                alert(`Error: Missing headers - ${missingHeaders.join(", ")}`);
                return;
            }

            // Process data
            const formattedData = jsonData.map((row) => {
                requiredHeaders.forEach((key) => {
                    if (!row.hasOwnProperty(key)) {
                        row[key] = ""; // Ensure missing properties are set
                    }

                    if (typeof row[key] === "number") {
                        row[key] = row[key] > 10000 ? excelSerialToDate(row[key]) : row[key].toString().padStart(12, "0");
                    } else {
                        row[key] = formatDateString(row[key]);
                    }
                });
                return row;
            });

            setExcelData(formattedData);
            alert("File uploaded successfully!");
        };

        reader.readAsArrayBuffer(file);
    };




    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    };

    const formatDate1 = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchmaxplantData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/getmaxplantread");
            setTableData(response.data);

        };
        const fetchhtdetailData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/getmaxconread");
            sethtData(response.data);
        };
        const fetchplantData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/getplant");
            setplantData(response.data);

        };

        fetchhtdetailData();
        fetchplantData();
        fetchmaxplantData();
    }, []);
 

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...excelData];
        updatedRows[index][field] = value;
        setExcelData(updatedRows);
    };
  

  
    const handledateChange = (e) => {
        const selectedDate = e.target.value;
        const date = new Date(selectedDate);
        const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const year = lastDayOfMonth.getFullYear();
        const month = String(lastDayOfMonth.getMonth() + 1).padStart(2, "0");
        const day = String(lastDayOfMonth.getDate()).padStart(2, "0");
        const formattedLastDay = `${year}-${month}-${day}`;

        if (selectedDate !== formattedLastDay) {
            alert("Please select the last date of the month.");
            setNewEntry((newEntry) => ({
                ...newEntry,
                date: formattedLastDay,
            }));
        } else {
            setNewEntry((newEntry) => ({
                ...newEntry,
                date: selectedDate,
            }));
        }
    };

 const navigate = useNavigate();
    const handleSubmit = async () => {
        // alert(JSON.stringify((newEntry)));

        console.log(excelData);
        await axios
            .post("http://147.79.68.117:8000/api/createplantread1", excelData)
            .then((response) => {
                alert(JSON.stringify(response.data), { position: "top-right" });
                navigate("/Plantreadentry");
            })
            .catch((error) => console.log(error));
    };

    // const handleDelete = async (id,id1) => {
    //     alert(id,id1);
    // await axios
    //     .delete(`http://147.79.68.117:8000/api/deleteplantread/${id}`)
    //     .then((response) => {
    //         alert(JSON.stringify(response.data), { position: "top-right" });
    //         window.location.reload();
    //     })
    //     .catch((error) => console.log(error));

    // const updatedInjectionList = tableData.filter((item) => item.id !== id);
    // setTableData(updatedInjectionList);
    // };


    const handleDelete = async (id, id1) => {
        alert(`ID1: ${id}, ID2: ${id1}`);

        try {
            // Fetch data
            const response = await axios.get("http://147.79.68.117:8000/api/gethtleadger");
            const ftr = response.data;

            // Check if deletion is allowed
            if (ftr.some(item => item.mo_year === id1)) {
                alert("You can't delete this entry");
                return; // Exit function
            }

            // Proceed with deletion
            const deleteResponse = await axios.delete(`http://147.79.68.117:8000/api/deleteplantread/${id}`);
            alert(JSON.stringify(deleteResponse.data));

            // Update table data after deletion
            setTableData(prevData => prevData.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while processing your request.");
        }
    };



    const minDate = (() => {
        if (htData.length > 0 && htData[0].mo_year) {
            const moYear = htData[0].mo_year;  // Assumes mo_year exists in the first record
            if (typeof moYear === "string") {
                const date = new Date(moYear);
                return isNaN(date) ? null : formatDate1(date);
            }
            if (typeof moYear === "number") {
                return `${moYear}-01-01`; // Default to January 1st of that year
            }
            if (moYear instanceof Date) {
                return formatDate1(moYear);
            }
        }
        return null;
    })();

    const validateFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileExt = file.name.split(".").pop().toLowerCase();
            if (fileExt !== "xlsx") {
                setFileError(true);
            } else {
                setFileError(false);
            }
        }
    };
    
          // Example function to navigate with data
       
    

    return (
        <div className="mx-auto p-4">
            <div className="text-center font-bold">
                <h1>GEN PLANT READING</h1>
            </div>

            <div className="grid mb-2">
                <div className="p-4 rounded-lg mb-2">


                    <div className="flex items-center space-x-4">
                        <label
                            className="text-sm font-medium text-gray-900 dark:text-white"
                            htmlFor="file_input"
                        >
                            Upload file
                        </label>
                        <input
                            className="w-96 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="file_input"
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={(e) => {
                                validateFile(e);
                                handleFileUpload(e);
                            }}
                        />

                        <p
                            className={`text-sm font-medium ${fileError ? "text-red-500" : "text-gray-900 dark:text-white"
                                }`}
                        >
                            {fileError ? "Invalid file! Only Xlsx files are allowed." : "Only Xlsx Files."}
                        </p>
                    </div>


                </div>
            </div>




            <div className="p-6">
           <div className="text-center font-Montserrat font-bold"> <h1>GEN PLANT READING</h1> </div>
            <div className="w-full font-Montserrat">
                <div className="pl-4 relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="overflow-y-auto" style={{ maxHeight: "700px" }}>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-green-200">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">ID</th>
                                    <th className="border border-gray-300 px-4 py-2">PLANT HTSCNO</th>
                                    <th className="border border-gray-300 px-4 py-2">DATE</th>
                                    <th scope="col" className="border border-gray-300 px-4 py-2">C1</th>
                            <th scope="col" className="border border-gray-300 px-4 py-2">C2</th>
                            <th scope="col" className="border border-gray-300 px-4 py-2">C4</th>
                            <th scope="col" className="border border-gray-300 px-4 py-2">C5</th>
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
                                {excelData.map((row, index) => (
                                    <tr key={row.id}>
                                        <td className="border border-gray-300 px-4 py-2">{index+1}</td>
                                        <td className="border border-gray-300 px-4 py-2">{row.PLANTHTSCNO}</td>
                                        <td className="border border-gray-300 px-4 py-2">{formatDate(row.DATE)}</td>
                                        {/* <td className="border border-gray-300 px-4 py-2">{row.total}</td> */}
                                        {["C1","C2","C4","C5","AMR", "OM", "TRANS", "SOC", "RKVAH", "IEC", "SC", "OC", "DSM"].map((field) => (
                                            <td className="border border-gray-300 px-4 py-2" key={field}>
                                                <input
                                                    type="number"
                                                    placeholder={`Enter ${field.toUpperCase()}`}
                                                    value={row[field] || 0}
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
                  <button onClick={handleSubmit} type="submit"
                    className="font-bold py-2 px-4 rounded-md h-10 w-30 bg-green-800 hover:bg-sky-600 text-white shadow-xl"
                  >SUBMIT</button>
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
        
        </div>
        
    );
};

export default GenBulk;
