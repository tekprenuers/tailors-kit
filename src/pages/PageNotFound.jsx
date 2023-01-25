import React from "react";
import { Helmet } from "react-helmet";

export default function PageNotFound() {
    return (
        <>
            <Helmet>
                <title>Page Not Found - TailorsKit</title>
                <meta property="og:title" content={"Page Not Found - TailorsKit"} />
                <meta name="description" content={"The page or resource you're looking for cannot be found"} />
            </Helmet>
            NEVER GOING TO BE FOUND
        </>
    )
}