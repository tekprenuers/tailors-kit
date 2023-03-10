import React, { useRef, useEffect } from "react";
import { toast } from 'react-toastify';
import { octaValidate } from "octavalidate-reactjs";
import Typed from "typed.js";
import { Helmet } from "react-helmet";
import Core from "./Hooks/Core";

export default function Register() {
  const {getToken} = Core();

  //redirect back to dashboard if user is logged in already
  if(getToken()){
    window.location.href = import.meta.env.VITE_DASHBOARD_URL
  }

  // Create Ref element.
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Save your client's data", "Manage your client's data", "Access your client's Data"], // Strings to display
      // Speed settings, try diffrent values untill you get good results
      startDelay: 300,
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 100,
      smartBackspace: true,
      loop: true,
      showCursor: true,
    });

    // Destropying
    return () => {
      typed.destroy();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target
    const btn = form.querySelector(`button[form="${form.id}"]`)
    const myForm = new octaValidate(form.id, {
      strictWords : ["admin", "test"],
      strictMode : true
    })
    //validate form
    if (myForm.validate()) {
      btn.classList.toggle('is-loading');
      fetch(import.meta.env.VITE_BACKEND_URL + 'register.php', {
        method: "post",
        body: new FormData(form),
        mode: "cors"
      })
        .then(res => res.json())
        .then(res => {
          btn.classList.remove('is-loading')
          if (!res.success) {
            //check if its a form error
            if (res?.data?.formError) {
              toast.error("A Validation error has occured")
            } else {
              toast.error(res.data.message)
            }
          } else {
            toast.success(res.data.message)
            setTimeout(() => {
              window.location.href=import.meta.env.VITE_FRONTEND_URL +"/login"
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
    <main className="">
      <Helmet>
        <title>Register - TailorsKit</title>
        <meta property="og:title" content={"Register - TailorsKit"} />
        <meta name="title" content={"Register - TailorsKit"} />
        <meta property="og:description" content={"Quickly register on TailorsKit to save, access & manage your clients data"} />
        <meta name="description" content={"Quickly register on TailorsKit to save, access & manage your clients data"} />
      </Helmet>
      <div className="columns p-20 mt-5">
      <div className="column is-half is-align-self-center">
          <div className="has-text-centered mb-5">
            <h4 className="title is-4 col-title">
              CREATE AN ACCOUNT
            </h4>
            <h5 className="subtitle" style={{textTransform: "uppercase" }}><span ref={el}></span></h5>
          </div>
          <section className="form-section has-shadow">
            <form id="form_register" method="post" onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">
                  Enter your email <span className="has-text-danger">*</span>
                </label>
                <p className="control has-icons-left">
                  <input id="inp_email" name="email" octavalidate="R,EMAIL" className="input" type="email" placeholder="Email" />
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope"></i>
                  </span>
                </p>
              </div>
              <div className="field">
                <label className="label">
                  Enter your password <span className="has-text-danger">*</span>
                </label>
                <p className="control has-icons-left">
                  <input id="inp_pass" name="pass" octavalidate="R" minLength={8} className="input" type="password" placeholder="Password" />
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock"></i>
                  </span>
                </p>
              </div>
              <div className="field">
                <label className="checkbox">
                  <input type="checkbox" /> I agree to the <a href="#">terms and conditions</a>
                </label>
              </div>
              <div className="field">
                <button form="form_register" type="submit" className="is-fullwidth button is-app-primary">Register</button>
                <p className="mt-3">Already have an account? Click here to <a href="/login">Login</a></p>
              </div>
            </form>
          </section>
        </div>
        <div className="column is-half has-text-centered is-align-self-center hide-on-mobile">
          <img src="/mannequin-with-tape-measure.png" className="img mh-500 has-drop-shadow" />
        </div>
      </div>
    </main>
  );
}
