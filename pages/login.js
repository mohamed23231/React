import { useEffect, useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { useRouter } from 'next/router';

const baseUrl='https://goride.e-diamond.pro/api';
import LoginForm from '../components/auth/LoginForm';

/**
 * Schema for validating login form data using Zod.
 */
const schema = z.object({
    email: z.string().email(),
    password: z.string()
        .min(8)
        .regex(
            /(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>ยง~])(?=.{8,})/,
            { message: 'Password must contain at least one lowercase letter, one uppercase letter, and one special character' }
        )
});

/**
 * Component for handling user login.
 */
export default function Login() {
    const [emailVerified,setEmailVerified]=useState(true)
    const router = useRouter();
    // const [ssLoggedIn,setIsLoggedIn]=useState('false')
    // State for form errors
    const [formErrors, setFormErrors] = useState({});
    // State for loading status
    const [isLoading, setIsLoading] = useState(false);
    // State for form data
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    // Redirect to profile page if user is already logged in
    useEffect(() => {
        if (localStorage.getItem('loggedUserP')) {
            router.push('/profile');
        }
    }, []);

    /**
     * Logic for user login.
     */
    const loginLogic = async () => {
        try {
            const res = await axios.post(`${baseUrl}/auth/login/`, {
                ...formData,
            });
            console.log(res)
            if(!res.data.email_verified){
                setEmailVerified(false)
            } else if (res.data.email_verified && !res.data.profile_completed) {
                const token = res.data.token;
                localStorage.setItem('loggedUserP', token);
                router.push('/profile');

            }else if (res.data.email_verified && res.data.profile_completed) {
                const token = res.data.token;
                localStorage.setItem('loggedUserP', token);
                router.push('/');
        
            }
            console.log(token);
        } catch (error) {
            console.log('hello from login error',error)

            if (error?.response) {
                setFormErrors({ ...formErrors, serverError: error.response.data.message });
            }
        }
    };


    /**
     * Handler for form submission.
     * @param {Event} e - Form submit event.
     */
    const handleSubmite = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading to true when the button is clicked
        try {
            await schema.parseAsync(formData); // Validate the form data asynchronously
            await loginLogic(); // Perform login logic
        } catch (error) {
            if (error.errors && error.errors.length > 0) {
                const errors = {};
                error.errors.forEach(err => {
                    errors[err.path[0]] = err.message;
                });
                setFormErrors(errors);
            }
        } finally {
            setIsLoading(false); // Set loading to false after login logic completes
        }
    };

    const  requestVerifyCode= async()=>{
        try {
            const resVerify = await axios.post(`${baseUrl}/auth/email/request-verify/`, {
                email:formData?.email,
            });
        } catch (error) {
            
        }
    }
    /**
     * Handler for input changes.
     * @param {Event} e - Input change event.
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: undefined, serverError: undefined });
    };

    // Render the LoginForm component with props
    return (
        <LoginForm
            handleChange={handleChange}
            handleSubmite={handleSubmite}
            formData={formData}
            formErrors={formErrors}
            isLoading={isLoading}
            emailVerified={emailVerified}
            requestVerifyCode={requestVerifyCode}
        />
    );
}
