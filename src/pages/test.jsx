
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { ImFileOpenoffice } from "react-icons/im";
import { LuView } from "react-icons/lu";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import html2pdf from "html2pdf.js";


const GenPlant = () => {
    const [ip, setip] = useState(localStorage.getItem("localIp"));
    const [openSection, setOpenSection] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [tableData, setTableData] = useState([{}]);
    const [plantData, setplantData] = useState([{}]);
    const [Injection, setNewInjection] = useState([{}]);
    const [htdetail, sethtdetail] = useState([{}]);


    const [isView, setIsView] = useState(false);
    const [ViewData, setViewData] = useState({ com_id: '', gen_name: '', con_htscno: '', weg_htscno: '', doc: '', gen_type: '', inj_volt: '', ban_op: '', priority: '', id: null });
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        // Format the date as you need, for example: DD-MM-YYYY
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    };
    const handleView = (item) => {
        console.log({ com_id: item.com_id, gen_name: item.gen_name, con_htscno: item.con_htscno, weg_htscno: item.weg_htscno, doc: item.doc, gen_type: item.gen_type, inj_volt: item.inj_volt, ban_op: item.ban_op, priority: item.priority, id: item.id });
        setViewData({ com_id: item.com_id, gen_name: item.gen_name, con_htscno: item.con_htscno, weg_htscno: item.weg_htscno, doc: item.doc, gen_type: item.gen_type, inj_volt: item.inj_volt, ban_op: item.ban_op, priority: item.priority, id: item.id });
        setIsView(true);
    };



    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ com_id: '', gen_name: '', con_htscno: '', weg_htscno: '', doc: '', gen_type: '', inj_volt: '', ban_op: '', priority: '', id: null });

    const handleEdit = (item) => {
        setEditData({ com_id: item.com_id, gen_name: item.gen_name, con_htscno: item.con_htscno, weg_htscno: item.weg_htscno, doc: item.doc, gen_type: item.gen_type, inj_volt: item.inj_volt, ban_op: item.ban_op, priority: item.priority, id: item.id });
        setIsEditing(true);
    };

    useEffect(() => {
        const fetchplantreadData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/getplant");
            // console.log(response.data);
            setTableData(response.data);
        }
        const fetchplanttypeData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/getplanttype");
            setplantData(response.data);
        }
        const fetchinjData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/getinj");
            setNewInjection(response.data);
        }
        const fetchhtdetailData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/gethtdetail");
            sethtdetail(response.data);
        }

        fetchinjData();
        fetchplanttypeData();
        fetchplantreadData();
        fetchhtdetailData();


    }, [])

    const exportToExcel = () => {
        console.log(tableData);
        const ws = XLSX.utils.json_to_sheet(tableData); // Convert JSON to sheet
        const wb = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(wb, ws, "PLANT TYPE"); // Append sheet to workbook

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "PLANT TYPE.xlsx"); // Save as file
    };




    // PDF export function using html2pdf.js



    const tableRef = useRef(null);
    const exportToPDF = () => {
        const element = tableRef.current; // Get table element via useRef

        // Temporarily hide the Actions column
        const tableRows = element.querySelectorAll('tr');
        tableRows.forEach(row => {
            const actionCell = row.querySelectorAll('td').length > 3 ? row.querySelectorAll('td')[3] : null;
            const headerActionCell = row.querySelectorAll('th').length > 3 ? row.querySelectorAll('th')[3] : null;

            if (actionCell) actionCell.style.display = 'none'; // Hide data cell
            if (headerActionCell) headerActionCell.style.display = 'none'; // Hide header cell
        });

        // Options for pdf export
        const options = {
            margin: 0.5,
            filename: 'PLANT TYPE.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        };

        // Generate PDF and save
        html2pdf().from(element).set(options).save().then(() => {
            // Revert display of the Actions column
            tableRows.forEach(row => {
                const actionCell = row.querySelectorAll('td').length > 3 ? row.querySelectorAll('td')[3] : null;
                const headerActionCell = row.querySelectorAll('th').length > 3 ? row.querySelectorAll('th')[3] : null;

                if (actionCell) actionCell.style.display = ''; // Show data cell
                if (headerActionCell) headerActionCell.style.display = ''; // Show header cell
            });
        });
    };





    const print = () => {
        const tableElement = tableRef.current;

        // Clone the table to manipulate a copy without affecting the original
        const tableClone = tableElement.cloneNode(true);

        // Hide the Actions column in the clone
        const rows = tableClone.querySelectorAll('tr');
        rows.forEach((row) => {
            const actionCell = row.querySelectorAll('th, td').length > 3 ? row.querySelectorAll('th, td')[3] : null;
            if (actionCell) {
                actionCell.style.display = 'none'; // Hide the Actions cell
            }
        });

        // Create an iframe to hold the table content
        const printWindow = document.createElement('iframe');
        document.body.appendChild(printWindow);
        printWindow.style.position = 'absolute';
        printWindow.style.width = '0';
        printWindow.style.height = '0';
        printWindow.style.border = 'none';

        // Write table HTML to iframe document with enhanced CSS
        const doc = printWindow.contentDocument || printWindow.contentWindow.document;
        doc.open();
        doc.write(`
                <html>
                    <head>
                        <title>Print Table</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                padding: 20px;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 20px;
                            }
                            th, td {
                                border: 1px solid #ddd;
                                padding: 8px;
                                text-align: center;
                            }
                            th {
                                background-color: #f2f2f2;
                                color: #333;
                                font-weight: bold;
                            }
                            tr:nth-child(even) {
                                background-color: #f9f9f9;
                            }
                            tr:hover {
                                background-color: #f1f1f1;
                            }
                            h2 {
                                text-align: center;
                                color: #333;
                            }
                        </style>
                    </head>
                    <body>
                        <h2>PLANT TYPE TABLE</h2>
                        ${tableClone.outerHTML}
                    </body>
                </html>
            `);
        doc.close();

        // Print the iframe content
        printWindow.contentWindow.print();

        // Clean up by removing the iframe after printing
        printWindow.addEventListener('afterprint', () => {
            printWindow.remove();
        });
    };


    // Input fields state
    const [newEntry, setNewEntry] = useState({
        com_id: '', gen_name: '', con_htscno: '', weg_htscno: '', doc: '', gen_type: '', inj_volt: '', ban_op: '', priority: ''
    });

    // Toggle section
    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index);
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry({ ...newEntry, [name]: value });
    };
    const handleplantChange = (e) => {
        // const { name, value } = e.target;
        const filteredData = plantData.find(plant => plant.plant_name === e.target.value);

        if (filteredData) {
            console.log(filteredData.priority);
            setNewEntry((newEntry) => ({
                ...newEntry,
                priority: filteredData.priority, // Store the entire selectedPlant object or its specific fields
            }));
            // setNewEntry({ ...newEntry, priority: filteredData.priority });
        } else {
            console.log("No matching plant found");
        }

    };
    const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };


    const d1 = formatDate(new Date()); // Get the current date
    const nextYear = new Date(d1); // Create a copy of d1
    nextYear.setFullYear(nextYear.getFullYear() + 5); // Add one year

    const d2 = formatDate(nextYear); // Format the new date
    const d3 = formatDateTime(new Date()); // Format the new date


    const handleidChange = (e) => {
        // const { name, value } = e.target;
        const filteredData = htdetail.find(plant => plant.htscno === e.target.value);

        if (filteredData) {
            console.log(filteredData.com_id);
            setNewEntry((newEntry) => ({
                ...newEntry,
                com_id: filteredData.com_id,
                fromdate: d1,
                todate: d2,
                user: "ADMIN",
                date_time: d3,  // Store the entire selectedPlant object or its specific fields
            }));
            // setNewEntry({ ...newEntry, priority: filteredData.priority });
        } else {
            console.log("No matching plant found");
        }

    };


    // Handle search
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    // Add new entry to table

    // const handleSubmit1 = async () => {
    //     var cid = (newEntry.gen_name).substring(0, 4) + (newEntry.weg_htscno).substring(8, 12);
    //     setNewEntry((newEntry) => ({
    //         ...newEntry,
    //         com_id: cid,
    //     }));

    // }

    // useEffect(() => {
    //     if (newEntry.com_id) {
    //         handleSubmit(); // Submit once `com_id` is updated
    //     }
    // }, [newEntry.com_id]);


    const handleSubmit = async () => {

     

        alert(JSON.stringify(newEntry));
        await axios.post("http://147.79.68.117:8000/api/createplant", newEntry)
            .then((response) => {
                // alert("OK");
                alert(JSON.stringify(response.data), { position: "top-right" })
                window.location.reload();
            })
            .catch(error => console.log(error))
    };

    // Filter table data based on search query
    const filteredData = tableData.filter((row) =>
        Object.values(row).some(value => value.toString().toLowerCase().includes(searchQuery))
    );
    
    const handleEditSubmit = () => {

        

        alert(JSON.stringify(editData)); // Check the data being sent
        axios.put(`http://147.79.68.117:8000/api/updateplant/${editData.id}`, {
            com_id: editData.com_id,
            gen_name: editData.gen_name,
            con_htscno: editData.con_htscno,
            weg_htscno: editData.weg_htscno,
            doc: editData.doc,
            gen_type: editData.gen_type,
            inj_volt: editData.inj_volt,
            ban_op: editData.ban_op,
            priority: editData.priority,
        


        })
            .then(() => {
                const updatedData = tableData.map(tableData =>
                    tableData.id === editData.id
                        ? {
                            ...tableData,  // Spread the existing `PLANT TYPE` to keep other fields intact
                            com_id: editData.com_id,
                            gen_name: editData.gen_name,
                            con_htscno: editData.con_htscno,
                            weg_htscno: editData.weg_htscno,
                            doc: editData.doc,
                            gen_type: editData.gen_type,
                            inj_volt: editData.inj_volt,
                            ban_op: editData.ban_op,
                            priority: editData.priority,


                        }
                        : tableData  // Return the original `PLANT TYPE` if ID does not match
                );

                setTableData(updatedData);  // Update the state with new data
                setIsEditing(false); // Close the modal or form
            })
            .catch(error => console.error(error));
    };


    const handleDelete = async (id) => {
        // Filter out the item with the given id


        await axios.delete(`http://147.79.68.117:8000/api/deleteplant/${id}`)
            .then((response) => {
                // alert("OK");
                alert(JSON.stringify(response.data), { position: "top-right" })
                window.location.reload();
            })
            .catch(error => console.log(error))

        const updatedInjectionList = tableData.filter((item) => item.id !== id);
        console.log(updatedInjectionList);
        setTableData(updatedInjectionList);


        // Update the state
    };

    useEffect(() => {
        console.log("Updated editData:", editData);
    }, [editData]);
    
    const handleeditChange = (e) => {
        const selectedValue = e.target.value;
    
        // Alert the selected value
        // alert(JSON.stringify(selectedValue));
    
        // Find the matching plant
        const filteredData = plantData.find(plant => plant.plant_name === selectedValue);
    
        if (filteredData) {
            console.log(filteredData.priority);
    
            // Update both `priority` and `gen_type` state together
            setEditData((prevState) => ({
                ...prevState,
                gen_type: selectedValue, // Update gen_type
                priority: filteredData.priority, // Update priority based on selected plant
            }));
    
        } else {
            console.log("No matching plant found");
        }
    };
    

    const exportExcel = () => {
        // Define the headers as a 2D array (each row is an array)
        const headers = [[
            "HTSCNO", "PLANTNAME", "GENPLANTHTSCNO", "INJ_VOLT", "D.O.C",
            "IEX/CAPTIVE/THIRD PARTY", "WIND/SOLAR/BIOMASS/BAGASSE/THERMAL",
            "REC/NON-REC", "BANKING-YES/NO"
        ]];
    
        // Create a worksheet
        const ws = XLSX.utils.aoa_to_sheet(headers);
    
        // Create a workbook and append worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "GENERATOR");
    
        // Export the file
        XLSX.writeFile(wb, "GEN_PLANT_DETAIL_ENTRY.xlsx");
    };
    
   const navigate = useNavigate();
    // Example function to navigate with data
    const handleNavigate = () => {
        navigate("/TEST1");
    };
    return (
        <div className="mx-auto p-4">
            <div className="text-center font-bold">
                <h1> GEN PLANT DETAILS</h1>
            </div>



            <div className="grid mb-2">
                <div className="p-4 rounded-lg mb-2">
                    <div className="flex justify-between items-center w-full px-4">
                        {/* Left-aligned SVG Button */}
                        <div>
                    <button
                        onClick={() => toggleSection(1)}
                        data-modal-target="default-modal"
                        data-modal-toggle="default-modal"
                        type="button"
                        className="p-0 w-12 h-12 bg-blue-600 rounded-full hover:bg-green-700 active:shadow-lg shadow transition ease-in duration-200 focus:outline-none"
                    >
                        <svg viewBox="0 0 20 20" className="w-6 h-6 inline-block">
                            <path fill="#FFFFFF" d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                                C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                                C15.952,9,16,9.447,16,10z" />
                        </svg>
                    </button>
                    </div>

{/* Right-aligned Buttons */}
<div className="flex space-x-4">
    <button
        onClick={exportExcel}
        className="px-4 py-2 bg-green-700 text-white rounded-lg shadow-md hover:bg-rose-500"
    >
        EXCEL FORMAT
    </button>
    <button
        onClick={handleNavigate}
        className="p-2 bg-blue-600 text-white rounded hover:bg-green-700 active:shadow-lg shadow transition ease-in duration-200 focus:outline-none"
    >
        BULK UPLOAD
    </button>
</div>
</div>
                    {openSection === 1 && (
                        <div className="grid gap-6 mb-6 md:grid-cols-5 p-6">


                            <select className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2
                             border-gray-300 appearance-none focus:border-gray-200 peer"
                                value={newEntry.con_htscno}
                                name="con_htscno"
                                onChange={(e) => {
                                    handleInputChange(e);
                                    handleidChange(e);


                                }}>
                                <option value="" >SELECT HTSCNO</option>
                                {htdetail.map((item) => (
                                    <option key={item.id} value={item.htscno}>
                                        {item.htscno}
                                    </option>
                                ))}

                            </select>
                            <div className="relative z-0">
                                <input
                                    type="text"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    value={newEntry.gen_name}
                                    name="gen_name"
                                    onChange={handleInputChange}
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                   GEN PLANT NAME
                                </label>
                            </div>
                            <input
                                type="hidden"
                                className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                placeholder=" "
                                value={newEntry.con_htscno}
                                name="con_htscno"
                                onChange={handleInputChange}
                            />
                            <div className="relative z-0">
                                <input
                                    type="text"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    value={newEntry.weg_htscno}
                                    name="weg_htscno"
                                    onChange={handleInputChange}
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                   GEN PLANT HTSCNO
                                </label>
                            </div>
                            <select className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-gray-200 peer"


                                value={newEntry.gen_type}
                                name="gen_type"
                                onChange={(e) => {
                                    handleInputChange(e);
                                    handleplantChange(e);

                                }}>
                                <option disabled value=""> SELECT PLANT TYPE </option>
                                {plantData.map((item) => (
                                    <option key={item.id} value={item.plant_name}>
                                        {item.plant_name}
                                    </option>
                                ))}
                            </select>
                            <div className="relative z-0">
                                <input
                                    type="date"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    value={newEntry.doc}
                                    name="doc"
                                    onChange={handleInputChange}
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    D.O.C
                                </label>
                            </div>
                            <select className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-gray-200 peer"
                                value={newEntry.inj_volt}
                                name="inj_volt"
                                onChange={handleInputChange}
                            >
                                <option selected>SELECT INJ VOLT</option>
                                {Injection.map((item) => (
                                    <option key={item.id} value={item.inj}>
                                        {item.inj}
                                    </option>
                                ))}
                            </select>

                            <select className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-gray-200 peer"
                                value={newEntry.ban_op}
                                name="ban_op"
                                onChange={handleInputChange}
                            >
                                <option selected>SELECT BANKING OPTION</option>
                                <option value="YES">YES</option>
                                <option value="NO">NO</option>
                            </select>

                            <div className="flex p-1 mx-5 justify-center">
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="font-bold py-2 px-4 rounded-md h-10 w-30 bg-green-800 hover:bg-sky-600 text-white shadow-xl"
                                >
                                    SUBMIT
                                </button>
                            </div>

                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center mb-4 pr-4">
                {/* Left Side - Search Input */}

                <div className="pl-4">
                    <input
                        type="text"
                        placeholder="Search Line Loss"
                        className="p-2 border rounded"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Right Side - Export Icons */}
                <div className="flex items-center space-x-4">
                    <img
                        className="w-12 h-12 cursor-pointer"
                        onClick={exportToPDF}
                        src="../src/assets/pdf.png"
                        alt="Export to PDF"
                    />
                    <img
                        className="pl-2 w-10 h-8 cursor-pointer"
                        onClick={exportToExcel}
                        src="../src/assets/xlsx.png"
                        alt="Export to Excel"
                    />
                    <img
                        className="pl-4 w-12 h-10 cursor-pointer"
                        onClick={print}
                        src="../src/assets/pnt.png"
                        alt="Export to PDF"
                    />
                </div>
            </div>

            <div className="w-full">
                <div className="pl-4 relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
                        <table ref={tableRef} className="border-2 bg-gray-200 w-full text-sm text-center text-gray-500 dark:text-gray-400" id="PLANT TYPE">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">SL.No</th>
                                    <th scope="col" className="px-6 py-3">GEN PLANT NAME</th>
                                    <th scope="col" className="px-6 py-3">SERVICE NO</th>
                                    <th scope="col" className="px-6 py-3">INJ VOLT</th>
                                    <th scope="col" className="px-6 py-3">TYPE</th>

                                    <th scope="col" className="px-6 py-3" colSpan="3">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row, index) => (
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4">{index + 1}</td>
                                        <td className="px-6 py-4">{row.gen_name}</td>
                                        <td className="px-6 py-4">{row.weg_htscno}</td>
                                        <td className="px-6 py-4">{row.inj_volt}</td>
                                        <td className="px-6 py-4">{row.gen_type}</td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-center space-x-2">
                                                <Link to="#"
                                                    // onClick={() => handleView(item)} 
                                                    onClick={() => handleView(row)}
                                                    className="font-bold text-sky-600 text-lg p-1"><LuView />
                                                </Link>
                                                <Link
                                                    to="#"
                                                    onClick={() => handleEdit(row)}
                                                    className="font-bold text-green-600 text-lg p-1"
                                                >
                                                    <FaEdit />
                                                </Link>
                                                <Link
                                                    to="#"
                                                    onClick={() => handleDelete(row.id)}
                                                    className="font-bold text-red-600 text-lg p-1"
                                                ><RiDeleteBin3Fill /></Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            <div className="p-4 flex flex-wrap gap-4">


                {/* View Modal */}
                {isView && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                            <h3 className="text-xl font-semibold mb-4">GEN PLANT DETAILS</h3>



                            <div className="grid gap-6 mb-6  p-6">

                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.gen_name}
                                        readOnly
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                       GEN PLANT NAME
                                    </label>
                                </div>
                                {/* <div className="relative z-0"> */}
                                <input
                                    type="hidden"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    value={ViewData.priority}

                                />
                                {/* <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    PRIORITY
                    </label> */}
                                {/* </div>
                <div className="relative z-0"> */}
                                <input
                                    type="hidden"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    value={ViewData.con_htscno}
                                />
                                {/* <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    CON HTSCNO
                    </label>
                </div> */}
                                {/* <div className="relative z-0"> */}
                                <input
                                    type="hidden"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    value={ViewData.com_id}

                                />
                                {/* <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    COMPANY ID
                    </label>
                </div> */}
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.weg_htscno}
                                        readOnly />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                      GEN PLANT HTSCNO
                                    </label>
                                </div>

                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={formatDate(ViewData.doc)}
                                        readOnly
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        D.O.C
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.gen_type}
                                        readOnly
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                       GEN PLANT TYPE
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.inj_volt}
                                        readOnly
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        INJ VOLT
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.ban_op}
                                        readOnly
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        BANKING OPTION
                                    </label>
                                </div>




                            </div>


                            <div className="flex justify-end gap-2">

                                <button
                                    onClick={() => setIsView(false)}
                                    className="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Verify
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>









            <div className="p-4 flex flex-wrap gap-4">


                {/* View Modal */}
                {isEditing && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                            <h3 className="text-xl font-semibold mb-4">GEN PLANT DETAILS</h3>



                            <div className="grid gap-6 mb-6  p-6">

                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={editData.gen_name}
                                        onChange={(e) => setEditData({ ...editData, gen_name: e.target.value })}
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                      GEN PLANT NAME
                                    </label>
                                </div>
                                {/* <div className="relative z-0"> */}
                                <input
                                    type="hidden"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    value={editData.priority}
                                    onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                                />
                                {/* <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    PRIORITY
                    </label> */}
                                {/* </div>
                <div className="relative z-0"> */}
                                <input
                                    type="hidden"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    value={editData.con_htscno}
                                    onChange={(e) => setEditData({ ...editData, con_htscno: e.target.value })}
                                />
                                {/* <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    CON HTSCNO
                    </label> */}
                                {/* </div>
                <div className="relative z-0"> */}
                                <input
                                    type="hidden"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    value={editData.com_id}
                                    onChange={(e) => setEditData({ ...editData, com_id: e.target.value })}
                                />
                                {/* <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    COMPANY ID
                    </label>
                </div> */}
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={editData.weg_htscno}
                                        onChange={(e) => setEditData({ ...editData, weg_htscno: e.target.value })}
                                        readOnly />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                      GEN PLANT HTSCNO
                                    </label>
                                </div>

                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={editData.doc}
                                        onChange={(e) => setEditData({ ...editData, doc: e.target.value })}
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        D.O.C
                                    </label>
                                </div>

                                <select 
  className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-gray-200 peer" 
  name="traffic_type"
  value={editData.gen_type}
  onChange={handleeditChange} // Only call `handleeditChange` to handle everything
>
  <option value="">{editData.gen_type || "Select a type"}</option>
  {plantData.map((item) => (
    <option key={item.id} value={item.plant_name}>
      {item.plant_name}
    </option>
  ))}
</select>


                                <select className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-gray-200 peer" name="traffic_type"
                                    value={editData.inj_volt}

                                    onChange={(e) => setEditData({ ...editData, inj_volt: e.target.value })} >
                                    <option value={editData.inj_volt}>{editData.inj_volt}</option>
                                    {Injection.map((item) => (
                                        <option key={item.id} value={item.inj}>
                                            {item.inj}
                                        </option>
                                    ))}
                                </select>
                                <select className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-gray-200 peer" name="traffic_type"
                                    value={editData.ban_op}

                                    onChange={(e) => setEditData({ ...editData, ban_op: e.target.value })} >
                                    <option value={editData.ban_op}>{editData.ban_op}</option>
                                    <option value="YES">YES</option>
                                    <option value="NO">NO</option>

                                </select>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={handleEditSubmit}
                                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default GenPlant;
