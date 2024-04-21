import { Spinner } from "@nextui-org/spinner";
import Link from 'next/link';

export default function LoginForm({ formData, handleChange, handleSubmite, formErrors, isLoading,emailVerified,requestVerifyCode,mailSent }) {
    return (
        <>

            <div className="mt-20 flex justify-center items-center">
                <form className="max-w-sm mx-auto grow" >
                    <h2 className="font-semibold text-4xl mb-7">Login</h2>
                    <div className="mb-5 ">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input onChange={handleChange} name="email" value={formData.email} id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@mail.com" required />
                        {formErrors?.email && <p className="text-red-500 text-sm">{formErrors?.email}</p>}
                    </div>
                    <div className="mb-5 ">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password
                        </label>
                        <input value={formData.password} onChange={handleChange} name="password"
                            type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        {formErrors?.password && <p className="text-red-500 text-sm text-center">{formErrors?.password}</p>}
                    </div>

                    <Link href="/resetPassword" className="hover:text-blue-500	pb-5 flex justify-end">
                        <p>Reset Password</p>
                    </Link>

                    {formErrors?.serverError && <div className="text-center border bg-red-600 text-white rounded-lg mb-5 p-3"> {formErrors?.serverError}</div>}
                    <button disabled={isLoading} onClick={handleSubmite} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        {isLoading ? <Spinner color="white" size="sm" /> : 'Submit'}
                        </button>

                    {emailVerified ? <div className="mt-3 bg-red-400	 text-sm text-center p-5 border rounded-lg" >
                        <p className="">Please Check your mailbox to verify your account</p>

                       
                            <p className="mt-3">If you didn't receive a verification email, click <span onClick={requestVerifyCode}  className="font-bold cursor-pointer">here</span> and check your mail.</p>
                       
                        
                    </div> : null}  
                    {mailSent && <div className=" mt-3 bg-green-400 text-sm text-center p-5 border rounded-lg">We have sent you a mail please check your mail box</div>}

                </form>
            </div>

        </>
    );
}