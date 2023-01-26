import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Core from "../../Hooks/Core";
import { octaValidate } from "octavalidate-reactjs";
import { Helmet } from "react-helmet";

const ExtraFields = ({ numOfFields, extraFields, gender }) => {

    const { getToken } = Core();

    let num = numOfFields;

    let i = 1;

    let extraFieldsIndex = 0;
    const res = [];

    //handle delete
    const handleDelete = (e) => {
        e.preventDefault();
        const btn = e.target;
        const dataToDel = btn.getAttribute("data");
        //proceed if data exists
        if (dataToDel) {
            //new search params
            const search = new URLSearchParams();
            search.append('data', dataToDel);
            search.append('gender', gender);

            btn.classList.toggle('is-loading');
            //do fetch
            fetch(import.meta.env.VITE_BACKEND_URL + 'api/config/delete_measurement.php', {
                method: "post",
                mode: "cors",
                body: search.toString(),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    'Authorization': `Bearer ${getToken()}`
                }
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
                        btn.classList.remove('is-loading')
                        //reload page
                        setTimeout(() => {
                            window.location.reload()
                        }, 500);
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
    while (i <= num) {
        res.push(
            //set key on input change so that it updates on state change properly
            //Thanks stack overflow!
            <div className="field measure-field">
                <label className="label"><span className="has-text-app-primary">{i}</span> Measurement Name</label>
                <p className="control is-expanded">
                    <input id={"inp_" + gender + "_tape_" + i} autoComplete={"off"} spellCheck={false} className="input tape-inp" octavalidate="ALPHA_SPACES" type="text" placeholder="Waist" defaultValue={extraFields?.[extraFieldsIndex] || ""} key={extraFields?.[extraFieldsIndex]} />
                </p>
                {
                    //enable the delete button when there's data stored in this index
                    (extraFields?.[extraFieldsIndex]) ?
                        <p className="has-text-right mt-2">
                            <button type="button" onClick={handleDelete} id={"btn_del_tape_" + i} data={extraFields?.[extraFieldsIndex]} className="button is-small is-danger">Delete</button>
                        </p> : null
                }
            </div>
        )
        i++;
        extraFieldsIndex++;
    }

    return (
        res.map((el, ind) => {
            // fieldBody++;
            return (
                <React.Fragment key={ind}>
                    {el}
                </React.Fragment >
            )
        })
    )
}

export default function Settings_UpdateMeasurement() {
    const [tapeData, setTapeData] = useState({})
    const [gender, setGender] = useState("")
    let [numOfFields, setNumOfFields] = useState(1);
    const { getToken, Preloader } = Core();

    //track fetch request
    const [status, setStatus] = useState("loading");

    //fetch data on component load
    useEffect(() => {
        getConfig().then(res => {
            setStatus("loaded")
            if (!res.success) {
                toast.error(res.message);
            } else {
                //set data
                setTapeData(res.data)
            }
        })
    }, [])
    //get measurement data
    const getConfig = async () => {
        const url = new URL(import.meta.env.VITE_BACKEND_URL + 'api/config/get_measurement.php');

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
            strictMode: true
        })
        const formData = new FormData(form);
        //validate form
        if (myForm.validate()) {
            btn.classList.toggle('is-loading');
            //store all measurements
            const tape = []
            //get all measurements
            form.querySelectorAll('input.tape-inp').forEach(el => {
                if (el.value.trim() !== "") {
                    tape.push(el.value)
                }
            })

            //remove duplicates
            const tapeUniq = [... new Set([...tape])]

            //check gender
            if (gender.toLowerCase() == "male") {
                formData.append('tape_male', tapeUniq);
            } else if (gender.toLowerCase() == "female") {
                formData.append('tape_female', tapeUniq);
            }

            fetch(import.meta.env.VITE_BACKEND_URL + 'api/config/update_measurement.php', {
                method: "post",
                body: formData,
                mode: "cors",
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            })
                .then(res => res.json())
                .then(res => {
                    // //close modal
                    document.querySelectorAll('.modal').forEach(el => {
                        el.classList.remove('is-active')
                    })
                    document.documentElement.classList.remove('is-clipped')
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
    //MALE
    const tape = {
        "male": {
            "top": ["chest", "shoulder", "neck", "sleeve length", "short sleeve", "quarter sleeve", "long sleeve", "round sleeve", "length"],
            "trousers": ["waist", "laps", "kneel", "length", "booth", "hip"]
        },
        "female": ["bust", "waist", "hips", "half length", "shoulder", "shoulder to underburst", "gown full length", "shoulder to knee", "bust point", "round sleeve", "sleeve length", "round armhole", "neck", "arm length"]
    }

    const handleGenderChange = (e) => {
        //store gender
        const gender = e.target.value.toLowerCase();
        setGender(gender);
        if (tapeData?.["tape_" + gender]) {
            //set the length to 1 if it is 0, so that the add more button will be of use 🌝
            setNumOfFields(tapeData["tape_" + gender].length || 1);
        }
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
    return (
        <>
            <Helmet>
                <title>Update Your Measurement Data - TailorsKit</title>
                <meta property="og:title" content={"Update your measurement Data - TailorsKit"} />
                <meta name="description" content={"Set different measurement data for both males and females"} />
            </Helmet>
            {(status !== "loaded") ?
                <>
                    {Preloader()}
                </> : <>
                    <section className="dash-hero hero is-hero-bar">
                        <div className="hero-body">
                            <div className="level">
                                <div className="level-left">
                                    <div className="level-item"><h1 className="title">
                                        Update Measurement Data
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
                                    <span className="icon"><i className="mdi mdi-ruler-square"></i></span>
                                    <span>My Measurement Data</span>
                                </p>
                            </header>
                            <div className="card-content">

                                <form method="post" id="form_upd_tape" onSubmit={handleSubmit}>
                                    <div className="field mb-4">
                                        <label className="label">Select Gender <span className="has-text-danger">*</span></label>
                                        <div className="control">
                                            <div className="select is-fullwidth">
                                                <select onChange={handleGenderChange} id="inp_gender" name="gender" octavalidate="R,ALPHA_ONLY">
                                                    <option value="">Select One</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        (gender) ? <>
                                            <div className="columns mb-4">
                                                <div className="column is-half"></div>
                                                <div className="column is-half has-text-right">
                                                    <button type="button" onClick={(e) => setNumOfFields(++numOfFields)} className="button is-app-primary"><i className="mdi mdi-plus"></i>&nbsp;Add more</button>
                                                </div>
                                            </div>
                                            <ExtraFields numOfFields={numOfFields} extraFields={tapeData?.["tape_" + gender]} gender={gender} />
                                            <div className="field mt-5">
                                                <button type="button" data-target="modal_save_tape" className="button is-app-primary is-fullwidth jb-modal" onClick={showModal} form="form_upd_tape">Save Measurements</button>
                                            </div>
                                        </> : null
                                    }
                                </form>
                            </div>
                        </div>
                    </section>
                    <div id="modal_save_tape" className="modal">
                        <div className="modal-background jb-modal-close" onClick={closeModal}></div>
                        <div className="modal-card">
                            <header className="modal-card-head">
                                <p className="modal-card-title">Confirm Action</p>
                                <button className="delete jb-modal-close" aria-label="close" onClick={closeModal}></button>
                            </header>
                            <section className="modal-card-body">
                                <p className="has-text-centered">Are you sure that you want to save this measurement data for the <b>{gender}</b> gender?</p>
                            </section>
                            <footer className="modal-card-foot is-justify-content-end">
                                <button className="button jb-modal-close" onClick={closeModal}>Cancel</button>
                                <button form="form_upd_tape" type="submit" className="button is-app-primary jb-modal-close">Save</button>
                            </footer>
                        </div>
                        <button onClick={closeModal} className="modal-close is-large jb-modal-close" aria-label="close"></button>
                    </div>
                </>
            }
        </>
    )
}