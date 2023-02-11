import React, { useEffect, useState } from "react"
import { toast } from 'react-toastify'
import { useParams } from "react-router-dom"
import Core from "../../Hooks/Core"
import { octaValidate } from 'octavalidate-reactjs'
import { Helmet } from "react-helmet"

export default function ViewRequests() {
    const { getToken, Preloader } = Core()
    const cus_id = useParams().cusId
    const [requestsData, setrequestsData] = useState([])
    const [cusData, setCusData] = useState();
    //state to track search request
    const [isSearch, setIsSearch] = useState(false)

    const [delData, setDelData] = useState({
        name: "", req_id: ""
    })

    //track fetch request
    const [status, setStatus] = useState("loading")

    //data to display in modal 
    const [modalData, setModalData] = useState({

    })
    //get customers
    useEffect(() => {
        getRequests().then(res => {
            setStatus("loaded")
            setIsSearch(false)
            //if result was returned instead of false
            if (res.success) {
                //set state
                setrequestsData(res.data.requests)
                setCusData(res.data.customer);
                //PAGINATION
                setNumOfPages(Math.ceil(res.data.requests.length / recordsPerPage))
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

    const getRequests = async (search = null) => {
        const url = new URL(import.meta.env.VITE_BACKEND_URL + 'api/requests/get_requests.php');
        //check if customr_id was supplied
        url.searchParams.append('cus_id', cus_id || '')
        //check for search query
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
                return res
            })
            .catch(err => {
                console.log(err)
                toast.error("Network Error!");
                return;
            })
        )
    }

    const handleRequestDelete = (e) => {
        e.preventDefault();
        const form = e.target
        const btn = form.querySelector(`button[form="${form.id}"]`)
        const myForm = new octaValidate(form.id, {
            strictMode: true
        })
        const formData = new FormData(form);
        formData.append('req_id', delData.req_id);
        formData.append('cus_id', cusData.cus_id);
        //validate form
        if (myForm.validate()) {
            btn.classList.toggle('is-loading');
            fetch(import.meta.env.VITE_BACKEND_URL + 'api/requests/delete_request.php', {
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
                        // closeModal(btn);
                        //reload data
                        handleReload();
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
            getRequests(formData.get("search")).then(res => {
                setIsSearch(true)
                if (!res) {
                    toast.error("An error has occured")
                } else {
                    //set state
                    setrequestsData(res.data.requests)
                    //PAGINATION
                    setNumOfPages(Math.ceil(res.data.requests.length / recordsPerPage))
                    setPageNumbers([...Array(numOfPages + 1).keys()].slice(1))
                }
                btn.classList.remove("is-loading");
            })
        } else {
            toast.error("A Validation error has occured")
        }
    }

    const handleReload = () => {
        getRequests(null).then(res => {
            setIsSearch(false)
            if (!res) {
                toast.error("An error has occured")
            } else {
                //set state
                setrequestsData(res.data.requests)
                //PAGINATION
                setNumOfPages(Math.ceil(res.data.requests.length / recordsPerPage))
                setPageNumbers([...Array(numOfPages + 1).keys()].slice(1))
            }
        })
    }

    const handleDeleteModal = (e) => {
        setDelData({
            name: e.currentTarget.getAttribute('data-name'),
            req_id: e.currentTarget.getAttribute('data-id')
        })

        const modalTarget = e.currentTarget.getAttribute('data-target')

        document.getElementById(modalTarget).classList.add('is-active')
        document.documentElement.classList.add('is-clipped')
    }

    const closeModal = (e) => {
        e.currentTarget.closest('.modal').classList.remove('is-active')
        document.documentElement.classList.remove('is-clipped')
    }

    const handleClick = (e) => {
        const btn = e.target;

        const data = {
            name: btn.getAttribute("data-name"),
            image: btn.getAttribute("data-image"),
            extraNote: btn.getAttribute("data-extra-note"),
            completed: btn.getAttribute("data-completed"),
            price: btn.getAttribute("data-price"),
            dueDate: btn.getAttribute("data-due-date")
        }
        setModalData((prev) => ({
            ...prev, ...data
        }));
        return (
            showModal(e)
        )
    }

    const showModal = (e) => {
        const modalTarget = e.currentTarget.getAttribute('data-target')

        document.getElementById(modalTarget).classList.add('is-active')
        document.documentElement.classList.add('is-clipped')
    }
    return (
        <section className="section is-main-section">
            <Helmet>
                <title>View All Customer Requests - TailorsKit</title>
                <meta property="og:title" content={"View All Customer Requests - TailorsKit"} />
                <meta name="description" content={"Visit this page to view & manage all customer requests"} />
            </Helmet>
            {(status !== "loaded") ?
                <>
                    {Preloader()}
                </> : <>
                    <div className="mb-0 p-4 card">
                        <p className="notification is-info is-light">
                            Search for a request using the <b>name</b> of the request or the <b>extra note</b> in the request.
                        </p>
                        <form id="form_search" method="get" onSubmit={handleSearch}>
                            <div id="serch_form_inp_wrapper" className="search-form">
                                <input maxLength={50} id="inp_search" octavalidate="SEARCH" placeholder="Search for a request" className="input radius-0" name="search" />
                                <button form="form_search" className="button is-app-primary radius-0">Search</button>
                            </div>
                        </form>
                    </div>
                    <section className="section is-title-bar">
                        <div className="level">
                            <div className="level-left">
                                &nbsp;
                            </div>
                            <div className="level-right">
                                <div className="level-item">
                                    <div className="buttons is-right">
                                        <a href={import.meta.env.VITE_DASHBOARD_URL + '/new-order/' + cus_id} type="button"
                                            className="button is-app-primary"
                                        ><i className="mdi mdi-plus"></i> Create order
                                        </a>
                                    </div>
                                </div></div></div></section>
                    {
                        (requestsData && (requestsData).length) ? <>
                            <div className="card has-table has-mobile-sort-spaced">
                                <header className="card-header">
                                    <p className="card-header-title">
                                        <span className="icon"><i className="mdi mdi-account"></i></span>
                                        <span>Viewing requests for <span className="has-text-app-primary">{cusData?.name}</span></span>
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
                                                        <th>Price</th>
                                                        <th>Due Date</th>
                                                        <th className="has-text-centered">Completed</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        requestsData.slice(indexOfFirstRecord, indexOfLastRecord).map((el, ind) => {
                                                            return (
                                                                <tr key={ind}>
                                                                    <td><button data-image={el?.image} onClick={handleClick} type="button" className="button is-app-primary is-small jb-modal" data-target="modal_view_image">view image</button></td>
                                                                    <td data-label="Name">{el?.name}</td>
                                                                    <td data-label="Phone">{el?.price}</td>
                                                                    <td data-label="Created">
                                                                        <small className="has-text-grey is-abbr-like" title="Oct 25, 2020">{el?.deadline}</small>
                                                                    </td>
                                                                    <td className="has-text-centered">
                                                                        {
                                                                            (el?.is_completed == "Yes") ? <span className="tag is-primary">Yes</span> : <span className="tag is-danger">No</span>
                                                                        }
                                                                    </td>
                                                                    <td className="is-actions-cell">
                                                                        <div className="buttons is-centered">
                                                                            <a data-name={el?.name} data-extra-note={el?.extra_note} data-due-date={el?.deadline} data-completed={el?.is_completed} data-price={el?.price} data-target="modal_view_request" className="button is-small is-app-primary jb-modal" type="button" onClick={handleClick}>view request
                                                                            </a>
                                                                            <a href={import.meta.env.VITE_DASHBOARD_URL + '/update-request/' + el?.req_id} className="button is-small is-info" type="button">Update
                                                                            </a>
                                                                            <button data-name={el?.name} data-id={el?.req_id} onClick={handleDeleteModal} className="button is-danger jb-modal is-small" data-target="modal_del_request" type="button">Delete
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
                            <div id="modal_del_request" className="modal">
                                <div className="modal-background jb-modal-close" onClick={closeModal}></div>
                                <div className="modal-card">
                                    <header className="modal-card-head">
                                        <p className="modal-card-title">Confirm action</p>
                                        <button className="delete jb-modal-close" aria-label="close" onClick={closeModal}></button>
                                    </header>
                                    <section className="modal-card-body">
                                        <h4 className="has-text-centered mb-4 title is-5">Deleting <b>{delData.name}</b></h4>
                                        <p className="notification is-danger is-light has-text-centered">Are you sure you want to delete this request?</p>
                                    </section>
                                    <footer className="modal-card-foot is-justify-content-end">
                                        <button className="button jb-modal-close" onClick={closeModal}>Cancel</button>
                                        <form method="post" id="form_del_request" onSubmit={handleRequestDelete}>
                                            <input type="hidden" name="cus_id" id="inp_cus_id" defaultValue={delData.cus_id} />
                                            <button form="form_del_request" type="submit" className="button is-danger jb-modal-close">Delete</button>
                                        </form>
                                    </footer>
                                </div>
                                <button onClick={closeModal} className="modal-close is-large jb-modal-close" aria-label="close"></button>
                            </div>
                            <div id="modal_view_image" className="modal">
                                <div className="modal-background jb-modal-close" onClick={closeModal}></div>
                                <div className="modal-card">
                                    <header className="modal-card-head">
                                        <p className="modal-card-title">View request's image</p>
                                        <button className="delete jb-modal-close" aria-label="close" onClick={closeModal}></button>
                                    </header>
                                    <section className="modal-card-body">
                                        {
                                            (modalData?.image) ?
                                                <img src={modalData.image} className="img" />
                                                :
                                                <p className="notification is-danger is-light m-0">You did not upload an image for this request</p>
                                        }
                                    </section>
                                    <footer className="modal-card-foot is-justify-content-end">
                                        <button className="button jb-modal-close" onClick={closeModal}>Close</button>
                                    </footer>
                                </div>
                                <button onClick={closeModal} className="modal-close is-large jb-modal-close" aria-label="close"></button>
                            </div>
                            <div id="modal_view_request" className="modal">
                                <div className="modal-background jb-modal-close" onClick={closeModal}></div>
                                <div className="modal-card">
                                    <header className="modal-card-head">
                                        <p className="modal-card-title">View request's image</p>
                                        <button className="delete jb-modal-close" aria-label="close" onClick={closeModal}></button>
                                    </header>
                                    <section className="modal-card-body">
                                        {
                                            (modalData?.completed == "Yes") ?
                                                <p className="notification is-primary is-light"><i class="mdi mdi-check-circle"> </i>&nbsp;This request has been completed</p>
                                                : <p className="notification is-danger is-light">This request has not been completed</p>
                                        }
                                        <table className="table is-hovered is-striped">
                                            <tbody>
                                                {
                                                    (modalData?.name) ?

                                                        <tr>
                                                            <th>Name</th>
                                                            <td>{modalData.name}</td>
                                                        </tr>

                                                        : null
                                                }
                                                {
                                                    (modalData?.price) ?

                                                        <tr>
                                                            <th>Price</th>
                                                            <td>&#8358;{modalData.price}</td>
                                                        </tr>

                                                        : null
                                                }
                                                {
                                                    (modalData?.dueDate) ?

                                                        <tr>
                                                            <th>Due date</th>
                                                            <td>{modalData.dueDate}</td>
                                                        </tr>

                                                        : null
                                                }
                                                {
                                                    (modalData?.extraNote) ?

                                                        <tr>
                                                            <th>Extra Note</th>
                                                            <td>{modalData.extraNote}</td>
                                                        </tr>

                                                        : null
                                                }
                                            </tbody>

                                        </table>
                                    </section>
                                    <footer className="modal-card-foot is-justify-content-end">
                                        <button className="button jb-modal-close" onClick={closeModal}>Close</button>
                                    </footer>
                                </div>
                                <button onClick={closeModal} className="modal-close is-large jb-modal-close" aria-label="close"></button>
                            </div>
                        </>
                            : <>
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
                                                <p className="mb-2 fw-bold">No Orders Were Found For This Customer</p>
                                                <a href={import.meta.env.VITE_DASHBOARD_URL + '/new-order/' + cus_id} className="button is-app-primary">Create a new order</a>
                                            </div>
                                        </section>
                                }
                            </>
                    }

                </>
            }
        </section>
    )
}