import React, { useEffect, useState, useRef } from "react";
import axios from "axios";


import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";

const HTLedger = () => {
  const [ip, setip] = useState(localStorage.getItem("localIp"));
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
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

  // **Filter Based on Month & HTSCNo**
  const filteredLedgerData = htLedger.filter(
    (item) => item.mo_year === selectedMonth && item.con_htscno === conHtScNo
  );

  // **Search Filter**
  const searchFilteredData = filteredLedgerData.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // **Total Calculation (Based on Search Results)**
  const totalValues = searchFilteredData.reduce((acc, row) => {
    [
      "G_ALL_C1", "G_ALL_C2", "G_ALL_C4", "G_ALL_C5",
      "NOAD_C1", "NOAD_C2", "NOAD_C4", "NOAD_C5",
      "BAL_C1", "BAL_C2", "BAL_C4", "BAL_C5"
    ].forEach((key) => {
      acc[key] = (acc[key] || 0) + (parseFloat(row[key]) || 0);
    });
    return acc;
  }, {});


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


  const tableRef = useRef(null);

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
      const actionCell = row.querySelectorAll("td, th")[6]; // Assuming 7th column is "Actions"
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
      const actionCell = row.querySelectorAll('th, td').length > 6 ? row.querySelectorAll('th, td')[6] : null;
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

  // {console.log(startDate,endDate);}




  return (
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
            Select Year
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
          <option value="" disabled>Select HT - COM / CON HTSCNo</option>
          {rows.map((row, index) => (
            <option key={index} value={row.htscno}>{row.htscno}</option>
          ))}
        </select>

        <label>Select Month:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="" disabled>Select Month</option>
          {uniqueMoYears.map((year, index) => (
            <option key={index} value={year}>{formatmonth(year)}</option>
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
          {/* <img
            className="pl-2 w-10 h-8 cursor-pointer"
            onClick={exportToExcel}
            src="../src/assets/xlsx.png"
            alt="Export to Excel"
        /> */}
          <img
            className="pl-4 w-12 h-10 cursor-pointer"
            onClick={print}
            src="../src/assets/pnt.png"
            alt="Export to PDF"
          />
        </div>


        <table ref={tableRef} className="w-full border-collapse border border-gray-300">
  <thead>
    <tr className="bg-gray-200">
      {[
        "id", "GEN PLANT htscno", "GEN PLANT name", "INJ VOLT", "l l",
        "ALL C1", "ALL C2", "ALL C4", "ALL C5", "ALL TOTAL",
        "ADJ C1", "ADJ C2", "ADJ C4", "ADJ C5", "ADJ TOTAL",
        "BAL C1", "BAL C2", "BAL C4", "BAL C5", "BAL TOTAL"
      ].map((field) => (
        <th key={field} className="border p-2">{field}</th>
      ))}
    </tr>
  </thead>

  <tbody>
    {searchFilteredData.length > 0 ? (
      searchFilteredData.map((row, index) => {
        // Ensure values are numbers and handle undefined cases
        const allTotal = [
          row.G_ALL_C1, row.G_ALL_C2, row.G_ALL_C4, row.G_ALL_C5
        ].reduce((sum, val) => sum + (Number(val) || 0), 0).toFixed(0);

        const adjTotal = [
          row.NOAD_C1, row.NOAD_C2, row.NOAD_C4, row.NOAD_C5
        ].reduce((sum, val) => sum + (Number(val) || 0), 0).toFixed(0);

        const balTotal = [
          row.BAL_C1, row.BAL_C2, row.BAL_C4, row.BAL_C5
        ].reduce((sum, val) => sum + (Number(val) || 0), 0).toFixed(0);

        return (
          <tr key={row.id || index} className="border">
          <td className="border p-2">{index + 1}</td>
          {[
            "weg_htscno", "gen_name", "inj_volt", "line_loss"
           
          ].map((field) => (
            <td key={field} className="border p-2">{row[field] ?? 0}</td>
          ))}
          {[            
            "G_ALL_C1", "G_ALL_C2", "G_ALL_C4", "G_ALL_C5"
          ].map((field) => (
            <td key={field} className="border p-2">{formatIndianNumber(row[field]) ?? 0}</td>
          ))}
          <td className="border p-2 font-bold">{formatIndianNumber(allTotal)}</td>
          {[
            "NOAD_C1", "NOAD_C2", "NOAD_C4", "NOAD_C5"
          ].map((field) => (
            <td key={field} className="border p-2">{formatIndianNumber(row[field]) ?? 0}</td>
          ))}
          <td className="border p-2 font-bold">{formatIndianNumber(adjTotal)}</td>
          {[
            "BAL_C1", "BAL_C2", "BAL_C4", "BAL_C5"
          ].map((field) => (
            <td key={field} className="border p-2">{formatIndianNumber(row[field]) ?? 0}</td>
          ))}
          <td className="border p-2 font-bold">{formatIndianNumber(balTotal)}</td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="10" className="text-center p-4">No records found.</td>
    </tr>
  )}
  </tbody>

  <tfoot>
    <tr className="bg-gray-300 font-bold">
      <td className="border p-2" colSpan={5}>Total</td>
      {[
        "G_ALL_C1", "G_ALL_C2", "G_ALL_C4", "G_ALL_C5"
      ].map((field) => (
        <td key={field} className="border p-2">
          {formatIndianNumber((Number(totalValues[field]) || 0))}
        </td>
      ))}
      <td className="border p-2">
        {formatIndianNumber(
          (Number(totalValues["G_ALL_C1"]) || 0) +
          (Number(totalValues["G_ALL_C2"]) || 0) +
          (Number(totalValues["G_ALL_C4"]) || 0) +
          (Number(totalValues["G_ALL_C5"]) || 0)
        )}
      </td>
      {[
        "NOAD_C1", "NOAD_C2", "NOAD_C4", "NOAD_C5"
      ].map((field) => (
        <td key={field} className="border p-2">
          {formatIndianNumber((Number(totalValues[field]) || 0))}
        </td>
      ))}
      <td className="border p-2">
        {formatIndianNumber(
          (Number(totalValues["NOAD_C1"]) || 0) +
          (Number(totalValues["NOAD_C2"]) || 0) +
          (Number(totalValues["NOAD_C4"]) || 0) +
          (Number(totalValues["NOAD_C5"]) || 0)
        )}
      </td>
      {[
        "BAL_C1", "BAL_C2", "BAL_C4", "BAL_C5"
      ].map((field) => (
        <td key={field} className="border p-2">
          {formatIndianNumber((Number(totalValues[field]) || 0))}
        </td>
      ))}
      <td className="border p-2">
        {formatIndianNumber(
          (Number(totalValues["BAL_C1"]) || 0) +
          (Number(totalValues["BAL_C2"]) || 0) +
          (Number(totalValues["BAL_C4"]) || 0) +
          (Number(totalValues["BAL_C5"]) || 0)
          )}
      </td>
    </tr>
  </tfoot>
</table>



      </div>
    </div>
  );
};

export default HTLedger;
