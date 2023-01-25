import React, { useEffect, useState } from "react";
import Core from "../Hooks/Core";
import { toast } from 'react-toastify';

export default function DashHome() {
    const { getToken, Preloader } = Core();

    const [dashStats, setDashStats] = useState({
        total_customers: 0, total_requests: 0, total_measurements: 0
    })
    const [expiredLicense, setExpiredLicense] = useState(false);

    const [clientsData, setClientsData] = useState({})

    //keep track of whether the page has loaded
    const [status, setStatus] = useState("loading")
    //get user data
    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + 'api/app/dash_stats.php?token=' + getToken(), {
            method: "get",
            mode: "cors"
        })
            .then(res => res.json())
            .then(res => {
                //change state
                setStatus("loaded")
                if (!res.success) {
                    //check if its a form error
                    if (res?.formError) {
                        toast.error("A Validation error has occured")
                    }else if(res?.data?.expired){
                        setExpiredLicense(res.data.expired)
                    } else {
                        toast.error(res.data.message)
                    }
                } else {
                    toast.success(res.data.message)
                    //dashboard stats
                    setDashStats(res.data)
                    //get customers
                    getCustomerData().then(newRes => {
                        //if result was returned instead of false
                        if (newRes) {
                            //set state
                            setClientsData(newRes)
                            //PAGINATION
                            setNumOfPages(Math.ceil(newRes.length / recordsPerPage))
                            setPageNumbers([...Array(numOfPages + 1).keys()].slice(1))
                        }
                    })
                }
            })
            .catch(err => {
                console.log(err)
                toast.error("Network Error!");
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

    const copyData = (data, CopiedElem) => {
        window.navigator.clipboard.writeText(data).then(() => {
            toast.info(CopiedElem + " has been copied")
        }, () => {
            toast.error("This item cannot be copied")
        })
    }
    return (
        <>
            {
                (status !== "loaded") ?
                    <>
                        {Preloader()}
                    </> : <>
                        <section className="dash-hero hero is-hero-bar">
                            <div className="hero-body">
                                <div className="level">
                                    <div className="level-left">
                                        <div className="level-item"><h1 className="title">
                                            Dashboard
                                        </h1></div>
                                    </div>
                                    <div className="level-right d-none">
                                        <div className="level-item"></div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="section is-main-section">
                            {
                                (expiredLicense) ? <>
                                    <div className="mt-3 notification is-danger is-light">
                                        <p className="mb-3">Your subscription has <b>expired</b>, please renew.</p>
                                        <a href={import.meta.env.VITE_DASHBOARD_URL + '/license'} className="button is-danger">My License</a>
                                    </div>
                                </> : null
                            }

                            <div className="tile is-ancestor">
                                <div className="tile is-parent">
                                    <div className="card tile is-child">
                                        <div className="card-content">
                                            <div className="level is-mobile">
                                                <div className="level-item">
                                                    <div className="is-widget-label"><h3 className="subtitle is-spaced">
                                                        Clients
                                                    </h3>
                                                        <h1 className="title">
                                                            {dashStats?.total_customers}
                                                        </h1>
                                                    </div>
                                                </div>
                                                <div className="level-item has-widget-icon">
                                                    <div className="is-widget-icon"><span className="icon has-text-primary is-large"><i
                                                        className="mdi mdi-account-multiple mdi-48px"></i></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tile is-parent">
                                    <div className="card tile is-child">
                                        <div className="card-content">
                                            <div className="level is-mobile">
                                                <div className="level-item">
                                                    <div className="is-widget-label"><h3 className="subtitle is-spaced">
                                                        Requests
                                                    </h3>
                                                        <h1 className="title">
                                                            {dashStats?.total_requests}
                                                        </h1>
                                                    </div>
                                                </div>
                                                <div className="level-item has-widget-icon">
                                                    <div className="is-widget-icon"><span className="icon has-text-info is-large"><i
                                                        className="mdi mdi-cart-outline mdi-48px"></i></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tile is-parent">
                                    <div className="card tile is-child">
                                        <div className="card-content">
                                            <div className="level is-mobile">
                                                <div className="level-item mr-0">
                                                    <div className="is-widget-label"><h3 className="subtitle is-spaced">
                                                        Measurements
                                                    </h3>
                                                        <h1 className="title">
                                                            {dashStats?.total_measurements}
                                                        </h1>
                                                    </div>
                                                </div>
                                                <div className="level-item has-widget-icon">
                                                    <div className="is-widget-icon"><span className="icon has-text-success is-large"><i
                                                        className="mdi mdi-ruler-square mdi-48px"></i></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="card">
                    <header className="card-header">
                        <p className="card-header-title">
                            <span className="icon"><i className="mdi mdi-finance"></i></span>
                            Performance
                        </p>
                        <a href="#" className="card-header-icon">
                            <span className="icon"><i className="mdi mdi-reload"></i></span>
                        </a>
                    </header>
                    <div className="card-content">
                        <div className="chart-area">
                            <div style={{ height: "100%" }}>
                                <div className="chartjs-size-monitor">
                                    <div className="chartjs-size-monitor-expand">
                                        <div></div>
                                    </div>
                                    <div className="chartjs-size-monitor-shrink">
                                        <div></div>
                                    </div>
                                </div>
                                <canvas id="big-line-chart" width="2992" height="1000" className="chartjs-render-monitor" style={{ display: "block", height: "400px", width: "1197px" }}></canvas>
                            </div>
                        </div>
                    </div>
                </div> */}
                            <div className="card has-table has-mobile-sort-spaced">
                                <header className="card-header">
                                    <p className="card-header-title">
                                        <span className="icon"><i className="mdi mdi-account-multiple"></i></span>
                                        Clients
                                    </p>
                                    <a onClick={(e) => window.location.reload()} className="card-header-icon">
                                        <span className="icon"><i className="mdi mdi-reload"></i></span>
                                    </a>
                                </header>
                                <div className="card-content">
                                    {
                                        (clientsData && (clientsData).length) ?
                                            <>
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
                                                                                        <a href={import.meta.env.VITE_DASHBOARD_URL + '/customers/' + el?.cus_id} className="button is-small is-app-primary" type="button">View
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
                                                    <Pagination numOfPages={numOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                                                </div>
                                            </>
                                            :
                                            <section className="p-3">
                                                <div className="has-text-centered">
                                                    <img alt="caution image" src="/times-square.svg" width={"200px"} />
                                                </div>
                                                <div className="notification is-app is-light">
                                                    <p className="mb-2">No Customers Found</p>
                                                    <a href={import.meta.env.VITE_DASHBOARD_URL + '/add-customer'} className="button is-app-primary">Add customer</a>
                                                </div>
                                            </section>
                                    }
                                </div>
                            </div>
                        </section>
                    </>
            }
        </>
    )
}