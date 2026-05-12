import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { KeyRound, Loader } from "lucide-react";
import { forgotPassword } from "../../store/slices/authSlice";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { isRequestingForToken } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setError("Email is invalid");
      return;
    }

    setError("");

    try {
      await dispatch(forgotPassword(trimmedEmail)).unwrap();
      setEmail(trimmedEmail);
      setIsSubmitted(true);
    } catch (error) {
      setError(error || "Failed to send reset link. Please try again.");
    }
  };

  if (isSubmitted) {
    return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center">

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-800">
          Check Your Email
        </h1>

        {/* Subtitle */}
        <p className="text-slate-500 mt-2 text-sm">
          We've sent a password reset link to your email address.
        </p>

        {/* Info Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-6">
          <p className="text-slate-700 text-sm">
            If an account with{" "}
            <span className="font-semibold text-slate-900">
              {email}
            </span>{" "}
            exists, you will receive a password reset email shortly.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">

          {/* Primary Button */}
          <Link
            to="/login"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition duration-200"
          >
            Back to Login
          </Link>

          {/* Secondary Button */}
          <button
            onClick={() => {
              setIsSubmitted(false);
              setEmail("");
            }}
            className="w-full border border-slate-300 text-slate-700 hover:bg-slate-100 py-2.5 rounded-lg transition duration-200"
          >
            Send Another Email
          </button>
        </div>

      </div>
    </div>
    )
  }

  return <>
  <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div className="max-w-md w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
          <KeyRound className="w-8 h-8 text-white"/>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Forgot Password?</h1>
        <p className="text-slate-600 mt-2">Enter your email address and we'll send you a link to reset your password.</p>
      </div>

      {/* Forgot Password Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {
            error && (
              <div className="p-3 bg-red-50 border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )
          }

          {/* Email Address */}
          <div>
            <label className="label">Email Address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if(error) setError("");
                }}
                className={`input ${error ? "input-error" : ""}`}
                placeholder="Enter your email"
                disabled={isRequestingForToken}
                />
                {
                  error.email && (
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  )
                }
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={isRequestingForToken} className="w-full btn-primary
          disabled:opacity-50 disabled:cursor-not-allowed">
            {
              isRequestingForToken ? (
                <div className="flex justify-center items-center">
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Sending...
                </div>
              ) : (
                "Send Reset Link"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Remember your password? <Link to={"/login"} className="text-blue-600
            hover:text-blue-500 font-medium">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  </div>
  
  </>;
};

export default ForgotPasswordPage;
