import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import { octaValidate } from 'octavalidate-reactjs'
import Core from "../../Hooks/Core";
import { Helmet } from "react-helmet";

export default function AddRequest() {
    const cus_id = useParams().cusId;
    //save customer data
    const [cusData, setCusData] = useState({})
    const { getToken, Preloader } = Core();
    //track fetch request
    const [status, setStatus] = useState("loading")

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target
        const btn = form.querySelector(`button[form="${form.id}"]`)
        const myForm = new octaValidate(form.id, {
            strictMode: true,
            errorElem: {
                "inp_req_image": "inp_req_image_wrapper"
            }
        })
        const formData = new FormData(form);
        formData.append('cus_id', cus_id || '');
        //validate form
        if (myForm.validate()) {
            btn.classList.toggle('is-loading');
            fetch(import.meta.env.VITE_BACKEND_URL + 'api/requests/add_request.php', {
                method: "post",
                body: formData,
                mode: "cors",
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res);
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
                        btn.classList.remove('is-loading')
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
    const setFileName = (e) => {
        document.querySelector('.file-name').innerText = e.target.files[0].name
    }

    const formatPrice = (e) => {
        const val = e.target.value;
        //remove all white spaces and convert to array
        const valAry = val.replaceAll(' ', '').split('');
        //check if first elem is zero
        (valAry[0] == 0) ? valAry.splice(0, 1) : null;
        //replace value
        e.target.value = valAry.join('')
    }

    //check if customer exists
    useEffect(() => {
        getCustomerData().then(res => {
            //track initial fetch request
            setStatus("loaded")
            if (!res.success) {
                toast.error(res.message);
            } else {
                //set data
                setCusData(res.data)
            }
        })
    }, [])

    //get customer data
    const getCustomerData = async () => {
        const url = new URL(import.meta.env.VITE_BACKEND_URL + 'api/customers/get_customer.php');
        //check if search query was supplied
        url.searchParams.append('cus_id', cus_id || '')

        return (await fetch(url.toString(), {
            method: "get",
            mode: "cors",
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
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

    return (
        <>
            <Helmet>
                <title>{"Add A Request for "+cusData?.name}</title>
                <meta property="og:title" content={"Add A Request for "+cusData?.name} />
                <meta name="description" content={"Visit this page to add a new request for this customer"} />
            </Helmet>
            {(status !== "loaded") ?
                <>
                    {Preloader()}
                </> :
                <>
                    <section className="dash-hero hero is-hero-bar">
                        <div className="hero-body">
                            <div className="level">
                                <div className="level-left">
                                    <div className="level-item"><h1 className="title">
                                        Add A New Request
                                    </h1></div>
                                </div>
                                <div className="level-right" style={{ display: "none" }}>
                                    <div className="level-item"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="section is-main-section">
                        <div className="card">
                            <header className="card-header">
                                <p className="card-header-title">
                                    <span className="icon"><i className="mdi mdi-account"></i></span>
                                    <span>Add a new request for <span className="has-text-app-primary">{cusData?.name}</span> </span>
                                </p>
                            </header>
                            <div className="card-content">
                                <div className="notification is-info is-light">
                                    <p className="m-0">Fields with an asterisk(<span className="has-text-danger">*</span>) are required!</p>
                                </div>
                                <form method="post" id="form_new_request" onSubmit={handleSubmit}>
                                    <div className="field">
                                        <label className="label">Name <span className="has-text-danger">*</span></label>
                                        <p className="control is-expanded has-icons-left">
                                            <input id="inp_name" className="input" octavalidate="R,TEXT" ov-required-msg="Request Name is required" type="text" name="name" placeholder="Senator" />
                                            <span className="icon is-small is-left"><i className="mdi mdi-tshirt-crew"></i></span>
                                        </p>
                                    </div>
                                    <div className="field">
                                        <label className="label">Image</label>
                                        <div className="file has-name" id="inp_req_image_wrapper">
                                            <label className="file-label">
                                                <input id="inp_req_image" accept-mime="image/jpg, image/png, image/jpeg" onChange={setFileName} className="file-input" type="file" maxsize="5mb" name="image" />
                                                <span className="file-cta">
                                                    <span className="file-icon">
                                                        <i className="fas fa-upload"></i>
                                                    </span>
                                                    <span className="file-label">
                                                        Choose a file…
                                                    </span>
                                                </span>
                                                <span className="file-name">
                                                    No file chosen
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Price</label>
                                        <div className="field has-addons">
                                            <div className="control">
                                                <a className="button is-static">
                                                    &#8358;
                                                </a>
                                            </div>
                                            <div className="control is-expanded">
                                                <input id="inp_price" maxLength={6} onChange={formatPrice} className="input" octavalidate="DIGITS" type="text" name="price" placeholder="5000" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Extra Note <span className="has-text-danger">*</span></label>
                                        <div className="control is-expanded has-icons-left">
                                            <textarea octavalidate="TEXT" placeholder="I want a senator material with ..." name="extra_note" id="inp_cus_req" className="input textarea"></textarea>
                                            <span className="icon is-small is-left"><i className="mdi mdi-check-circle"></i></span>
                                        </div>
                                        <small>Briefly state what the customer wants</small>
                                    </div>
                                    <div className="field">
                                        <label className="label">Deadline <span className="has-text-danger">*</span></label>
                                        <div className="control is-expanded has-icons-left">
                                            <input id="inp_date_due" className="input" type="date" name="deadline" placeholder="When will you be able to deliver?" />
                                            <span className="icon is-small is-left"><i className="mdi mdi-calendar"></i></span>
                                        </div>
                                        <small>When will you be able to deliver this request?</small>
                                    </div>
                                    <div className="field mt-5">
                                        <button className="button is-app-primary is-fullwidth" form="form_new_request">Create Request</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </>
            }
        </>

    )

}