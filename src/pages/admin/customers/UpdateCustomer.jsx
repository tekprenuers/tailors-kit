import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { octaValidate } from 'octavalidate-reactjs'
import Core from "../../Hooks/Core";
import { Helmet } from "react-helmet";

export default function AddCustomer() {
    const { getToken, Preloader } = Core();
    // get customer id from URL
    const cus_id = useParams().cusId;
    //customer data
    const [cusData, setCusData] = useState({});
    //track fetch request
    const [status, setStatus] = useState("loading")
    //check if customer exists
    useEffect(() => {
        getCustomerData().then(res => {
            //track fetch
            setStatus("loaded")
            if (!res.success) {
                toast.error(res.message);
            } else {
                //set data
                setCusData(res.data)
            }
        })
    }, [])

    //SET GENDER
    document.querySelectorAll('input[type="radio"]').forEach(el => {
        if (el.value == cusData?.gender) {
            el.checked = true;
        } else {
            el.checked = false;
        }
    })

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target
        const btn = form.querySelector(`button[form="${form.id}"]`)
        const myForm = new octaValidate(form.id, {
            strictMode: true,
            errorElem: {
                "inp_cus_image": "inp_cus_image_wrapper",
                "inp_gender": "inp_gender_wrapper"
            }
        })
        const formData = new FormData(form);
        formData.append('cus_id', cus_id);
        //validate form
        if (myForm.validate()) {
            btn.classList.toggle('is-loading');
            fetch(import.meta.env.VITE_BACKEND_URL + 'api/customers/update_customer.php', {
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

    const formatPhone = (e) => {
        const val = e.target.value;
        //number must start from 7,8 or 9
        //070, 080, 090
        const allowed = [7, 8, 9];
        //remove all white spaces and convert to array
        const valAry = val.replaceAll(' ', '').split('');
        //because i dont know if the number will have +234 anywhere, check for it manually
        (!allowed.includes(Number(valAry[0]))) ? valAry.splice(0, 1) : null;

        //replace value
        e.target.value = valAry.join('')
    }
    return (
        <>
            <Helmet>
                <title>{"Updating " + cusData?.name}</title>
                <meta property="og:title" content={"Updating - " + cusData?.name} />
                <meta name="description" content={"Visit this page to update this customer's data"} />
            </Helmet>
            {(status !== "loaded") ?
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
                                            href={import.meta.env.VITE_DASHBOARD_URL + '/customers/' + cus_id}
                                            target="_self"
                                            className="button is-app-primary"
                                        >
                                            <span className="icon">
                                                <i className="mdi mdi-eye"></i>
                                            </span>
                                            <span>View data</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="dash-hero hero is-hero-bar">
                        <div className="hero-body">
                            <div className="level">
                                <div className="level-left">
                                    <div className="level-item"><h1 className="title">
                                        Update Customer
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
                                    Update Customer
                                </p>
                            </header>
                            <div className="card-content">
                                <div className="notification is-info is-light">
                                    <p className="m-0">Fields with an asterisk(<span className="has-text-danger">*</span>) are required!</p>
                                </div>
                                <form method="post" id="form_new_customer" onSubmit={handleSubmit}>
                                    <div className="field">
                                        <label className="label">Customer Name <span className="has-text-danger">*</span></label>
                                        <div className="field-body">
                                            <div className="field">
                                                <p className="control is-expanded has-icons-left">
                                                    <input defaultValue={cusData?.fname} id="inp_fname" className="input" octavalidate="R,ALPHA_ONLY" ov-required-msg="Customer's First Name is required" type="text" name="fname" placeholder="First Name" />
                                                    <span className="icon is-small is-left"><i className="mdi mdi-account"></i></span>
                                                </p>
                                            </div>
                                            <div className="field">
                                                <p className="control is-expanded has-icons-left has-icons-right">
                                                    <input defaultValue={cusData?.lname} id="inp_lname" octavalidate="R,ALPHA_ONLY" className="input" ov-required-msg="Customer's Last Name is required" type="text" placeholder="Last Name" name="lname" />
                                                    <span className="icon is-small is-left"><i className="mdi mdi-account"></i></span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="field mb-4">
                                        <label className="label">Select Gender <span className="has-text-danger">*</span></label>
                                        <div className="control">
                                            <div id="inp_gender_wrapper" className="select is-fullwidth">
                                                <select defaultValue={cusData?.gender} id="inp_gender" name="gender" octavalidate="R,ALPHA_ONLY">
                                                    <option key={""} value="">Select One</option>
                                                    <option key={"Male"} value="Male">Male</option>
                                                    <option key={"Female"} value="Female">Female</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Customer's Image</label>
                                        <div className="file has-name" id="inp_cus_image_wrapper">
                                            <label className="file-label">
                                                <input id="inp_cus_image" accept-mime="image/jpg, image/png, image/jpeg" onChange={setFileName} className="file-input" type="file" name="image" />
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
                                        <label className="label">Customer Email</label>
                                        <p className="control is-expanded has-icons-left">
                                            <input defaultValue={cusData?.email} id="inp_email" className="input" octavalidate="EMAIL" type="text" name="email" placeholder="Email Address" />
                                            <span className="icon is-small is-left"><i className="mdi mdi-email"></i></span>
                                        </p>
                                    </div>
                                    <div className="field">
                                        <label className="label">Customer Phone <span className="has-text-danger">*</span></label>
                                        <div className="field-body">
                                            <div className="field">
                                                <div className="field has-addons">
                                                    <div className="control">
                                                        <a className="button is-static">
                                                            +234
                                                        </a>
                                                    </div>
                                                    <div className="control is-expanded">
                                                        <input defaultValue={cusData?.phone?.replace('+234', '')} id="inp_phone" ov-required-msg="Customer's Primary Phone number is required" onChange={formatPhone} className="input" length="10" octavalidate="R,DIGITS" type="tel" name="phone" placeholder="Primary Phone Number" />
                                                    </div>
                                                </div>
                                                <small>Do not enter <span className="has-text-danger">the first zero</span> or <span className="has-text-danger">+234</span></small>
                                            </div>
                                            <div className="field">
                                                <div className="field has-addons">
                                                    <div className="control">
                                                        <a className="button is-static">
                                                            +234
                                                        </a>
                                                    </div>
                                                    <div className="control is-expanded">
                                                        <input defaultValue={cusData?.alt_phone?.replace('+234', '')} id="inp_alt_phone" octavalidate="DIGITS" maxLength="10" onChange={formatPhone} className="input" type="tel" placeholder="Alternate Phone Number" name="alt_phone" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Customer Home Address <span className="has-text-danger">*</span></label>
                                        <div className="control is-expanded has-icons-left">
                                            <textarea defaultValue={cusData?.addr} octavalidate="R,TEXT" ov-required-msg="Customer's Home Address is required" placeholder="Customer's home address" name="addr" id="inp_cus_addr" className="input textarea"></textarea>
                                            <span className="icon is-small is-left"><i className="mdi mdi-map-marker"></i></span>
                                        </div>
                                    </div>
                                    <div className="field mt-5">
                                        <button className="button is-app-primary is-fullwidth" form="form_new_customer">Update customer</button>
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