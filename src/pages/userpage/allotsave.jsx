import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Allotsave = () => {
  const tableRef = useRef(null);
const [ip, setip] = useState(localStorage.getItem("localIp"));
  const location = useLocation();
  const { filteredData, conread } = location.state || { filteredData: [], conread: {} };

  // Ensure filteredData is treated as an array of objects correctly
  const [rows, setRows] = useState(filteredData);
  const [data, setData] = useState(conread);

  // console.log("Rows:", rows);  // Should print array of objects
  // console.log("Data:", data);

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
              text-transform: uppercase;
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
               font-weight: bold;
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
          <h2>HT COM / CON LEDGER</h2>
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
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const objectData = rows.reduce((acc, item, index) => {
        acc[index] = item; // Assign each object a key
        return acc;
      }, {});

      console.log(objectData);

      const response = await axios.post("http://147.79.68.117:8000/api/createhtleadger", rows);

      alert("DATA ADDED SUCCESSFULLY");
      console.log("Response:", response.data);

      navigate("/readentry");

      // Use setTimeout to allow navigation before reload
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add data. Please try again.");
    }
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
    const year = date.getFullYear().toString();
    return `${monthName} / (${year})`;
  };


  return (
    <div className="p-6 bg-gray-100 uppercase">
      {/* Header Section */}
      <div className="text-center font-montserrat font-bold p-6">
        <h1>HT COM / CON Ledger</h1>
      </div>
      <img
        className="pl-4 w-12 h-10 cursor-pointer"
        onClick={print}
        src="../src/assets/pnt.png"
        alt="Export to PDF"
      />
      {/* Consumption Table */}
      <div className="overflow-x-auto mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
          {data.con_htscno} - {formatmonth(data.date)}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-center text-sm" ref={tableRef}>
            <thead>
              <tr className="bg-gray-400 ">
                <th className="border border-gray-300 px-4 py-2">{data.con_htscno}</th>
                <th className="border border-gray-300 px-4 py-2">TOTAL</th>
                <th className="border border-gray-300 px-4 py-2">C1</th>
                <th className="border border-gray-300 px-4 py-2">C2</th>
                <th className="border border-gray-300 px-4 py-2">C4</th>
                <th className="border border-gray-300 px-4 py-2">C5</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">HT - COM / CON</td>
                <td className="border border-gray-300 px-4 py-2">{Number(data.c1) + Number(data.c2) + Number(data.c4) + Number(data.c5)}</td>
                <td className="border border-gray-300 px-4 py-2">{data.c1}</td>
                <td className="border border-gray-300 px-4 py-2">{data.c2}</td>
                <td className="border border-gray-300 px-4 py-2">{data.c4}</td>
                <td className="border border-gray-300 px-4 py-2">{data.c5}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Net HT Balance to be Billed</td>
                <td className="border border-gray-300 px-4 py-2">{Number(data.c_c1) + Number(data.c_c2) + Number(data.c_c4) + Number(data.c_c5)}</td>
                <td className="border border-gray-300 px-4 py-2">{data.c_c1}</td>
                <td className="border border-gray-300 px-4 py-2">{data.c_c2}</td>
                <td className="border border-gray-300 px-4 py-2">{data.c_c4}</td>
                <td className="border border-gray-300 px-4 py-2">{data.c_c5}</td>
              </tr>
            </tbody>

            <tbody>
              {rows.map((item) => {

                // console.log(rowId); // Use a unique identifier for each row
                return (
                  <><tr className="bg-gray-400   font-bold">
                    <td className="border border-gray-300 px-4 py-2" colSpan="6">
                      {item.weg_htscno}
                    </td>
                  </tr><tr className="bg-gray-300  font-bold">
                      <td className="border border-gray-300 px-4 py-2" colSpan="2">
                        {item.gen_type}
                      </td>
                      <td className="border border-gray-300 px-4 py-2" colSpan="2">
                        {item.gen_name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">Inter Slot:  {item.is}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.inj_volt} KV</td>
                    </tr><tr>
                      <td className="border border-gray-300 px-4 py-2">Supply</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.c1) + Number(item.c2) + Number(item.c4) + Number(item.c5)}</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.c1)}</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.c2)}</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.c4)}</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.c5)}</td>
                    </tr><tr>
                      <td className="border border-gray-300 px-4 py-2">Adjusted</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.ac1) + Number(item.ac2) + Number(item.ac4) + Number(item.ac5)}</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.ac1)}</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.ac2)}</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.ac4)}</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.ac5)}</td>
                    </tr><tr>
                      <td className="border border-gray-300 px-4 py-2">Consumption Balance</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.cbc1) + Number(item.cbc2) + Number(item.cbc4) + Number(item.cbc5)}</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.cbc1)}</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.cbc2)}</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.cbc4)}</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.cbc5)}</td>
                    </tr><tr>
                      <td className="border border-gray-300 px-4 py-2">Gen PLANT  Banking Units</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.bc1) + Number(item.bc2) + Number(item.bc4) + Number(item.bc5)}</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.bc1)}</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.bc2)}</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.bc4)}</td>
                      <td className="border border-gray-300 px-4 py-2">{Number(item.bc5)}</td>
                    </tr>
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
                        tc
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
                      <td className="px-4 py-2 border border-gray-300" >{item.amr}</td>
                      <td className="px-4 py-2 border border-gray-300" >{item.om}</td>
                      <td className="px-4 py-2 border border-gray-300" >{item.trans}</td>
                      <td className="px-4 py-2 border border-gray-300" >{item.soc}</td>
                      <td className="px-4 py-2 border border-gray-300" >{item.rkvah}</td>
                      <td className="px-4 py-2 border border-gray-300" >{item.iec}</td>
                    </tr>
                    <tr className="px-4 py-2 border border-gray-300" colSpan="6">
                      <th className="px-4 py-2 border border-gray-300" >
                        sc
                      </th>
                      <th className="px-4 py-2 border border-gray-300" >
                        oc
                      </th>
                      <th className="px-4 py-2 border border-gray-300" >
                        dsm
                      </th>
                      <th className="px-4 py-2 border border-gray-300" >
                        wc
                      </th>
                      <th className="px-4 py-2 border border-gray-300" >
                        css
                      </th>
                      <th className="px-4 py-2 border border-gray-300" >
                        net total
                      </th></tr>
                    <tr className="px-4 py-2 border border-gray-300" colSpan="6">
                      <td className="px-4 py-2 border border-gray-300" >{item.sch}</td>
                      <td className="px-4 py-2 border border-gray-300" >{item.other}</td>
                      <td className="px-4 py-2 border border-gray-300" >{item.dsm}</td>
                      <td className="px-4 py-2 border border-gray-300" >{item.wc}</td>
                      <td className="px-4 py-2 border border-gray-300" >{item.css}</td>
                      <td className="px-4 py-2 border font-extrabold border-gray-300" >{Number(item.amr) + Number(item.om) + Number(item.trans) + Number(item.soc) + Number(item.rkvah)
                        + Number(item.iec) + Number(item.sch) + Number(item.other) + Number(item.dsm) + Number(item.wc) + Number(item.css)}</td>
                    </tr><tr><th className="px-4 py-2 border border-gray-300 bg-transparent font-bold" colSpan="6"> </th></tr>

                    {/* <tr>
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

                      <td className="px-4 py-2 border border-gray-300" colSpan="2">{item.wc}</td>
                    </tr><tr>
                      <td className="px-4 py-2 border border-gray-300" colSpan="2">Css</td>
                      <td className="px-4 py-2 border border-gray-300 text-left" colSpan="2">cross subsidy surCharges</td>

                      <td className="px-4 py-2 border border-gray-300" colSpan="2">{item.css}</td>
                    </tr> 
                    <tr>
                      <td className="px-4 py-2 border border-gray-300" colSpan="4">NET TOTAL CHARGES</td>*/}
                    {/* <td className="px-4 py-2 border border-gray-300 text-left" colSpan="2">cross subsidy surCharges</td> */}

                    {/* <td className="px-4 py-2 border border-gray-300" colSpan="2">{Number(item.amr)+Number(item.om)+Number(item.trans)+Number(item.soc)+Number(item.rkvah)
                      +Number(item.iec)+Number(item.sch)+Number(item.other)+Number(item.dsm)+Number(item.wc)+Number(item.css)}</td>
                    </tr> */}
                  </>

                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 mb-4 text-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Allotsave;