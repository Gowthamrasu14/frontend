
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


const UserPage = () => {
    const [ip, setip] = useState(localStorage.getItem("localIp"));
    const [openSection, setOpenSection] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [tableData, setTableData] = useState([{}]);
    const [fileError, setFileError] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        // Format the date as you need, for example: DD-MM-YYYY
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
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
    // Input fields state
    const [isView, setIsView] = useState(false);
    const [ViewData, setViewData] = useState({
        empcode: '', empname: '', dest: '', doj: '', utype: '', username: '',
        password: '', valupto: '', user: 'ADMIN', datetime: d3, img: '', file: null, previewUrl: null, id: null
    });
    const handleView = (item) => {
        // console.log({ password: item.password, gen_name: item.gen_name, username: item.username, valupto: item.valupto, doc: item.doc, utype: item.utype, inj_volt: item.inj_volt, ban_op: item.ban_op, dest: item.dest, id: item.id });
        setViewData({
            empcode: item.empcode, empname: item.empname, dest: item.dest, doj: item.doj, utype: item.utype, username: item.username,
            password: item.password, valupto: item.valupto, user: item.user, datetime: item.datetime, img: item.img, id: item.id
        });
        setIsView(true);
    };



    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        empcode: '', empname: '', dest: '', doj: '', utype: '', username: '',
        password: '', valupto: '', user: '', datetime: d3, img: '', file: null, previewUrl: null, id: null
    });
    const handleEdit = (item) => {
        setEditData({
            empcode: item.empcode, empname: item.empname, dest: item.dest, doj: item.doj, utype: item.utype, username: item.username,
            password: item.password, valupto: item.valupto, user: item.user, datetime: item.datetime, img: item.img, id: item.id
        });
        setIsEditing(true);
    };



    useEffect(() => {
        const fetchuserData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/getuser");
            // console.log(response.data);
            setTableData(response.data);
        }
        fetchuserData();

    }, [])


    const exportToExcel = () => {
        // console.log(tableData);
        const ws = XLSX.utils.json_to_sheet(tableData); // Convert JSON to sheet
        const wb = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(wb, ws, "PLANT TYPE"); // Append sheet to workbook

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "PLANT TYPE.xlsx"); // Save as file
    };

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
        const doj = printWindow.contentDocument || printWindow.contentWindow.document;
        doj.open();
        doj.write(`
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
        doj.close();

        // Print the iframe content
        printWindow.contentWindow.print();

        // Clean up by removing the iframe after printing
        printWindow.addEventListener('afterprint', () => {
            printWindow.remove();
        });
    };


    const [newEntry, setNewEntry] = useState({
        empcode: '', empname: '', dest: '', doj: '', utype: '', username: '',
        password: '', valupto: '', user: 'ADMIN', datetime: d3, img: '', file: null, previewUrl: null
    });

    // Toggle section
    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index);
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Update the newEntry state
        setNewEntry({ ...newEntry, [name]: value });
    };


    useEffect(() => {
        if (newEntry.utype && newEntry.doj) {
            handleempcode();
        }
    }, [newEntry.utype, newEntry.doj]);


    const handleempcode = () => {
        const empcodes = Object.values(tableData)
            .map(entry => entry.empcode)
            .filter(code => code); // filter out empty/null

        let newEmpCode;

        if (empcodes.length === 0) {
            newEmpCode = 'EMP001';
        } else {
            const maxNum = Math.max(...empcodes.map(code => parseInt(code.replace('EMP', ''))));
            const nextNum = (maxNum + 1).toString().padStart(3, '0');
            newEmpCode = `EMP${nextNum}`;
        }



        const d1 = formatDate(newEntry.doj); // Get the current date
        const nextYear = new Date(d1); // Create a copy of d1
        nextYear.setFullYear(nextYear.getFullYear() + 5); // Add one year

        const d2 = formatDate(nextYear); // Format the new date
        // console.log(d2);
        // ✅ Always update newEntry here
        setNewEntry({ ...newEntry, empcode: newEmpCode, valupto: d2 });
    };

    // Handle search
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const handleSubmit = async () => {

        alert(JSON.stringify(newEntry));
        await axios.post("http://147.79.68.117:8000/api/createuser", newEntry)
            .then((response) => {
                // alert("OK");
                alert(JSON.stringify(response.data), { position: "top-right" })
                window.location.reload();
            })
            .catch(error => console.log(error))
    };



    const handleEditSubmit = () => {
        alert(JSON.stringify(editData)); // Check the data being sent
        axios.put(`http://147.79.68.117:8000/api/updateuser/${editData.id}`, {
            empcode: editData.empcode,
            empname: editData.empname,
            dest: editData.dest,
            doj: editData.doj,
            utype: editData.utype,
            username: editData.username,
            password: editData.password,
            valupto: editData.valupto,
            img: editData.img,


        })
            .then(() => {
                const updatedData = tableData.map(tableData =>
                    tableData.id === editData.id
                        ? {
                            ...tableData,  // Spread the existing `PLANT TYPE` to keep other fields intact
                            empcode: editData.empcode,
                            empname: editData.empname,
                            dest: editData.dest,
                            doj: editData.doj,
                            utype: editData.utype,
                            username: editData.username,
                            password: editData.password,
                            valupto: editData.valupto,
                            img: editData.img,


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


        await axios.delete(`http://147.79.68.117:8000/api/deleteuser/${id}`)
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

    const handleimage = (e) => {
        const file = e.target.files[0];
        if (file && /\.(jpe?g|png)$/i.test(file.name)) {
            setFileError(false);
            const previewUrl = URL.createObjectURL(file);
            setNewEntry({
                ...newEntry,
                file,
                previewUrl
            });
        } else {
            setFileError(true);
            setNewEntry({
                ...newEntry,
                file: null,
                previewUrl: null
            });
        }
    };


    return (
        <div className="mx-auto p-4">
            <div className="text-center font-bold">
                <h1> USER DETAILS</h1>
            </div>

            <div className="grid mb-2">
                {/* Accordion Section 1 */}
                <div className="p-4 rounded-lg mb-2">
                    <button
                        onClick={() => toggleSection(1)}
                        // data-modal-target="default-modal"
                        // data-modal-toggle="default-modal"
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
                        <div className="grid gap-6 mb-6 md:grid-cols-4 p-6">

                            <div className="relative z-0">
                                <input
                                    type="text"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    // value={newEntry.empname}
                                    name="empname"
                                    onChange={handleInputChange}

                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    EMP NAME
                                </label>
                            </div>

                            <div className="relative z-0">
                                <input
                                    type="date"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    // value={newEntry.doj}
                                    name="doj"
                                    onChange={handleInputChange}
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    DATE OF JOINING
                                </label>
                            </div>

                            <div className="relative z-0">
                                <input
                                    type="text"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    value={newEntry.dest}  // Make sure value is linked to state
                                    name="dest"
                                    onChange={handleInputChange}
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    DESIGNATION
                                </label>
                            </div>

                            <div className="relative z-0">
                                <select
                                    name="utype"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    onChange={handleInputChange}

                                >
                                    <option value="">Select User Type</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="USER">USER</option>
                                </select>
                            </div>

                            <div className="relative z-0">
                                <input
                                    type="text"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    // value={newEntry.empname}
                                    name="username"
                                    onChange={handleInputChange}
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    USERNAME
                                </label>
                            </div>

                            <div className="relative z-0">
                                <input
                                    type="text"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    // value={newEntry.empname}
                                    name="password"
                                    onChange={handleInputChange}
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    PASSWORD
                                </label>
                            </div>

                            {/* <div className="relative z-0">
                                <input
                                    id="file_input"
                                    type="file"
                                    accept=".JPEG, .JPG, .PNG"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    name="empname"
                                    onChange={handleimage}
                                    // value={newEntry.empname}

                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    EMP PHOTO
                                </label>
                                <p
                                    className={`text-sm font-medium ${fileError ? "text-red-500" : "text-gray-900 dark:text-white"
                                        }`}
                                >
                                    {fileError ? "Invalid file! Only Xlsx files are allowed." : "Only .JPEG, .JPG, .PNG Files."}
                                </p>

                            </div> */}


                            {/* {newEntry.previewUrl && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500">Preview:</p>
                                    <img src={newEntry.previewUrl} alt="Preview" className="h-32 rounded-full border border-gray-300" />
                                </div>
                            )} */}

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
                                    <th scope="col" className="px-6 py-3">EMP CODE</th>
                                    <th scope="col" className="px-6 py-3">EMP NAME</th>
                                    <th scope="col" className="px-6 py-3">DESIGNATION</th>
                                    <th scope="col" className="px-6 py-3">DATE OF JOINING</th>
                                    <th scope="col" className="px-6 py-3">USER TYPE</th>
                                    {/* <th scope="col" className="px-6 py-3">EMP PHOTO</th> */}

                                    <th scope="col" className="px-6 py-3" colSpan="3">ACTIONS</th>
                                </tr>
                            </thead>

                            {/* {console.log(newEntry)} */}
                            <tbody>
                                {tableData.map((row, index) => (
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4">{index + 1}</td>
                                        <td className="px-6 py-4">{row.empcode}</td>
                                        <td className="px-6 py-4">{row.empname}</td>
                                        <td className="px-6 py-4">{row.dest}</td>
                                        <td className="px-6 py-4">{formatDate(row.doj)}</td>
                                        <td className="px-6 py-4">{row.utype}</td>

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
                            <h3 className="text-xl font-semibold mb-4">USER DETAILS</h3>



                            <div className="grid gap-6 mb-6  p-6">

                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.empname}
                                        readOnly
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        EMPLOYEE NAME
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.dest}

                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        DESTDESIGNATION
                                    </label>
                                </div>


                                <div className="relative z-0">
                                    <input
                                        type="DATE"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        // value={formatDate(ViewData.doj)}
                                        value={ViewData.doj.split('T')[0]}
                                        readOnly
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        DATE OF JOINNING
                                    </label>
                                </div>


                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.username}
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        USERNAME
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.password}

                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        PASSWORD
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="date"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.valupto.split('T')[0]}
                                        readOnly
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        VALID TILL UP TO
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
                                        value={editData.empname}
                                        onChange={(e) => setEditData({ ...editData, empname: e.target.value })}
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        EMPLOYEE NAME
                                    </label>
                                </div>
                                <div className="relative z-0">
                                <input
                                    type="hidden"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    value={editData.dest}
                                    onChange={(e) => setEditData({ ...editData, dest: e.target.value })}
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
    DESTINGNATION
    </label>
    
    <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={editData.doJ}
                                        onChange={(e) => setEditData({ ...editData, doc: e.target.value })}
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                      DATE OF JOINING
                                    </label>
                                </div>

                                </div>
<div className="relative z-0">
                                <input
                                    type="text"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    value={editData.username}
                                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
    USERNAME
    </label>  </div>
<div className="relative z-0">
                                <input
                                    type="text"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    value={editData.password}
                                    onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
    COMPANY ID
    </label>
</div>
                                <div className="relative z-0">
                                    <input
                                        type="date"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={editData.valupto}
                                        onChange={(e) => setEditData({ ...editData, valupto: e.target.value })}
                                         />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        VALID UPTO
                                    </label>
                                </div>


                                <select
                                    className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-gray-200 peer"
                                    name="traffic_type"
                                    value={editData.utype}
                                    onChange={handleeditChange} // Only call `handleeditChange` to handle everything
                                >
                                    <option value="">{editData.utype || "Select a type"}</option>
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

export default UserPage;
