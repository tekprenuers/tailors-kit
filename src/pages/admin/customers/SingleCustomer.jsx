import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import Core from "../../Hooks/Core";

const ShowMeasurements = ({ data }) => {
    if (typeof data !== "undefined") {
        //loop through data
        return (
            Object.keys(data).map((el, ind) => {
                return (
                    <tr key={ind}>
                        <th className="w-50">
                            {el}
                        </th>
                        <td>{data[el]}</td>
                    </tr>
                )
            })
        )
    }
    return;
}

const ShowRequests = ({ data }) => {
    if (typeof data !== "undefined") {
        //the variable declaration below is possible because they are passed by values and not by reference
        let completed = 0; let uncompleted = 0; let amount = 0;
        //loop through
        data.forEach(item => {
            if (item.is_completed == "Yes") {
                ++completed;
            } else {
                ++uncompleted;
            }

            if (item?.price) {
                amount += Number(item.price);
            }
        })

        return (
            <>
                <tr>
                    <th className="w-50">
                        Completed
                    </th>
                    <td>{completed}</td>
                </tr>
                <tr>
                    <th className="w-50">
                        Uncompleted
                    </th>
                    <td>{uncompleted}</td>
                </tr>
                <tr>
                    <th className="w-50">
                        Expected Revenue
                    </th>
                    <td>&#8358;{amount}</td>
                </tr>
                <tr className="tr-last">
                    <th className="w-50">Total Requests</th>
                    <td><span className="tag is-primary">{completed + uncompleted}</span></td>
                </tr>
            </>
        )
    } else {
        return;
    }
}
export default function SingleCustomer() {
    const cus_id = useParams().cusId;
    //customer data from fetch request
    const [cusData, setCusData] = useState({})
    //retrieve token
    const { getToken, Preloader, findDateDifference } = Core();
    //set gender
    const [gender, setGender] = useState("male");
    //track fetch request
    const [status, setStatus] = useState("loading")
    //check if customer exists
    useEffect(() => {
        getCustomerData().then(res => {
            //track initial fetch request
            setStatus("loaded")
            if (!res.success) {
                toast.error(res.message);
            } else {
                //set customer data
                setCusData(res.data)
                //set gender
                setGender(res.data?.gender?.toLowerCase())
            }
        })
    }, [])

    //get customer data
    const getCustomerData = async () => {
        const url = new URL(import.meta.env.VITE_BACKEND_URL + 'api/customers/get_customer.php');
        url.searchParams.append('token', getToken());
        //check if search query was supplied
        url.searchParams.append('cus_id', cus_id || '')

        return (await fetch(url.toString(), {
            method: "get",
            mode: "cors"
        })
            .then(res => res.json())
            .then(res => {
                return res;
            })
            .catch(err => {
                console.log(err)
                toast.error("Network Error!");
                return;
            })
        )
    }
    const closeModal = (e) => {
        e.currentTarget.closest('.modal').classList.remove('is-active')
        document.documentElement.classList.remove('is-clipped')
    }

    const handleMeasurementDelete = (e) => {
        e.preventDefault();
        const form = e.target
        const btn = form.querySelector(`button[form="${form.id}"]`)

        const formData = new FormData(form);
        formData.append('token', getToken());
        formData.append('cus_id', cus_id);

        btn.classList.toggle('is-loading');
        fetch(import.meta.env.VITE_BACKEND_URL + 'api/measurements/delete_measurement.php', {
            method: "post",
            body: formData,
            mode: "cors"
        })
            .then(res => res.json())
            .then(res => {
                if (!res.success) {
                    //check if its a form error
                    if (res?.formError) {
                        toast.error("A Validation error has occured")
                    } else {
                        toast.error(res.data.message)
                    }
                    btn.classList.remove('is-loading')
                } else {
                    toast.success(res.data.message)
                    btn.classList.remove('is-loading');
                    setTimeout(() => {
                        //reload page
                        window.location.reload()
                    }, 500)
                }
            })
            .catch(err => {
                console.log(err)
                toast.error("Network Error!");
                btn.classList.remove('is-loading')
            })
    }

    const showModal = (e) => {
        const modalTarget = e.currentTarget.getAttribute('data-target')

        document.getElementById(modalTarget).classList.add('is-active')
        document.documentElement.classList.add('is-clipped')
    }

    return (
        <>
            {
                (status !== "loaded") ?
                    <>
                        {Preloader()}
                    </> :
                    <>
                        <section className="section is-title-bar">
                            <div className="level">
                                <div className="level-left">
                                    &nbsp;
                                </div>
                                <div className="level-right">
                                    <div className="level-item">
                                        <div className="buttons is-right">
                                            <a
                                                href={import.meta.env.VITE_DASHBOARD_URL + '/update-customer/' + cus_id}
                                                target="_self"
                                                className="button is-info"
                                            >
                                                <span className="icon">
                                                    <i className="mdi mdi-account"></i>
                                                </span>
                                                <span>Update data</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="card">
                            <header className="card-header">
                                <h4 className="card-header-title has-text-info"><span className="icon"><i className="mdi mdi-account"></i></span>&nbsp;Profile Data</h4>
                                <div className="card-header-icon">
                                    <button type="button" className="button jb-modal is-app-primary" data-target="modal_view_profile" onClick={showModal}>View profile</button>
                                </div>
                            </header>
                            <table className="table is-fullwidth is-striped is-hoverable">
                                <tbody>
                                    {
                                        (cusData?.name) ?
                                            <tr>
                                                <th className="w-50">
                                                    <span className="mdi mdi-account"></span>&nbsp;Name
                                                </th>
                                                <td>{cusData?.name}</td>
                                            </tr>
                                            : null
                                    }
                                    {
                                        (cusData?.gender) ?
                                            <tr>
                                                <th className="w-50">
                                                    <span className="mdi mdi-gender-male-female"></span>&nbsp;Gender
                                                </th>
                                                <td>{cusData.gender}</td>
                                            </tr>
                                            : null
                                    }
                                    {
                                        (cusData?.email) ?
                                            <tr>
                                                <th className="w-50">
                                                    <span className="mdi mdi-email"></span>&nbsp;Email
                                                </th>
                                                <td>{cusData.email}</td>
                                            </tr>

                                            : null
                                    }
                                    {
                                        (cusData?.phone) ?
                                            <tr>
                                                <th className="w-50">
                                                    <span className="mdi mdi-phone"></span>&nbsp;Phone 1
                                                </th>
                                                <td>{cusData.phone}</td>
                                            </tr>
                                            : null
                                    }
                                    {
                                        (cusData?.alt_phone) ?
                                            <tr>
                                                <th className="w-50">
                                                    <span className="mdi mdi-phone"></span>&nbsp;Phone 2
                                                </th>
                                                <td>see</td>
                                            </tr>
                                            : null
                                    }
                                    {
                                        (cusData?.address) ?
                                            <tr>
                                                <th className="w-50">
                                                    <span className="mdi mdi-map-marker"></span>&nbsp;Address
                                                </th>
                                                <td>{cusData.address}</td>
                                            </tr>
                                            : null
                                    }
                                    <tr className="tr-last">
                                        <th className="w-50">
                                            <span className="mdi mdi-calendar"></span>&nbsp;Date Created
                                        </th>
                                        <td>{cusData.date_added}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                        {
                            (cusData?.["tape_" + gender]) ?
                                <section className="card mt-3">
                                    <header className="card-header">
                                        <h4 className="card-header-title has-text-info"><span className="icon"><i className="mdi mdi-ruler-square"></i></span>&nbsp;Measurement</h4>
                                        <span className="card-header-icon">
                                            <div className="buttons is-right">
                                                <a title="Update this measurement" href={import.meta.env.VITE_DASHBOARD_URL + '/update-measurement/' + cus_id}  className="button is-primary">
                                                    <span>
                                                    <i className="mdi mdi-pencil"></i>
                                                </span>
                                                    <span className="hide-on-mobile">&nbsp;Update</span></a>
                                                <button title="Delete this measurement" type="button" data-target="modal_del_measurement" className="button is-danger jb-modal" onClick={showModal}>
                                                    <span>
                                                        <i className="mdi mdi-trash-can"></i>
                                                    </span>
                                                    <span className="hide-on-mobile">&nbsp;Delete</span>
                                                </button>
                                            </div>
                                        </span>
                                    </header>
                                    <table className="table w-100 is-striped is-hoverable">
                                        <tbody>
                                            <ShowMeasurements data={cusData["tape_" + gender]} />
                                            <tr className="tr-last">
                                                <th>Last updated</th>
                                                <td>{cusData?.tape_last_updated} ({findDateDifference(cusData?.tape_last_updated_jsformatted)})</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </section>
                                : null
                        }
                        {
                            (cusData?.requests?.length) ?
                                <section className="card mt-3">
                                    <header className="card-header">
                                        <h4 className="card-header-title has-text-info"><span className="icon"><i className="mdi mdi-view-grid-outline"></i></span>&nbsp;Requests</h4>
                                        <span className="card-header-icon">
                                            <a href={import.meta.env.VITE_DASHBOARD_URL + '/requests/' + cus_id} className="button is-app-primary">View requests</a>
                                        </span>
                                    </header>
                                    <table className="table w-100 is-striped is-hoverable">
                                        <tbody>
                                            <ShowRequests data={cusData.requests} />
                                        </tbody>
                                    </table>
                                </section>
                                : null
                        }
                        <div id="modal_del_measurement" className="modal">
                            <div className="modal-background jb-modal-close" onClick={closeModal}></div>
                            <div className="modal-card">
                                <header className="modal-card-head">
                                    <p className="modal-card-title">Delete measurement</p>
                                    <button className="delete jb-modal-close" aria-label="close" onClick={closeModal}></button>
                                </header>
                                <section className="modal-card-body">
                                    <p>Are you sure you want to delete measurement data for this customer?</p>
                                </section>
                                <footer className="modal-card-foot is-justify-content-end">
                                    <button className="button jb-modal-close" onClick={closeModal}>Close</button>
                                    <form method="post" id="form_del_measurement" onSubmit={handleMeasurementDelete}>
                                        <button form="form_del_measurement" type="submit" className="button is-danger">Delete</button>
                                    </form>
                                </footer>
                            </div>
                            <button onClick={closeModal} className="modal-close is-large jb-modal-close" aria-label="close"></button>
                        </div>
                        <div id="modal_view_profile" className="modal">
                            <div className="modal-background jb-modal-close" onClick={closeModal}></div>
                            <div className="modal-card">
                                <header className="modal-card-head">
                                    <p className="modal-card-title">View profile</p>
                                    <button className="delete jb-modal-close" aria-label="close" onClick={closeModal}></button>
                                </header>
                                <section className="modal-card-body">
                                    {
                                        (cusData?.image) ?
                                            <img src={cusData.image} className="img" />
                                            :
                                            <p className="notification is-danger is-light m-0">You have not uploaded an image for this customer</p>
                                    }
                                </section>
                                <footer className="modal-card-foot is-justify-content-end">
                                    <button className="button jb-modal-close" onClick={closeModal}>Close</button>
                                </footer>
                            </div>
                            <button onClick={closeModal} className="modal-close is-large jb-modal-close" aria-label="close"></button>
                        </div>
                    </>
            }
        </>
    )
}