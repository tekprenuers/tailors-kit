import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import { octaValidate } from "octavalidate-reactjs";
import Typed from "typed.js";
import { Helmet } from "react-helmet";
import Core from "./Hooks/Core";

export default function Login() {
  const location = useLocation();
  const {getToken} = Core()
  //redirect back to dashboard if user is logged in already
  if(getToken()){
    window.location.href = import.meta.env.VITE_DASHBOARD_URL
  }
  //redirect to?
  let redirect = import.meta.env.VITE_DASHBOARD_URL + '/home';
  //check if there's search param in the URL
  if(location.search){
    //new search params
    const search = new URLSearchParams(location.search)
    //check if next is present
    if(search?.get('next')){
      //decode it
      const next = decodeURIComponent(search.get('next'))
      //check if dashboard is present in the URL
      if(next.match(new RegExp('/dashboard', 'i'))){
        redirect = next;
      }
    }
  }

  // Create Ref element.
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Save your client's data", "Access your client's data", "Update your client's data",], // Strings to display
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
    const myForm = new octaValidate(form.id)
    //validate form
    if (myForm.validate()) {
      btn.classList.toggle('is-loading');
      fetch(import.meta.env.VITE_BACKEND_URL + 'login.php', {
        method: "post",
        body: new FormData(form),
        mode: "cors"
      })
        .then(res => res.json())
        .then(res => {
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
            if (res.data?.token) {
              // localStorage.setItem("TK::TOKEN", res.data.token);
              localStorage.setItem("TK::DATA", JSON.stringify({
                "TK::TOKEN": res.data.token,
                "TK::USER": res.data.user
              }));
                //redirect to dashboard or redirect link
                setTimeout(() => {
                  window.location.href = redirect;
                }, 3000)
            }
            // if (res.data?.expired) {
            //   setTimeout(() => {
            //     window.location.href = import.meta.env.VITE_BACKEND_URL + 'pay';
            //   }, 3000)
            // }
            btn.classList.remove('is-loading')
            btn.setAttribute("disabled", "disabled")
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
        <title>Login - TailorsKit</title>
        <meta property="og:title" content={"Login - TailorsKit"} />
        <meta name="title" content={"Login - TailorsKit"} />
        <meta property="og:description" content={"Quickly Login to your account on TailorsKit to save, access & manage your clients data"} />
        <meta name="description" content={"Quickly Login to your account on TailorsKit to save, access & manage your clients data"} />
      </Helmet>
      <div className="columns p-20 mt-5">
      <div className="column is-half is-align-self-center">
      <div className="has-text-centered mb-5">
            <h4 className="title is-4 col-title">
              SIGN IN TO YOUR ACCOUNT
            </h4>
            <h5 className="subtitle" style={{textTransform: "uppercase" }}><span ref={el}></span></h5>
          </div>
          <section className="form-section has-shadow">
            <form id="form_login" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label className="label">
                  Enter your email <span className="has-text-danger">*</span>
                </label>
                <p className="control has-icons-left">
                  <input octavalidate="R,EMAIL" id="inp_email" name="email" className="input" type="email" placeholder="Email" />
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
                  <input octavalidate="R" minLength={8} id="inp_pass" name="pass" className="input" type="password" placeholder="Password" />
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock"></i>
                  </span>
                </p>
              </div>
              <div className="field">
                <label className="checkbox">
                  <input type="checkbox" disabled /> Remember me
                </label>
              </div>
              <div className="field">
                <button form="form_login" className="is-fullwidth button is-app-primary">
                  Login
                </button>
                <p className="mt-3">
                  Don't have an account?  <a href="/register">Click here to Register</a>
                </p>
                <p className="mt-3">
                  <a href="/reset">I forgot my password</a>
                </p>
              </div>
            </form>
          </section>
        </div>
        <div className="column is-half is-align-self-center has-text-centered hide-on-mobile">
          <img src="/mannequin-with-tape-measure.png" className="img mh-500 has-drop-shadow" />
        </div>
      </div>
    </main>
  );
}
