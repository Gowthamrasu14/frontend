import axios from "axios";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { RiDeleteBin3Fill } from "react-icons/ri";
import * as XLSX from "xlsx";


const GenReading = () => {
    const [ip, setip] = useState(localStorage.getItem("localIp"));
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
    const navigate = useNavigate();
    // Example function to navigate with data
    const handleNavigate = () => {
        navigate("/Genbulk");
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


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry((prevState) => {
            const updatedData = { ...prevState, [name]: value };
            // Recalculate total whenever an input field is changed
            updatedData.total = parseFloat(updatedData.c1 || 0) + parseFloat(updatedData.c2 || 0) + parseFloat(updatedData.c4 || 0) + parseFloat(updatedData.c5 || 0);
            return updatedData;
        });
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


    const handleSubmit = async () => {
        // alert(JSON.stringify((newEntry)));
        console.log(newEntry);
        await axios
            .post("http://147.79.68.117:8000/api/createplantread", newEntry)
            .then((response) => {
                alert(JSON.stringify(response.data), { position: "top-right" });
                window.location.reload();
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
            // Fetch related entries
            const response = await axios.get("http://147.79.68.117:8000/api/gethtleadger");
            const ftr = response.data;
    
            console.log(ftr);
    
            // If there are entries and one of them has mo_year === id1, block delete
            if (ftr.length > 0 && ftr.some(item => item.mo_year === id1)) {
                alert("You can't delete this entry");
                return;
            }
    
            // Proceed with deletion
            const deleteResponse = await axios.delete(`http://147.79.68.117:8000/api/deleteplantread/${id}`);
            alert(JSON.stringify(deleteResponse.data));
    
            // Update table
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



    const exportExcel = () => {
        // Define the headers
        const headers = [
            ["PLANTHTSCNO", "DATE", "C1", "C2", "C4", "C5","TOTAL","AMR", "OM",
        "TRANS", "SOC", "RKVAH", "IEC", "SCH", "OTHER", "DSM"]
        ];

        // Create a worksheet
        const ws = XLSX.utils.aoa_to_sheet(headers);

        // Create a workbook and append worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "GEN PLANT");

        // Export the file
        XLSX.writeFile(wb, "GEN PLANT READING ENTRY.xlsx");
    };


    return (
        <div className="mx-auto p-4">
            <div className="text-center font-bold">
                <h1>GEN PLANT READING ENTRY</h1>
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
                                    <path
                                        fill="#FFFFFF"
                                        d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601 
                    C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399 
                    C15.952,9,16,9.447,16,10z"
                                    />
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
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-6 mb-6 md:grid-cols-6 p-6">
                                <select
                                    name="htscno"
                                    value={newEntry.htscno}
                                    onChange={handleInputChange}
                                    className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-gray-200 peer"
                                >
                                    <option value="" disabled>
                                        SELECT HTSCNO
                                    </option>
                                    {Array.from(
                                        new Set(
                                            plantData
                                                .filter(
                                                    (item1) =>
                                                        !tableData.some((item2) => item2.planthtscno === item1.weg_htscno)
                                                )
                                                .map((item) => item.weg_htscno)
                                        )
                                    ).map((uniqueHtscno) => (
                                        <option key={uniqueHtscno} value={uniqueHtscno}>
                                            {uniqueHtscno}
                                        </option>
                                    ))}


                                </select>


                                <div className="relative z-0">
                                    <input
                                        type="date"
                                        name="date"
                                        value={newEntry.date}
                                        onChange={handledateChange}
                                        min={minDate}
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        DATE
                                    </label>
                                </div>

                                <div className="relative z-0">
                                    <input
                                        type="number"
                                        name="c1"
                                        value={newEntry.c1}
                                        onChange={handleInputChange}
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        C1
                                    </label>
                                </div>

                                <div className="relative z-0">
                                    <input
                                        type="number"
                                        name="c2"
                                        value={newEntry.c2}
                                        onChange={handleInputChange}
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        C2
                                    </label>
                                </div>

                                <div className="relative z-0">
                                    <input
                                        type="number"
                                        name="c4"
                                        value={newEntry.c4}
                                        onChange={handleInputChange}
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        C4
                                    </label>
                                </div>

                                <div className="relative z-0">
                                    <input
                                        type="number"
                                        name="c5"
                                        value={newEntry.c5}
                                        onChange={handleInputChange}
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        C5
                                    </label>
                                </div>

                                <div className="relative z-0">
                                    <input
                                        type="text"

                                        readOnly
                                        value={newEntry.total}
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-green-700 font-extrabold focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        TOTAL
                                    </label>
                                </div>


                                <div className="relative z-0">
                                    <input
                                        type="number"
                                        name="amr"
                                        value={newEntry.amr}
                                        onChange={handleInputChange}
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        AMR
                                    </label>
                                </div>

                                <div className="relative z-0">
                                    <input
                                        type="number"
                                        name="om"
                                        value={newEntry.om}
                                        onChange={handleInputChange}
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        O&M
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="number"
                                        name="trans"
                                        value={newEntry.trans}
                                        onChange={handleInputChange}
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        TRANS
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="number"
                                        name="soc"
                                        value={newEntry.soc}
                                        onChange={handleInputChange}
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        S.O.C
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="number"
                                        name="rkvah"
                                        value={newEntry.rkvah}
                                        onChange={handleInputChange}
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        RKVAH
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="number"
                                        name="iec"
                                        value={newEntry.iec}
                                        onChange={handleInputChange}
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        I.E.C
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="number"
                                        name="sch"
                                        value={newEntry.sch}
                                        onChange={handleInputChange}
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        SCHEDULING
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="number"
                                        name="other"
                                        value={newEntry.other}
                                        onChange={handleInputChange}
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        OTHER
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        type="number"
                                        name="dsm"
                                        value={newEntry.dsm}
                                        onChange={handleInputChange}
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        DSM
                                    </label>
                                </div>


                                <div className="flex p-1 mx-5 justify-center">
                                    <button
                                        type="submit"
                                        className="font-bold py-2 px-4 rounded-md h-10 w-30 bg-green-800 hover:bg-sky-600 text-white shadow-xl"
                                    >
                                        SUBMIT
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <div className="p-8 relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="border-2 bg-gray-200 w-full text-sm text-center text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">SL.No</th>
                            <th scope="col" className="px-6 py-3">GEN PLANT HTSCNO</th>
                            <th scope="col" className="px-6 py-3">DATE</th>
                            <th scope="col" className="px-6 py-3">C1</th>
                            <th scope="col" className="px-6 py-3">C2</th>
                            <th scope="col" className="px-6 py-3">C4</th>
                            <th scope="col" className="px-6 py-3">C5</th>
                            <th scope="col" className="px-6 py-3">TOTAL</th>
                            <th scope="col" className="px-6 py-3">AMR</th>
                            <th scope="col" className="px-6 py-3">O&M</th>
                            <th scope="col" className="px-6 py-3">TRANS</th>
                            <th scope="col" className="px-6 py-3">S.O.C</th>
                            <th scope="col" className="px-6 py-3">RKVAH</th>
                            <th scope="col" className="px-6 py-3">IEC</th>
                            <th scope="col" className="px-6 py-3">SCH</th>
                            <th scope="col" className="px-6 py-3">OTHER</th>
                            <th scope="col" className="px-6 py-3">DSM</th>
                            <th scope="col" className="px-6 py-3">TOTAL</th>
                            <th scope="col" className="px-6 py-3" colSpan="3">ACTIONS</th>
                        </tr>

                    </thead>
                    <tbody>
                        {tableData.map((charge, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4">{charge.planthtscno}</td>
                                <td className="px-6 py-4">{formatDate(charge.mo_year)}</td>
                                <td className="px-6 py-4">{charge.c1}</td>
                                <td className="px-6 py-4">{charge.c2}</td>
                                <td className="px-6 py-4">{charge.c4}</td>
                                <td className="px-6 py-4">{charge.c5}</td>
                                <td className="px-6 py-4">{Number(charge.c1) + Number(charge.c2) + Number(charge.c3) + Number(charge.c4) + Number(charge.c5)}</td>
                                <td className="px-6 py-4">{charge.amr}</td>
                                <td className="px-6 py-4">{charge.om}</td>
                                <td className="px-6 py-4">{charge.trans}</td>
                                <td className="px-6 py-4">{charge.soc}</td>
                                <td className="px-6 py-4">{charge.rkvah}</td>
                                <td className="px-6 py-4">{charge.iec}</td>
                                <td className="px-6 py-4">{charge.sch}</td>
                                <td className="px-6 py-4">{charge.other}</td>
                                <td className="px-6 py-4">{charge.dsm}</td>
                                <td className="px-6 py-4">{Number(charge.amr) + Number(charge.om) + Number(charge.trans) + Number(charge.soc)+
                                Number(charge.rkvah) + Number(charge.iec) + Number(charge.sch) + Number(charge.other) + Number(charge.dsm)}</td>
                               
                                <td className="px-6 py-4">
                                    <div className="flex justify-center space-x-2">

                                        <Link
                                            to="#"
                                            onClick={() => handleDelete(charge.id, charge.mo_year)}
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
    );
};

export default GenReading;
