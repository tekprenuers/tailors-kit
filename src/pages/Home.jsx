import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

function Home() {

    return (
        <>
            <Helmet>
                <title>TailorsKit</title>
                <meta property="og:title" content={"TailorsKit"} />
                <meta name="description" content={"Save, access & manage your clients data on your Tailors Kit. Become a member Now!"} />
            </Helmet>
            <section className="hero is-medium">
                <div className="hero-body">
                    <div className="container has-text-centered" style={{ top: '30%' }}>
                        <h1 className="title is-1 has-text-light">Welcome To Tailors Kit</h1>
                        <p className="subtitle has-text-light fonts-pacifico">Save A Client's Data With Ease</p>
                        <button className='button is-app-primary'>Get Started</button>
                    </div>
                </div>
            </section>
            <section className='p-50 section-app-primary'>

                <div className='columns'>
                    <div className='column is-half is-align-self-center'>
                        <h2 className='title is-3 has-text-centered'>What is <span className='text-with-image'><img src="/navbar-icon.png" /> </span></h2>
                    </div>
                    <div className='column is-half'>
                        <article>
                            <p className='m-0 is-bold'>Tailor's kit is a platform that helps Tailors to document a Clients Data with ease. This platform will help Tailors to access Clients Data from anywhere and at anytime with ease.</p>
                        </article>
                    </div>
                </div>
            </section>
        </>

    )
}

export default Home