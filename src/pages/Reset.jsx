import React, { useState } from "react";
import { octaValidate } from "octavalidate-reactjs";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

export default function Reset() {
  const navigate = useNavigate();
  //search params
  const searchParams = new URLSearchParams(useLocation().search);
  //state to show the form
  const [showResetForm, setShowResetForm] = useState(false);
  //password type states
  const [passType, setPassType] = useState("password")

  React.useEffect(() => {
    if (searchParams?.get("email") && searchParams?.get("hash")) {
      //verify that the link is valid
      fetch(
        import.meta.env.VITE_BACKEND_URL +
          "verify_reset_link.php?email=" +
          searchParams.get('email')+'&hash='+searchParams.get('hash'),
        {
          method: "get",
          mode: "cors",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) {
            //check if its a form error
            if (res?.formError) {
              toast.error("A Validation error has occured");
            } else {
              toast.error(res.data.message);
            }
          } else {
            toast.success(res.data.message);
            setShowResetForm(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  //show or hide password
  const showHidePass = (e) => {
    const checked = e.target.checked;
    if(checked === true){
      setPassType("text")
    }else{
      setPassType("password")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector(`button[form="${form.id}"]`);
    const myForm = new octaValidate(form.id);
    //validate form
    if (myForm.validate()) {
      btn.classList.toggle("is-loading");
      fetch(import.meta.env.VITE_BACKEND_URL + "reset_link.php", {
        method: "post",
        body: new FormData(form),
        mode: "cors",
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) {
            //check if its a form error
            if (res?.formError) {
              toast.error("A Validation error has occured");
            } else {
              toast.error(res.data.message);
            }
            btn.classList.remove("is-loading");
          } else {
            toast.success(res.data.message);
            btn.classList.remove("is-loading");
            btn.setAttribute("disabled", "disabled");
            // setTimeout( () => {
            //   navigate("/dashboard")
            // }, 3000)
          }
        })
        .catch((err) => {
          console.log(err);
          btn.classList.remove("is-loading");
        });
    } else {
      toast.error("A Validation error has occured");
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector(`button[form="${form.id}"]`);
    const myForm = new octaValidate(form.id);
    //validate form
    if (myForm.validate()) {
      btn.classList.toggle("is-loading");
      const formData = new FormData(form);
      //append email and hash
      formData.append('email', searchParams.get('email'));
      formData.append('hash', searchParams.get('hash'));
      fetch(import.meta.env.VITE_BACKEND_URL + "reset_pass.php", {
        method: "post",
        body: formData,
        mode: "cors",
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) {
            //check if its a form error
            if (res?.formError) {
              toast.error("A Validation error has occured");
            } else {
              toast.error(res.data.message);
            }
            btn.classList.remove("is-loading");
          } else {
            toast.success(res.data.message);
            btn.classList.remove("is-loading");
            btn.setAttribute("disabled", "disabled");
            setTimeout( () => {
              navigate("/login")
            }, 3000)
          }
        })
        .catch((err) => {
          console.log(err);
          btn.classList.remove("is-loading");
        });
    } else {
      toast.error("A Validation error has occured");
    }
  };

  return (
    <main className="mt-5 p-20">
      {(showResetForm === true) ? (
        <>
          <section className="form-section has-shadow">
            <div className="has-text-centered mb-3">
              <img src="/navbar-icon.png" />
            </div>
            <div className="mb-3 mt-3">
              <p className="has-text-centered mb-3">
                Please reset your password
              </p>
            </div>

            <form id="form_reset" onSubmit={handlePasswordReset}>
              <div className="field">
                <label className="label">
                  Enter new password <span className="has-text-danger">*</span>
                </label>
                <p className="control has-icons-left has-icons-right">
                  <input
                    octavalidate="R"
                    id="inp_pass"
                    name="pass"
                    className="input"
                    type={passType} minLength={8}
                    placeholder="Enter new password"
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-asterisk"></i>
                  </span>
                </p>
              </div>
              <div className="field">
                <label className="label">
                  Re-enter password <span className="has-text-danger">*</span>
                </label>
                <p className="control has-icons-left has-icons-right">
                  <input equalto="inp_pass"
                    octavalidate="R"
                    id="inp_con_pass"
                    className="input"
                    type={passType} minLength={8}
                    placeholder="Re-enter password"
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-asterisk"></i>
                  </span>
                </p>
              </div>
              <div className="field">
                <label className="checkbox">
                  <input onChange={showHidePass} type="checkbox" /> show password
                </label>
              </div>
              <div className="field">
                <button
                  type="submit"
                  form="form_reset"
                  className="is-fullwidth button is-app-primary"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </section>
        </>
      ) : (
        <>
          <section className="form-section has-shadow">
            <div className="has-text-centered mb-3">
              <img src="/navbar-icon.png" />
            </div>
            <div className="mb-3 mt-3">
              <p className="has-text-centered mb-3">
                Reset your password
              </p>
              <p className="mb-4">
                We will email you instructions to reset your password
              </p>
            </div>

            <form id="form_reset" onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">
                  Enter your email <span className="has-text-danger">*</span>
                </label>
                <p className="control has-icons-left has-icons-right">
                  <input
                    octavalidate="R,EMAIL"
                    id="inp_email"
                    name="email"
                    className="input"
                    type="email"
                    placeholder="Email"
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope"></i>
                  </span>
                </p>
              </div>
              <div className="field">
                <button
                  type="submit"
                  form="form_reset"
                  className="is-fullwidth button is-app-primary"
                >
                  Send Link
                </button>
                <p className="mt-3"><a href="/login">Take me back to login</a></p>
              </div>
            </form>
          </section>
        </>
      )}
    </main>
  );
}
