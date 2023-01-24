import { useLocation } from "react-router-dom";

export default function Login() {
    const location = useLocation();
    //by default, redirect to the homepage of the dashboard
    let redirect = 'https://my-website.com/dashboard/home';
    //check if there's search param in the URL
    if (location.search) {
        //new search params
        const search = new URLSearchParams(location.search)
        //check if ?next is present in the search query
        if (search?.get('next')) {
            //decode it because the url will be encoded by the browser
            const next = decodeURIComponent(search.get('next'))
            //check if /dashboard is present in the URL
            if (next.match(new RegExp('/dashboard', 'i'))) {
                redirect = next;
            }
        }
    }

    //handle login form submission and use the code below to redirect users

    //window.location.href = redirect
}

/*

I implemented a feature today and I want to share it with you.

Let's assume that in your app, you have a page that needs authentication before a user will be able to access it, for example, the dashboard.

What If by any reason, the user logs out of the app, but needs to revisit that same page on the dashboard. How would you redirect this user?

Also, what if a user tries to visit an information on the dashboard by clicking on a link from the email sent to him?

If the user is not authenticated, he will be redirected back to /login right? and at this point, he has lost record of the link that he tried to visit.

How can I resolve this issue?

It's easy! 

Find a way to store the link, authenticate the user, and then redirect the user back to the link he tried to visit.

Here's a simple solution using query parameters.

Assuming an un-authenticated user tried to visit https://my-website.com/dashboard/home

He will be redirected to login and the link he tried to visit will be attached in the query parameter.

So he will be redirected to

https://my-website.com/home?next=https://my-website.com/dashboard/home

When he is authenticated successfully, he will then be redirected to 

https://my-website.com/dashboard/home

The code in the comments section shows the implementation and the video shows a site that uses this implementation
*/