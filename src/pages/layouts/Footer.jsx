import React from "react";

export default function Footer() {
  return (
    <footer className="section">
      <div className="container">
        <div
          className="columns is-multiline"
          style={{borderBottom: "1px solid #dee2e6"}}
        >
          <div className="column is-5 mb-5">
            <a className="mb-4 is-inline-block" href="./">
              <img className="image" src="/navbar-icon.png" alt="Tailors Kit" />
            </a>
            <p className="has-text-grey-dark mb-6">
            Tailor's kit is a large database & productivity software that helps Tailors to save, manage, access client's data, and track client's requests from anywhere and at anytime with ease.
            </p>
            <div>
              <a className="mr-3 is-inline-block" target={"_blank"} href="https://facebook.com/tailorskitsoftware">
                <i className="mx-auto image is-fullwidth fab fa-facebook-f"></i>
              </a>
              {/* <a className="mr-3 is-inline-block" href="#">
                <i className="mx-auto image is-fullwidth fab fa-twitter"></i>
              </a> */}
              <a className="mr-3 is-inline-block" target={"_blank"} href="https://instagram.com/tailors_kit">
                <i className="mx-auto image is-fullwidth fab fa-instagram"></i>
              </a>
            </div>
          </div>
          <div className="column is-7">
            <div className="columns is-multiline is-justify-content-end">
              <div className="column is-6 is-6-desktop mb-5">
                <h4 className="is-size-4 has-text-weight-bold mb-4">Quick Links</h4>
                <ul>
                  {/* <li className="mb-2">
                    <a className="" href="#">
                      About Us
                    </a>
                  </li>                   <li className="mb-2">
                    <a className="" href="#">
                      Terms
                    </a>
                  </li>
                  <li className="mb-2">
                    <a className="" href="#">
                      Team
                    </a>
                  </li>*/}
                  <li>
                    <a className="" href="/privacy">
                      Privacy
                    </a>
                  </li>
                </ul>
              </div>
              {/* <div className="column is-6 is-6-desktop mb-5">
                <h4 className="is-size-4 has-text-weight-bold mb-4">Pages</h4>
                <ul>
                  <li className="mb-2">
                    <a className="" href="#">
                      Login
                    </a>
                  </li>
                  <li className="mb-2">
                    <a className="" href="#">
                      Register
                    </a>
                  </li>
                  <li>
                    <a className="" href="#">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a className="" href="#">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>
        </div>
        <div className="pt-5 has-text-centered">
          <p>All rights reserved © Tailors Kit 2023</p>
        </div>
      </div>
    </footer>
  );
}
