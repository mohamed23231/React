import { useEffect, useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { useRouter } from 'next/router';
import LoginForm from '../components/auth/LoginForm';

const baseUrl = 'https://goride.e-diamond.pro/api';

const schema = z.object({
    email: z.string().email(),
    password: z.string()
        .min(8)
        .regex(
            /(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>ยง~])(?=.{8,})/,
            { message: 'Password must contain at least one lowercase letter, one uppercase letter, and one special character' }
        )
});

const Login = () => {
    const [emailVerified, setEmailVerified] = useState(false);
    const [mailSent, setMailSent] = useState(false);
    const router = useRouter();
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const tokenExpiration = localStorage.getItem('tokenExpiration');
        
        if (accessToken && tokenExpiration) {
            const expirationTime = parseInt(tokenExpiration);
            const currentTime = Date.now();
            
            if (currentTime < expirationTime) {
                router.push('/profile');
            }
        }
    }, []);
    
    const loginLogic = async () => {
        try {
            const res = await axios.post(`${baseUrl}/auth/login/`, {
                ...formData,
            });
    
            if (!res.data.email_verified) {
                setEmailVerified(true);
                const { access, refresh } = res.data.tokens;
                const expirationTime = new Date(Date.now() + 30 * 60 * 1000); // Current time + 30 minutes
                localStorage.setItem('accessToken', access);
                localStorage.setItem('refreshToken', refresh);
                localStorage.setItem('tokenExpiration', expirationTime.getTime()); // Save expiration time
            } else if (res.data.email_verified && !res.data.profile_completed) {
                const { access, refresh } = res.data.tokens;
                const expirationTime = new Date(Date.now() + 30 * 60 * 1000); // Current time + 30 minutes
                localStorage.setItem('accessToken', access);
                localStorage.setItem('refreshToken', refresh);
                localStorage.setItem('tokenExpiration', expirationTime.getTime()); // Save expiration time
                router.push('/profile');
            } else if (res.data.email_verified && res.data.profile_completed) {
                const { access, refresh } = res.data.tokens;
                const expirationTime = new Date(Date.now() + 30 * 60 * 1000); // Current time + 30 minutes
                localStorage.setItem('accessToken', access);
                localStorage.setItem('refreshToken', refresh);
                localStorage.setItem('tokenExpiration', expirationTime.getTime()); // Save expiration time
                router.push('/');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setFormErrors({ ...formErrors, serverError: 'Invalid email or password' });
            } else if (error?.response) {
                setFormErrors({ ...formErrors, serverError: error.response.data.message });
            }
        }
    };
        

    const handleSubmite = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await schema.parseAsync(formData);
            await loginLogic();
        } catch (error) {
            console.error('Error during form submission:', error);
            if (error.errors && error.errors.length > 0) {
                const errors = {};
                error.errors.forEach(err => {
                    errors[err.path[0]] = err.message;
                });
                setFormErrors(errors);
            } else if (error?.response) {
                setFormErrors({ ...formErrors, serverError: error.response.data.message });
            }
        } finally {
            setIsLoading(false);
        }
    };
    

    const requestVerifyCode = async () => {
        try {
            const resVerify = await axios.post(`${baseUrl}/auth/email/request-verify/`, {
                email: formData?.email,
            });
            if (resVerify.data.success) {
                setEmailVerified(false);
                setMailSent(true);
            }
        } catch (error) {
            // Handle error
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: undefined, serverError: undefined });
    };

    return (
        <LoginForm
            handleChange={handleChange}
            handleSubmite={handleSubmite}
            formData={formData}
            formErrors={formErrors}
            isLoading={isLoading}
            emailVerified={emailVerified}
            requestVerifyCode={requestVerifyCode}
            mailSent={mailSent}
        />
    );
};

export default Login;
