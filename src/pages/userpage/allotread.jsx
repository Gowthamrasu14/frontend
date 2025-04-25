import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { RxUpdate } from "react-icons/rx";
import { SiVerizon } from "react-icons/si";
import ipeak from "../../assets/p.png";
import inormal from "../../assets/n.png";
import inight from "../../assets/night.png";




const ReadingEntry = () => {


  const [ip, setip] = useState(localStorage.getItem("localIp"));
  const [tableData, setTableData] = useState([]);  // Initialize with empty array
  const [htData, sethtData] = useState([]);
  const [htData1, sethtData1] = useState([]);
  const [conData, setconData] = useState([]);
  const [conData1, setconData1] = useState([]);
  const [conalter, setconalter] = useState([]);
  const [IS, setIS] = useState([]);
  const [chargesData, setChargesData] = useState([]);
  const [combo, setcombo] = useState("1");
  const [conhtscno, setconhtscno] = useState([]);


  const [bankingData, setBanking] = useState([]);
  const [savedata, setsavedata] = useState([]);

  const [plantData, setplantData] = useState([]);
  const [preadData, setpreadData] = useState([]);
  const [llData, setllData] = useState([]);
  const [field, setfield] = useState([]);
  const [field1, setfield1] = useState([]);
  const [htlData, sethtlData] = useState([]);
  const [plantprice, setplantprice] = useState([]);

  const [conread, setconread] = useState({
    date: '',
    c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, c_c1: 0, c_c2: 0, c_c3: 0, c_c4: 0, c_c5: 0,
  });
  const [newEntry, setNewEntry] = useState({
    date: '',
    c1: 0,
  });

  const [filteredData, setFilteredData] = useState([]);
  const [sumOfC, setSumOfC] = useState({ c1: 0, c2: 0, c4: 0, c5: 0, lc1: 0, lc2: 0, lc4: 0, lc5: 0 });

  // LOAD EVENTS
  useEffect(() => {

    const fetchhtData = async () => {
      const response = await axios.get("http://147.79.68.117:8000/api/gethtdetail");
      sethtData(response.data);
    };
    const fetchconData = async () => {
      const response = await axios.get("http://147.79.68.117:8000/api/getconread");
      setconData(response.data);

    };
    const fetchplantData = async () => {
      const response = await axios.get("http://147.79.68.117:8000/api/getplant");
      setplantData(response.data);

    };
    const fetchllData = async () => {
      const response = await axios.get("http://147.79.68.117:8000/api/getupdatelineloss");
      setllData(response.data);

    };
    const chargesData = async () => {
      const response = await axios.get("http://147.79.68.117:8000/api/getcharges");

      setChargesData(response.data);
    }

    const htlData = async () => {
      const response = await axios.get("http://147.79.68.117:8000/api/gethtleadger");

      sethtlData(response.data);
    }

    const plantprice = async () => {
      const response = await axios.get("http://147.79.68.117:8000/api/getplantunitprice");

      setplantprice(response.data);
    }
    plantprice();
    htlData();
    chargesData();
    fetchplantData();
    fetchhtData();
    fetchconData();
    fetchllData();
  }, []);

  const handleconChange = (e) => {
    const selectedHTSCNO = e.target.value;

    const getLatestData = (htscno) => {
      const filteredData = conData.filter((item) => item.con_htscno === htscno);
      if (filteredData.length === 0) return null; // Return null if no records found
      return filteredData.reduce((latest, item) =>
        new Date(item.mo_year) > new Date(latest.mo_year) ? item : latest
        , filteredData[0]);
    };

    const getLatestData1 = (htscno) => {
      const filteredData = htlData.filter((item) => item.con_htscno === htscno);
      if (filteredData.length === 0) return null; // Return null if no records found
      return filteredData.reduce((latest, item) =>
        new Date(item.mo_year) > new Date(latest.mo_year) ? item : latest
        , filteredData[0]);
    };

    const latestrecords = getLatestData(selectedHTSCNO);
    const latestrecords1 = getLatestData1(selectedHTSCNO);
    setconhtscno(selectedHTSCNO);

    console.log(latestrecords?.mo_year);
    console.log(latestrecords1?.mo_year);

    // Ensure both records exist before proceeding
    if (!latestrecords) {
      alert("PLEASE ENTER THE CONSUMPTION READING....");
      console.error("latestrecords is null or missing properties.");
      setconread({
        com_id: "",
        con_htscno: "",
        date: "",
        c1: 0, c2: 0, c3: 0, c4: 0, c5: 0,
        c_c1: 0, c_c2: 0, c_c3: 0, c_c4: 0, c_c5: 0,
      });

      setconalter({
        com_id: "",
        con_htscno: "",
        date: "",
        c1: 0, c2: 0, c3: 0, c4: 0, c5: 0,
        c_c1: 0, c_c2: 0, c_c3: 0, c_c4: 0, c_c5: 0,
      });

      return;
    }

    if (!latestrecords1) {

      console.log("No records found in htlData, setting initial state.");
      setconread({
        com_id: latestrecords.com_id || "",
        con_htscno: latestrecords.con_htscno || "",
        date: latestrecords.mo_year || "",
        c1: latestrecords.c1 || 0, c2: latestrecords.c2 || 0, c3: latestrecords.c3 || 0,
        c4: latestrecords.c4 || 0, c5: latestrecords.c5 || 0,
        c_c1: latestrecords.c_c1 || 0, c_c2: latestrecords.c_c2 || 0,
        c_c3: latestrecords.c_c3 || 0, c_c4: latestrecords.c_c4 || 0, c_c5: latestrecords.c_c5 || 0,
      });

      setconalter({
        com_id: latestrecords.com_id || "",
        con_htscno: latestrecords.con_htscno || "",
        date: latestrecords.mo_year || "",
        c1: latestrecords.c1 || 0, c2: latestrecords.c2 || 0, c3: latestrecords.c3 || 0,
        c4: latestrecords.c4 || 0, c5: latestrecords.c5 || 0,
        c_c1: latestrecords.c_c1 || 0, c_c2: latestrecords.c_c2 || 0,
        c_c3: latestrecords.c_c3 || 0, c_c4: latestrecords.c_c4 || 0, c_c5: latestrecords.c_c5 || 0,
      });

      var filtered1 = htData.filter((user) => user.htscno === e.target.value);
      sethtData1(filtered1[0]);
      // console.log(filtered1[0]);
      //LIST OF GENERATOR FOR SELECTED HT NUMBER
      var filtered2 = plantData.filter((user) => user.con_htscno === e.target.value);
      setconData1(filtered2);
      // console.log(filtered2);
      setcombo("0");
      return;
    }

    // Compare dates safely
    const latestDate = new Date(latestrecords.mo_year);
    const latestDate1 = new Date(latestrecords1.mo_year);

    if (latestDate1 < latestDate) {
      setconread({
        com_id: latestrecords.com_id || "",
        con_htscno: latestrecords.con_htscno || "",
        date: latestrecords.mo_year || "",
        c1: latestrecords.c1 || 0, c2: latestrecords.c2 || 0, c3: latestrecords.c3 || 0,
        c4: latestrecords.c4 || 0, c5: latestrecords.c5 || 0,
        c_c1: latestrecords.c_c1 || 0, c_c2: latestrecords.c_c2 || 0,
        c_c3: latestrecords.c_c3 || 0, c_c4: latestrecords.c_c4 || 0, c_c5: latestrecords.c_c5 || 0,
      });

      setconalter({
        com_id: latestrecords.com_id || "",
        con_htscno: latestrecords.con_htscno || "",
        date: latestrecords.mo_year || "",
        c1: latestrecords.c1 || 0, c2: latestrecords.c2 || 0, c3: latestrecords.c3 || 0,
        c4: latestrecords.c4 || 0, c5: latestrecords.c5 || 0,
        c_c1: latestrecords.c_c1 || 0, c_c2: latestrecords.c_c2 || 0,
        c_c3: latestrecords.c_c3 || 0, c_c4: latestrecords.c_c4 || 0, c_c5: latestrecords.c_c5 || 0,
      });

    } else if (latestDate1.getTime() === latestDate.getTime()) {
      alert("PLEASE ENTER THE CONSUMPTION READING....");
    }




    // FOR LINE LOSS CALCULATION 
    var filtered1 = htData.filter((user) => user.htscno === e.target.value);
    sethtData1(filtered1[0]);
    // console.log(filtered1[0]);
    //LIST OF GENERATOR FOR SELECTED HT NUMBER
    var filtered2 = plantData.filter((user) => user.con_htscno === e.target.value);
    setconData1(filtered2);
    // console.log(filtered2[0]);
    setcombo("0");
  }


  useEffect(() => {

    const fetchpreadData = async () => {
      const response = await axios.get(`http://147.79.68.117:8000/api/getOneplantread/${formatDate1(conread.date)}`);
      setpreadData(response.data);

    };
    fetchpreadData();
  }, [conData1]);

  useEffect(() => {
    const updatedFilteredData = conData1.flatMap((plant, index) => {
      const filteredPreadData = preadData.filter((user) => user.planthtscno === plant.weg_htscno);

      const filteredlinloss = llData.filter(
        (user) => user.Inj_Volt === plant.inj_volt && user.Drawal === htData1.drawal
      );

      if (filteredPreadData.length > 0 && filteredlinloss.length > 0) {
        return filteredPreadData.flatMap((d) =>
          filteredlinloss.map((ll) => ({
            id: index + 1,
            con_htscno: plant.con_htscno || '',
            com_id: htData1.com_id || '',
            traffic_type: htData1.traffic_type || '',
            weg_htscno: plant.weg_htscno || '',
            gen_name: plant.gen_name || '',
            gen_type: plant.gen_type || '',
            inj_volt: plant.inj_volt || '',
            drawal: htData1.drawal || '',
            date: formatDate1(conread.date),
            ll: ll.lin_loss,
            ban_op: plant.ban_op,

            is: 'NO',
            cc1: d.cc1,
            cc2: d.cc2,
            cc3: d.cc3,
            cc4: d.cc4,
            cc5: d.cc5,
            c_c1: conread.c_c1,
            c_c2: conread.c_c2,
            c_c3: conread.c_c3,
            c_c4: conread.c_c4,
            c_c5: conread.c_c5,
            gc1: d.c1 || 0,
            gc2: d.c2 || 0,
            gc4: d.c4 || 0,
            gc5: d.c5 || 0,
            ac1: 0,
            ac2: 0,
            ac4: 0,
            ac5: 0,
            c1: 0,
            c2: 0,
            c4: 0,
            c5: 0,
            lc1: 0,
            lc2: 0,
            lc4: 0,
            lc5: 0,
            bc1: 0,
            bc2: 0,
            bc4: 0,
            bc5: 0,
            gbc1: 0,
            gbc2: 0,
            gbc4: 0,
            gbc5: 0,
            cbc1: 0,
            cbc2: 0,
            cbc4: 0,
            cbc5: 0,
            inpkc1_c2: 0,
            inpkc2_c1: 0,
            insc1_c5: 0,
            insc1_c4: 0,
            insc2_c5: 0,
            insc2_c4: 0,
            insc4_c5: 0,
            om: d.om || 0,
            trans: d.trans || 0,
            soc: d.soc || 0,
            rkvah: d.rkvah || 0,
            iec: d.iec || 0,
            sch: d.sch || 0,
            other: d.other || 0,
            dsm: d.dsm || 0,
            amr: d.amr || 0,
            wc: 0,
            css: 0,
          }))
        );
      } else {
        return [
          {
            id: index + 1,
            con_htscno: plant.con_htscno || '',
            com_id: htData1.com_id || '',
            traffic_type: htData1.traffic_type || '',
            weg_htscno: plant.weg_htscno || '',
            gen_name: plant.gen_name || '',
            gen_type: plant.gen_type || '',
            inj_volt: plant.inj_volt || '',
            date: formatDate1(conread.date),
            ll: filteredlinloss[0]?.lin_loss || 0,
            drawal: htData1.drawal || '',
            ban_op: plant.ban_op,
            is: 'NO',
            cc1: 0,
            cc2: 0,
            cc3: 0,
            cc4: 0,
            cc5: 0,
            c_c1: 0,
            c_c2: 0,
            c_c3: 0,
            c_c4: 0,
            c_c5: 0,
            gc1: 0,
            gc2: 0,
            gc4: 0,
            gc5: 0,
            ac1: 0,
            ac2: 0,
            ac4: 0,
            ac5: 0,
            c1: 0,
            c2: 0,
            c4: 0,
            c5: 0,
            lc1: 0,
            lc2: 0,
            lc4: 0,
            lc5: 0,
            bc1: 0,
            bc2: 0,
            bc4: 0,
            bc5: 0,
            gbc1: 0,
            gbc2: 0,
            gbc4: 0,
            gbc5: 0,
            cbc1: 0,
            cbc2: 0,
            cbc4: 0,
            cbc5: 0,
            inpkc1_c2: 0,
            inpkc2_c1: 0,
            insc1_c5: 0,
            insc1_c4: 0,
            insc2_c5: 0,
            insc2_c4: 0,
            insc4_c5: 0,
            om: 0,
            trans: 0,
            soc: 0,
            rkvah: 0,
            iec: 0,
            sch: 0,
            other: 0,
            dsm: 0,
            amr: 0,
            wc: 0,
            css: 0,
          },
        ];
      }
    });


    setFilteredData(updatedFilteredData || []); // Ensure it's always an array


    const totalC1 = filteredData.reduce((sum, row) => sum + (row.c1 || 0), 0);
    const totalC2 = filteredData.reduce((sum, row) => sum + (row.c2 || 0), 0);
    const totalC4 = filteredData.reduce((sum, row) => sum + (row.c4 || 0), 0);
    const totalC5 = filteredData.reduce((sum, row) => sum + (row.c5 || 0), 0);
    const totalLC1 = filteredData.reduce((sum, row) => sum + (row.lc1 || 0), 0);
    const totalLC2 = filteredData.reduce((sum, row) => sum + (row.lc2 || 0), 0);
    const totalLC4 = filteredData.reduce((sum, row) => sum + (row.lc4 || 0), 0);
    const totalLC5 = filteredData.reduce((sum, row) => sum + (row.lc5 || 0), 0);

    setSumOfC((prevState) => ({
      ...prevState, // Spread the previous state
      c1: totalC1,
      c2: totalC2,
      c4: totalC4,
      c5: totalC5,
      lc1: totalLC1,
      lc2: totalLC2,
      lc4: totalLC4,
      lc5: totalLC5,
    }));


  }, [preadData]);




  // FOR ROW TOTAL
  const [inputs, setInputs] = useState({ c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 }); // Initial state

  const handleInputChange = (rowId, field, value, ll) => {
    const updatedValue = field === "is" ? value : Number(value) || 0; // Handle select inputs separately

    // Update `inputs` state
    setInputs((prevInputs) => ({
      ...prevInputs,
      [rowId]: {
        ...prevInputs[rowId],
        [field]: updatedValue,
      },
    }));

    // If `filteredData` needs to be updated too
    setFilteredData((prevData) =>
      prevData.map((item, index) =>
        index + 1 === rowId ? { ...item, [field]: updatedValue } : item
      )
    );



  };







  const handleBlur = (rowId, field, field1, field2, field3, value, ll) => {
    const numericValue = Number(value) || 0; // Convert value to number, default to 0 if invalid
    var updatedpreadValue = 0;
    // console.log(numericValue);
    setFilteredData((prevData) => {
      const newData = [...prevData];


      // Ensure the row exists
      if (newData[rowId - 1]) {
        const currentField1Value = conalter[field1] || 0;
        const currentpreadValue = Number(newData[rowId - 1][field3]) || 0;

        const calculatedFieldValue = Math.round(numericValue * (100 - ll) / 100);
        // console.log(calculatedFieldValue);
        // Calculate the new value for `field1`
        const updatedField1Value = (Number(sumOfC[field1]) || 0) + (currentField1Value - calculatedFieldValue);
        try {

          // if (numericValue != 0) {
          //   updatedpreadValue = (Number(sumOfC[field2]) || 0) + (currentpreadValue - numericValue);
          // } else {
          //   updatedpreadValue = (preadData[rowId - 1][field] - numericValue);
          // }
          updatedpreadValue = (currentpreadValue - numericValue);
        }
        catch {

        }
        // console.log(preadData);

        // Update the row with calculated values
        newData[rowId - 1] = {
          ...newData[rowId - 1],
          [field]: calculatedFieldValue, // Update `field`
          [field1]: updatedField1Value, // Update `field1`
          [field2]: numericValue, // Update `field2`
          [field3]: updatedpreadValue,
        };
      } else {
        console.error(`Row with ID ${rowId} does not exist in filteredData.`);
      }

      return newData;
    });
  };

  const handlefocus = (rowId, field, field3,) => {

    setFilteredData((prevData) => {
      const newData = [...prevData];


      // Ensure the row exists
      if (newData[rowId - 1]) {


        // console.log(field);

        // Update the row with calculated values
        newData[rowId - 1] = {
          ...newData[rowId - 1],
          [field3]: prevData[rowId - 1][field]
        };
      } else {
        console.error(`Row with ID ${rowId} does not exist in filteredData.`);
      }

      return newData;
    });
  };
  // console.log(htData1.traffic_type);


  useEffect(() => {
    const totalC1 = filteredData.reduce((sum, row) => sum + (row.c1 || 0), 0);
    const totalC2 = filteredData.reduce((sum, row) => sum + (row.c2 || 0), 0);
    const totalC4 = filteredData.reduce((sum, row) => sum + (row.c4 || 0), 0);
    const totalC5 = filteredData.reduce((sum, row) => sum + (row.c5 || 0), 0);
    const totalLC1 = filteredData.reduce((sum, row) => sum + (row.lc1 || 0), 0);
    const totalLC2 = filteredData.reduce((sum, row) => sum + (row.lc2 || 0), 0);
    const totalLC4 = filteredData.reduce((sum, row) => sum + (row.lc4 || 0), 0);
    const totalLC5 = filteredData.reduce((sum, row) => sum + (row.lc5 || 0), 0);

    setSumOfC((prevState) => ({
      ...prevState, // Spread the previous state
      c1: totalC1,
      c2: totalC2,
      c4: totalC4,
      c5: totalC5,
      lc1: totalLC1,
      lc2: totalLC2,
      lc4: totalLC4,
      lc5: totalLC5,
    }));
  }, [filteredData]);


  useEffect(() => {
    const handlesave = () => {
      let { c1: cc1, c2: cc2, c4: cc4, c5: cc5, c_c1: c_cc1, c_c2: c_cc2, c_c4: c_cc4, c_c5: c_cc5 } = conread;

      let updatedData = filteredData.map((item, index) => {
        let c1 = item.c1;
        let c2 = item.c2;
        let c4 = item.c4;
        let c5 = item.c5;
        let inter = item.is;
        let ll = item.ll;

        let balc1 = 0;
        let balc2 = 0;
        let balc4 = 0;
        let balc5 = 0;

        let tinpkc1_c2 = 0;
        let tinpkc2_c1 = 0;
        let tinsc1_c5 = 0;
        let tinsc2_c5 = 0;
        let tinsc1_c4 = 0;
        let tinsc2_c4 = 0;
        let tinsc4_c5 = 0;

        const charge = chargesData.find((user) => user.plantname === item.gen_type && formatDate1(user.date) <= formatDate1(item.date));
        let wcharges = charge?.w_chrgs || 0;

        let CSS = "CSS_" + htData1.traffic_type;
        let ccharges = charge?.[CSS] || 0; // Use optional chaining to prevent errors



        let gen_type = item.gen_type;
        let cssValue = 0;

        let noadc1 = 0;
        let noadc2 = 0;
        let noadc4 = 0;
        let noadc5 = 0;

        // let inj = item.inj_volt;
        let linloss = llData.filter((user) => user.Inj_Volt === item.inj_volt && user.Drawal === htData1.drawal && formatDate1(user.date) <= formatDate1(item.date));

        // console.log("Filtered linloss:", linloss); // Debugging log

        // Check if linloss has at least one item before accessing Trans_loss
        let trans = linloss.length > 0 ? linloss[0].Trans_loss : 0; // Default to 0 or some fallback value

        // console.log("Trans_loss value:", trans);


        if (balc2 === 0 && c1 <= cc1) {
          cc1 -= c1;
          noadc1 = Number(c1) + Number(noadc1);
          // console.log(1);
          // console.log(cc1);

          balc1 = 0;
        } else if (balc2 === 0 && c1 > cc1) {
          // console.log(c1);
          // console.log(cc1);
          // console.log(2);
          balc1 = c1 - cc1;
          // console.log(balc1);
          noadc1 = Number(cc1) + Number(noadc1);
          cc1 = 0;

          if (balc1 !== 0 && balc1 <= (cc2 - c2)) {
            // console.log(3);
            noadc2 = Number(balc1) + Number(noadc2);
            tinpkc1_c2 = balc1;
            cc2 -= (c2 + balc1);
            balc1 = 0;

          } else if (balc1 !== 0 && balc1 > (c2 - cc2)) {
            // console.log(4);
            // console.log(balc1);
            noadc2 = Number(cc2) + Number(noadc2);
            tinpkc1_c2 = (cc2 - c2);
            balc1 -= (cc2 - c2);
            // console.log(balc1);
            cc2 = 0;

          }
        }

        // if (balc1 === 0 && c2 <= cc2) {
        //   console.log(5)
        //   noadc2 = Number(c2) + Number(noadc2);
        //   cc2 -= c2;
        //   balc2 = 0;
        // } else if (balc1 === 0 && c2 > cc2) {
        //   console.log(6)
        //   balc2 = c2 - cc2;
        //   noadc2 = Number(cc2) + Number(noadc2);
        //   cc2 = 0;

        //   if (balc2 !== 0 && (balc2) <= cc1) {
        //     console.log(7)
        //     noadc1 = Number(c1 + balc2) + Number(noadc1);
        //     tinpkc2_c1 = balc2;
        //     cc1 -= (balc2);
        //     balc2 = 0;
        //   } else if (balc2 !== 0 && (balc2) > cc1) {
        //     console.log(8)
        //     noadc1 = Number(cc2) + Number(noadc1);
        //     tinpkc2_c1 = (cc1);
        //     balc2 = (balc2) - cc1;
        //     cc1 = 0;
        //   }
        // }










        if (balc1 === 0 && c2 <= cc2) {
          cc2 -= c2;
          noadc2 = Number(c2) + Number(noadc2);
          // console.log(2);
          // console.log(cc2);

          balc2 = 0;
        } else if (balc1 === 0 && c2 > cc2) {
          // console.log(c2);
          // console.log(cc2);
          // console.log(2);
          balc2 = c2 - cc2;
          // console.log(balc2);
          noadc2 = Number(cc2) + Number(noadc2);
          cc2 = 0;

          if (balc2 !== 0 && balc2 <= (cc1 - c1)) {
            // console.log(3);
            noadc1 = Number(balc2) + Number(noadc1);
            tinpkc2_c1 = balc2;
            cc1 -= (c1 + balc2);
            balc2 = 0;

          } else if (balc2 !== 0 && balc2 > (c1 - cc1)) {
            // console.log(4);
            // console.log(balc2);
            noadc1 = Number(cc1) + Number(noadc1);
            tinpkc2_c1 = (cc1 - c1);
            balc2 -= (cc1 - c1);
            // console.log(balc2);
            cc1 = 0;

          }
        }









        if (c5 <= cc5) {
          noadc5 = Number(c5) + Number(noadc5);
          cc5 -= c5;
          balc5 = 0;
        } else {
          noadc5 = Number(cc5) + Number(noadc5);
          balc5 = c5 - cc5;
          cc5 = 0;
        }

        if (c4 <= cc4) {
          noadc4 = Number(c4) + Number(noadc4);;
          cc4 -= c4;
          balc4 = 0;
        } else {
          noadc4 = Number(cc4) + Number(noadc4);;
          balc4 = c4 - cc4;
          cc4 = 0;
        }
        let g = "-"
        // console.log(noadc1,g,noadc2,g,noadc4,g,noadc5);

        if (inter === '') {
          alert("PLEASE SELECT INTER SLOT OPTION 'YES' OR 'NO'");
        }

        if (inter === "YES") {
          if (balc1 !== 0 && balc1 <= (cc5 - c5)) {
            noadc5 = Number(balc1) + Number(noadc5);
            tinsc1_c5 = balc1;
            cc5 -= (c5 + balc1);
            balc1 = 0;
          } else if (balc1 !== 0 && balc1 > (cc5 - c5)) {
            noadc5 = Number(cc5) + Number(noadc5);
            tinsc1_c5 = (cc5 - c5);
            balc1 -= (cc5 - c5);
            cc5 = 0;
          }

          if (balc1 !== 0 && balc1 <= (cc4 - c4)) {
            noadc4 = Number(balc1) + Number(noadc4);;
            tinsc1_c4 = balc1;
            cc4 -= (c4 + balc1);
            balc1 = 0;
          } else if (balc1 !== 0 && balc1 > (cc4 - c4)) {
            noadc4 = Number(cc4) + Number(noadc4);
            tinsc1_c4 = (cc4 - c4);
            balc1 -= (cc4 - c4);
            cc4 = 0;
          }

          if (balc2 !== 0 && balc2 <= (cc5 - c5)) {
            noadc5 = Number(balc2) + Number(noadc5);
            tinsc2_c5 = balc2;
            cc5 -= (c5 + balc2);
            balc2 = 0;
          } else if (balc2 !== 0 && balc2 > (cc5 - c5)) {
            noadc5 = Number(cc5) + Number(noadc5);
            tinsc2_c5 = (cc5 - c5);
            balc2 -= (cc5 - c5);
            cc5 = 0;
          }

          if (balc2 !== 0 && balc2 <= (cc4 - c4)) {
            noadc4 = Number(balc2) + Number(noadc4);
            tinsc2_c4 = balc2;
            cc4 -= (c4 + balc2);
            balc2 = 0;
          } else if (balc2 !== 0 && balc2 > (cc4 - c4)) {
            noadc4 = Number(cc4) + Number(noadc4);
            tinsc2_c4 = (cc4 - c4);
            balc2 -= cc4;
            cc4 = 0;
          }

          if (balc4 !== 0 && balc4 <= (cc5 - c5)) {
            // console.log(1);
            noadc5 = Number(balc4) + Number(noadc5);
            tinsc4_c5 = balc4;
            cc5 -= (c5 + balc4);
            balc4 = 0;
          } else if (balc4 !== 0 && balc4 > (cc5 - c5)) {
            // console.log(2);
            // console.log(noadc5);

            // console.log(cc5);
            // console.log(c5);
            noadc5 = Number(cc5) + Number(noadc5);
            tinsc4_c5 = (cc5 - c5);
            balc4 -= cc5;
            // console.log(noadc5);
            cc5 = 0;
          }
        }
        // let twc = (Number(c1) - Number(balc1)) +
        //   (Number(c2) - Number(balc2)) +
        //   (Number(c4) - Number(balc4)) +
        //   (Number(c5) - Number(balc5));

        let twc = Number(noadc1) + Number(noadc2) + Number(noadc4) + Number(noadc5);
        let wheelc = (((((twc / (100 - ll)) * 100) * (100 - trans) / 100) * wcharges));
        // console.log("Updated values -> noadc1:", noadc1, "noadc2:", noadc2, "noadc4:", noadc4, "noadc5:", noadc5);
        // console.log(wheelc);

        if (
          gen_type === "IEX" ||
          gen_type === "THIRD PARTY BIOMASS" ||
          gen_type === "THIRD PARTY BAGASSE" ||
          gen_type === "THIRD PARTY THERMAL" ||
          gen_type === "THIRD PARTY SOLAR" ||
          gen_type === "THIRD PARTY WIND"
        ) {

          cssValue = Number(twc) * Number(ccharges);
          // console.log(cssValue);
        }
        else {
          cssValue = 0;
        }
        // console.log(twc);

        // console.log(wcharges);

        return {
          ...item,
          cbc1: cc1,
          cbc2: cc2,
          cbc4: cc4,
          cbc5: cc5,
          bc1: Math.round((balc1 / (100 - ll)) * 100),
          bc2: Math.round((balc2 / (100 - ll)) * 100),
          bc4: Math.round((balc4 / (100 - ll)) * 100),
          bc5: Math.round((balc5 / (100 - ll)) * 100),
          gbc1: Math.round(((balc1 / (100 - ll)) * 100) - ((balc1 / (100 - ll)) * 100) * 14 / 100),
          gbc2: Math.round(((balc2 / (100 - ll)) * 100) - ((balc2 / (100 - ll)) * 100) * 14 / 100),
          gbc4: Math.round(((balc4 / (100 - ll)) * 100) - ((balc4 / (100 - ll)) * 100) * 14 / 100),
          gbc5: Math.round(((balc5 / (100 - ll)) * 100) - ((balc5 / (100 - ll)) * 100) * 14 / 100),
          inpkc1_c2: Math.round((tinpkc1_c2 / (100 - ll)) * 100),
          inpkc2_c1: Math.round((tinpkc2_c1 / (100 - ll)) * 100),
          insc1_c5: Math.round((tinsc1_c5 / (100 - ll)) * 100),
          insc1_c4: Math.round((tinsc1_c4 / (100 - ll)) * 100),
          insc2_c5: Math.round((tinsc2_c5 / (100 - ll)) * 100),
          insc2_c4: Math.round((tinsc2_c4 / (100 - ll)) * 100),
          insc4_c5: Math.round((tinsc4_c5 / (100 - ll)) * 100),
          ac1: (noadc1),
          ac2: (noadc2),
          ac4: (noadc4),
          ac5: (noadc5),
          wc: Math.round(Number(wheelc)),
          css: Math.round(cssValue, 3), // Assign computed CSS value here

        };
      });

      // Update the state with new filtered data
      setFilteredData(updatedData);

      // Update conread state
      setconread((prev) => ({
        ...prev,
        c_c1: cc1,
        c_c2: cc2,
        c_c4: cc4,
        c_c5: cc5,
      }));
    };

    handlesave();
  }, [IS]);


  // console.log(filteredData);


  const getRowTotal = (rowId) => {
    const rowInputs = inputs[rowId] || {};
    return (
      (rowInputs.c1 || 0) +
      (rowInputs.c2 || 0) +
      (rowInputs.c4 || 0) +
      (rowInputs.c5 || 0)
    );
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
    const year = date.getFullYear().toString().slice(-2);
    return `${monthName}-${year}`;
  };

  // Merge objects

  const navigate = useNavigate();
  // Example function to navigate with data
  const handleNavigate = () => {
    navigate("/Allotcharges", { state: { filteredData, conread } });
  };






  return (
    <div className="min-h-screen uppercase bg-gray-100">
      {/* Header */}
      <div className="text-center font-bold">
        <h1>HT - COM / CON & GEN PLANT - UNITS ENTRY DETAIL</h1>
      </div>
      {/* <div className="text-center">
                <h6 className="text-sm ">SVPSY0286 | SEP-24</h6>
            </div> */}


      {/* Main Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white bg shadow rounded-lg p-6">


          {/* Table 1: Service Number */}
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead className="bg-green-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2"> HT - COM/CON SERVICE No</th>
                <th className="border border-gray-300 px-4 py-2">TOTAL</th>
                <th className="border border-gray-300 px-4 py-2">C1</th>
                <th className="border border-gray-300 px-4 py-2">C2</th>
                <th className="border border-gray-300 px-4 py-2">C4</th>
                <th className="border border-gray-300 px-4 py-2">C5</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex items-center space-x-3">
                    <select
                      name="htscno"
                      value={newEntry.htscno}
                      onChange={(e) => {
                        // handleInputChange(e);
                        handleconChange(e);
                        setInputs({
                          c1: 0,
                          c2: 0,
                          c3: 0,
                          c4: 0,
                          c5: 0,
                        });

                      }}
                      className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-gray-200 peer"
                    >
                      <option value="">SELECT HT - COM / CON  HTSCNO</option>
                      {htData.map((item) => (
                        <option key={item.id} value={item.htscno}>
                          {item.htscno}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      id="first_name"
                      className="peer block border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-black"
                      placeholder={formatmonth(conread.date)}

                      readOnly
                    />
                  </div>
                </td>

                <td className="border border-gray-300 px-4 py-2">{Number(conread.c1) + Number(conread.c2) + Number(conread.c4) + Number(conread.c5)}</td>
                <td className="border border-gray-300 px-4 py-2">{conread.c1}</td>
                <td className="border border-gray-300 px-4 py-2">{conread.c2}</td>
                <td className="border border-gray-300 px-4 py-2">{conread.c4}</td>
                <td className="border border-gray-300 px-4 py-2">{conread.c5}</td>
              </tr>
              {/* {console.log(conalter)} */}
              <tr>
                <td className="border border-gray-300 px-4 py-2">Consumption to be billed</td>
                <td className="border border-gray-300 px-4 py-2">{Number(conread.c_c1) + Number(conread.c_c2) + Number(conread.c_c4) + Number(conread.c_c5) || 0}</td>
                <td className="border border-gray-300 px-4 py-2">{conread.c_c1 || 0}</td>
                <td className="border border-gray-300 px-4 py-2">{conread.c_c2 || 0}</td>
                <td className="border border-gray-300 px-4 py-2">{conread.c_c4 || 0}</td>
                <td className="border border-gray-300 px-4 py-2">{conread.c_c5 || 0}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Adjusted Units</td>
                <td className="border border-gray-300 px-4 py-2">{(Number(conread.c1) + Number(conread.c2) + Number(conread.c4) + Number(conread.c5)) - (Number(conread.c_c1) + Number(conread.c_c2) + Number(conread.c_c4) + Number(conread.c_c5) || 0)}</td>
                <td className="border border-gray-300 px-4 py-2">{conread.c1 - (conread.c_c1 || 0)}</td>
                <td className="border border-gray-300 px-4 py-2">{conread.c2 - (conread.c_c2 || 0)}</td>
                <td className="border border-gray-300 px-4 py-2">{conread.c4 - (conread.c_c4 || 0)}</td>
                <td className="border border-gray-300 px-4 py-2">{conread.c5 - (conread.c_c5 || 0)}</td>
              </tr>
            </tbody>
          </table>

          {/* Table 2: Plant Details */}
          <div className="w-full">

            <div className="pl-4 relative overflow-x-auto shadow-md sm:rounded-lg">
              <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
                <div className="flex justify-center gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-green-700 mr-2 border border-gray-500"></div>
                    <span>GEN</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-purple-800 mr-2 border border-gray-500"></div>
                    <span>ALLOT + LL</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-blue-700 mr-2 border border-gray-500"></div>
                    <span>GEN BANK</span>
                  </div>
                </div>
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-green-200 sticky top-0">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">GEN PLANT NAME</th>
                      <th className="border border-gray-300 px-4 py-2">GEN PLANT HTSCNO</th>
                      <th className="border border-gray-300 px-4 py-2">TOTAL</th>
                      <th className="border border-gray-300 px-4 py-2">C1</th>
                      <th className="border border-gray-300 px-4 py-2">C2</th>
                      <th className="border border-gray-300 px-4 py-2">C4</th>
                      <th className="border border-gray-300 px-4 py-2">C5</th>
                      <th className="border border-gray-300 px-4 py-2">I S</th>

                      {/* <th className="border border-gray-300 px-4 py-2" colSpan={2}>ACTION</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {/* {console.log(filteredData)} */}
                    {filteredData.map((item, index) => {
                      const rowId = index + 1;
                      
                      const matchedPrices = plantprice.filter(
                        (user) => user.con_htscno === conhtscno && user.plant_htscno === item.weg_htscno
                      );

                      // Get the one with the max date
                      const matchedPrice = matchedPrices.reduce((latest, current) => {
                        const currentDate = new Date(current.date);
                        const latestDate = latest ? new Date(latest.date) : null;
                        return !latestDate || currentDate > latestDate ? current : latest;
                      }, null);
                      // console.log(matchedPrice);
                      const ppeak = matchedPrice?.peak ?? 0;
                      const pnormal = matchedPrice?.normal ?? 0;
                      const pnight = matchedPrice?.night ?? 0;

                      // console.log(ppeak, pnormal, pnight); // Use a unique identifier for each row
                      return (
                        <>
                          {(Number(item.gc1) + Number(item.gc2) + Number(item.gc4) + Number(item.gc5)) !== 0
                            ?
                            <tr key={rowId}>

                              <td className="border border-gray-300 px-4 py-2">{item.gen_name}</td>
                              <td className="border border-gray-300 px-4 py-2">{item.weg_htscno}
                                <div className="flex items-center font-bold text-red-600">  <img
                                  src={ipeak || 0} className="cursor-pointer duration-500 w-5 h-10" alt="Peak" />
                                  <span className="ml-2">{ppeak}</span>
                                </div>

                                <div className="flex items-center font-bold text-green-800"> <img
                                  src={inormal || 0} className="cursor-pointer duration-500 w-5 h-10" alt="Peak" />
                                  <span className="ml-2">{pnormal}</span> </div>

                                <div className="flex items-center font-bold text-black">  <img
                                  src={inight || 0} className="cursor-pointer duration-500 w-5 h-10" alt="Peak" />
                                  <span className="ml-2">{pnight}</span> </div>

                              </td>

                              {/* Total Field */}
                              <td className="border border-gray-300 px-4 py-2 ">
                                <input
                                  type="number"
                                  min={0}
                                  value={getRowTotal(rowId)}
                                  className="peer block w-full border-0 border-b-2 border-transparent text-center bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                                  readOnly />
                                {/* <div className="font-bold">{getRowTotal(rowId)}</div> */}
                                <div className="font-bold text-black-500 text-green-700">
                                  {Number(item.cc1) + Number(item.cc2) + Number(item.cc4) + Number(item.cc5)}
                                </div>
                                <div className="font-bold text-black-500 text-purple-800">{Math.round((conread.c_c1 + conread.c_c2 + conread.c_c4 + conread.c_c5) / (100 - item.ll) * 100)}</div>

                                <div className="font-bold text-black-500 text-blue-700"> {(Number(item.cc1) + Number(item.cc2) + Number(item.cc4) + Number(item.cc5)) - (Math.round((item.c_c1 + item.c_c2 + item.c_c4 + item.c_c5) / (100 - item.ll) * 100))}</div>

                              </td>
                              {/* Input Fields */}
                              <td className="border border-gray-300 px-4 py-2">
                                <input
                                  type="number"

                                  min={0}
                                  value={inputs[rowId]?.c1 || 0}
                                  // value = {item.cc1}
                                  onChange={(e) => {
                                    let value = Number(e.target.value);
                                    if (value > item.cc1) {
                                      value = item.cc1; // Set it to max if exceeded
                                      e.preventDefault();
                                    }
                                    handleInputChange(rowId, "c1", value, item.ll);
                                  }}

                                  // onChange={(e) => handleInputChange(rowId, "c1", e.target.value, item.ll)}
                                  onBlur={(e) => {
                                    handleBlur(rowId, "c1", "c_c1", "lc1", "cc1", e.target.value, item.ll);
                                    setfield1("c_c1"); // Dynamically set field1 on blur to use it later
                                    setfield("c1");

                                  }}
                                  onFocus={(e) => {
                                    handlefocus(rowId, "gc1", "cc1");
                                    setfield1("c_c1"); // Dynamically set field1 on blur to use it later
                                    setfield("c1");

                                  }}
                                  className="peer block w-full border-0 border-b-2 border-transparent text-center bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"

                                />
                                <div className="font-bold text-black-500 text-green-700">
                                  {Number(item.cc1)}
                                </div>
                                <div className="font-bold text-black-500 text-purple-800">{Math.round((conread.c_c1) / (100 - item.ll) * 100)}</div>

                                <div className="font-bold text-black-500 text-blue-700"> {(Number(item.cc1)) - (Math.round((conread.c_c1) / (100 - item.ll) * 100))}</div>

                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                <input
                                  type="number"
                                  min={0}
                                  value={inputs[rowId]?.c2 || 0}
                                  // value = {item.cc2}
                                  onChange={(e) => {
                                    let value = Number(e.target.value);
                                    if (value > item.cc2) {
                                      value = item.cc2; // Set it to max if exceeded
                                      e.preventDefault();
                                    }
                                    handleInputChange(rowId, "c2", value, item.ll);
                                  }}
                                  // onChange={(e) => handleInputChange(rowId, "c2", e.target.value, item.ll)}
                                  onBlur={(e) => {
                                    handleBlur(rowId, "c2", "c_c2", "lc2", "cc2", e.target.value, item.ll);
                                    setfield1("c_c2"); // Dynamically set field1 on blur to use it later
                                    setfield("c2");
                                  }}

                                  onFocus={(e) => {
                                    handlefocus(rowId, "gc2", "cc2");
                                    setfield1("c_c2"); // Dynamically set field1 on blur to use it later
                                    setfield("c2");

                                  }}

                                  className="peer block w-full border-0 border-b-2 border-transparent text-center bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"

                                />
                                <div className="font-bold text-black-500 text-green-700">
                                  {Number(item.cc2)}
                                </div>
                                <div className="font-bold text-black-500 text-purple-800">{Math.round((conread.c_c2) / (100 - item.ll) * 100)}</div>

                                <div className="font-bold text-black-500 text-blue-700"> {(Number(item.cc2)) - (Math.round((conread.c_c2) / (100 - item.ll) * 100))}</div>

                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                <input
                                  type="number"
                                  min={0}
                                  value={inputs[rowId]?.c4 || 0}
                                  // value = {item.cc4}
                                  onChange={(e) => {
                                    let value = Number(e.target.value);
                                    if (value > item.cc4) {
                                      value = item.cc4; // Set it to max if exceeded
                                      e.preventDefault();
                                    }
                                    handleInputChange(rowId, "c4", value, item.ll);
                                  }}
                                  // onChange={(e) => handleInputChange(rowId, "c4", e.target.value, item.ll)}
                                  onBlur={(e) => {
                                    handleBlur(rowId, "c4", "c_c4", "lc4", "cc4", e.target.value, item.ll);
                                    setfield1("c_c4"); // Dynamically set field1 on blur to use it later
                                    setfield("c4");
                                  }}
                                  onFocus={(e) => {
                                    handlefocus(rowId, "gc4", "cc4");
                                    setfield1("c_c4"); // Dynamically set field1 on blur to use it later
                                    setfield("c4");

                                  }}
                                  className="peer block w-full border-0 border-b-2 border-transparent text-center bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"

                                />
                                <div className="font-bold text-black-500 text-green-700">
                                  {Number(item.cc4)}
                                </div>
                                <div className="font-bold text-black-500 text-purple-800">{Math.round((conread.c_c4) / (100 - item.ll) * 100)}</div>

                                <div className="font-bold text-black-500 text-blue-700"> {(Number(item.cc4)) - (Math.round((conread.c_c4) / (100 - item.ll) * 100))}</div>

                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                <input
                                  type="number"
                                  min={0}
                                  value={inputs[rowId]?.c5 || 0}
                                  // value = {item.cc5}
                                  onChange={(e) => {
                                    let value = Number(e.target.value);
                                    if (value > item.cc5) {
                                      value = item.cc5; // Set it to max if exceeded
                                      e.preventDefault();
                                    }
                                    handleInputChange(rowId, "c5", value, item.ll);
                                  }}
                                  // onChange={(e) => handleInputChange(rowId, "c5", e.target.value, item.ll)}
                                  onBlur={(e) => {
                                    handleBlur(rowId, "c5", "c_c5", "lc5", "cc5", e.target.value, item.ll);
                                    setfield1("c_c5"); // Dynamically set field1 on blur to use it later
                                    setfield("c5");
                                  }}
                                  onFocus={(e) => {
                                    handlefocus(rowId, "gc5", "cc5");
                                    setfield1("c_c5"); // Dynamically set field1 on blur to use it later
                                    setfield("c5");

                                  }}
                                  className="peer block w-full border-0 border-b-2 border-transparent text-center bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"

                                />
                                <div className="font-bold text-black-500 text-green-700">
                                  {Number(item.cc5)}
                                </div>
                                <div className="font-bold text-black-500 text-purple-800">{Math.round((conread.c_c5) / (100 - item.ll) * 100)}</div>

                                <div className="font-bold text-black-500 text-blue-700"> {(Number(item.cc5)) - (Math.round((conread.c_c5) / (100 - item.ll) * 100))}</div>

                              </td>

                              <td className="border border-gray-300 px-4 py-2">


                                <select
                                  value={inputs[rowId]?.is || ""} // Ensure the correct value is selected
                                  className="border border-gray-300 rounded-lg"
                                  onChange={(e) => {
                                    const value = e.target.value;

                                    handleInputChange(rowId, "is", value, item.ll); // Update state properly

                                    setIS((prev) => ({ ...prev, id: rowId, rowId: value }));

                                  }}
                                >
                                  <option value="">SELECT IS</option>
                                  <option value="YES">YES</option>
                                  <option value="NO">NO</option>
                                </select>
                              </td>
                            </tr>

                            :
                            <tr key={rowId}>
                              <td className="border border-gray-300 px-4 py-2">{item.gen_name}</td>
                              <td className="border border-gray-300 px-4 py-2">{item.weg_htscno}</td>

                              {/* Total Field */}
                              <td className="border border-gray-300 px-4 py-2 ">
                                <input
                                  type="number"
                                  min={0}
                                  value={getRowTotal(rowId)}
                                  className="peer block w-full border-0 border-b-2 border-transparent text-center bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                                  readOnly />
                                {/* <div className="font-bold">{getRowTotal(rowId)}</div> */}
                                <div className="font-bold text-black-500 text-green-700">
                                  {Number(item.cc1) + Number(item.cc2) + Number(item.cc4) + Number(item.cc5)}
                                </div>
                                <div className="font-bold text-black-500 text-purple-800">{Math.round((conread.c_c1 + conread.c_c2 + conread.c_c4 + conread.c_c5) / (100 - item.ll) * 100)}</div>

                                <div className="font-bold text-black-500 text-blue-700"> {(Number(item.cc1) + Number(item.cc2) + Number(item.cc4) + Number(item.cc5)) - (Math.round((item.c_c1 + item.c_c2 + item.c_c4 + item.c_c5) / (100 - item.ll) * 100))}</div>

                              </td>
                              {/* Input Fields */}
                              <td className="border border-gray-300 px-4 py-2">
                                <input
                                  type="number"
                                  min={0}
                                  value={inputs[rowId]?.c1 || 0}
                                  // value = {item.cc1}
                                  onChange={(e) => {
                                    let value = Number(e.target.value);

                                    handleInputChange(rowId, "c1", value, item.ll);
                                  }}

                                  // onChange={(e) => handleInputChange(rowId, "c1", e.target.value, item.ll)}
                                  onBlur={(e) => {
                                    handleBlur(rowId, "c1", "c_c1", "lc1", "cc1", e.target.value, item.ll);
                                    setfield1("c_c1"); // Dynamically set field1 on blur to use it later
                                    setfield("c1");

                                  }}
                                  onFocus={(e) => {
                                    handlefocus(rowId, "gc1", "cc1");
                                    setfield1("c_c1"); // Dynamically set field1 on blur to use it later
                                    setfield("c1");

                                  }}
                                  className="peer block w-full border-0 border-b-2 border-transparent text-center bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"

                                />
                                <div className="font-bold text-black-500 text-green-700">
                                  {Number(item.cc1)}
                                </div>
                                <div className="font-bold text-black-500 text-purple-800">{Math.round((conread.c_c1) / (100 - item.ll) * 100)}</div>

                                <div className="font-bold text-black-500 text-blue-700"> {(Number(item.cc1)) - (Math.round((conread.c_c1) / (100 - item.ll) * 100))}</div>

                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                <input
                                  type="number"
                                  min={0}
                                  value={inputs[rowId]?.c2 || 0}
                                  // value = {item.cc2}
                                  onChange={(e) => {
                                    let value = Number(e.target.value);

                                    handleInputChange(rowId, "c2", value, item.ll);
                                  }}
                                  // onChange={(e) => handleInputChange(rowId, "c2", e.target.value, item.ll)}
                                  onBlur={(e) => {
                                    handleBlur(rowId, "c2", "c_c2", "lc2", "cc2", e.target.value, item.ll);
                                    setfield1("c_c2"); // Dynamically set field1 on blur to use it later
                                    setfield("c2");
                                  }}

                                  onFocus={(e) => {
                                    handlefocus(rowId, "gc2", "cc2");
                                    setfield1("c_c2"); // Dynamically set field1 on blur to use it later
                                    setfield("c2");

                                  }}

                                  className="peer block w-full border-0 border-b-2 border-transparent text-center bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"

                                />
                                <div className="font-bold text-black-500 text-green-700">
                                  {Number(item.cc2)}
                                </div>
                                <div className="font-bold text-black-500 text-purple-800">{Math.round((conread.c_c2) / (100 - item.ll) * 100)}</div>

                                <div className="font-bold text-black-500 text-blue-700"> {(Number(item.cc2)) - (Math.round((conread.c_c2) / (100 - item.ll) * 100))}</div>

                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                <input
                                  type="number"
                                  min={0}
                                  value={inputs[rowId]?.c4 || 0}
                                  // value = {item.cc4}
                                  onChange={(e) => {
                                    let value = Number(e.target.value);

                                    handleInputChange(rowId, "c4", value, item.ll);
                                  }}
                                  // onChange={(e) => handleInputChange(rowId, "c4", e.target.value, item.ll)}
                                  onBlur={(e) => {
                                    handleBlur(rowId, "c4", "c_c4", "lc4", "cc4", e.target.value, item.ll);
                                    setfield1("c_c4"); // Dynamically set field1 on blur to use it later
                                    setfield("c4");
                                  }}
                                  onFocus={(e) => {
                                    handlefocus(rowId, "gc4", "cc4");
                                    setfield1("c_c4"); // Dynamically set field1 on blur to use it later
                                    setfield("c4");

                                  }}
                                  className="peer block w-full border-0 border-b-2 border-transparent text-center bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"

                                />
                                <div className="font-bold text-black-500 text-green-700">
                                  {Number(item.cc4)}
                                </div>
                                <div className="font-bold text-black-500 text-purple-800">{Math.round((conread.c_c4) / (100 - item.ll) * 100)}</div>

                                <div className="font-bold text-black-500 text-blue-700"> {(Number(item.cc4)) - (Math.round((conread.c_c4) / (100 - item.ll) * 100))}</div>

                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                <input
                                  type="number"
                                  min={0}
                                  value={inputs[rowId]?.c5 || 0}
                                  // value = {item.cc5}
                                  onChange={(e) => {
                                    let value = Number(e.target.value);

                                    handleInputChange(rowId, "c5", value, item.ll);
                                  }}
                                  // onChange={(e) => handleInputChange(rowId, "c5", e.target.value, item.ll)}
                                  onBlur={(e) => {
                                    handleBlur(rowId, "c5", "c_c5", "lc5", "cc5", e.target.value, item.ll);
                                    setfield1("c_c5"); // Dynamically set field1 on blur to use it later
                                    setfield("c5");
                                  }}
                                  onFocus={(e) => {
                                    handlefocus(rowId, "gc5", "cc5");
                                    setfield1("c_c5"); // Dynamically set field1 on blur to use it later
                                    setfield("c5");

                                  }}
                                  className="peer block w-full border-0 border-b-2 border-transparent text-center bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"

                                />
                                <div className="font-bold text-black-500 text-green-700">
                                  {Number(item.cc5)}
                                </div>
                                <div className="font-bold text-black-500 text-purple-800">{Math.round((conread.c_c5) / (100 - item.ll) * 100)}</div>

                                <div className="font-bold text-black-500 text-blue-700"> {(Number(item.cc5)) - (Math.round((conread.c_c5) / (100 - item.ll) * 100))}</div>

                              </td>

                              <td className="border border-gray-300 px-4 py-2">


                                <select
                                  value={inputs[rowId]?.is || ""} // Ensure the correct value is selected
                                  className="border border-gray-300 rounded-lg"
                                  onChange={(e) => {
                                    const value = e.target.value;

                                    handleInputChange(rowId, "is", value, item.ll); // Update state properly

                                    setIS((prev) => ({ ...prev, id: rowId, rowId: value }));

                                  }}
                                >
                                  <option value="">SELECT IS</option>
                                  <option value="YES">YES</option>
                                  <option value="NO">NO</option>
                                </select>
                              </td>
                            </tr>
                          }

                        </>
                      );
                    })}
                  </tbody>

                </table>
                {conread.date !== "" && (
                  <div className="flex p-4 mx-5 justify-center">
                    <button
                      onClick={handleNavigate}
                      type="submit"
                      className="font-bold py-2 px-4 rounded-md h-10 w-30 bg-green-800 hover:bg-sky-600 text-white shadow-xl"
                    >
                      NEXT
                    </button>
                  </div>
                )}

              </div></div></div>

        </div>
      </main>
    </div>
  );
};

export default ReadingEntry;
