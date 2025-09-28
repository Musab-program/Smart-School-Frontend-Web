'use client';

import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa"; // لاستخدام أيقونة جذابة

/**
 * Interface for the props of the ErrorPage component.
 * @interface ErrorPageProps
 * @property {Error} error - The error object that was thrown.
 * @property {() => void} reset - A function to reset the error boundary.
 */
interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

/**
 * A custom error page component to be used with Next.js App Router error boundaries.
 * This component displays a user-friendly error message and provides options to
 * retry or navigate back to the home page.
 * @param {ErrorPageProps} props - The props for the component.
 * @returns {JSX.Element} The JSX for the error page.
 */
const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-lg w-full text-center border border-gray-200 transform transition-all duration-300 hover:scale-105">
        
        {/* Error icon */}
        <div className="text-red-500 mb-6 flex justify-center">
          <FaExclamationTriangle size={70} />
        </div>

        {/* Error title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
          Oops! Something went wrong.
        </h1>

        {/* User-friendly message */}
        <p className="text-gray-600 mb-4 text-lg">We&apos;re sorry, but an unexpected error has occurred.</p>
        
        {/* Error message */}
        <p className="text-red-500 font-medium mb-6 px-4 py-2 bg-red-50 rounded-lg border border-red-200 text-sm break-all">
          Error Message: {error.message}
        </p>

        {/* Retry button */}
        <button
          onClick={() => reset()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg mb-4"
        >
          Try again
        </button>

        {/* Link to home page */}
        <Link href="/" passHref>
          <button className="w-full bg-transparent hover:bg-gray-100 text-blue-600 font-semibold py-3 px-6 rounded-full transition-all duration-300 border border-blue-600 hover:border-blue-700">
            Go to home page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;