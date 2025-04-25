import axios from "axios";
import React, { useEffect, useState } from "react";
import  { useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { ImFileOpenoffice } from "react-icons/im";
import { LuView } from "react-icons/lu";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import html2pdf from "html2pdf.js"; 



const LinLoss = () => {
    const [ip, setip] = useState(localStorage.getItem("localIp"));
    const [openSection, setOpenSection] = useState(null);
    const [injectionSearch, setInjectionSearch] = useState("");
    const [drawelSearch, setDrawelSearch] = useState("");
    const [lineLossSearch, setLineLossSearch] = useState("");

    const [newInjection, setNewInjection] = useState([{}]);
    const [newDrawel, setNewDrawel] = useState([{}]);
    const [newLineLoss, setNewLineLoss] = useState([{}]);
    useEffect(() => {
        const fetchinjData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/getinj");
            setNewInjection(response.data);
        }
        const fetchdrawelData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/getdrawel");
            setNewDrawel(response.data);
        }

        const fetchlinelossData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/getupdatelineloss");
            setNewLineLoss(response.data);
        }

        fetchinjData();
        fetchdrawelData();
        fetchlinelossData();

    }, [])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        // Format the date as you need, for example: DD-MM-YYYY
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    };


    const exportToExcel = () => {
        console.log(newLineLoss);
        const ws = XLSX.utils.json_to_sheet(newLineLoss); // Convert JSON to sheet
        const wb = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(wb, ws, "LineLoss"); // Append sheet to workbook

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "LineLoss.xlsx"); // Save as file
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
                    filename: 'LineLoss.pdf',
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



    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index);
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
                    <h2>Line Loss Table</h2>
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
    




    const [injectionData, setInjectionData] = useState({ injection: "" });
    const [drawelData, setDrawelData] = useState({ drawel: "" });
    const [lineLossData, setLineLossData] = useState({
        date: "",
        injection: "",
        drawel: "",
        transmissionLoss: "",
        distributionLoss: "",
        lineLoss: ""
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ date: "", Inj_Volt: "", Drawal: "", Trans_loss: "", Dist_loss: "", lin_loss: "", id: null });

    const [isView, setIsView] = useState(false);
    const [ViewData, setViewData] = useState({ date: "", Inj_Volt: "", Drawal: "", Trans_loss: "", Dist_loss: "", lin_loss: "", id: null });


    const handleInjectionSubmit = async () => {

        await axios.post("http://147.79.68.117:8000/api/createinj", injectionData)
            .then((response) => {
                // alert("OK");
                alert(JSON.stringify(response.data), { position: "top-right" })
                window.location.reload();
            })
            .catch(error => console.log(error))


        // setInjectionData("");
    };

    const handleDrawelSubmit = async () => {
        await axios.post("http://147.79.68.117:8000/api/createdrawel", drawelData)
            .then((response) => {
                // alert("OK");
                alert(JSON.stringify(response.data), { position: "top-right" })
                window.location.reload();
            })
            .catch(error => console.log(error))

    };

    const handleLineLossSubmit = async () => {
        
        await axios.post("http://147.79.68.117:8000/api/createlineloss", lineLossData)
            .then((response) => {
                // alert("OK");
                alert(JSON.stringify(response.data), { position: "top-right" })
                window.location.reload();
            })
            .catch(error => console.log(error))
    };


    const handleEditinj = (item) => {
        const updatedInjection = prompt("Edit Injection:", item.inj);
        if (updatedInjection) {
            axios.put(`http://147.79.68.117:8000/api/updateinj/${item.id}/ ${updatedInjection}`)
                .then(() => {
                    const updatedData = newInjection.map(inj => inj.id === item.id ? { ...inj, inj: updatedInjection } : inj);
                    setNewInjection(updatedData);
                })
                .catch(error => console.error(error));
        }
    };

    const handleEditdrawel = (item) => {

        const updatedDrawel = prompt("Edit Drawel:", item.drawel);
       
        if (updatedDrawel) {
            axios.put(`http://147.79.68.117:8000/api/updatedrawel/${item.id}/${updatedDrawel}`)
                .then(() => {
                    const updatedData = newDrawel.map(drawel => drawel.id === item.id ? { ...drawel, drawel: updatedDrawel } : drawel);
                    setNewDrawel(updatedData);
                })
                .catch(error => console.error(error));
        }
    };


    const handleEditll = (item) => {
        setEditData({ date: item.date, Inj_Volt: item.Inj_Volt, Drawal: item.Drawal, Trans_loss: item.Trans_loss, Dist_loss: item.Dist_loss, lin_loss: item.lin_loss, id: item.id });
        setIsEditing(true);
    };
    const handleViewll = (item) => {
        setViewData({ date: item.date, Inj_Volt: item.Inj_Volt, Drawal: item.Drawal, Trans_loss: item.Trans_loss, Dist_loss: item.Dist_loss, lin_loss: item.lin_loss, id: item.id });
        setIsView(true);
    };


    const handleEditSubmit = () => {
        alert(JSON.stringify(editData)); // Check the data being sent
        axios.put(`http://147.79.68.117:8000/api/updatelineloss/${editData.id}`, {
            date: editData.date,
            Inj_Volt: editData.Inj_Volt,
            Drawal: editData.Drawal,
            Trans_loss: editData.Trans_loss,
            Dist_loss: editData.Dist_loss,
            lin_loss: editData.lin_loss
        })
            .then(() => {
                const updatedData = newLineLoss.map(lineloss =>
                    lineloss.id === editData.id
                        ? {
                            ...lineloss,  // Spread the existing `lineloss` to keep other fields intact
                            date: editData.date,
                            Inj_Volt: editData.Inj_Volt,
                            Drawal: editData.Drawal,
                            Trans_loss: editData.Trans_loss,
                            Dist_loss: editData.Dist_loss,
                            lin_loss: editData.lin_loss
                        }
                        : lineloss  // Return the original `lineloss` if ID does not match
                );

                setNewLineLoss(updatedData);  // Update the state with new data
                setIsEditing(false); // Close the modal or form
            })
            .catch(error => console.error(error));
    };

    //


    const handleDeleteinj = async (id) => {
        // Filter out the item with the given id


        await axios.delete(`http://147.79.68.117:8000/api/deleteinj/${id}`)
            .then((response) => {
                // alert("OK");
                alert(JSON.stringify(response.data), { position: "top-right" })
                window.location.reload();
            })
            .catch(error => console.log(error))

        const updatedInjectionList = newInjection.filter((item) => item.id !== id);

        setNewInjection(updatedInjectionList);


        // Update the state
    };


    const handleDeletedrawel = async (id) => {
        // Filter out the item with the given id


        await axios.delete(`http://:8000/api/deletedrawel/${id}`)
            .then((response) => {
                // alert("OK");
                alert(JSON.stringify(response.data), { position: "top-right" })
                window.location.reload();
            })
            .catch(error => console.log(error))

        const updateddrawelList = newDrawel.filter((item) => item.id !== id);

        setNewDrawel(updateddrawelList);


        // Update the state
    };


    const handleDeletell = async (id) => {
        // Filter out the item with the given id


        await axios.delete(`http://147.79.68.117:8000/api/deletelineloss/${id}`)
            .then((response) => {
                // alert("OK");
                alert(JSON.stringify(response.data), { position: "top-right" })
                window.location.reload();
            })
            .catch(error => console.log(error))

        const updatedInjectionList = newInjection.filter((item) => item.id !== id);

        setNewInjection(updatedInjectionList);


        // Update the state
    };


    useEffect(() => {
        const calculateLineLoss = () => {
            // Parse and calculate
            const transLoss = parseFloat(lineLossData.transmissionLoss) || 0;
            const distLoss = parseFloat(lineLossData.distributionLoss) || 0;

            // console.log("Transmission Loss:", transLoss); // Debugging
            // console.log("Distribution Loss:", distLoss);  // Debugging

            setLineLossData(prevData => ({
                ...prevData,
                lineLoss: (transLoss + distLoss).toFixed(2)  // Update lineLoss with sum
            }));
        };
        calculateLineLoss();
    }, [lineLossData.transmissionLoss, lineLossData.distributionLoss]);



    useEffect(() => {
        const calculateLineLoss = () => {
            // Parse and calculate
            const transLoss = parseFloat(editData. Trans_loss) || 0;
            const distLoss = parseFloat(editData.Dist_loss) || 0;

            // console.log("Transmission Loss:", transLoss); // Debugging
            // console.log("Distribution Loss:", distLoss);  // Debugging

            setEditData(prevData => ({
                ...prevData,
                lin_loss: (transLoss + distLoss).toFixed(2)  // Update lineLoss with sum
            }));
        };
        calculateLineLoss();
    }, [editData.Trans_loss, editData.Dist_loss]);



    return (






        <div className="mx-auto p-4">




            <div className="text-center font-bold">
                <h1>LINE LOSS DETAILS</h1>
            </div>




            <div className="grid grid-cols-2 mb-2">
                {/* Accordion Section 1 */}
                <div className="p-4 border rounded-lg mb-2">
                    <div
                        className="bg-transparent hover:bg-sky-600 text-black text-center p-4 cursor-pointer"
                        onClick={() => toggleSection(1)}
                    >
                        ADD INJECTION
                    </div>
                    {openSection === 1 && (
                        <div className="p-6 w-full">
                            <div className="flex gap-6 mb-6">
                                <div className="relative z-0 w-full md:w-1/2">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={injectionData.injection}
                                        onChange={(e) => {
                                            const updatedValue = e.target.value;
                                            setInjectionData({ ...injectionData, injection: updatedValue });
                                        }}



                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        INJECTION VOLT
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        type="submit"
                                        onClick={handleInjectionSubmit}
                                        className="font-bold py-2 px-4 rounded-md h-10 w-30 bg-green-800 hover:bg-sky-600 text-white shadow-xl"
                                    >
                                        SUBMIT
                                    </button>
                                </div>
                            </div>




                            <input
                                type="text"
                                placeholder="Search Injection"
                                className="mb-4 p-2 border rounded"
                                value={injectionSearch}
                                onChange={(e) => setInjectionSearch(e.target.value)}
                            />
                            <div className="w-full">
                                <div className="p-0 relative shadow-md sm:rounded-lg overflow-hidden">
                                    <div className="overflow-y-auto" style={{ maxHeight: "200px" }}> {/* Set the desired max height here */}
                                        <table className="min-w-full bg-gray-200 text-sm text-center text-gray-500 dark:text-gray-400 border-separate border-spacing-0">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 border-b border-gray-300">#</th>
                                                    <th scope="col" className="px-6 py-3 border-b border-gray-300">INJECTION</th>
                                                    <th scope="col" className="px-6 py-3 border-b border-gray-300" colSpan="3">ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {newInjection
                                                    .filter((item) =>
                                                        Object.values(item).some((value) =>
                                                            value.toString().toLowerCase().includes(injectionSearch.toLowerCase())
                                                        )
                                                    )
                                                    .map((item) => (
                                                        <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                                                            <td className="px-6 py-4 border-b border-gray-300">{item.id}</td>
                                                            <td className="px-6 py-4 border-b border-gray-300">{item.inj}</td>
                                                            <td className="px-6 py-4 border-b border-gray-300" colSpan="3">
                                                                <div className="flex justify-center space-x-2">
                                                                    <Link
                                                                        to="#"
                                                                        onClick={() => handleEditinj(item)}
                                                                        className="font-bold text-green-600 text-lg p-1 hover:text-green-800"
                                                                    >
                                                                        <FaEdit />
                                                                    </Link>
                                                                    <Link
                                                                        to="#"
                                                                        onClick={() => handleDeleteinj(item.id)}
                                                                        className="font-bold text-red-600 text-lg p-1 hover:text-red-800"
                                                                    >
                                                                        <RiDeleteBin3Fill />
                                                                    </Link>
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
                    )}
                </div>

                {/* Accordion Section 2 */}
                <div className="p-4 border rounded-lg mb-2">
                    <div
                        className="bg-transparent hover:bg-sky-600 text-black  text-center p-4 cursor-pointer"
                        onClick={() => toggleSection(2)}
                    >
                        ADD DRAWEL
                    </div>
                    {openSection === 2 && (


                        <div className="p-6 w-full">

                            <div className="flex gap-6 mb-6">
                                <div className="relative z-0 w-full md:w-1/2">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={drawelData.drawel}
                                        onChange={(e) => {
                                            var ll = e.target.value;
                                            setDrawelData({ ...drawelData, drawel: ll });
                                        }}
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        DRAWEL VOLT
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        type="submit"
                                        onClick={handleDrawelSubmit}
                                        className="font-bold py-2 px-4 rounded-md h-10 w-30 bg-green-800 hover:bg-sky-600 text-white shadow-xl"
                                    >
                                        SUBMIT
                                    </button>
                                </div>
                            </div>
                            <input
                                type="text"
                                placeholder="Search Drawel"
                                className="mb-4 p-2 border rounded"
                                value={drawelSearch}
                                onChange={(e) => setDrawelSearch(e.target.value)}
                            />
                            <div className="w-full">
                                <div className="p-0 relative shadow-md sm:rounded-lg overflow-hidden">
                                    <div className="overflow-y-auto" style={{ maxHeight: "200px" }}> {/* Set the desired max height here */}
                                        <table className="border-2 bg-gray-200 w-full text-sm text-center text-gray-500 dark:text-gray-400">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3">#</th>
                                                    <th scope="col" className="px-6 py-3">DRAWEL</th>
                                                    <th scope="col" className="px-6 py-3" colSpan="3">ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {newDrawel
                                                    .filter((item) =>
                                                        Object.values(item).some((value) =>
                                                            value.toString().toLowerCase().includes(drawelSearch.toLowerCase())
                                                        )
                                                    )
                                                    .map((item) => (
                                                        <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                            <td className="px-6 py-4">{item.id}</td>
                                                            <td className="px-6 py-4">{item.drawel}</td>
                                                            <td className="px-6 py-4" colSpan="3">
                                                                <div className="flex justify-center space-x-2">

                                                                    <Link
                                                                        to="#"
                                                                        onClick={() => handleEditdrawel(item)}
                                                                        className="font-bold text-green-600 text-lg p-1"
                                                                    >
                                                                        <FaEdit />
                                                                    </Link>
                                                                    <Link
                                                                        to="#"
                                                                        onClick={() => handleDeletedrawel(item.id)}
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
                    )}
                </div>
            </div>

            <div className="grid  mb-2">
                {/* Accordion Section 3 */}
                <div className="p-4 border rounded-lg mb-2">
                    <div
                        className="bg-transparent hover:bg-sky-600 text-black  text-center p-4 cursor-pointer"
                        onClick={() => toggleSection(3)}
                    >
                        ADD LINE LOSS
                    </div>
                    {openSection === 3 && (
                        <div className="grid gap-6 mb-6 md:grid-cols-6 p-6">
                            <div className="relative z-0">
                                <input
                                    type="date"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    value={lineLossData.date}
                                    onChange={(e) => setLineLossData({ ...lineLossData, date: e.target.value })}

                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    DATE
                                </label>
                            </div>
                            <select className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2
                             border-gray-300 appearance-none focus:border-gray-200 peer" value={lineLossData.injection}
                                onChange={(e) => setLineLossData({ ...lineLossData, injection: e.target.value })}>
                                <option value="">SELECT INJ VOLT</option>
                                {newInjection.map((item) => (
                                    <option key={item.id} value={item.inj}>
                                        {item.inj}
                                    </option>
                                ))}

                            </select>
                            <select className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2
                             border-gray-300 appearance-none focus:border-gray-200 peer"value={lineLossData.drawel}
                                onChange={(e) => setLineLossData({ ...lineLossData, drawel: e.target.value })}
                            >
                                <option value="">SELECT DRAWEL VOLT</option>
                                {newDrawel.map((item) => (
                                    <option key={item.id} value={item.drawel}>
                                        {item.drawel}
                                    </option>
                                ))}
                            </select>
                            <div className="relative z-0">
                                <input
                                    type="text"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    value={lineLossData.transmissionLoss}
                                    onChange={(e) => setLineLossData({ ...lineLossData, transmissionLoss: e.target.value })}

                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    TRANSMISSION LOSS
                                </label>
                            </div>
                            <div className="relative z-0">
                                <input
                                    type="text"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    value={lineLossData.distributionLoss}
                                    onChange={(e) => setLineLossData({ ...lineLossData, distributionLoss: e.target.value })}

                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    DISTRIBUTION LOSS
                                </label>
                            </div>
                            <div className="relative z-0">
                                <input
                                    type="text"
                                    className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    placeholder=" "
                                    value={lineLossData.lineLoss}
                                    onChange={(e) => setLineLossData({ ...lineLossData, lineLoss: e.target.value })}

                                />
                                <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    LINE LOSS
                                </label>
                            </div>
                            <div className="flex p-1 mx-5 justify-center">
                                <button
                                    type="submit"
                                    onClick={handleLineLossSubmit}
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
            value={lineLossSearch}
            onChange={(e) => setLineLossSearch(e.target.value)}
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


      


            {/* Main Table Section */}
            <div className="w-full">
                <div className="pl-4 relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="overflow-y-auto" style={{ maxHeight: "300px" }}> {/* Set the desired max height here */}


                        <table  ref={tableRef}  className="border-2 bg-gray-200 w-full text-sm text-center text-gray-500 dark:text-gray-400" id="LineLoss">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">#</th>
                                    <th scope="col" className="px-6 py-3">DATE</th>
                                    <th scope="col" className="px-6 py-3">INJECTION</th>
                                    <th scope="col" className="px-6 py-3">DRAWEL</th>
                                    <th scope="col" className="px-6 py-3">TRANSMISSION LOSS</th>
                                    <th scope="col" className="px-6 py-3">DISTRIBUTION LOSS</th>
                                    <th scope="col" className="px-6 py-3">LINE LOSS</th>
                                    <th scope="col" className="px-6 py-3" colSpan="3">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                            
                                {newLineLoss
                                    .filter((item) =>
                                        Object.values(item).some((value) =>
                                            value.toString().toLowerCase().includes(lineLossSearch.toLowerCase())
                                        )
                                    )
                                    .map((item,index) => (
                                        <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <td className="px-6 py-4">{index+1}</td>
                                            <td className="px-6 py-4">{formatDate(item.date)}</td>
                                            <td className="px-6 py-4">{item.Inj_Volt}</td>
                                            <td className="px-6 py-4">{item.Drawal}</td>
                                            <td className="px-6 py-4">{item.Trans_loss}</td>
                                            <td className="px-6 py-4">{item.Dist_loss}</td>
                                            <td className="px-6 py-4">{item.lin_loss}</td>
                                            <td className="px-6 py-4" colSpan="3">
                                                <div className="flex justify-center space-x-2">
                                                    <Link to="#"
                                                        onClick={() => handleViewll(item)} className="font-bold text-sky-600 text-lg p-1"><LuView />
                                                    </Link>
                                                    <Link
                                                        to="#"
                                                        onClick={() => handleEditll(item)}
                                                        className="font-bold text-green-600 text-lg p-1"
                                                    >
                                                        <FaEdit />
                                                    </Link>
                                                    <Link
                                                        to="#"
                                                        onClick={() => handleDeletell(item.id)}
                                                        className="font-bold text-red-600 text-lg p-1"
                                                    ><RiDeleteBin3Fill /></Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div></div>







            <div className="p-4 flex flex-wrap gap-4">


                {/* Edit Modal */}
                {isEditing && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                            <h3 className="text-xl font-semibold mb-4">Edit Drawel</h3>



                            <div className="grid gap-6 mb-6  p-6">

                                <div className="relative z-0">
                                    <input
                                        type="date"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={editData.date ? new Date(editData.date).toISOString().split('T')[0] : ""}

                                        onChange={(e) => setEditData({ ...editData, date: e.target.value })}

                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        DATE
                                    </label>
                                </div>
                                <select className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2
                             border-gray-300 appearance-none focus:border-gray-200 peer"  value={editData.Inj_Volt}
                                    onChange={(e) => setEditData({ ...editData, Inj_Volt: e.target.value })}>

                                    <option value="">SELECT INJ VOLT</option>
                                    {newInjection.map((item) => (
                                        <option key={item.id} value={item.inj}>
                                            {item.inj}
                                        </option>
                                    ))}

                                </select>
                                <select className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2
                             border-gray-300 appearance-none focus:border-gray-200 peer" value={editData.Drawal}
                                    onChange={(e) => setEditData({ ...editData, Drawal: e.target.value })}
                                >
                                    <option value="">SELECT DRAWEL VOLT</option>
                                    {newDrawel.map((item) => (
                                        <option key={item.id} value={item.drawel}>
                                            {item.drawel}
                                        </option>
                                    ))}
                                </select>
                                <div className="relative z-0 ">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={editData.Trans_loss}
                                        onChange={(e) => setEditData({ ...editData, Trans_loss: e.target.value })}
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        TRANSMISSION LOSS
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={editData.Dist_loss}
                                        onChange={(e) => setEditData({ ...editData, Dist_loss: e.target.value })}
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        DISTRIBUTION LOSS
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={editData.lin_loss}
                                        onChange={(e) => setEditData({ ...editData, lin_loss: e.target.value })}
                                    readOnly />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        LINE LOSS
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
                                        placeholder=" "
                                        value={ViewData.Inj_Volt}


                                        readOnly />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    DRAWAL VOLT
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.Drawal}


                                        readOnly />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    INJ VOLT
                                    </label>
                                </div>

                                <div className="relative z-0 ">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.Trans_loss}

                                        readOnly />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    TRANSMISSION LOSS
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.Dist_loss}

                                        readOnly />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    DISTRIBUTION LOSS
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="text"
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                        placeholder=" "
                                        value={ViewData.lin_loss}

                                        readOnly />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                    LINE LOSS
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



        </div>
    );
};

export default LinLoss;


