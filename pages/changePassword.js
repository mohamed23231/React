import { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import ChangePasswordForm from '../components/auth/ChangePasswordForm';

 
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
    // State for form data
    const [formData, setFormData] = useState({
        email: "",
    });

    /**
     * Logic for user signup.
     */
    const changePwLogic = async () => {
        try {
            const res = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signup', 
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
