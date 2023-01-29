import React from "react";
import { octaValidate } from "octavalidate-reactjs";
import { toast } from "react-toastify";

export default function Contact(){

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target
        const btn = form.querySelector(`button[form="${form.id}"]`)
        const myForm = new octaValidate(form.id, {
            strictMode: true,
            errorElem: {
                "inp_image": "inp_image_wrapper",
                "inp_cat": "inp_cat_wrapper"
            }
        })
        const formData = new FormData(form);
        //validate form
        if (myForm.validate()) {
            btn.classList.toggle('is-loading');
            fetch(import.meta.env.VITE_BACKEND_URL + 'api/support/contact.php', {
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
    return (
        <section className="section mw-700 m-auto has-shadow mt-5 radius-20">
            <h4 className="title is-3 has-text-centered">CONTACT US</h4>
            <h5 className="subtitle has-text-centered">SEND US A MESSAGE</h5>
            <p className="notification is-info is-light">
                Fields marked with an asterisk (<span className="has-text-danger">*</span>) is required!
            </p>
            <form method="post" id="form_contact" onSubmit={handleSubmit} noValidate>
            <div className="field">
                    <label className="label">Your Email<span className="has-text-danger">*</span></label>
                    <p className="control is-expanded has-icons-left">
                        <input id="inp_email" className="input" octavalidate="R,EMAIL" type="email" name="email" placeholder="me@them.com" />
                        <span className="icon is-small is-left"><i className="mdi mdi-email"></i></span>
                    </p>
                </div>
                <div className="field">
                    <label className="label">Title <span className="has-text-danger">*</span></label>
                    <p className="control is-expanded has-icons-left">
                        <input id="inp_title" className="input" octavalidate="R,TEXT" type="text" name="title" placeholder="I CAN'T LOGIN" />
                        <span className="icon is-small is-left"><i className="mdi mdi-text-shadow"></i></span>
                    </p>
                </div>
                <div className="field">
                    <div className="field mb-4">
                        <label className="label">Select category <span className="has-text-danger">*</span></label>
                        <div className="control">
                            <div id="inp_cat_wrapper" className="select is-fullwidth">
                                <select id="inp_cat" name="category" octavalidate="R,ALPHA_ONLY">
                                    <option value="">Select One</option>
                                    <option value="Bugs">Bugs</option>
                                    <option value="Inquiry">Inquiry</option>
                                    <option value="Payments">Payments</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Description <span className="has-text-danger">*</span></label>
                    <div className="control is-expanded has-icons-left">
                        <textarea octavalidate="R,TEXT" ov-required-msg="Description is required" placeholder="I have tried to ..." name="desc" id="inp_desc" className="input textarea"></textarea>
                        <span className="icon is-small is-left"><i className="mdi mdi-text-shadow"></i></span>
                    </div>
                </div>
                <div className="field mt-5">
                    <button className="button is-app-primary is-fullwidth" form="form_contact">Send message</button>
                </div>
            </form>
        </section>
    )
}