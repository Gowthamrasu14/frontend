import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from "react-google-charts";

const Dashboard = () => {
    const [ip, setip] = useState(localStorage.getItem("localIp"));
    const [companyDetails, setCompanyDetails] = useState([]);
    const [allChartData, setAllChartData] = useState([]);

    useEffect(() => {
        const reloaded = localStorage.getItem("dashboard_reloaded");
        if (!reloaded) {
            localStorage.setItem("dashboard_reloaded", "true");
            window.location.reload();
        }
    }, []);

    useEffect(() => {
        const fetchhtdetailData = async () => {
            const response = await axios.get("http://147.79.68.117:8000/api/gethtdetail");
            setCompanyDetails(response.data);
        };
        fetchhtdetailData();
    }, []);

    useEffect(() => {
        const fetchAllData = async () => {
            const allData = await Promise.all(
                companyDetails.map(async (company) => {
                    try {
                        const response = await axios.get(`http://147.79.68.117:8000/api/consumption`, {
                            params: {
                                com_id: company.com_id,
                                htscno: company.htscno
                            }
                        });

                        return {
                            company,
                            chartData: Array.isArray(response.data)
                                ? [["Label", "Value"], ...response.data.map(item => [item.label, Number(item.value)])]
                                : [["Label", "Value"], ["No Data", 100]]
                        };
                    } catch (error) {
                        console.error("Error fetching for", company.com_id, error);
                        return {
                            company,
                            chartData: [["Label", "Value"], ["No Data", 100]]
                        };
                    }
                })
            );
            setAllChartData(allData);
        };

        if (companyDetails.length > 0) {
            fetchAllData();
        }
    }, [companyDetails]);

    const pieChartOptions = {
        pieHole: 0.4,
        chartArea: { width: '90%', height: '80%' },
        legend: { position: 'right' },
        pieSliceText: 'value',
        tooltip: { text: 'value' },
        sliceVisibilityThreshold: 0
    };

    return (
        <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
            <h2 className="text-center text-xl sm:text-2xl font-semibold mb-6">WELCOME</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {allChartData.map(({ company, chartData }, index) => (
                    <div
                        key={index}
                        className="border shadow-md rounded-xl p-2 bg-white flex justify-center items-center"
                    >
                        <Chart
                            chartType="PieChart"
                            data={chartData}
                            options={{
                                ...pieChartOptions,
                                title: `${index + 1}. ${company.com_name}`,
                            }}
                            width="100%"
                            height="300px"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
