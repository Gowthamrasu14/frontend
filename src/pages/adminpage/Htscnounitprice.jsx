
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRef } from 'react';
import { useNavigate, Link, json } from "react-router-dom";
import { ImFileOpenoffice } from "react-icons/im";
import { LuView } from "react-icons/lu";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import html2pdf from "html2pdf.js";

const PLANTTYPE = () => {

    const [ip, setip] = useState(localStorage.getItem("localIp"));
    const [openSection, setOpenSection] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [htData, sethtData] = useState([{}]);
    const [plantData, setplantData] = useState([]);
    
    
    const [tableData, setTableData] = useState([]);
   

    const [isView, setIsView] = useState(false);
    const [ViewData, setViewData] = useState({ date: '', con_htscno: '', plant_htscno: '', normal: '', peak: '', night: '', id: null });

    const handleView = (item) => {
        // console.log(item)
        setViewData({ date: item.date, con_htscno: item.con_htscno, plant_htscno: item.plant_htscno, normal: item.normal, peak: item.peak, night: item.night, id: item.id });
        setIsView(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ date: '', con_htscno: '', plant_htscno: '', normal: '', peak: '', night: '', id: null  });

    const handleEdit = (item) => {
        setEditData({date: item.date, con_htscno: item.con_htscno, plant_htscno: item.plant_htscno, normal: item.normal, peak: item.peak, night: item.night, id: item.id });
        setIsEditing(true);
    };

    useEffect(() => {
        const fetchhtData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/getplant");
            sethtData(response.data);
        }
        const fetchpriceData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/getoneplantunitprice");
            setTableData(response.data);
        }
        
        fetchpriceData();
        fetchhtData();
       


    }, [])

    const exportToExcel = () => {
        console.log(tableData);
        const ws = XLSX.utils.json_to_sheet(tableData); // Convert JSON to sheet
        const wb = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(wb, ws, "PLANT PRICE"); // Append sheet to workbook

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "PLANT PRICE.xlsx"); // Save as file
    };




    // PDF export function using html2pdf.js



    const tableRef = useRef(null);
    const exportToPDF = () => {
        const element = tableRef.current; // Get table element via useRef

        // Temporarily hide the Actions column
        const tableRows = element.querySelectorAll('tr');
        tableRows.forEach(row => {
            const actionCell = row.querySelectorAll('td').length > 7 ? row.querySelectorAll('td')[7] : null;
            const headerActionCell = row.querySelectorAll('th').length > 7 ? row.querySelectorAll('th')[7] : null;

            if (actionCell) actionCell.style.display = 'none'; // Hide data cell
            if (headerActionCell) headerActionCell.style.display = 'none'; // Hide header cell
        });

        // Options for pdf export
        const options = {
            margin: 0.5,
            filename: 'PLANT PRICE.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        };

        // Generate PDF and save
        html2pdf().from(element).set(options).save().then(() => {
            // Revert display of the Actions column
            tableRows.forEach(row => {
                const actionCell = row.querySelectorAll('td').length > 7 ? row.querySelectorAll('td')[7] : null;
                const headerActionCell = row.querySelectorAll('th').length > 7 ? row.querySelectorAll('th')[7] : null;

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
            const actionCell = row.querySelectorAll('th, td').length > 7 ? row.querySelectorAll('th, td')[7] : null;
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
                        <h2>PLANT PRICE TABLE</h2>
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
        date: '' ,con_htscno: '', plant_htscno: '',com_id:'',normal: '', peak: '',night:''

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

    // Handle search
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    // Add new entry to table
    const handleSubmit = async () => {
        // alert(JSON.stringify(newEntry));
        await axios.post("http://147.79.68.117:8000/api/createplantunitprice", newEntry)
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
        axios.put(`http://147.79.68.117:8000/api/updateplantunitprice/${editData.id}`, {
          
            date: editData.date, 
            con_htscno: editData.con_htscno, 
            plant_htscno: editData.plant_htscno,
             normal: editData.normal, 
             peak: editData.peak, 
             night: editData.night,


        })
            .then(() => {
                const updatedData = tableData.map(tableData =>
                    tableData.id === editData.id
                        ? {
                            ...tableData,  // Spread the existing `PLANT PRICE` to keep other fields intact
                            date: editData.date, 
                            con_htscno: editData.con_htscno, 
                            plant_htscno: editData.plant_htscno,
                             normal: editData.normal, 
                             peak: editData.peak, 
                             night: editData.night,

                        }
                        : tableData  // Return the original `PLANT PRICE` if ID does not match
                );

                setTableData(updatedData);  // Update the state with new data
                setIsEditing(false); // Close the modal or form
            })
            .catch(error => console.error(error));
    };


    const handleDelete = async (id) => {
        // Filter out the item with the given id


        await axios.delete(`http://147.79.68.117:8000/api/deleteplantunitprice/${id}`)
            .then((response) => {
                // alert("OK");
                alert(JSON.stringify(response.data), { position: "top-right" })
                window.location.reload();
            })
            .catch(error => console.log(error))

        const updatedInjectionList = tableData.filter((item) => item.id !== id);
        console.log(updatedInjectionList);
        setTableData(updatedInjectionList);

    };
    const handleplantChange = (e) => {
        const filteredData = htData.filter((plant) => plant.con_htscno === e.target.value);
        setplantData(filteredData);

    };
    const handleidChange = (e) => {
        console.log(JSON.stringify(htData))
        const filteredData = htData.find((plant) => plant.con_htscno === e.target.value);
        if (filteredData) {
            setNewEntry((newEntry) => ({
                ...newEntry,
                com_id: filteredData.com_id,
            }));
        } else {
            console.log("No matching plant found");
        }
    };
    return (
        <div className="mx-auto p-4">
            <div className="text-center font-bold mb-4">
                <h1> GEN PLANT PRICE</h1>
            </div>

            <div className="grid mb-2">
                {/* Accordion Section for Adding New Plant */}
                <div className="p-4 rounded-lg mb-2">
                    <button
                        onClick={() => toggleSection(1)}
                        type="button"
                        className="p-0 w-12 h-12 bg-blue-600 rounded-full hover:bg-green-700 transition duration-200 focus:outline-none"
                    >
                        <svg viewBox="0 0 20 20" className="w-6 h-6 inline-block">
                            <path fill="#FFFFFF" d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                                C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                                C15.952,9,16,9.447,16,10z" />
                        </svg>
                    </button>

                    {openSection === 1 && (
                        <div className="grid gap-6 mb-6 md:grid-cols-6 p-6">
                            
                            <div className="relative z-0">
                                <input
                                    type="date"
                                    value={newEntry.date}
                                    name="date"
                                    onChange={handleInputChange}
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                   DATE
                                </label>
                            </div>

                            <select className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2
                             border-gray-300 appearance-none focus:border-gray-200 peer" name="con_htscno"
                             value={newEntry.con_htscno}
                             onChange={(e) => {
                                handleInputChange(e);
                                handleidChange(e);
                                handleplantChange(e);

                            }}
                             >
                                <option  value="">SELECT HTSCNO</option>
                               
                                {[...new Set(htData.map((item) => item.con_htscno))].map((htscno, index) => (
    <option key={index} value={htscno}>
        {htscno}
    </option>
))}

                               
                            </select>
                            <select className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2
                             border-gray-300 appearance-none focus:border-gray-200 peer" name="plant_htscno"
                             value={newEntry.plant_htscno}
                             onChange={handleInputChange}>
                                <option disabled value="">SELECT GEN PLANT HTSCNO</option>
                                {plantData.map((item) => (
                                    <option key={item.id} value={item.weg_htscno}>
                                        {item.weg_htscno +" - "+ item.gen_name }
                                    </option>
                                ))}
                            
                            </select>
                            
                            <div className="relative z-0">
                                <input
                                    type="text"
                                    value={newEntry.peak}
                                    name="peak"
                                    onChange={handleInputChange}
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    PEAk
                                </label>
                            </div>
                            <div className="relative z-0">
                                <input
                                    type="text"
                                    value={newEntry.normal}
                                    name="normal"
                                    onChange={handleInputChange}
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    NORMAL
                                </label>
                            </div>
                            <div className="relative z-0">
                                <input
                                    type="text"
                                    value={newEntry.night}
                                    name="night"
                                    onChange={handleInputChange}
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    NIGHT
                                </label>
                            </div>
                            <div className="flex p-1 mx-5 justify-center">
                                <button
                                    type="button"
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
                    <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
                <table ref={tableRef} className="border-2 bg-gray-200 w-full text-sm text-center text-gray-500 dark:text-gray-400" id="PLANT PRICE">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">SL.No</th>
                                <th className="px-6 py-3">CONSUMER</th>
                                <th className="px-6 py-3">GEN PLANT</th>
                                <th className="px-6 py-3">GEN NAME</th>
                                <th className="px-6 py-3">DATE</th>
                               
                                <th className="px-6 py-3">NORMAL</th>
                                <th className="px-6 py-3">NIGHT</th>
                                <th className="px-6 py-3">PEAK</th>
                                <th className="px-6 py-3" colSpan="3">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredData.map((price, index) => {
    const matchedPlant = htData.find(
        (plant) => plant.weg_htscno === price.plant_htscno
    );
    // console.log(filteredData);
    // console.log(htData);
    // console.log(matchedPlant);
    return (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4">{price.con_htscno}</td>
                                <td className="px-6 py-4">{price.plant_htscno}</td>
                                <td className="px-6 py-4">{matchedPlant ? matchedPlant.gen_name : "N/A"}</td>
                                <td className="px-6 py-4">{formatDate(price.date)}</td>
                                <td className="px-6 py-4">{price.normal}</td>
                                <td className="px-6 py-4">{price.night}</td>
                                <td className="px-6 py-4">{price.peak}</td>
                                 <td className="px-6 py-4">
                                    <div className="flex justify-center space-x-2">
                                    <Link to="#"
                                                        // onClick={() => handleView(item)} 
                                                        onClick={() => handleView(price)}
                                                        className="font-bold text-sky-600 text-lg p-1"><LuView />
                                                    </Link>
                                                    <Link
                                                        to="#"
                                                        onClick={() => handleEdit(price)}
                                                        className="font-bold text-green-600 text-lg p-1"
                                                    >
                                                        <FaEdit />
                                                    </Link>
                                        <Link
                                            to="#"
                                            onClick={() => handleDelete(price.id)}
                                            className="font-bold text-red-600 text-lg p-1"
                                        ><RiDeleteBin3Fill /></Link>
                                    </div>
                                </td>
                            </tr>
                        )})}
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
            <h3 className="text-xl font-semibold mb-4">GEN PLANT PRICE DETAILS</h3>



            <div className="grid gap-6 mb-6  p-6">

            <div className="relative z-0">
                    <input
                        type="date"
                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                        placeholder=" "
                        value={ViewData.date ? new Date(ViewData.date).toISOString().split('T')[0] : ""}
                        
                         readOnly
                         />
                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    date
                    </label>
                </div>
                <div className="relative z-0">
                    <input
                        type="text"
                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                        placeholder=" "
                        value={ViewData.con_htscno}
                       
                        readOnly
                         />
                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    CON HTSCNO
                    </label>
                </div>

                <div className="relative z-0">
                    <input
                        type="text"
                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                        placeholder=" "
                        value={ViewData.con_htscno}
                      
                        readOnly
                         />
                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    CONSUMER
                    </label>
                </div>
                <div className="relative z-0">
                    <input
                        type="text"
                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                        placeholder=" "
                        value={ViewData.peak}
                       readOnly
                         />
                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    PEAK
                    </label>
                </div>
                <div className="relative z-0">
                    <input
                        type="text"
                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                        placeholder=" "
                        value={ViewData.normal}
                        readOnly
                         />
                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    NORMAL
                    </label>
                </div>
                <div className="relative z-0">
                    <input
                        type="text"
                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                        placeholder=" "
                        value={ViewData.night}
                        
                        readOnly
                         />
                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    NIGHT
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
            <h3 className="text-xl font-semibold mb-4">HtDetails Data</h3>



            <div className="grid gap-6 mb-6  p-6">

                <div className="relative z-0">
                    <input
                        type="date"
                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                        placeholder=" "
                        value={editData.date ? new Date(editData.date).toISOString().split('T')[0] : ""}
                         onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                         readOnly
                         />
                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    date
                    </label>
                </div>
                <div className="relative z-0">
                    <input
                        type="text"
                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                        placeholder=" "
                        value={editData.con_htscno}
                        onChange={(e) => setEditData({ ...editData, con_htscno: e.target.value })}

                        readOnly
                         />
                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    CONSUMER
                    </label>
                </div>

                <div className="relative z-0">
                    <input
                        type="text"
                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                        placeholder=" "
                        value={editData.con_htscno}
                        onChange={(e) => setEditData({ ...editData, con_htscno: e.target.value })}
                        readOnly
                         />
                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    CONSUMER
                    </label>
                </div>
                <div className="relative z-0">
                    <input
                        type="text"
                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                        placeholder=" "
                        value={editData.peak}
                        onChange={(e) => setEditData({ ...editData, peak: e.target.value })}
                         />
                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    PEAK
                    </label>
                </div>
                <div className="relative z-0">
                    <input
                        type="text"
                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                        placeholder=" "
                        value={editData.normal}
                        onChange={(e) => setEditData({ ...editData, normal: e.target.value })}
                         />
                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    NORMAL
                    </label>
                </div>
                <div className="relative z-0">
                    <input
                        type="text"
                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                        placeholder=" "
                        value={editData.night}
                        onChange={(e) => setEditData({ ...editData, night: e.target.value })}
                         />
                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                    NIGHT
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







       </div >
    );
};

export default PLANTTYPE;
