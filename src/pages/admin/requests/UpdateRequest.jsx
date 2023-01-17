import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import { octaValidate } from 'octavalidate-reactjs'
import Core from "../../Hooks/Core";

export default function AddRequest() {
    const req_id = useParams().reqId;
    //set request data
    const [reqData, setReqData] = useState({})

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
        formData.append('token', getToken());
        formData.append('req_id', req_id || '');
        //validate form
        if (myForm.validate()) {
            btn.classList.toggle('is-loading');
            fetch(import.meta.env.VITE_BACKEND_URL + 'api/requests/update_request.php', {
                method: "post",
                body: formData,
                mode: "cors"
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
                        //reload after 2s
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000)
                        // btn.classList.remove('is-loading')
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
        getRequestData().then(res => {
            setStatus("loaded")
            if (!res.success) {
                toast.error(res.message);
            } else {
                //set data
                setReqData(res.data)
            }
        })
    }, [])

    // document.querySelector('#inp_completed')?.value = reqData?.is_completed;

    //get customer data
    const getRequestData = async () => {
        const url = new URL(import.meta.env.VITE_BACKEND_URL + 'api/requests/get_request.php');
        url.searchParams.append('token', getToken());
        //check if search query was supplied
        url.searchParams.append('req_id', req_id || '')

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

    return (
        (status !== "loaded") ?
            <>
                {Preloader()}
            </> :
            <>
                <section className="dash-hero hero is-hero-bar">
                    <div className="hero-body">
                        <div className="level">
                            <div className="level-left">
                                <div className="level-item"><h1 className="title">
                                    Update Request
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
                                <span>Update request for <span className="has-text-app-primary">{reqData?.cus_name}</span> </span>
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
                                        <input defaultValue={reqData?.name} id="inp_name" className="input" octavalidate="R,TEXT" ov-required-msg="Request Name is required" type="text" name="name" placeholder="Senator" />
                                        <span className="icon is-small is-left"><i className="mdi mdi-tshirt-crew"></i></span>
                                    </p>
                                </div>
                                <div className="field">
                                    <label className="label">Image</label>
                                    <div className="file has-name" id="inp_req_image_wrapper">
                                        <label className="file-label">
                                            <input id="inp_req_image" accept-mime="image/jpg, image/png, image/jpeg" onChange={setFileName} className="file-input" type="file" name="image" />
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
                                            <input defaultValue={reqData?.price} id="inp_price" maxLength={6} onChange={formatPrice} className="input" octavalidate="DIGITS" type="text" name="price" placeholder="5000" />
                                        </div>
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Extra Note <span className="has-text-danger">*</span></label>
                                    <div className="control is-expanded has-icons-left">
                                        <textarea defaultValue={reqData?.extra_note} octavalidate="TEXT" placeholder="I want a senator material with ..." name="extra_note" id="inp_cus_req" className="input textarea"></textarea>
                                        <span className="icon is-small is-left"><i className="mdi mdi-check-circle"></i></span>
                                    </div>
                                    <small>Briefly state what the customer wants</small>
                                </div>
                                <div className="field">
                                    <label>Have you completed this request?</label>
                                    <div className="control">
                                        <div className="select is-fullwidth">
                                            <select name="completed" octavalidate="ALPHA_ONLY" id="inp_completed" defaultValue={reqData?.is_completed?.toString()}>
                                                {
                                                    (reqData?.is_completed == "Yes") ?
                                                        <option value={"Yes"} selected>Yes</option>
                                                        : <option value={"Yes"}>Yes</option>
                                                }
                                                {
                                                    (reqData?.is_completed == "No") ?
                                                        <option value={"No"} selected>No</option>
                                                        : <option value={"No"}>No</option>
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Date Due <span className="has-text-danger">*</span></label>
                                    <div className="control is-expanded has-icons-left">
                                        <input defaultValue={reqData?.due_date} id="inp_date_due" className="input" type="date" name="due_date" placeholder="Date Due" />
                                        <span className="icon is-small is-left"><i className="mdi mdi-calendar"></i></span>
                                    </div>
                                    <small>When will you be able to deliver this request?</small>
                                </div>
                                <div className="field mt-5">
                                    <button className="button is-app-primary is-fullwidth" form="form_new_request">Update Request</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </>
    )
}