import React, { useEffect, useState } from "react"
import { toast } from 'react-toastify'
import Core from "../../Hooks/Core"
import { octaValidate } from 'octavalidate-reactjs'
import { Helmet } from "react-helmet"

export default function ViewCustomers() {
    const { getToken, Preloader } = Core()
    //store clients data
    const [clientsData, setClientsData] = useState([])
    //store a client's data for deletion
    const [delData, setDelData] = useState({
        name: "", cus_id: "", gender: ""
    })
    //track fetch request
    const [status, setStatus] = useState("loading")
    //state to check if user has searched for a record
    const [isSearch, setIsSearch] = useState(false)
    //get customers
    useEffect(() => {
        getCustomerData().then(res => {
            //if result was returned instead of false
            //track fetch request
            setStatus("loaded")
            if (res) {
                //set search query so that error will be
                //No records found then remove the search bar
                setIsSearch(false)
                //set state
                setClientsData(res)
                //PAGINATION
                setNumOfPages(Math.ceil(res.length / recordsPerPage))
                setPageNumbers([...Array(numOfPages + 1).keys()].slice(1))
            }
        })
    }, [])

    //pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [numOfPages, setNumOfPages] = useState(1)
    const [pageNumbers, setPageNumbers] = useState(1)
    const [recordsPerPage] = useState(5)
    const indexOfLastRecord = currentPage * recordsPerPage
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage

    const Pagination = ({ numOfPages, currentPage, setCurrentPage }) => {
        const pageNumbers = [...Array(numOfPages + 1).keys()].slice(1)

        const nextPage = () => {
            if (currentPage !== numOfPages)
                setCurrentPage(currentPage + 1)
        }

        const prevPage = () => {
            if (currentPage !== 1)
                setCurrentPage(currentPage - 1)
        }
        return (
            <>
                <div className="notification">
                    <div className="level">
                        <div className="level-left">
                            <div className="level-item">
                                <div className="buttons has-addons">
                                    <button onClick={prevPage} className="button"><span aria-hidden="true">&lsaquo;</span></button>
                                    {
                                        pageNumbers.map(pageNum => {
                                            return (
                                                <button key={pageNum}  {...(!currentPage) ? 'disabled' : ''} type="button" className={`button ${(currentPage === pageNum) ? 'is-active' : ''}`} onClick={() => setCurrentPage(pageNum)}>{pageNum}</button>

                                            )
                                        })
                                    }
                                    <button onClick={nextPage} className="button"><span aria-hidden="true">&rsaquo;</span></button>
                                </div>
                            </div>
                        </div>
                        <div className="level-right">
                            <div className="level-item">
                                <small>Page {currentPage} of {numOfPages}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

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

    const handleCustomerDelete = (e) => {
        e.preventDefault();
        const form = e.target
        const btn = form.querySelector(`button[form="${form.id}"]`)
        const myForm = new octaValidate(form.id, {
            strictMode: true
        })
        const formData = new FormData(form);
        //validate form
        if (myForm.validate()) {
            btn.classList.toggle('is-loading');
            fetch(import.meta.env.VITE_BACKEND_URL + 'api/customers/delete_customer.php', {
                method: "post",
                body: formData,
                mode: "cors",
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            })
                .then(res => res.json())
                .then(res => {
                    if (!res.success) {
                        //check if its a form error
                        if (res?.data?.formError) {
                            toast.error("A Validation error has occured")
                        } else {
                            toast.error(res.data.message)
                        }
                        btn.classList.remove('is-loading')
                    } else {
                        toast.success(res.data.message)
                        btn.classList.remove('is-loading');
                        // //close modal
                        document.querySelectorAll('.modal').forEach(el => {
                            el.classList.remove('is-active')
                        })
                        document.documentElement.classList.remove('is-clipped')
                        //reload data
                        getCustomerData().then(res => {
                            //if result was returned instead of false
                            if (res) {
                                //set state
                                setClientsData(res)
                                //PAGINATION
                                setNumOfPages(Math.ceil(res.length / recordsPerPage))
                                setPageNumbers([...Array(numOfPages + 1).keys()].slice(1))
                            }
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                    toast.error("Network Error!");
                    btn.classList.remove('is-loading')
                })
        } else {
            toast.error("A Validation error has occured")
        }
    }

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
        myForm.customRule('SEARCH', /^[a-zA-Z0-9+@. ]+$/, "Search Query contains invalid characters");
        const formData = new FormData(form);
        //validate form
        if (myForm.validate()) {
            btn.classList.toggle('is-loading');
            //get customer data with search query included
            getCustomerData(formData.get("search")).then(res => {
                if (!res) {
                    toast.error("An error has occured")
                } else {
                    //change the state to true so that error will be
                    //Your search query returned no results
                    //and then retain the search box
                    setIsSearch(true)
                    //set state
                    setClientsData(res)
                    //PAGINATION
                    setNumOfPages(Math.ceil(res.length / recordsPerPage))
                    setPageNumbers([...Array(numOfPages + 1).keys()].slice(1))
                }
                btn.classList.remove("is-loading");
            })
        } else {
            toast.error("A Validation error has occured")
        }
    }

    const handleReload = () => {
        getCustomerData(null).then(res => {
            if (!res) {
                toast.error("An error has occured")
            } else {
                //set state
                setClientsData(res)
                //PAGINATION
                setNumOfPages(Math.ceil(res.length / recordsPerPage))
                setPageNumbers([...Array(numOfPages + 1).keys()].slice(1))
            }
        })
    }

    const handleDeleteModal = (e) => {
        setDelData({
            name: e.currentTarget.getAttribute('data-name'),
            cus_id: e.currentTarget.getAttribute('data-id'),
            gender: e.currentTarget.getAttribute('data-gender')
        })

        const modalTarget = e.currentTarget.getAttribute('data-target')

        document.getElementById(modalTarget).classList.add('is-active')
        document.documentElement.classList.add('is-clipped')
    }

    const closeModal = (e) => {
        e.currentTarget.closest('.modal').classList.remove('is-active')
        document.documentElement.classList.remove('is-clipped')
    }

    const showModal = (e) => {
        const modalTarget = e.currentTarget.getAttribute('data-target')

        document.getElementById(modalTarget).classList.add('is-active')
        document.documentElement.classList.add('is-clipped')
    }
    const copyData = (data, CopiedElem) => {
        window.navigator.clipboard.writeText(data).then(() => {
            toast.info(CopiedElem + " has been copied")
        }, () => {
            toast.error("This item cannot be copied")
        })
    }
    return (
        <>
            <Helmet>
                <title>View Customers - TailorsKit</title>
                <meta property="og:title" content={"View Customers - TailorsKit"} />
                <meta name="description" content={"Visit this page to view all your customers"} />
            </Helmet>

            <div className="mb-4 mt-3 p-2">
                <form id="form_search" method="get" onSubmit={handleSearch}>
                    <div id="serch_form_inp_wrapper" className="search-form">
                        <input maxLength={50} id="inp_search" octavalidate="SEARCH" placeholder="Search for a customer" className="input radius-0" name="search" />
                        <button form="form_search" className="button is-app-primary radius-0">Search</button>
                    </div>
                </form>
            </div>
            {
                (status !== "loaded") ?
                    <>
                        {Preloader()}
                    </> : <section className="section is-main-section">


                        {
                            (clientsData && (clientsData).length) ?
                                <>
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
                                                                <th>Date created</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                clientsData.slice(indexOfFirstRecord, indexOfLastRecord).map((el, ind) => {
                                                                    return (
                                                                        <tr key={ind}>
                                                                            <td data-label="Name">{el?.name}</td>
                                                                            <td data-label="Gender">{el?.gender}</td>
                                                                            <td className="is-touchable" data-label="Phone" onClick={(e) => copyData(el?.phone, "Phone number")} title="Click to copy">{el?.phone}</td>
                                                                            <td data-label="Created">
                                                                                <small className="has-text-grey is-abbr-like" title="Oct 25, 2020">{el?.date_added}</small>
                                                                            </td>
                                                                            <td className="is-actions-cell">
                                                                                <div className="buttons is-centered">
                                                                                    <a href={import.meta.env.VITE_DASHBOARD_URL + '/customers/' + el?.cus_id} className="button is-small is-primary" type="button">View
                                                                                    </a>
                                                                                    <a href={import.meta.env.VITE_DASHBOARD_URL + '/update-customer/' + el?.cus_id} className="button is-small is-info" type="button">Update
                                                                                    </a>
                                                                                    <button data-gender={el?.gender} data-name={el?.name} data-id={el?.cus_id} onClick={handleDeleteModal} className="button is-small is-danger jb-modal" data-target="modal_del_customer" type="button">Delete
                                                                                    </button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })
                                                            }

                                                        </tbody>
                                                    </table>
                                                </div>
                                                <Pagination numOfPages={numOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                                            </div>
                                        </div>
                                    </div>
                                    <div id="modal_del_customer" className="modal">
                                        <div className="modal-background jb-modal-close" onClick={closeModal}></div>
                                        <div className="modal-card">
                                            <header className="modal-card-head">
                                                <p className="modal-card-title">Confirm action</p>
                                                <button className="delete jb-modal-close" aria-label="close" onClick={closeModal}></button>
                                            </header>
                                            <section className="modal-card-body">
                                                <h4 className="has-text-centered mb-4 title is-5">Deleting <b>{delData.name}</b></h4>
                                                <p className="has-text-centered">Are you sure you want to delete this customer <b>{delData.name}</b> and all {delData?.gender?.toLowerCase() == "male" ? "his" : "her"} associated data?</p>
                                            </section>
                                            <footer className="modal-card-foot is-justify-content-end">
                                                <button className="button jb-modal-close" onClick={closeModal}>Cancel</button>
                                                <form method="post" id="form_del_customer" onSubmit={handleCustomerDelete}>
                                                    <input type="hidden" name="cus_id" id="inp_cus_id" defaultValue={delData.cus_id} />
                                                    <button form="form_del_customer" type="submit" className="button is-danger">Delete</button>
                                                </form>
                                            </footer>
                                        </div>
                                        <button onClick={closeModal} className="modal-close is-large jb-modal-close" aria-label="close"></button>
                                    </div>
                                    <div id="modal_action_customer" className="modal">
                                        <div className="modal-background jb-modal-close" onClick={closeModal}></div>
                                        <div className="modal-card">
                                            <header className="modal-card-head">
                                                <p className="modal-card-title">Action modal</p>
                                                <button className="delete jb-modal-close" aria-label="close" onClick={closeModal}></button>
                                            </header>
                                            <section className="modal-card-body">
                                                <p>
                                                    <button>Add Measurement</button>
                                                </p>
                                            </section>
                                            <footer className="modal-card-foot is-justify-content-end">
                                                <button className="button jb-modal-close" onClick={closeModal}>Cancel</button>
                                                <form method="post" id="form_del_customer" onSubmit={handleCustomerDelete}>
                                                    <input type="hidden" name="cus_id" id="inp_cus_id" defaultValue={delData.cus_id} />
                                                    <button form="form_del_customer" type="submit" className="button is-danger jb-modal-close">Delete</button>
                                                </form>
                                            </footer>
                                        </div>
                                        <button onClick={closeModal} className="modal-close is-large jb-modal-close" aria-label="close"></button>
                                    </div>
                                </>
                                :
                                <>
                                    {
                                        (isSearch) ?
                                            <section className="empty-results">
                                                <div className="notification is-app is-light has-text-centered">
                                                    <img alt="No results image" src="/caution.svg" width={"100px"} />
                                                    <p className="mb-2 has-text-centered fw-bold">Your search query returned no results</p>
                                                </div>
                                            </section> :
                                            <section className="empty-results">
                                                <div className="notification is-app is-light has-text-centered">
                                                    <img alt="No results image" src="/times-square.svg" width={"100px"} className="mb-2" />
                                                    <p className="mb-2 fw-bold">No Customers Found</p>
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