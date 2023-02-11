import React, { useEffect, useState } from "react";
import { octaValidate } from 'octavalidate-reactjs'
import core from "../../Hooks/Core";
import { toast } from 'react-toastify'
import { Helmet } from "react-helmet";

export default function UpdateProfile() {
    const { getToken, updateUserData, Preloader } = core()
    const [profileData, setProfileData] = useState({
        fname: "", lname: "", phone: "", alt_phone: "", addr: "", email: "", state: ""
    })
    //track fetch request
    const [status, setStatus] = useState("loading");

    const setFileName = (e) => {
        document.querySelector('.file-name').innerText = e.target.files[0].name
    }

    //all states
    const states = ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Kastina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "F.C.T"];

    //get user data
    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + 'api/clients/user_data.php', {
            method: "get",
            mode: "cors",
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        })
            .then(res => res.json())
            .then(res => {
                setStatus("loaded");
                if (!res.success) {
                    //check if its a form error
                    if (res?.data?.formError) {
                        toast.error("A Validation error has occured")
                    } else {
                        toast.error(res.data.message)
                    }
                } else {
                    toast.success(res.data.message)
                    //update form fields
                    setProfileData(res.data)
                    //update local data
                    updateUserData({ image: res.data.image })
                }
            })
            .catch(err => {
                console.log(err);
                setStatus("loaded")
                toast.error("Network Error!");
            })
    }, [])
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target
        const btn = form.querySelector(`button[form="${form.id}"]`)
        const myForm = new octaValidate(form.id, {
            strictMode: true,
            errorElem: {
                "inp_image": "inp_image_wrapper",
                "inp_state": "inp_state_wrapper"
            }
        })
        const formData = new FormData(form);
        //validate form
        if (myForm.validate()) {
            btn.classList.toggle('is-loading');
            fetch(import.meta.env.VITE_BACKEND_URL + 'api/clients/update_user.php', {
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
                        if (res?.data?.formError) {
                            toast.error("A Validation error has occured")
                        } else {
                            toast.error(res.data.message)
                        }
                        btn.classList.remove('is-loading')
                    } else {
                        toast.success(res.data.message)
                        btn.classList.remove('is-loading')
                        //update local data
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000)
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
        <>
            <Helmet>
                <title>Update your profile - TailorsKit</title>
                <meta property="og:title" content={"Update your profile - TailorsKit"} />
                <meta name="description" content={"Update your profile on TailorsKit"} />
            </Helmet>
            {(status !== "loaded") ?
                <>
                    {Preloader()}
                </> : <>
                    <section className="dash-hero hero is-hero-bar">
                        <div className="hero-body">
                            <div className="level">
                                <div className="level-left">
                                    <div className="level-item"><h1 className="title is-4">
                                        Profile
                                    </h1></div>
                                </div>
                                <div className="level-right">
                                    <div className="level-item"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="section is-main-section">
                        <div className="card">
                            <header className="card-header">
                                <p className="card-header-title">
                                    <span className="icon"><i className="mdi mdi-account-circle default"></i></span>
                                    Edit Profile
                                </p>
                            </header>
                            <div className="card-content">
                                <form onSubmit={handleSubmit} id="form_upd_profile" noValidate>
                                    <div className="field">
                                        <label className="label">Avatar</label>
                                        <div className="file has-name" id="inp_image_wrapper">
                                            <label className="file-label">
                                                <input id="inp_image" accept-mime="image/jpg, image/png, image/jpeg" onChange={setFileName} className="file-input" type="file" maxsize="5mb" name="image" />
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
                                    <hr />
                                    <div className="field">
                                        <label className="label">First Name <span className="has-text-danger">*</span></label>
                                        <div className="control">
                                            <input id="inp_fname" octavalidate="R,ALPHA_ONLY" type="text" autoComplete="on" name="fname" placeholder="Simon" className="input" defaultValue={profileData.fname} />
                                        </div>
                                        <p className="help">Required. Your First name</p>
                                    </div>
                                    <div className="field">
                                        <label className="label">Last Name <span className="has-text-danger">*</span></label>
                                        <div className="control">
                                            <input id="inp_lname" octavalidate="R,ALPHA_ONLY" type="text" autoComplete="on" name="lname" placeholder="Ugorji" className="input" defaultValue={profileData.lname} />
                                        </div>
                                        <p className="help">Required. Your Last name</p>
                                    </div>
                                    <div className="field">
                                        <label className="label">Email</label>
                                        <div className="control">
                                            <input readOnly placeholder="me@org.com" type="email" className="input" defaultValue={profileData.email} />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Primary Phone Number <span className="has-text-danger">*</span></label>
                                        <div className="control">
                                            <input octavalidate="R,DIGITS" placeholder="090XXXXXXXX" id="inp_phone" type="tel" autoComplete="on" name="phone" className="input" defaultValue={profileData.phone} />
                                        </div>
                                        <p className="help">Required. Your Primary phone number</p>
                                    </div>
                                    <div className="field">
                                        <label className="label">Alternate Phone Number</label>
                                        <div className="control">
                                            <input octavalidate="DIGITS" placeholder="090XXXXXXXX" id="inp_alt_phone" type="tel" autoComplete="on" name="alt_phone" className="input" defaultValue={profileData.alt_phone} />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label>State Of Origin <span className="has-text-danger">*</span></label>
                                        <div className="control">
                                            <div id="inp_state_wrapper" className="select is-fullwidth">
                                                <select name="state" octavalidate="R,ALPHA_SPACES" id="inp_state" defaultValue={profileData.state}>
                                                    {
                                                        states.map((el, ind) => {
                                                            return (
                                                                <option value={el} key={ind}>{el}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Home Address <span className="has-text-danger">*</span></label>
                                        <div className="control is-expanded has-icons-left">
                                            <textarea octavalidate="R,TEXT" ov-required-msg="Home Address is required" placeholder="Home address" name="addr" id="inp_addr" className="input textarea" defaultValue={profileData.addr}></textarea>
                                            <span className="icon is-small is-left"><i className="mdi mdi-map-marker"></i></span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="field">
                                        <div className="control">
                                            <button form="form_upd_profile" type="submit" className="button is-app-primary is-fullwidth">
                                                Submit
                                            </button>
                                        </div>
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