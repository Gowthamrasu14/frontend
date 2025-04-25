import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { ImFileOpenoffice } from "react-icons/im";
import { LuView } from "react-icons/lu";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";

const Customer = () => {
    return (
        <>
            <div className="">



                <div className="text-center font-bold">
                    <h1>CUSTOMER DETAILS</h1>
                </div>


                {/* <button data-modal-target="default-modal" data-modal-toggle="default-modal" className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
  Add Customer
</button> */}


                <button data-modal-target="default-modal" data-modal-toggle="default-modal" type="button"
                    className="p-0 w-12 h-12 bg-blue-600 rounded-full hover:bg-green-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none">
                    <svg viewBox="0 0 20 20" enable-background="new 0 0 20 20" className="w-6 h-6 inline-block">
                        <path fill="#FFFFFF" d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                                    C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                                    C15.952,9,16,9.447,16,10z" />
                    </svg>
                </button>




                <div id="default-modal" tabindex="-1" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">

                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className=" text-xl font-semibold text-gray-900 dark:text-white">
                                    ADD CUSTOMER
                                </h3>
                                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>

                            <div className="grid grid-rows-5 grid-flow-col gap-4  p-5">

                                <div>
                                    <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">COMPANY NAME</label>
                                    <input type="text"
                                        id="ConName" name="ConName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ENTER COMPANY NAME" required />
                                </div>

                                <div>
                                    <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">DATABASE NAME</label>
                                    <input type="text"
                                        id="ConName" name="ConName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ENTER DATABASE NAME" required />
                                </div>

                                <div>
                                    <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">DB USER NAME</label>
                                    <input type="text"
                                        id="ConName" name="ConName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ENTER DB USER NAME" required />
                                </div>
                                <div>
                                    <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">DB PASSWORD</label>
                                    <input type="text"
                                        id="ConName" name="ConName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ENTER DB PASSWORD" required />
                                </div>


                                <div>
                                    <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">MAXIMUM GENERATOR</label>
                                    <input type="number"
                                        id="ConName" name="ConName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ENTER MAXIMUM GENERATOR" required />
                                </div>
                                <div>
                                    <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">MAXIMUM CONSUMER</label>
                                    <input type="number"
                                        id="ConName" name="ConName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ENTER MAXIMUM CONSUMER" required />
                                </div>

                                <div>
                                    <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">FROM DATE</label>
                                    <input type="date"
                                        id="ConName" name="ConName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ENTER DB USER NAME" required />
                                </div>
                                <div>
                                    <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">TO DATE</label>
                                    <input type="date"
                                        id="ConName" name="ConName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ENTER DB PASSWORD" required />
                                </div>

                                <div>
                                    <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">EMAIL</label>
                                    <input type="text"
                                        id="ConName" name="ConName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ENTER EMAIL" required />
                                </div>
                                <div>
                                    <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">MOBILE</label>
                                    <input type="number" onChange={(e) => {
                                        const inputValue = e.target.value;
                                        // Allow only if the length of the input is 10 or less
                                        if (inputValue.length <= 10) {
                                            //   setValue(inputValue);
                                        } else {
                                            alert("Please enter a valid phone number");
                                        }
                                    }}
                                        id="ConName" name="ConName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ENTER MOBILE NUMBER" required />
                                </div>



                            </div>


                            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                <button data-modal-hide="default-modal" type="Submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                                <button data-modal-hide="default-modal" type="Cancel" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-2 relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table class="border-2 bg-gray-200 w-full text-sm text-left rtl:text-right dark:">
                        <thead class="text-xs uppercase bg-transparent dark:">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    SL NO
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    COMPANY NAME
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    DATABASE NAME
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    DB USER NAME
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    DB PASSWORD
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    MAXIMUM GENERATOR
                                </th>
                                <th colSpan={3} scope="col" className="px-6 py-3 text-center">ACTION</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-white">
                                <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap dark:text-blue-100">
                                    1
                                </th>
                                <td class="px-6 py-4">
                                    ELANGO
                                </td>
                                <td class="px-6 py-4">
                                    ELAN1234
                                </td>
                                <td class="px-6 py-4">
                                    ELAN1234
                                </td>
                                <td class="px-6 py-4">
                                    ************
                                </td>
                                <td class="px-6 py-4">
                                    5
                                </td>

                                <td className="px-6 py-4 text-blue-700 text-xl"><LuView /></td>
                                <td className="px-6 py-4 text-green-700 text-xl"><FaEdit /></td>
                                <td className="px-6 py-4 text-red-700 text-xl" ><RiDeleteBin3Fill /></td>


                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>



















































        </>





    );
};

export default Customer;