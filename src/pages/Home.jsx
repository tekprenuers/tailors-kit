import React from 'react'
import { Helmet } from 'react-helmet'

function Home() {

    return (
        <>
            <Helmet>
                <title>TailorsKit</title>
            </Helmet>
            <section className="hero is-medium">
                <div className="hero-body">
                    <div className="container m-0" style={{ top: '30%' }}>
                        <h1 className="title is-1 has-text-dark">Welcome To Tailors Kit</h1>
                        <p className="subtitle fonts-pacifico mb-3 has-text-white">The Largest Database & Best Productivity Software For Tailors In Nigeria</p>
                        <a href={'/login'} className='button is-dark has-text-app-primary is-medium fw-normal'>Join us now</a>
                    </div>
                </div>
            </section>
            <section className='p-50 bg-app-primary'>
                <div className='columns'>
                    <div className='column is-half is-align-self-center'>
                        <h2 className='title is-3 has-text-centered'>What is <span className='text-with-image'><img src="/navbar-icon.png" /> </span></h2>
                    </div>
                    <div className='column is-half'>
                        <article>
                            <p className='m-0 is-bold'>Tailor's kit is a large database & productivity software that helps Tailors to save, manage, access client's data, and track client's orders from anywhere and at anytime with ease.</p>
                        </article>
                    </div>
                </div>
            </section>
            <section className='p-50'>
                <h3 className='title is-3 has-text-centered'>WHAT WE HELP YOU MANAGE</h3>
                <div className='columns is-flex-direction-row-reverse mt-5 mb-5'>
                    <div className='column is-half has-text-centered is-align-self-centered'>
                        <img src="/client-data.svg" width="400px" />
                    </div>
                    <div className='column is-half is-align-self-center'>
                        <h3 className='title is-4 col-title'>CLIENT DATA</h3>
                        <h5 className='subtitle mb-3'>We help you store & manage your client's profile.</h5>
                        <article className='is-bold'>
                            <p>Data such as the client's name, gender, phone number, state of origin, Home address etc. are all saved to the cloud and can be managed easily with TailorsKit.</p>
                        </article>
                    </div>
                </div>
                <div className='columns mb-5 has-bg-app-light'>
                    <div className='column is-half has-text-centered is-align-self-centered'>
                        <img src="/measure-amico.svg" width="400px" />
                    </div>
                    <div className='column is-half is-align-self-center'>
                        <h3 className='title is-4 col-title'>CLIENT MEASUREMENTS</h3>
                        <h5 className='subtitle mb-3'>Configure your measurements and use it!</h5>
                        <article className='is-bold'>
                            <p className='mb-2'>Measurements have never been any easier.</p>
                            <p>With TailorsKit, you can create and save measurement data for both males and females, and then use this data to update the measurement of a client.</p>
                        </article>
                    </div>
                </div>
                <div className='columns is-flex-direction-row-reverse'>
                    <div className='column is-half has-text-centered is-align-self-centered'>
                        <img src="/people-collaborating.svg" width="400px" />
                    </div>
                    <div className='column is-half is-align-self-center'>
                        <h3 className='title is-4 col-title'>CLIENT ORDERS</h3>
                        <h5 className='subtitle mb-3'>Keep track of client's orders & build your own catalogue!</h5>
                        <article className='is-bold'>
                        <p className='mb-2'>What does the client want you to sew for him?</p>
                            <p className='mb-2'>With TailorsKit, you can manage & keep track of all client orders and in order to make you efficient, each order has its deadline. When an order is completed, it is ready to show up on your personal catalogue.</p>
                            <p>Let your works speak for itself!</p>
                        </article>
                    </div>
                </div>
            </section>
            <section className='bg-app-primary p-50'>
            <div className='columns'>
                    <div className='column is-half has-text-centered is-align-self-centered'>
                    <img src='/high-five.svg' width={"300px"} />
                    </div>
                    <div className='column is-half is-align-self-center'>
                        <h3 className='title is-3'>ARE YOU READY TO JOIN US?</h3>
                        <h5 className='subtitle mb-3'>Become a member today!</h5>
                        <article className='is-bold'>
                            <p className='mb-3'>Join us now and get access to all features starting with a <span className='col-title'>14 days</span> free trial.</p>
                            {/* <p className='mb-3'>Joing the waiting list today and get access to all features starting with a <span className='col-title'>21 days free trial.</span></p> */}
                            <div className='buttons'>
                                <a href={'/login'} className='button is-dark fw-normal'>Join us now</a>
                                <button type='button' className='button is-dark is-outlined fw-normal pwaAppInstallBtn'>Install TailorsKit</button>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home