import React, { useEffect, useState, useRef } from "react";
import axios from "axios";


import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";
const Masterreport = () => {
const [ip, setip] = useState(localStorage.getItem("localIp"));
  const tableRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [plantData, setplantData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [htLedger, setHtLedger] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [uniqueMoYears, setUniqueMoYears] = useState([]);
  const [conHtScNo, setConHtScNo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const htResponse = await axios.get("http://147.79.68.117:8000/api/gethtdetail");
        setRows(htResponse.data);

        const conResponse = await axios.get("http://147.79.68.117:8000/api/getconread");
        setData(conResponse.data);

        const plantResponse = await axios.get("http://147.79.68.117:8000/api/getplant");
        setplantData(plantResponse.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchLedgerData = async () => {
      if (!startDate || !endDate) return;
      try {
        const response = await axios.get(
          `http://147.79.68.117:8000/api/getdatehtleadger/${startDate.replace(/\//g, "-")}/${endDate.replace(/\//g, "-")}`
        );
        const ledgerData = Array.isArray(response.data) ? response.data : [];
        setHtLedger(ledgerData);
        setUniqueMoYears([...new Set(ledgerData.map((item) => item.mo_year))]);
      } catch (error) {
        console.error("Error fetching ledger data:", error);
      }
    };
    fetchLedgerData();
  }, [startDate, endDate]);




  const [filteredLedgerData, setFilteredLedgerData] = useState([]);
  useEffect(() => {
    const filteredData = plantData.filter(
      (item) => item.con_htscno === conHtScNo);
    setFilteredLedgerData(filteredData);
  }, [conHtScNo]);

  { console.log(filteredLedgerData) }



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


  const uniqueYears = [...new Set(Object.values(data).map((item) => item.mo_year.split("-")[0]))];

  // Format output as {0: 2024, 1: 2025}
  const formattedYears = uniqueYears.reduce((acc, year, index) => {
    acc[index] = parseInt(year, 10);
    return acc;
  }, {});

  // Function to get year from mo_year
  const getYear = (year) => parseInt(year, 10);

  // {console.log(startDate,endDate);}





  useEffect(() => {
    const filteredData = plantData.filter((item) => {
      const matchingData = htLedger.find(
        (ht) => ht.con_htscno === item.con_htscno && ht.weg_htscno === item.weg_htscno
      );
  
      const allot =
        matchingData
          ? (Number(matchingData.ALL_C1) +
              Number(matchingData.ALL_C2) +
              Number(matchingData.ALL_C4) +
              Number(matchingData.ALL_C5)).toString()
          : "0";
  
      const adj =
        matchingData
          ? (Number(matchingData.NOAD_C1) +
              Number(matchingData.NOAD_C2) +
              Number(matchingData.NOAD_C4) +
              Number(matchingData.NOAD_C5)).toString()
          : "0";
  
      const bank =
        matchingData
          ? (Number(matchingData.BAL_C1) +
              Number(matchingData.BAL_C2) +
              Number(matchingData.BAL_C4) +
              Number(matchingData.BAL_C5)).toString()
          : "0";
  




          
      return (
        item.con_htscno === conHtScNo &&
        (searchTerm === "" ||
          item.gen_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.weg_htscno.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.con_htscno.toLowerCase().includes(searchTerm.toLowerCase()) ||
          allot.includes(searchTerm) ||
          adj.includes(searchTerm) ||
          bank.includes(searchTerm))
      );
    });
  
    setFilteredLedgerData(filteredData);
  }, [conHtScNo, searchTerm, plantData, htLedger]);
  
  


   const exportToPDF = () => {
      const element = tableRef.current; // Get table element via useRef
 
      // Create a wrapper div to hold the heading and table together
      const wrapper = document.createElement("div");
      wrapper.innerHTML = `
        <h2 style="text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 10px;">
          HT Ledger Report
        </h2>
      `;
      wrapper.appendChild(element.cloneNode(true)); // Clone the table to avoid modifying the original
  
      // Hide the Actions column in the cloned table
      const tableRows = wrapper.querySelectorAll("tr");
      
      tableRows.forEach((row) => {
        const actionCell = row.querySelectorAll("td, th")[42]; // Assuming 7th column is "Actions"
        if (actionCell) actionCell.style.display = "none"; // Hide Actions column
      });
  
      // Define PDF export options
      const options = {
        margin: [0.5, 0.5, 0.5, 0.5], // Margins (Top, Left, Bottom, Right)
        filename: "HT_Ledger_Report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 3, // Higher scale for better resolution
          useCORS: true, // Ensure images load properly
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: {
          unit: "mm",
          format: "a3", // Larger paper format to accommodate full table
          orientation: "landscape",
        },
      };

      // Generate and save PDF
      html2pdf()
        .from(wrapper)
        .set(options)
        .save()
        .then(() => {
          console.log("PDF Exported Successfully");
        });
    };
  
  
  
  
  
    const print = () => {
      const tableElement = tableRef.current;
  
      // Clone the table to manipulate a copy without affecting the original
      const tableClone = tableElement.cloneNode(true);
  
      // Hide the Actions column in the clone
      const rows = tableClone.querySelectorAll('tr');
      rows.forEach((row) => {
        const actionCell = row.querySelectorAll('th, td').length > 42 ? row.querySelectorAll('th, td')[42] : null;
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
                        <h2>HT DETAILS TABLE</h2>
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
    
      const exportToExcel = () => {
        if (searchFilteredData.length === 0) {
          alert("No data available to export!");
          return;
        }
    
        const ws = XLSX.utils.json_to_sheet(searchFilteredData); // Convert JSON to sheet
        const wb = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(wb, ws, "HT Ledger"); // Append sheet to workbook
    
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    
        saveAs(data, "HT_Ledger.xlsx"); // Save as file
      };


  return (
    <>

      <div className="p-6 bg-gray-100 uppercase">
        <div className="text-center font-montserrat font-bold p-6">
          <h1>HT - COM / CON Ledger</h1>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <label>Select Fy:</label>

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


          <label>Select HT - COM / CON HTSCNo:</label>
          <select
            value={conHtScNo}
            onChange={(e) => setConHtScNo(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="" disabled>HT - COM / CON HTSCNo</option>
            {rows.map((row, index) => (
              <option key={index} value={row.htscno}>{row.htscno}</option>
            ))}
          </select>


        </div>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-md px-3 py-2 w-50% mb-4"
        />

        <div className="overflow-x-auto">
          <div className="flex items-center space-x-4">
            <img
            className="w-12 h-12 cursor-pointer"
            onClick={exportToPDF}
            src="../src/assets/pdf.png"
            alt="Export to PDF"
          />
    
            <img
            className="pl-4 w-12 h-10 cursor-pointer"
            onClick={print}
            src="../src/assets/pnt.png"
            alt="Export to PDF"
          />
          </div>


          <table ref={tableRef} className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border p-2 text-center" rowSpan={2}>PLANT NAME</th>
                <th className="border p-2 text-center" rowSpan={2}>PLANT HTSCNO</th>
                {uniqueMoYears.map((year, index) => (
                  <th className="border p-2 text-center" key={`year-${index}`} colSpan={3}>{formatmonth(year)}</th>
                ))}
                <th colSpan={3}>TOTAL</th>
              </tr>
              <tr>
                {uniqueMoYears.map((year, index) => [
                  <th className="border p-2 text-center" key={`allot-${index}`}>ALLOT</th>,
                  <th className="border p-2 text-center" key={`adj-${index}`}>ADJ</th>,
                  <th className="border p-2 text-center" key={`bank-${index}`}>BANK</th>
                ])}
                <th className="border p-2 text-center">ALLOT</th>
                <th className="border p-2 text-center">ADJ</th>
                <th className="border p-2 text-center">BANK</th></tr>
            </thead>
            <tbody>
  {filteredLedgerData.map((row, index) => {
    let totalAllot = 0, totalAdj = 0, totalBank = 0;
    
    uniqueMoYears.forEach((year) => {
      const matchingData = htLedger.find(
        (item) =>
          item.mo_year === year &&
          item.con_htscno === row.con_htscno &&
          item.weg_htscno === row.weg_htscno
      );

      const allot = matchingData ? (Number(matchingData.ALL_C1) + Number(matchingData.ALL_C2) + Number(matchingData.ALL_C4) + Number(matchingData.ALL_C5)) || 0 : 0;
      const adj = matchingData ? (Number(matchingData.NOAD_C1) + Number(matchingData.NOAD_C2) + Number(matchingData.NOAD_C4) + Number(matchingData.NOAD_C5)) || 0 : 0;
      const bank = matchingData ? (Number(matchingData.BAL_C1) + Number(matchingData.BAL_C2) + Number(matchingData.BAL_C4) + Number(matchingData.BAL_C5)) || 0 : 0;

      totalAllot += allot;
      totalAdj += adj;
      totalBank += bank;
    });

    // Assign computed values to the row object
    row.totalAllot = totalAllot;
    row.totalAdj = totalAdj;
    row.totalBank = totalBank;

    return (
      <tr key={index}>
        <td className="border p-2 text-center">{row.gen_name}</td>
        <td className="border p-2 text-center">{row.weg_htscno}</td>
        {uniqueMoYears.map((year, idx) => {
          const matchingData = htLedger.find(
            (item) =>
              item.mo_year === year &&
              item.con_htscno === row.con_htscno &&
              item.weg_htscno === row.weg_htscno
          );

          const allot = matchingData ? (Number(matchingData.ALL_C1) + Number(matchingData.ALL_C2) + Number(matchingData.ALL_C4) + Number(matchingData.ALL_C5)) || 0 : 0;
          const adj = matchingData ? (Number(matchingData.NOAD_C1) + Number(matchingData.NOAD_C2) + Number(matchingData.NOAD_C4) + Number(matchingData.NOAD_C5)) || 0 : 0;
          const bank = matchingData ? (Number(matchingData.BAL_C1) + Number(matchingData.BAL_C2) + Number(matchingData.BAL_C4) + Number(matchingData.BAL_C5)) || 0 : 0;

          return (
            <React.Fragment key={idx}>
              <td className="border p-2 text-center">{formatIndianNumber(allot)}</td>
              <td className="border p-2 text-center">{formatIndianNumber(adj)}</td>
              <td className="border p-2 text-center">{formatIndianNumber(bank)}</td>
            </React.Fragment>
          );
        })}
        <td className="border p-2 text-center font-bold">{formatIndianNumber(totalAllot)}</td>
        <td className="border p-2 text-center font-bold">{formatIndianNumber(totalAdj)}</td>
        <td className="border p-2 text-center font-bold">{formatIndianNumber(totalBank)}</td>
      </tr>
    );
  })}

  {/* Grand Total Row */}
  <tr className="bg-gray-200 font-bold">
    <td className="border p-2 text-center" colSpan={2}>TOTAL</td>
    {uniqueMoYears.map((year, idx) => {
      let grandAllot = 0, grandAdj = 0, grandBank = 0;

      filteredLedgerData.forEach((row) => {
        const matchingData = htLedger.find(
          (item) =>
            item.mo_year === year &&
            item.con_htscno === row.con_htscno &&
            item.weg_htscno === row.weg_htscno
        );

        grandAllot += matchingData ? (Number(matchingData.ALL_C1) + Number(matchingData.ALL_C2) + Number(matchingData.ALL_C4) + Number(matchingData.ALL_C5)) || 0 : 0;
        grandAdj += matchingData ? (Number(matchingData.NOAD_C1) + Number(matchingData.NOAD_C2) + Number(matchingData.NOAD_C4) + Number(matchingData.NOAD_C5)) || 0 : 0;
        grandBank += matchingData ? (Number(matchingData.BAL_C1) + Number(matchingData.BAL_C2) + Number(matchingData.BAL_C4) + Number(matchingData.BAL_C5)) || 0 : 0;
      });

      return (
        <React.Fragment key={idx}>
          <td className="border p-2 text-center">{formatIndianNumber(grandAllot)}</td>
          <td className="border p-2 text-center">{formatIndianNumber(grandAdj)}</td>
          <td className="border p-2 text-center">{formatIndianNumber(grandBank)}</td>
        </React.Fragment>
      );
    })}
    <td className="border p-2 text-center font-bold">
      {formatIndianNumber(filteredLedgerData.reduce((acc, row) => acc + (Number(row.totalAllot) || 0), 0))}
    </td>
    <td className="border p-2 text-center font-bold">
      {formatIndianNumber(filteredLedgerData.reduce((acc, row) => acc + (Number(row.totalAdj) || 0), 0))}
    </td>
    <td className="border p-2 text-center font-bold">
      {formatIndianNumber(filteredLedgerData.reduce((acc, row) => acc + (Number(row.totalBank) || 0), 0))}
    </td>
  </tr>
</tbody>





          </table></div></div>
    </>
  );
};

export default Masterreport;
