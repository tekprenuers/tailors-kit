import React, {useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { octaValidate } from "octavalidate-reactjs";
import Typed from "typed.js";

export default function Register() {
  const navigate = useNavigate()

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
    if(myForm.validate()){
      btn.classList.toggle('is-loading');
      fetch(import.meta.env.VITE_BACKEND_URL+'register.php', {
        method: "post",
        body: new FormData(form),
        mode: "cors"
      })
      .then(res => res.json())
      .then(res => {
        if(!res.success){
          //check if its a form error
          if(res?.formError){
            toast.error("A Validation error has occured")
          }else{
            toast.error(res.data.message)
          }
          btn.classList.remove('is-loading')
        }else{
          toast.success(res.data.message)
          setTimeout( () => {
            navigate("/login")
          }, 3000)
        }
      })
      .catch(err => {
        console.log(err)
        toast.error("Network Error!");
        btn.classList.remove('is-loading')
      })
    }else{
      toast.error("A Validation error has occured")
    }
  }

  return (
    <main className="p-202">
      <div className="columns">
        <div className="column is-half">
          <img src="/mannequin-with-tape-measure.png" />
        </div>
        <div className="column is-half is-align-self-center">
        <div className="has-text-centered mb-5">
            <h4 className="title is-3 has-text-app-primary mb-3">
            Register
            </h4>
            <div>
              <span ref={el} className="title is-5  m-0" style={{height: "25px", textTransform: "uppercase"}}></span>
            </div>
          </div>
          <section className="form-section has-shadow">
            <form id="form_register" method="post" onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">
                  Enter your email <span className="has-text-danger">*</span>
                </label>
                <p className="control has-icons-left has-icons-right">
                  <input id="inp_email" name="email" octavalidate="R,EMAIL" className="input" type="email" placeholder="Email" />
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <span className="icon is-small is-right">
                    <i className="fas fa-check"></i>
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
      </div>
    </main>
  );
}
