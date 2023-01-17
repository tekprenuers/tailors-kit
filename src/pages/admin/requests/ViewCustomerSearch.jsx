import React, { useState, useEffect } from "react";
import Core from "../../Hooks/Core";
import { octaValidate } from 'octavalidate-reactjs'
import { toast } from 'react-toastify';

export default function ViewRequestCustomerSearch() {
    const { getToken, Preloader } = Core();
    //store clients data
    const [clientsData, setClientsData] = useState([]);
    //track fetch request
    const [status, setStatus] = useState("loading")

    const handleSearch = (e) => {
        e.preventDefault();
        const form = e.target
        const btn = form.querySelector(`button[form="${form.id}"]`)
        const myForm = new octaValidate(form.id, {
            strictMode: true,
            errorElem: {
                "inp_search": "serch_form_inp_wrapper"
            }
        })
        const formData = new FormData(form);
        //build a custom rule
        myForm.customRule('SEARCH', /^[a-zA-Z0-9+@. ]+$/, "Search Query contains invalid characters");
        //validate form
        if (myForm.validate()) {
            btn.classList.toggle('is-loading');
            //get customer data with search query included
            getCustomerData(formData.get("search")).then(res => {
                if (!res) {
                    toast.error("An error has occured")
                } else {
                    //set state
                    setClientsData(res)
                }
                btn.classList.remove("is-loading");
            })
        } else {
            toast.error("A Validation error has occured")
        }
    }

    //get customer data
    const getCustomerData = async (search = null) => {
        const url = new URL(import.meta.env.VITE_BACKEND_URL + 'api/customers/get_customers.php');
        url.searchParams.append('token', getToken());
        //check if search query was supplied
        url.searchParams.append('search', search || '')

        return (await fetch(url.toString(), {
            method: "get",
            mode: "cors"
        })
            .then(res => res.json())
            .then(res => {
                if (!res.success) {
                    return;
                } else {
                    return res.data;
                }
            })
            .catch(err => {
                console.log(err)
                toast.error("Network Error!");
                return;
            })
        )
    }

    const handleReload = () => {
        getCustomerData(null).then(res => {
            if (!res) {
                toast.error("An error has occured")
            } else {
                //set state
                setClientsData(res)
            }
        })
    }

    useEffect(() => {
        getCustomerData(null).then(res => {
            setStatus("loaded")
            if (!res) {
                toast.error("An error has occured")
            } else {
                //set state
                setClientsData(res)
            }
        })
    }, [])

    return (
        (status !== "loaded") ?
            <>
                {Preloader()}
            </> : <>
                <div className="mb-4 mt-3 p-2">
                    <form id="form_search" method="get" onSubmit={handleSearch}>
                        <div id="serch_form_inp_wrapper" className="search-form">
                            <p className="control is-expanded has-icons-left">
                                <input maxLength={50} id="inp_search" octavalidate="SEARCH" placeholder="Search for a customer" className="input radius-0" name="search" />
                                <span className="icon is-small is-left"><i className="mdi mdi-account-search"></i></span>
                            </p>
                            <button form="form_search" className="button is-app-primary radius-0">Begin search</button>
                        </div>
                    </form>
                </div>
                <div className="card has-table has-mobile-sort-spaced">
                    <header className="card-header">
                        <p className="card-header-title">
                            <span className="icon"><i className="mdi mdi-account-multiple"></i></span>
                            Clients
                        </p>
                        <a onClick={handleReload} className="card-header-icon">
                            <span className="icon"><i className="mdi mdi-reload"></i></span>
                        </a>
                    </header>
                    <div className="card-content">
                        <div className="b-table has-pagination">
                            <div className="table-wrapper has-mobile-cards">
                                <table className="table is-fullwidth is-striped is-hoverable is-sortable is-fullwidth">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Gender</th>
                                            <th>Phone</th>
                                            <th>Created</th>
                                            <th className="has-text-centered">Request</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            clientsData.map((el, ind) => {
                                                return (
                                                    <tr key={ind}>
                                                        <td data-label="Name">{el?.name}</td>
                                                        <td data-label="Gender">{el?.gender}</td>
                                                        <td data-label="Phone">{el?.phone}</td>
                                                        <td data-label="Created">
                                                            <small className="has-text-grey is-abbr-like" title="Oct 25, 2020">{el?.date_added}</small>
                                                        </td>
                                                        <td className="is-actions-cell">
                                                            <div className="buttons is-centered">
                                                                <a href={import.meta.env.VITE_DASHBOARD_URL + '/requests/' + el?.cus_id} className="button is-info is-small" type="button">&nbsp;View Requests
                                                                </a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </>
    )
}