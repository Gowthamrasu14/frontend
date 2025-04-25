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

const Charges = () => {
    const [ip, setip] = useState(localStorage.getItem("localIp"));
    const [openSection, setOpenSection] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [chargesData, setChargesData] = useState([]);
    const [newchargesData, setNewChargesData] = useState([]);
    const [newPlanttypeData, setPlanttypeData] = useState([]);
    const [tableData, setTableData] = useState([{}]);
    const [formData, setFormData] = useState({
        plantname: "",
        date: "",
        w_chrgs: "",
        CSS_1A: "",
        CSS_2A: "",
        CSS_2B: "",
        CSS_3: "",
        CSS_5: "",
    });
    useEffect(() => {
        const chargesData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/getcharges");
            setNewChargesData(response.data);
            setTableData(response.data);
        }
        const Planttype = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/getplanttype");
            setPlanttypeData(response.data);
        }
        chargesData();
        Planttype();
    }, [])



    const handleEditSubmit = () => {
       
        alert(JSON.stringify(editData)); // Check the data being sent
        axios.put(`http://147.79.68.117:8000/api/updatecharges/${editData.id}`, {
            date: editData.date,
            plantname: editData.plantname,
            CSS_1A: editData.CSS_1A,
            CSS_2A: editData.CSS_2A,
            CSS_2B: editData.CSS_2B,
            CSS_3: editData.CSS_3,
            CSS_5: editData.CSS_5,
            
            
        })
            .then(() => {
                const updatedData = tableData.map(tableData =>
                    tableData.id === editData.id
                        ? {
                            ...tableData,  // Spread the existing `HT DETAILS` to keep other fields intact
                            date: editData.date,
            plantname: editData.plantname,
            CSS_1A: editData.CSS_1A,
            CSS_2A: editData.CSS_2A,
            CSS_2B: editData.CSS_2B,
            CSS_3: editData.CSS_3,
            CSS_5: editData.CSS_5,
                           
                        }
                        : tableData  // Return the original `HT DETAILS` if ID does not match
                );

                setTableData(updatedData);  // Update the state with new data
                setIsEditing(false); // Close the modal or form
            })
            .catch(error => console.error(error));
           
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        // Format the date as you need, for example: DD-MM-YYYY
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    };


    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ plantname: "", date: "", w_chrgs: "", CSS_1A: "", CSS_2A: "", CSS_2B: "", CSS_3: "", CSS_5: "" });

    const [isView, setIsView] = useState(false);
    const [ViewData, setViewData] = useState({ plantname: "", date: "", w_chrgs: "", CSS_1A: "", CSS_2A: "", CSS_2B: "", CSS_3: "", CSS_5: "" });
    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index);
        if (openSection === index) {
            setFormData({
                plantname: "",
                date: "",
                w_chrgs: "",
                CSS_1A: "",
                CSS_2A: "",
                CSS_2B: "",
                CSS_3: "",
                CSS_5: "",
            });
        }
    };


    const handleEdit = (item) => {
        setEditData({ plantname: item.plantname, date: item.date, w_chrgs: item.w_chrgs, CSS_1A: item.CSS_1A, CSS_2A: item.CSS_2A, CSS_2B: item.CSS_2B, CSS_3: item.CSS_3, CSS_5: item.CSS_5, id: item.id });
        setIsEditing(true);
    };
    const handleView = (item) => {
        setViewData({ plantname: item.plantname, date: item.date, w_chrgs: item.w_chrgs, CSS_1A: item.CSS_1A, CSS_2A: item.CSS_2A, CSS_2B: item.CSS_2B, CSS_3: item.CSS_3, CSS_5: item.CSS_5, id: item.id });
        setIsView(true);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredData = newchargesData.filter((row) =>
        Object.values(row).some((value) =>
            value?.toString().toLowerCase().includes(searchQuery)
        )
    );



    // Add new entry to table
    const handleSubmit = async () => {
        await axios.post("http://147.79.68.117:8000/api/createcharges", formData)
            .then((response) => {
                // alert("OK");
                alert(JSON.stringify(response.data), { position: "top-right" })
                window.location.reload();
            })
            .catch(error => console.log(error))
    };

    // Filter table data based on search query





    const handleDelete = async (id) => {
        // Filter out the item with the given id


        await axios.delete(`http://147.79.68.117:8000/api/deletecharges/${id}`)
            .then((response) => {
                // alert("OK");
                alert(JSON.stringify(response.data), { position: "top-right" })
                window.location.reload();
            })
            .catch(error => console.log(error))

        const updatedInjectionList = tableData.filter((item) => item.id !== id);
        // console.log(updatedInjectionList);
        setTableData(updatedInjectionList);


        // Update the state
    };





    const exportToExcel = () => {
        console.log();
        const ws = XLSX.utils.json_to_sheet(newchargesData); // Convert JSON to sheet
        const wb = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(wb, ws, "CHARGES Detail"); // Append sheet to workbook

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "CHARGES Detail.xlsx"); // Save as file
    };

    const tableRef = useRef(null);
    const exportToPDF = () => {
        const element = tableRef.current; // Get table element via useRef

        // Temporarily hide the Actions column
        const tableRows = element.querySelectorAll('tr');
        tableRows.forEach(row => {
            const actionCell = row.querySelectorAll('td').length > 9 ? row.querySelectorAll('td')[9] : null;
            const headerActionCell = row.querySelectorAll('th').length > 9 ? row.querySelectorAll('th')[9] : null;

            if (actionCell) actionCell.style.display = 'none'; // Hide data cell
            if (headerActionCell) headerActionCell.style.display = 'none'; // Hide header cell
        });

        // Options for pdf export
        const options = {
            margin: 0.5,
            filename: 'CHARGES Detail.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        };

        // Generate PDF and save
        html2pdf().from(element).set(options).save().then(() => {
            // Revert display of the Actions column
            tableRows.forEach(row => {
                const actionCell = row.querySelectorAll('td').length > 9 ? row.querySelectorAll('td')[9] : null;
                const headerActionCell = row.querySelectorAll('th').length > 9 ? row.querySelectorAll('th')[9] : null;

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
            const actionCell = row.querySelectorAll('th, td').length > 9 ? row.querySelectorAll('th, td')[9] : null;
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
                 <h2>CHARGES DETAILS TABLE</h2>
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

    return (
        <div className="mx-auto p-4">
            <div className="text-center font-bold">
                <h1>CHARGES DETAILS</h1>
            </div>

            <div className="grid mb-2">
                <div className="p-4 rounded-lg mb-2">
                    <button
                        onClick={() => toggleSection(1)}
                        type="button"
                        className="p-0 w-12 h-12 bg-blue-600 rounded-full hover:bg-green-700 active:shadow-lg shadow transition ease-in duration-200 focus:outline-none"
                    >
                        <svg viewBox="0 0 20 20" className="w-6 h-6 inline-block">
                            <path fill="#FFFFFF" d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                                C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                                C15.952,9,16,9.447,16,10z" />
                        </svg>
                    </button>

                    {openSection === 1 && (

                        <div className="grid gap-6 mb-6 md:grid-cols-5 p-6">

<div className="relative z-0">
                                <input
                                    type="DATE"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    name="date"

                                    onChange={handleInputChange}
                                    value={formData.date}
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    DATE
                                </label>
                            </div>

                            <select className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2
                             border-gray-300 appearance-none focus:border-gray-200 peer" name="plantname"
                                value={formData.plantname}
                                onChange={handleInputChange}>
                                <option disabled value="" >SELECT PLANT TYPE</option>
                                {newPlanttypeData.map((item) => (
                                    <option key={item.id} value={item.plant_name}>
                                        {item.plant_name}
                                    </option>
                                ))}

                            </select>
                          
                            <div className="relative z-0">
                                <input
                                    type="text"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    name="w_chrgs"

                                    onChange={handleInputChange}
                                    value={formData.w_chrgs}
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    WHEELING
                                </label>
                            </div>
                            <div className="relative z-0">
                                <input
                                    type="text"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    name="CSS_1A"

                                    onChange={handleInputChange}
                                    value={formData.CSS_1A}
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    I
                                </label>
                            </div>
                            <div className="relative z-0">
                                <input
                                    type="text"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    name="CSS_2A"

                                    onChange={handleInputChange}
                                    value={formData.CSS_2A}
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    II A
                                </label>
                            </div>
                            <div className="relative z-0">
                                <input
                                    type="text"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    name="CSS_2B"

                                    onChange={handleInputChange}
                                    value={formData.CSS_2B}
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    II B
                                </label>
                            </div>
                            <div className="relative z-0">
                                <input
                                    type="text"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    name="CSS_3"

                                    onChange={handleInputChange}
                                    value={formData.CSS_3}
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    III
                                </label>
                            </div>
                            <div className="relative z-0">
                                <input
                                    type="text"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    name="CSS_5"

                                    onChange={handleInputChange}
                                    value={formData.CSS_5}
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    V
                                </label>
                            </div>


                            <div className="flex p-1 mx-5 justify-center">
                                <button
                                    type="submit"
                                    className="font-bold py-2 px-4 rounded-md h-10 w-30 bg-green-800 hover:bg-sky-600 text-white shadow-xl"
                                    onClick={handleSubmit}>
                                    SUBMIT
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>




            <div className="p-8 relative overflow-x-auto shadow-md sm:rounded-lg">

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
                        <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
                            <table className="border-2 bg-gray-200 w-full text-sm text-center text-gray-500" ref={tableRef}>
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3">SL.No</th>
                                        <th className="px-6 py-3">PLANT TYPE</th>
                                        <th className="px-6 py-3">DATE</th>
                                        <th className="px-6 py-3">WHEELING</th>
                                        <th className="px-6 py-3">I</th>
                                        <th className="px-6 py-3">II A</th>
                                        <th className="px-6 py-3">II B</th>
                                        <th className="px-6 py-3">III</th>
                                        <th className="px-6 py-3">V</th>
                                        <th className="px-6 py-3">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((charge, index) => (
                                        <tr key={charge.id} className="border-b bg-white">
                                            <td className="px-6 py-4">{index + 1}</td>
                                            <td className="px-6 py-4">{charge.plantname}</td>
                                            <td className="px-6 py-4">{formatDate(charge.date)}</td>
                                            <td className="px-6 py-4">{charge.w_chrgs}</td>
                                            <td className="px-6 py-4">{charge.CSS_1A}</td>
                                            <td className="px-6 py-4">{charge.CSS_2A}</td>
                                            <td className="px-6 py-4">{charge.CSS_2B}</td>
                                            <td className="px-6 py-4">{charge.CSS_3}</td>
                                            <td className="px-6 py-4">{charge.CSS_5}</td>
                                            <td className="px-6 py-4" colSpan="3">
                                                <div className="flex justify-center space-x-2">
                                                    <Link to="#"
                                                        onClick={() => handleView(charge)} className="font-bold text-sky-600 text-lg p-1"><LuView />
                                                    </Link>
                                                    <Link
                                                        to="#"
                                                        onClick={() => handleEdit(charge)}
                                                        className="font-bold text-green-600 text-lg p-1"
                                                    >
                                                        <FaEdit />
                                                    </Link>
                                                    <Link
                                                        to="#"
                                                        onClick={() => handleDelete(charge.id)}
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

            </div>




            <div className="p-4 flex flex-wrap gap-4">


                {/* Edit Modal */}
                {isView && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                            <h3 className="text-xl font-semibold mb-4">View Drawel</h3>



                            <div className="grid gap-6 mb-6  p-6">

                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={formatDate(ViewData.date)}


                                        readOnly />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        DATE
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=""
                                        value={ViewData.plantname}


                                        readOnly />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    PLANT NAME
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.w_chrgs}


                                        readOnly />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        WHEELING
                                    </label>
                                </div>

                                <div className="relative z-0 ">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.CSS_1A}

                                        readOnly />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        I
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.CSS_2A}

                                        readOnly />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        II A
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.CSS_2B}

                                        readOnly />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                       II B
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.CSS_3}

                                        readOnly />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                       III
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.CSS_5}

                                        readOnly />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                       V
                                    </label>
                                </div>

                            </div>


                            <div className="flex justify-end gap-2">

                                <button
                                    onClick={() => setIsView(false)}
                                    className="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>




            <div className="p-4 flex flex-wrap gap-4">


                {/* Edit Modal */}
                {isEditing && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                            <h3 className="text-xl font-semibold mb-4">EDIT CHAEGES</h3>



                            <div className="grid gap-6 mb-6  p-6">

                                <div className="relative z-0">
                                    <input
                                        type="DATE"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={editData.date ? new Date(editData.date).toISOString().split('T')[0] : ""}
                                        onChange={(e) => setEditData({ ...editData, date: e.target.value })} 

                                         />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        DATE
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=""
                                        value={editData.plantname}
                                        onChange={(e) => setEditData({ ...editData, plantname: e.target.value })}
                                        readOnly
                                         />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    PLANT NAME
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={editData.w_chrgs}
                                        onChange={(e) => setEditData({ ...editData, w_chrgs: e.target.value })}

                                         />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        WHEELING
                                    </label>
                                </div>

                                <div className="relative z-0 ">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={editData.CSS_1A}
                                        onChange={(e) => setEditData({ ...editData, CSS_1A: e.target.value })}
                                         />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        I
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={editData.CSS_2A}
                                        onChange={(e) => setEditData({ ...editData, CSS_2A: e.target.value })}
                                         />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        II A
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={editData.CSS_2B}
                                        onChange={(e) => setEditData({ ...editData, CSS_2B: e.target.value })}
                                         />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                       II B
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={editData.CSS_3}
                                        onChange={(e) => setEditData({ ...editData, CSS_3: e.target.value })}
                                         />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                       III
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={editData.CSS_5}
                                        onChange={(e) => setEditData({ ...editData, CSS_5: e.target.value })}
                                         />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                       V
                                    </label>
                                </div>

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

export default Charges;
