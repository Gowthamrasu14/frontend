import axios from "axios";
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom";
import { LuView } from "react-icons/lu";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import * as XLSX from "xlsx";

const Genplant1 = () => {
    const [ip, setip] = useState(localStorage.getItem("localIp"));
    const [fileError, setFileError] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [htData, sethtData] = useState([]);
    const [htDetail, sethtDetail] = useState([]); // Initialize with empty array
    const [plantData, setplantData] = useState([]);  // Initialize with empty array
    const [openSection, setOpenSection] = useState(null);
    const [pri, setpri] = useState([]);
    const [conhtscno, setconhtscno] = useState();

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
        "HTSCNO", "PLANTNAME", "GENPLANTHTSCNO", "INJ_VOLT", "D.O.C",
        "IEX/CAPTIVE/THIRDPARTY", "WIND/SOLAR/BIOMASS/BAGASSE/THERMAL",
        "REC/NON-REC", "BANKING-YES/NO"
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



    // Format to YYYY-MM-DD HH:mm:ss
    const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };




    useEffect(() => {
        const fetchmaxplantData = async () => {
            const response = await axios.get("http://" + ip + ":8000/api/getmaxplantread");
            setTableData(response.data);

        };
        const fetchhtdetailData = async () => {
            const response = await axios.get("http://" + ip + ":8000/api/getmaxconread");
            sethtData(response.data);
        };
        const fetchplantData = async () => {
            const response = await axios.get("http://" + ip + ":8000/api/getplant");
            setplantData(response.data);

        };
        const fetchhtData = async () => {
            const response = await axios.get("http://" + ip + ":8000/api/gethtdetail");
            sethtDetail(response.data);

        };

        const fetchpri = async () => {
            const response = await axios.get("http://" + ip + ":8000/api/getplanttype");
            setpri(response.data);

        };

        fetchpri();
        fetchhtData();
        fetchhtdetailData();
        fetchplantData();
        fetchmaxplantData();
    }, []);

    const [processedData, setProcessedData] = useState([]);
    const [ProcessingData, setProcessingData] = useState([]);
    useEffect(() => {
        // Step 1: Filter excelData where HTSCNO === selected conhtscno
        // AND plantData contains NO record with same conhtscno and same weg_htscno
        const filteredData1 = excelData.filter(plant => {
          return (
            plant.HTSCNO === conhtscno &&
            !plantData.some(
              p =>
                p.con_htscno === conhtscno &&
                p.weg_htscno === plant.GENPLANTHTSCNO
            )
          );
        });
      
        setProcessingData(filteredData1);
      
        // Step 2: Map filtered data and add extra fields
        const updatedData = filteredData1.map(row => {
          const ict = row["IEX/CAPTIVE/THIRDPARTY"]?.toString().trim() || "";
          const type = row["WIND/SOLAR/BIOMASS/BAGASSE/THERMAL"]?.toString().trim() || "";
          const rec = row["REC/NON-REC"]?.toString().trim() || "";
      
          const matchString = [ict, type, rec].filter(Boolean).join(" ").trim();
      
          const priMatch = pri.find(plant =>
            plant.plant_name?.trim() === matchString
          );
      
          const htMatch = htDetail.find(plant => plant.htscno === conhtscno);
      
          const d1 = formatDate(new Date());
          const d2 = formatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 5)));
          const d3 = formatDateTime(new Date());
      
          return {
            ...row,
            priority: priMatch ? priMatch.priority : "No Match",
            gen_type: matchString,
            com_id: htMatch?.com_id || "",
            fromdate: d1,
            todate: d2,
            user: "ADMIN",
            date_time: d3,
            con_htscno: row["HTSCNO"],
            gen_name: row["PLANTNAME"],
            weg_htscno: row["GENPLANTHTSCNO"],
            doc: formatDate1(row["D.O.C"]),
            inj_volt: row["INJ_VOLT"],
            ban_op: row["BANKING-YES/NO"],
          };
        });
        console.log(updatedData)
        setProcessedData(updatedData);
      }, [excelData, conhtscno, pri, plantData, htDetail]);
      


    const handleInputChange = (index, field, value) => {
        const updatedRows = [...excelData];
        updatedRows[index][field] = value;
        setExcelData(updatedRows);
    };


    const handleworks = (index, field, value) => {
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
        try {
            console.log("Sending Data:", processedData);

            const response = await axios.post(`http://147.79.68.117:8000/api/createplantexcel`, processedData, {
                headers: { "Content-Type": "application/json" }
            });

            alert(JSON.stringify(response.data), { position: "top-right" });
            navigate("/test");
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
        }
    };




    const handleDelete = async (id, id1) => {
        alert(`ID1: ${id}, ID2: ${id1}`);

        try {
            // Fetch data
            const response = await axios.get("http://" + ip + ":8000/api/gethtleadger");
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
                <h1>GEN PLANT DETAIL</h1>
            </div>

            <div className="grid mb-2">
                <div className="p-4 rounded-lg mb-2">


                    <div className="flex items-center space-x-4">

                        <select className="block py-2.5 px-0 w-56 text-sm text-gray-500 bg-transparent border-0 border-b-2
                             border-gray-300 appearance-none focus:border-gray-200 peer"
                            value={conhtscno}
                            name="con_htscno"
                            onChange={(e) => {
                                // handleidChange(e);
                                // alert(e.target.value);
                                setconhtscno(e.target.value);


                            }}
                        >
                            <option value="" >SELECT HTSCNO</option>
                            {htDetail.map((item) => (
                                <option key={item.id} value={item.htscno}>
                                    {item.htscno}
                                </option>
                            ))}

                        </select>

                        {/* <label
                            className="text-sm font-medium text-gray-900 dark:text-white"
                            htmlFor="file_input"
                        >
                            Upload file
                        </label> */}
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
                <div className="text-center font-Montserrat font-bold"> <h1>GEN PLANT DETAIL</h1> </div>
                <div className="w-full font-Montserrat">
                    <div className="pl-4 relative overflow-x-auto shadow-md sm:rounded-lg">
                        <div className="overflow-y-auto" style={{ maxHeight: "700px" }}>
                            <table className="w-full border-collapse border border-gray-300">
                                <thead className="bg-green-200">
                                    <th className="w-full text-center" colSpan={10}>{conhtscno}</th>
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">ID</th>
                                        <th className="border border-gray-300 px-4 py-2">PLANT NAME</th>
                                        <th className="border border-gray-300 px-4 py-2">PLANT HTSCNO</th>
                                        <th scope="col" className="border border-gray-300 px-4 py-2">D.O.C</th>
                                        <th scope="col" className="border border-gray-300 px-4 py-2">INJ</th>
                                        <th scope="col" className="border border-gray-300 px-4 py-2">BANKING</th>
                                        <th scope="col" className="border border-gray-300 px-4 py-2">PLANT TYPE</th>
                                        {/* <th className="border border-gray-300 px-4 py-2">AMR</th>
                                    <th className="border border-gray-300 px-4 py-2">O&M</th>
                                    <th className="border border-gray-300 px-4 py-2">TRANS</th>
                                    <th className="border border-gray-300 px-4 py-2">SOC</th>
                                    <th className="border border-gray-300 px-4 py-2">RKVAH</th>
                                    <th className="border border-gray-300 px-4 py-2">IEC</th>
                                    <th className="border border-gray-300 px-4 py-2">SC</th>
                                    <th className="border border-gray-300 px-4 py-2">OC</th>
                                    <th className="border border-gray-300 px-4 py-2">DSM</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {processedData.map((row, index) => (
                                        <tr key={row.id}>
                                            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                            {/* <td className="border border-gray-300 px-4 py-2">{row.PLANTHTSCNO}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatDate(row.DATE)}</td> */}
                                            {/* <td className="border border-gray-300 px-4 py-2">{row.total}</td> */}
                                            {["PLANTNAME", "GENPLANTHTSCNO"].map((field) => (
                                                <td className="border border-gray-300 px-4 py-2" key={field}>
                                                    <input
                                                        type="text"
                                                        placeholder={`Enter ${field.toUpperCase()}`}
                                                        value={row[field] || 0}
                                                        onChange={(e) =>
                                                            handleInputChange(index, field, e.target.value)
                                                        }
                                                        className="peer block w-24 border-0 border-b-2 border-transparent text-center bg-transparent px-0 py-1 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                                                        readOnly />
                                                </td>
                                            ))}
                                            <td className="border border-gray-300 px-4 py-2">
                                                {formatDate(new Date(row["D.O.C"]))}
                                            </td>

                                            {["INJ_VOLT", "BANKING-YES/NO"].map((field) => (
                                                <td className="border border-gray-300 px-4 py-2" key={field}>
                                                    <input
                                                        type="text"
                                                        placeholder={`Enter ${field.toUpperCase()}`}
                                                        value={row[field] || 0}
                                                        onChange={(e) =>
                                                            handleInputChange(index, field, e.target.value)
                                                        }
                                                        className="peer block w-24 border-0 border-b-2 border-transparent text-center bg-transparent px-0 py-1 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                                                        readOnly />
                                                </td>
                                            ))}
                                            {/* {console.log(processedData)} */}
                                            <td className="border border-gray-300 px-4 py-2">
                                                {`${row["IEX/CAPTIVE/THIRDPARTY"]} ${row["WIND/SOLAR/BIOMASS/BAGASSE/THERMAL"]} ${row["REC/NON-REC"]}`}
                                            </td>




                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        

                        <div className="flex p-4 mx-5 justify-center">
  <button
    onClick={handleSubmit}
    type="submit"
    disabled={Object.keys(processedData).length === 0}
    className={`font-bold py-2 px-4 rounded-md h-10 w-30 shadow-xl text-white
      ${Object.keys(processedData).length === 0 
        ? 'bg-gray-400 cursor-not-allowed' 
        : 'bg-green-800 hover:bg-sky-600'}`}
  >
    SUBMIT
  </button>
</div>


                        {/* <div className="flex p-4 mx-5 justify-center">
                            <button onClick={handleSubmit} type="submit"
                                className="font-bold py-2 px-4 rounded-md h-10 w-30 bg-green-800 hover:bg-sky-600 text-white shadow-xl"
                            >SUBMIT</button>
                        </div> */}




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

export default Genplant1;
