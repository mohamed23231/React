import { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import ChangePasswordForm from '../components/auth/ChangePasswordForm';
const baseUrl = 'https://goride.e-diamond.pro/api';

 
/**
 * Schema for validating signup form data using Zod.
 */
const schema = z.object({
    old_password:z.string()
    .min(8),
    new_password: z.string()
    .min(8)
    .regex(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>ยง~])(?=.{8,})/,
        { message: 'Password must contain at least one lowercase letter, one uppercase letter, and one special character' }
    ),
    re_new_password: z.string()
    .transform((data) => {
        if (data.confirmPassword !== data.password) {
            throw new Error("Passwords don't match");
        }
        return data.confirmPassword;
    })

})

/**
 * Component for handling user signup.
 */
export default function Signup() {

    // State for form errors
    const [formErrors, setFormErrors] = useState({});
    // State for loading status
    const [isLoading, setIsLoading] = useState(false);
    // State for form data
    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        re_new_password: ""
    });

    /**
     * Logic for user signup.
     */
    const changePwLogic = async () => {
        try {
            const res = await axios.post(`${baseUrl}/auth/password/change/`, 
            formData,
            );

            console.log(res.data);
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
        e.preventDefault();
        setIsLoading(true); // Set loading to true when the button is clicked
        try {
            await schema.parseAsync(formData); // Validate the form data asynchronously
            await loginLogic(); // Perform signup logic
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
        <ChangePasswordForm
            handleChange={handleChange}
            handleSubmi={handleSubmite}
            formData={formData}
            formErrors={formErrors}
            isLoading={isLoading}
        />
    );
}
