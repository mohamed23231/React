import { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
const baseUrl = 'https://goride.e-diamond.pro/api';


/**
 * Schema for validating signup form data using Zod.
 */
const schema = z.object({
    email: z.string().email(),
});

/**
 * Component for handling user signup.
 */
export default function Signup() {

    // State for form errors
    const [formErrors, setFormErrors] = useState({});
    // State for loading status
    const [isLoading, setIsLoading] = useState(false);

    const [mailSent, setMailSent] = useState(false)
    // State for form data
    const [formData, setFormData] = useState({
        email: "",
    });

    /**
     * Logic for user signup.
     */
    const resetPwLogic = async () => {
        try {
            const res = await axios.post(`${baseUrl}/auth/password/request-reset/`, formData);
            if (res.data.success) {
                console.log('hello')
                setMailSent(true);
            }
        } catch (error) {
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
        console.log('clicked sub')
        e.preventDefault();
        setIsLoading(true); // Set loading to true when the button is clicked
        try {
            await schema.parseAsync(formData); // Validate the form data asynchronously
            await resetPwLogic(); // Perform signup logic
        } catch (error) {
            if (error.errors && error.errors.length > 0) {
                const errors = {};
                error.errors.forEach(err => {
                    errors[err.path[0]] = err.message;
                });
                setFormErrors(errors);
            }
        } finally {
            setIsLoading(false); // Set loading to false after signup logic completes
        }
    };

    /**
     * Handler for input changes.
     * @param {Event} e - Input change event.
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: undefined, serverError: undefined });
    };

    // Render the SignupForm component with props
    return (
        <ResetPasswordForm
            handleChange={handleChange}
            handleSubmite={handleSubmite}
            formData={formData}
            formErrors={formErrors}
            isLoading={isLoading}
            mailSent={mailSent}
        />
    );
}
