import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import Core from "../../Hooks/Core";
import { octaValidate } from "octavalidate-reactjs";

const TapeFields = ({ configData, tapeData }) => {
    //the number of configuration stored for either male measurements or female measurements
    // ["waist", "burst", "neck"] = 3
    let num = configData?.length;

    let i = 1;
    let configDataIndex = 0;
    //xtraFields?.[extraFieldsIndex]
    const res = [];

    while (i <= num) {
        //current congifuration eg burst, length, neck
        let currentConfig = configData[configDataIndex];
        res.push(
            <div className="field measure-field">
                <label className="label">{currentConfig}</label>
                <p className="control is-expanded">
                    <input data-name={currentConfig} id={"inp_tape_" + i} autoComplete={"off"} className="input tape-inp" octavalidate="DIGITS" length="2" type="number" placeholder="Waist" defaultValue={tapeData?.[currentConfig]} />
                </p>
            </div>
        )
        i++;
        configDataIndex++;
    }

    return (
        res.map((el, ind) => {
            return (
                <React.Fragment key={ind}>
                    {el}
                </React.Fragment >
            )
        })
    )
}

export default function AddMeasurement() {
    //get the customer ID from the URL
    const cus_id = useParams().cusId;

    //the measurement data for this customer
    const [tapeData, setTapeData] = useState({})

    //the user's measurement configuration
    const [configData, setConfigData] = useState({})

    const { getToken, Preloader } = Core();
    //track initial fetch request
    const [status, setStatus] = useState("loading");

    //fetch data on component load
    useEffect(() => {
        getMeasurementData().then(measureRes => {
            if (!measureRes.success) {
                toast.error(measureRes.message);
            } else {
                //delete data that is not needed
                (measureRes?.data?.gender == "male") ? delete (measureRes.data.tape_female) : null;
                //do the same if gender is female
                (measureRes?.data?.gender == "female") ? delete (measureRes.data.tape_male) : null;
                //set data
                setTapeData(measureRes.data);
                //run the other fetch request
                getConfigData().then(res => {
                    setStatus("loaded")
                    if (!res.success) {
                        toast.error(res.message);
                    } else {
                        if (measureRes?.data?.gender == "male") {
                            //store either the measurement configuration for males or females
                            // ["waist", "burst", "neck"] 
                            setConfigData(res.data?.tape_male)
                        } else {
                            setConfigData(res.data?.tape_female)
                        }
                    }
                })
            }
        });

    }, [])

    //if tapedata is available, show delete measurement 

    //get customer's measurement data
    const getMeasurementData = async () => {
        const url = new URL(import.meta.env.VITE_BACKEND_URL + 'api/measurements/get_measurement.php');
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

    //get measurement configuration
    const getConfigData = async () => {
        const url = new URL(import.meta.env.VITE_BACKEND_URL + 'api/config/get_measurement.php');
        url.searchParams.append('token', getToken());

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

    const handleSubmit = (e) => {
        const gender = tapeData?.gender;
        e.preventDefault();
        const form = e.target
        const btn = document.querySelector(`button[form="${form.id}"]`)
        const myForm = new octaValidate(form.id, {
            strictMode: true
        })
        const formData = new FormData(form);
        formData.append('token', getToken());
        formData.append('cus_id', cus_id || '');
        //validate form
        if (myForm.validate() && gender) {
            formData.append('gender', gender)
            //disable the submit button
            btn.classList.toggle('is-loading');
            //rebuild data
            const body = {}
            form.querySelectorAll('input.tape-inp').forEach(el => {
                //get the measurement name
                const name = el.getAttribute("data-name");
                //get the measurement value
                const val = el.value;
                //store
                if (name && val) {
                    body[name] = val
                }
            })
            //check gender
            if (gender.toLowerCase() == "male") {
                formData.append('tape_male', JSON.stringify(body));
            } else if (gender.toLowerCase() == "female") {
                formData.append('tape_female', JSON.stringify(body));
            }

            fetch(import.meta.env.VITE_BACKEND_URL + 'api/measurements/update_measurement.php', {
                method: "post",
                body: formData,
                mode: "cors"
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
                        if (res?.data.formError) {
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

    const closeModal = (e) => {
        e.currentTarget.closest('.modal').classList.remove('is-active')
        document.documentElement.classList.remove('is-clipped')
    }
    const showModal = (e) => {
        const modalTarget = e.currentTarget.getAttribute('data-target')

        document.getElementById(modalTarget).classList.add('is-active')
        document.documentElement.classList.add('is-clipped')
    }
    //MALE
    const tape = {
        "male": {
            "top": ["chest", "shoulder", "neck", "sleeve length", "short sleeve", "quarter sleeve", "long sleeve", "round sleeve", "length"],
            "trousers": ["waist", "laps", "kneel", "length", "booth", "hip"]
        },
        "female": ["bust", "waist", "hips", "half length", "shoulder", "shoulder to underburst", "gown full length", "shoulder to knee", "bust point", "round sleeve", "sleeve length", "round armhole", "neck", "arm length"]
    }

    return (
        (status !== "loaded") ?
            <>
                {Preloader()}
            </> : <>
                <section className="section is-title-bar">
                    <div className="level">
                        <div className="level-left">
                            &nbsp;
                        </div>
                        <div className="level-right">
                            <div className="level-item">
                                <div className="buttons is-right">
                                    <a
                                        href={import.meta.env.VITE_DASHBOARD_URL + '/settings/update-measurement'}
                                        target="_self"
                                        className="button is-app-primary"
                                    >
                                        <span className="icon">
                                            <i className="mdi mdi-ruler-square"></i>
                                        </span>
                                        <span>My Measurement data</span>
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
                                    Update Measurement
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
                                <span>Updating measurement for <span className="has-text-app-primary">{tapeData?.cus_name}</span> </span>
                            </p>
                        </header>
                        <div className="card-content">
                            {
                                (tapeData?.gender) ?
                                    <div className="notification is-info is-light">
                                        <p className="m-0">This customer is a <b>{tapeData?.gender}</b> so we will show you measurement data for {tapeData?.gender + 's'}</p>
                                    </div>
                                    : null
                            }
                            <form method="post" id="form_upd_measurement" onSubmit={handleSubmit} noValidate>
                                <TapeFields configData={configData} tapeData={(tapeData?.gender == "male") ? tapeData?.tape_male : tapeData?.tape_female} />
                                <div className="field mt-5">
                                    <button data-target="modal_save_measurement" className="button is-app-primary is-fullwidth jb-modal" type="button" onClick={showModal}>Confirm Measurement</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div id="modal_save_measurement" className="modal">
                        <div className="modal-background jb-modal-close" onClick={closeModal}></div>
                        <div className="modal-card">
                            <header className="modal-card-head">
                                <p className="modal-card-title">Confirm Action</p>
                                <button className="delete jb-modal-close" aria-label="close" onClick={closeModal}></button>
                            </header>
                            <section className="modal-card-body">
                                <p className="has-text-centered">Are you sure that you want to save this measurement data for <b>{tapeData?.cus_name}</b></p>
                            </section>
                            <footer className="modal-card-foot is-justify-content-end">
                                <button className="button jb-modal-close" onClick={closeModal}>Cancel</button>
                                <button form="form_upd_measurement" type="submit" className="button is-app-primary jb-modal-close">Save</button>
                            </footer>
                        </div>
                        <button onClick={closeModal} className="modal-close is-large jb-modal-close" aria-label="close"></button>
                    </div>
                </section>
            </>
    )
}