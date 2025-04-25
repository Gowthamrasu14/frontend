import { React, useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import pnt from "../../assets/pnt.png";

const Adustedsummary = () => {

    const tableRef = useRef(null);



    // Ensure filteredData is treated as an array of objects correctly
    const [rows, sethtData] = useState([]);
    const [data, setconData] = useState([]);

    const [selectedYear, setSelectedYear] = useState(""); // Default FY
    const [startDate, setStartDate] = useState(""); // Store start date separately
    const [endDate, setEndDate] = useState(""); // Store end date separately
    const [htledger, sethtledger] = useState("");
    const [selectedmonth, setSelectedmonth] = useState("");
    const [uniqueMoYears, setUniqueMoYears] = useState([]);
    const [conhtscno, sethtscno] = useState("");
    const [con, setcon] = useState([]);
    const [ip, setip] = useState(localStorage.getItem("localIp"));




    const formatDate1 = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    const formatmonth = (dateString) => {
        const date = new Date(dateString);
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthName = months[date.getMonth()];
        const year = date.getFullYear().toString().slice(2);
        return `${monthName}-${year}`;
    };


    const handleYearChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedYear(selectedValue);

        // Split the value into start and end date
        const [start, end] = selectedValue.split(" - ");
        setStartDate(start);
        setEndDate(end);
    };



    useEffect(() => {


        const fetchhtData = async () => {


            



            const response = await axios.get("http://147.79.68.117:8000/api/gethtdetail");
            sethtData(response.data);
            console.log(response.data);
        };
        const fetchconData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/getconread");
            setconData(response.data);

        };
        fetchhtData();
        fetchconData();

    }, []);



    useEffect(() => {
        const fetchhtDate = async () => {
            if (!startDate || !endDate) return; // Avoid making requests with undefined values

            try {
                // Convert slashes `/` to `-` to avoid breaking the URL
                const formattedStartDate = startDate.replace(/\//g, "-");
                const formattedEndDate = endDate.replace(/\//g, "-");

                const response = await axios.get(
                    `http://147.79.68.117:8000/api/getdatehtleadger/${formattedStartDate}/${formattedEndDate}`
                );

                // Ensure the response is an array, otherwise use an empty array
                const data = Array.isArray(response.data) ? response.data : [];
                sethtledger(data);

                const moYears = [...new Set(data.map(item => item.mo_year))];
                setUniqueMoYears(moYears);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchhtDate();
    }, [startDate, endDate]);


    const handleMonthChange = (e) => {
        setSelectedmonth(e.target.value);
    };

    const [filteredLedgerData, setFilteredLedgerData] = useState([]);
    useEffect(() => {
        if (Array.isArray(htledger)) {
            const filteredData = htledger.filter(
                (item) => item.mo_year === selectedmonth && item.con_htscno === conhtscno
            );
            setFilteredLedgerData(filteredData);
            // console.log(filteredData);
        }

        if (Array.isArray(data)) {
            const filteredData1 = data.filter(
                (item) => formatDate1(item.mo_year) === formatDate1(selectedmonth) && item.con_htscno === conhtscno
            );
            setcon(filteredData1[0]);
            // console.log(filteredData1[0]);

        }
    }, [selectedmonth, htledger, conhtscno, data]);

    const print = () => {
        const tableElement = tableRef.current;

        if (!tableElement) {
            alert("Table not found!");
            return;
        }

        // Clone the table to manipulate a copy without affecting the original
        const tableClone = tableElement.cloneNode(true);

        // Hide the Actions column in the clone
        const rows = tableClone.querySelectorAll("tr");
        rows.forEach((row) => {
            const actionCell =
                row.querySelectorAll("th, td").length > 9
                    ? row.querySelectorAll("th, td")[9]
                    : null;
            if (actionCell) {
                actionCell.style.display = "none"; // Hide the Actions cell
            }
        });

        // Open a new window to print the table content
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
            alert("Popup blocked! Please allow popups for this website.");
            return;
        }

        // Write table HTML to new window with enhanced CSS
        printWindow.document.write(`
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

        printWindow.document.close();
        printWindow.focus();

        // Trigger the print dialog
        printWindow.print();

        // Close the window after printing
        printWindow.onafterprint = () => {
            printWindow.close();
        };
    };

    const formatIndianNumber = (num) => {
        let formattedNumber = (Number(num) || 0).toFixed(0);
        let numStr = formattedNumber.toString();
        let lastThree = numStr.slice(-3);
        let otherNumbers = numStr.slice(0, -3);
        if (otherNumbers !== "") {
            lastThree = "," + lastThree;
        }
        return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    };


    const uniqueYears = [...new Set(Object.values(data).map((item) => item.mo_year.split("-")[0]))];

    // Format output as {0: 2024, 1: 2025}
    const formattedYears = uniqueYears.reduce((acc, year, index) => {
        acc[index] = parseInt(year, 10);
        return acc;
    }, {});

    // Function to get year from mo_year
    const getYear = (year) => parseInt(year, 10);

    return (
        <div className="p-6 bg-gray-100 uppercase">
            {/* Header Section */}
            <div className="text-center font-montserrat font-bold p-6">
                <h1>HT - COM / CON BILL SUMMARY</h1>
            </div>


            <div className="mb-4 flex items-center gap-4">
                {/* Financial Year Selection */}
                <label className="text-gray-700 font-semibold">Select Fy:</label>
                <select
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={selectedYear}
                    onChange={(e) => {
                        const [start, end] = e.target.value.split(" - ");
                        setSelectedYear(e.target.value);
                        setStartDate(start);
                        setEndDate(end);
                    }}
                >
                    <option value="" disabled>
                        Year
                    </option>
                    {Object.values(formattedYears).map((year, index) => (
                        <option
                            key={index}
                            value={`01/04/${getYear(year)} - 31/03/${getYear(year) + 1}`}
                        >
                            {`${getYear(year)} - ${getYear(year) + 1}`}
                        </option>
                    ))}

                </select>

                {/* HTSCNo Selection */}
                <label className="text-gray-700 font-semibold">Select HT - COM / CON HTSCNo:</label>
                <select
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={conhtscno}
                    onChange={(e) => sethtscno(e.target.value)}
                >
                    <option value="" disabled>HT - COM / CON HTSCNo</option>
                    {rows.map((row, index) => (
                        <option key={index} value={row.htscno}>{row.htscno}</option>
                    ))}
                </select>

                {/* Month Selection */}
                <label className="text-gray-700 font-semibold">Select Month:</label>
                <select
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={selectedmonth}
                    onChange={(e) => setSelectedmonth(e.target.value)}
                >
                    <option value="" disabled>Month</option>
                    {uniqueMoYears.map((year, index) => (
                        <option key={index} value={year}>{formatmonth(year)}</option>
                    ))}
                </select>
            </div>


            <div className="relative">
                {/* Your entire component content */}
                <img
                    className="absolute top-1 right-6 w-14 h-14 cursor-pointer"
                    onClick={print}
                    src={pnt}
                    alt="Export to PDF"
                />
            </div>
            {/* Consumption Table */}
            <div className="overflow-x-auto mb-6 bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
                    {conhtscno} - {formatmonth(selectedmonth)}
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 text-center text-sm" ref={tableRef}>
                        <thead>
                            <tr className="bg-gray-400 ">
                                <th className="border border-gray-300 px-4 py-2">{conhtscno}</th>
                                <th className="border border-gray-300 px-4 py-2">TOTAL</th>
                                <th className="border border-gray-300 px-4 py-2">C1</th>
                                <th className="border border-gray-300 px-4 py-2">C2</th>
                                <th className="border border-gray-300 px-4 py-2">C4</th>
                                <th className="border border-gray-300 px-4 py-2">C5</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">HT</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {formatIndianNumber(Number(con?.c1 || 0) + Number(con?.c2 || 0) + Number(con?.c4 || 0) + Number(con?.c5 || 0))}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(con?.c1 || 0)}</td>
                                <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(con?.c2 || 0)}</td>
                                <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(con?.c4 || 0)}</td>
                                <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(con?.c5 || 0)}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">Net HT Balance to be Billed</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {formatIndianNumber(Number(con?.c_c1 || 0) + Number(con?.c_c2 || 0) + Number(con?.c_c4 || 0) + Number(con?.c_c5 || 0))}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(con?.c_c1 || 0)}</td>
                                <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(con?.c_c2 || 0)}</td>
                                <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(con?.c_c4 || 0)}</td>
                                <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(con?.c_c5 || 0)}</td>
                            </tr>
                        </tbody>


                        <tbody>
                            {filteredLedgerData.map((item) => {

                                // console.log(rowId); // Use a unique identifier for each row
                                return (
                                    <><tr className="bg-gray-400  font-bold">
                                        <td className="border border-gray-300 px-4 py-2" colSpan="3">
                                            {item.weg_htscno}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2" colSpan="3">
                                            {item.gen_name}
                                        </td>
                                    </tr><tr className="bg-gray-300  font-bold">
                                            <td className="border border-gray-300 px-4 py-2" colSpan="4">
                                                {item.gen_type}
                                            </td>
                                            {/* <td className="border border-gray-300 px-4 py-2" colSpan="2">
                                                {item.gen_name}
                                            </td> */}
                                            <td className="border border-gray-300 px-4 py-2">Inter Slot:  {item.i_s}</td>
                                            <td className="border border-gray-300 px-4 py-2">{item.inj_volt} KV</td>
                                        </tr><tr>
                                            <td className="border border-gray-300 px-4 py-2">Supply</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.ALL_C1) + Number(item.ALL_C2) + Number(item.ALL_C4) + Number(item.ALL_C5))}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.ALL_C1))}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.ALL_C2))}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.ALL_C4))}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.ALL_C5))}</td>
                                        </tr><tr>
                                            <td className="border border-gray-300 px-4 py-2">Adjusted</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.NOAD_C1) + Number(item.NOAD_C2) + Number(item.NOAD_C4) + Number(item.NOAD_C5))}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.NOAD_C1))}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.NOAD_C2))}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.NOAD_C4))}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.NOAD_C5))}</td>
                                        </tr><tr>
                                            <td className="border border-gray-300 px-4 py-2">Consumption Balance</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.CON_C1) + Number(item.CON_C2) + Number(item.CON_C4) + Number(item.CON_C5))}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.CON_C1))}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.CON_C2))}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.CON_C4))}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.CON_C5))}</td>
                                        </tr><tr>
                                            <td className="border border-gray-300 px-4 py-2">Gen PLANT Banking Units</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.BAL_C1) + Number(item.BAL_C2) + Number(item.BAL_C4) + Number(item.BAL_C5))}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.BAL_C1))}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.BAL_C2))}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.BAL_C4))}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatIndianNumber(Number(item.BAL_C5))}</td>
                                        </tr>
                                        {/* <tr> */}
                                        {/* <th className="px-4 py-2 border border-gray-300 bg-gray-300 font-bold" colSpan="6">
                                                Charge
                                            </th>
                                        </tr><tr>
                                            <th className="px-4 py-2 border border-gray-300" colSpan="2">
                                                Code
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300" colSpan="2">
                                                Description
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300" colSpan="2">
                                                Amount
                                            </th>
                                        </tr><tr>
                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">C001</td>
                                            <td className="px-4 py-2 border border-gray-300 text-left" colSpan="2">AMR Meter Reading Charges</td>

                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">{item.amr}</td>
                                        </tr><tr>
                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">C002</td>
                                            <td className="px-4 py-2 border border-gray-300 text-left" colSpan="2">O&M Charges</td>

                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">{item.om}</td>
                                        </tr><tr>
                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">C003</td>
                                            <td className="px-4 py-2 border border-gray-300 text-left" colSpan="2">Transmission Charges</td>

                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">{item.trans}</td>
                                        </tr><tr>
                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">C004</td>
                                            <td className="px-4 py-2 border border-gray-300 text-left" colSpan="2">system operation Charges</td>

                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">{item.soc}</td>
                                        </tr><tr>
                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">C005</td>
                                            <td className="px-4 py-2 border border-gray-300 text-left" colSpan="2">rkvah charges</td>

                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">{item.rkvah}</td>
                                        </tr><tr>
                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">C006</td>
                                            <td className="px-4 py-2 border border-gray-300 text-left" colSpan="2">import energy Charges</td>

                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">{item.iec}</td>
                                        </tr><tr>
                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">C007</td>
                                            <td className="px-4 py-2 border border-gray-300 text-left" colSpan="2">scheduling Charges</td>

                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">{item.sch}</td>
                                        </tr><tr>
                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">C008</td>
                                            <td className="px-4 py-2 border border-gray-300 text-left" colSpan="2">other Charges</td>

                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">{item.other}</td>
                                        </tr><tr>
                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">C010</td>
                                            <td className="px-4 py-2 border border-gray-300 text-left" colSpan="2">dsm Charges</td>

                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">{item.dsm}</td>
                                        </tr><tr>
                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">whcl</td>
                                            <td className="px-4 py-2 border border-gray-300 text-left" colSpan="2">wheeling Charges</td>

                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">{item.W_CHRGS}</td>
                                        </tr><tr>
                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">Css</td>
                                            <td className="px-4 py-2 border border-gray-300 text-left" colSpan="2">cross subsidy surCharges</td>

                                            <td className="px-4 py-2 border border-gray-300" colSpan="2">{item.css}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border border-gray-300" colSpan="4">NET TOTAL CHARGES</td>*/}
                                        {/* <td className="px-4 py-2 border border-gray-300 text-left" colSpan="2">cross subsidy surCharges</td> */}

                                        {/* <td className="px-4 py-2 border border-gray-300" colSpan="2">{Number(item.amr) + Number(item.om) + Number(item.trans) + Number(item.soc) + Number(item.rkvah)
                                                + Number(item.iec) + Number(item.sch) + Number(item.other) + Number(item.dsm) + Number(item.W_CHRGS) + Number(item.css)}</td>
                                        </tr>  */}
                                        <tr>
                                            <th className="px-4 py-2 border border-gray-300 bg-gray-300 font-bold" colSpan="6">
                                                Charges
                                            </th>
                                        </tr>
                                        <tr className="px-4 py-2 border border-gray-300" colSpan="6">
                                            <th className="px-4 py-2 border border-gray-300" >
                                                amr
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300" >
                                                o & m
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300" >
                                                trans
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300" >
                                                soc
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300" >
                                                rkvah
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300" >
                                                iec
                                            </th></tr>
                                        <tr className="px-4 py-2 border border-gray-300" colSpan="6">
                                            <td className="px-4 py-2 border border-gray-300" >{formatIndianNumber(item.amr)}</td>
                                            <td className="px-4 py-2 border border-gray-300" >{formatIndianNumber(item.om)}</td>
                                            <td className="px-4 py-2 border border-gray-300" >{formatIndianNumber(item.trans)}</td>
                                            <td className="px-4 py-2 border border-gray-300" >{formatIndianNumber(item.soc)}</td>
                                            <td className="px-4 py-2 border border-gray-300" >{formatIndianNumber(item.rkvah)}</td>
                                            <td className="px-4 py-2 border border-gray-300" >{formatIndianNumber(item.iec)}</td>
                                        </tr>
                                        <tr className="px-4 py-2 border border-gray-300" colSpan="6">
                                            <th className="px-4 py-2 border border-gray-300" >
                                                sch
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300" >
                                                other
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300" >
                                                dsm
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300" >
                                                wheeling
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300" >
                                                css
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300" >
                                                net total
                                            </th></tr>
                                        <tr className="px-4 py-2 border border-gray-300" colSpan="6">
                                            <td className="px-4 py-2 border border-gray-300" >{formatIndianNumber(item.sch)}</td>
                                            <td className="px-4 py-2 border border-gray-300" >{formatIndianNumber(item.other)}</td>
                                            <td className="px-4 py-2 border border-gray-300" >{formatIndianNumber(item.dsm)}</td>
                                            <td className="px-4 py-2 border border-gray-300" >{formatIndianNumber(item.W_CHRGS)}</td>
                                            <td className="px-4 py-2 border border-gray-300" >{formatIndianNumber(item.css)}</td>
                                            <td className="px-4 py-2 border font-extrabold border-gray-300" >{formatIndianNumber(Number(item.amr) + Number(item.om) + Number(item.trans) + Number(item.soc) + Number(item.rkvah)
                                                + Number(item.iec) + Number(item.sch) + Number(item.other) + Number(item.dsm) + Number(item.W_CHRGS) + Number(item.css))}</td>
                                        </tr>
                                    </>

                                );
                            })}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default Adustedsummary;
