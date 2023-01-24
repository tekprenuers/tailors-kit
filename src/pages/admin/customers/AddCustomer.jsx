import React from "react";
import { toast } from 'react-toastify';
import { octaValidate } from 'octavalidate-reactjs'
import Core from "../../Hooks/Core";

export default function AddCustomer() {
    const { getToken } = Core();

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target
        const btn = form.querySelector(`button[form="${form.id}"]`)
        const myForm = new octaValidate(form.id, {
            strictMode: true,
            errorElem: {
                "inp_cus_image": "inp_cus_image_wrapper"
            }
        })
        const formData = new FormData(form);
        formData.append('token', getToken());
        //validate form
        if (myForm.validate()) {
            btn.classList.toggle('is-loading');
            fetch(import.meta.env.VITE_BACKEND_URL + 'api/customers/add_customer.php', {
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
                        btn.classList.remove('is-loading')
                        // btn.setAttribute("disabled", "disabled")
                        //You have successfully saved this customer, would you like to view the list of customers in your account? Then a checkbox to not show the message (modal) again
                        //For now
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
            <section className="dash-hero hero is-hero-bar">
                <div className="hero-body">
                    <div className="level">
                        <div className="level-left">
                            <div className="level-item"><h1 className="title">
                                Add A Customer
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
                            Add a customer
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
                                            <input id="inp_fname" className="input" octavalidate="R,ALPHA_ONLY" ov-required-msg="Customer's First Name is required" type="text" name="fname" placeholder="First Name" />
                                            <span className="icon is-small is-left"><i className="mdi mdi-account"></i></span>
                                        </p>
                                    </div>
                                    <div className="field">
                                        <p className="control is-expanded has-icons-left has-icons-right">
                                            <input id="inp_lname" octavalidate="R,ALPHA_ONLY" className="input" ov-required-msg="Customer's Last Name is required" type="text" placeholder="Last Name" name="lname" />
                                            <span className="icon is-small is-left"><i className="mdi mdi-account"></i></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Gender <span className="has-text-danger">*</span></label>
                                <div className="field is-grouped-multiline is-grouped">
                                    <div className="control"><label className="b-radio radio"><input name="gender" type="radio" value="Male" />
                                        <span className="check"></span>
                                        <span className="control-label">Male</span>
                                    </label></div>
                                    <div className="control"><label className="b-radio radio"><input name="gender" type="radio" value="Female" />
                                        <span className="check"></span>
                                        <span className="control-label">Female</span>
                                    </label>
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
                                    <input id="inp_email" className="input" octavalidate="EMAIL" type="text" name="email" placeholder="Email Address" />
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
                                                <input id="inp_phone" ov-required-msg="Customer's Primary Phone number is required" onChange={formatPhone} className="input" length="10" octavalidate="R,DIGITS" type="tel" name="phone" placeholder="Primary Phone Number" />
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
                                                <input id="inp_alt_phone" octavalidate="DIGITS" maxLength="10" onChange={formatPhone} className="input" type="tel" placeholder="Alternate Phone Number" name="alt_phone" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Customer Home Address <span className="has-text-danger">*</span></label>
                                <div className="control is-expanded has-icons-left">
                                    <textarea octavalidate="R,TEXT" ov-required-msg="Customer's Home Address is required" placeholder="Customer's home address" name="addr" id="inp_cus_addr" className="input textarea"></textarea>
                                    <span className="icon is-small is-left"><i className="mdi mdi-map-marker"></i></span>
                                </div>
                            </div>
                            <div className="field mt-5">
                                <button className="button is-app-primary is-fullwidth" form="form_new_customer">Save customer</button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )

}