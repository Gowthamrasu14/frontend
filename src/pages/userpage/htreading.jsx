import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { RiDeleteBin3Fill } from "react-icons/ri";

const HtReading = () => {
    const [ip, setip] = useState(localStorage.getItem("localIp"));
    const [tableData, setTableData] = useState([]);  // Initialize with empty array
    const [htData, sethtData] = useState([]);  // Initialize with empty array
    const [openSection, setOpenSection] = useState(null);
    const [newEntry, setNewEntry] = useState({
        c1: "",
        c2: "",
        c4: "",
        c5: "",
        total: "",
        htscno: "",
        date: "",
        com_id: "",
    });

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
        const fetchhtdetailData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/getmaxconread");
            setTableData(response.data);
        };
        const fetchdrawelData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/gethtdetail");
            sethtData(response.data);
        };

        fetchhtdetailData();
        fetchdrawelData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry((prevState) => {
            const updatedData = { ...prevState, [name]: value };
            updatedData.total =
                parseFloat(updatedData.c1 || 0) +
                parseFloat(updatedData.c2 || 0) +
                parseFloat(updatedData.c4 || 0) +
                parseFloat(updatedData.c5 || 0);
            return updatedData;
        });
    };

    const handleidChange = (e) => {
        const filteredData = htData.find((plant) => plant.htscno === e.target.value);
        if (filteredData) {
            setNewEntry((newEntry) => ({
                ...newEntry,
                com_id: filteredData.com_id,
            }));
        } else {
            console.log("No matching plant found");
        }
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
        await axios
            .post("http://147.79.68.117:8000/api/createconread", newEntry)
            .then((response) => {
                alert(JSON.stringify(response.data), { position: "top-right" });
                window.location.reload();
            })
            .catch((error) => console.log(error));
    };
    const handleDelete = async (id, id1, id2) => {
        try {
            console.log(`Deleting: ${id}, ${id1}, ${id2}`);
    
            // First delete request
            const response1 = await axios.delete(`http://147.79.68.117:8000/api/deleteconread/${id}`);
            // console.log("Response from deleteconread:", response1.data);
    
            // Second delete request
            // const response2 = await axios.delete(`http://147.79.68.117:8000/api/deletemonthplantread/${id1}`);
            // console.log("Response from deletemonthplantread:", response2.data);
    
            // Third delete request
            const response3 = await axios.delete(`http://147.79.68.117:8000/api/deletemonthhtleadger/${id1}/${id2}`);
            // console.log("Response from deletemonthhtleadger:", response3.data);
    
            // Show success alert
            alert("Delete successful!");
    
            // Update table data after deletion
            setTableData(prevData => prevData.filter(item => item.id !== id));
    
            // Optionally reload the page
            window.location.reload();
        } catch (error) {
            console.error("Error deleting data:", error);
            alert(`An error occurred: ${error.response ? error.response.data : error.message}`);
        }
    };
    
    

    const minDate = (() => {
        if (tableData.length > 0 && tableData[0].mo_year) {
            const moYear = tableData[0].mo_year;  // Assumes mo_year exists in the first record
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

    return (
        <div className="mx-auto p-4">
            <div className="text-center font-bold">
                <h1>HT - COM / CON READING ENTRY</h1>
            </div>

            <div className="grid mb-2">
                <div className="p-4 rounded-lg mb-2">
                    <button
                        onClick={() => toggleSection(1)}
                        data-modal-target="default-modal"
                        data-modal-toggle="default-modal"
                        type="button"
                        className="p-0 w-12 h-12 bg-blue-600 rounded-full hover:bg-green-700 active:shadow-lg shadow transition ease-in duration-200 focus:outline-none"
                    >
                        <svg viewBox="0 0 20 20" className="w-6 h-6 inline-block">
                            <path fill="#FFFFFF" d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601 C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399 C15.952,9,16,9.447,16,10z" />
                        </svg>
                    </button>

                    {openSection === 1 && (
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-6 mb-6 md:grid-cols-7 p-6">
                                <select
                                    name="htscno"
                                    value={newEntry.htscno}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        handleidChange(e);

                                    }}
                                    className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-gray-200 peer"
                                >
                                    <option value="" disabled>SELECT HTSCNO</option>
                                    {htData.map((item) => (
                                        <option key={item.id} value={item.htscno}>
                                            {item.htscno}
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
                                        className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                                    />
                                    <label className="absolute top-3 -z-10 origin-0 -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400">
                                        TOTAL
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
                            <th scope="col" className="px-6 py-3">HT - COM / CON HTSCNO</th>
                            <th scope="col" className="px-6 py-3">DATE</th>
                            <th scope="col" className="px-6 py-3">C1</th>
                            <th scope="col" className="px-6 py-3">C2</th>
                            <th scope="col" className="px-6 py-3">C4</th>
                            <th scope="col" className="px-6 py-3">C5</th>
                            <th scope="col" className="px-6 py-3">TOTAL</th>
                            <th scope="col" className="px-6 py-3" colSpan="3">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((ht, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4">{ht.con_htscno}</td>
                                <td className="px-6 py-4">{formatDate(ht.mo_year)}</td>
                                <td className="px-6 py-4">{ht.c1}</td>
                                <td className="px-6 py-4">{ht.c2}</td>
                                <td className="px-6 py-4">{ht.c4}</td>
                                <td className="px-6 py-4">{ht.c5}</td>
                                <td className="px-6 py-4">{Number(ht.c1) + Number(ht.c2) + Number(ht.c4) + Number(ht.c5)}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center space-x-2">

                                        <Link
                                            to="#"
                                            onClick={() => handleDelete(ht.id,ht.mo_year,ht.con_htscno)}
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

export default HtReading;
