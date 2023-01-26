import React, { useState, useEffect } from "react";
import Core from "../../Hooks/Core";
import { octaValidate } from 'octavalidate-reactjs'
import { toast } from 'react-toastify';
import { Helmet } from "react-helmet";

export default function RequestCustomerSearch() {
    const { getToken, Preloader } = Core();
    //save clients data
    const [clientsData, setClientsData] = useState([]);
    //track fetch request
    const [status, setStatus] = useState("loading")
    //state to track record search
    const [isSearch, setIsSearch] = useState(false)

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
                setIsSearch(true)
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
        //check if search query was supplied
        url.searchParams.append('search', search || '')

        return (await fetch(url.toString(), {
            method: "get",
            mode: "cors",
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
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
            setIsSearch(false)
            if (!res) {
                toast.error("An error has occured")
            } else {
                //set state
                setClientsData(res)
            }
        })
    }, [])

    return (
        <>
            <Helmet>
                <title>Customer Search - TailorsKit</title>
                <meta property="og:title" content={"Customer Search - TailorsKit"} />
                <meta name="description" content={"Visit this page to search for a customer"} />
            </Helmet>
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
            {(status !== "loaded") ?
                <>
                    {Preloader()}
                </> :
                <section className="section is-main-section">
                    {
                        (clientsData && clientsData.length) ? <>
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
                                                        <th></th>
                                                        <th>Name</th>
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
                                                                    <td className="is-image-cell">
                                                                        <div className="image">
                                                                            <img src={(el?.image) ? el?.image : "https://avatars.dicebear.com/v2/initials/rebecca-bauch.svg"} className="is-rounded" />
                                                                        </div>
                                                                    </td>
                                                                    <td data-label="Name">{el?.name}</td>
                                                                    <td data-label="Phone">{el?.phone}</td>
                                                                    <td data-label="Created">
                                                                        <small className="has-text-grey is-abbr-like" title="Oct 25, 2020">{el?.date_added}</small>
                                                                    </td>
                                                                    <td className="is-actions-cell">
                                                                        <div className="buttons is-centered">
                                                                            <a href={import.meta.env.VITE_DASHBOARD_URL + '/new-request/' + el?.cus_id} className="button is-small is-app-primary" type="button">
                                                                                <span className="icon"><i className="mdi mdi-plus"></i></span>&nbsp;New Request
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
                        </> : <>
                            {
                                (isSearch) ?
                                    <section className="empty-results">
                                        <div className="has-text-centered">
                                            <img alt="No results image" src="/caution.svg" width={"150px"} />
                                        </div>
                                        <div className="notification is-app is-light">
                                            <p className="mb-2 has-text-centered">Your search query returned <b>No results</b></p>
                                        </div>
                                    </section> :
                                    <section className="empty-results">
                                        <div className="has-text-centered">
                                            <img alt="No results image" src="/times-square.svg" width={"150px"} />
                                        </div>
                                        <div className="notification is-app is-light">
                                            <p className="mb-2">No Customers Found</p>
                                            <a href={import.meta.env.VITE_DASHBOARD_URL + '/add-customer'} className="button is-app-primary">Add Customer</a>
                                        </div>
                                    </section>
                            }
                        </>
                    }
                </section>
            }
        </>
    )
}