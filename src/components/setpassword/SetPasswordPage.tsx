import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, ShieldCheck, Loader2, XCircle, AlertCircle, CheckCircle } from 'lucide-react';
import illustration from '../../assets/Verify-Illustration.jpg';
import Spinner from '../ui/Spinner';

const SetPasswordPage = () => {
    const navigate = useNavigate();
    const { slug: urlSlug } = useParams();

    // States for Security and UI
    const [slug, setSlug] = useState("");
    const accessToken = sessionStorage.getItem("access_token") || "";
    const [loading, setLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });

    useEffect(() => {
        const activeSlug = urlSlug || sessionStorage.getItem("reset_slug");

        if (activeSlug) {
            setSlug(activeSlug);
            sessionStorage.setItem("reset_slug", activeSlug);

            if (urlSlug) {
                const cleanPath = window.location.pathname.replace(urlSlug, "").replace(/\/$/, "");
                window.history.replaceState(null, '', `${cleanPath}/`);
            }

            setIsValidating(false);
        } else {
            navigate('/login', { replace: true });
        }
    }, [urlSlug, navigate]);

    const ScheduleRoom = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/verify-email-reset-password/${slug}/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                alert("Password updated successfully. Please log in with your new password.");
                sessionStorage.removeItem("reset_slug");
                navigate('/login', { replace: true });
                console.log("Successfully👍:", data);
            } else {
                throw new Error(`Error: ${JSON.stringify(data)}`);
            }
        } catch (error) {
            console.error("Error scheduling :", error);
        }
        finally {
            setLoading(false);
        }
    }

   const isMatch = formData.confirm_password.length > 0 && formData.new_password === formData.confirm_password;
    
    // Password Validation Rules: Updated for 8-12 character range
    const hasRequiredLength = formData.new_password.length >= 8 && formData.new_password.length <= 12;
    const hasCapital = /[A-Z]/.test(formData.new_password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.new_password);
    const isPasswordValid = hasRequiredLength && hasCapital && hasSpecial;

    const isFormValid = formData.old_password.length > 0 && isPasswordValid && isMatch;

    // Helper for validation badges with increased visibility
    const ValidationBadge = ({ label, isValid }) => (
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-300 ${isValid ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
            {isValid ? <CheckCircle size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border-2 border-slate-400" />}
            {label}
        </div>
    );

    const inputBase = "block w-full px-4 py-4 text-sm font-light text-slate-900 bg-transparent border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 peer transition-all duration-200 font-['Inter']";
    const labelBase = "absolute text-sm font-semibold text-slate-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus: peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 pointer-events-none transition-all";
    
    return (
        <div className="h-screen w-screen flex items-center justify-center p-4 font-['Inter'] overflow-hidden bg-[#fcfdfe]">
            {/* Box shadow increased: using a multi-layered shadow for deeper visibility on all sides (xl + 2xl mix) */}
            <div className="max-w-6xl w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1),0_10px_30px_rgba(0,0,0,0.08),0_-5px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex overflow-hidden h-[600px]">

                {/* Left Side: Fixed Illustration - HIDDEN ON MOBILE */}
                <div className="hidden md:flex w-[40%] lg:w-[55%] flex-col items-center justify-center p-16 border-r border-slate-50 bg-[#f8fafc]">
                    <div className="text-center w-full h-full flex items-center justify-center">
                        <div className="relative inline-block w-full">
                            <img
                                src={illustration}
                                alt="Security Illustration"
                                className="w-full max-w-[480px] h-auto object-contain scale-110"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side: Form - CENTERED ON MOBILE */}
                <div className="flex-1 p-6 sm:p-10 lg:p-24 flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">Update Password</h2>
                    </div>

                    <form className="space-y-6" onSubmit={ScheduleRoom}>
                        {/* Old/Temporary Password */}
                        <div className="relative">
                            <input
                                type="password"
                                id="old"
                                className={inputBase}
                                placeholder=" "
                                autoComplete="off"
                                onChange={(e) => setFormData({ ...formData, old_password: e.target.value })}
                                required
                            />
                            <label htmlFor="old" className={labelBase}>Old Password </label>
                        </div>

                        {/* New Password with 8-12 character limit */}
                        <div className="space-y-3">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="new"
                                    maxLength={12}
                                    className={inputBase}
                                    placeholder=" "
                                    value={formData.new_password}
                                    onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                                    required
                                />
                                <label htmlFor="new" className={labelBase}>New Password</label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            
                            {/* Password Complexity Badges */}
                            <div className="flex flex-wrap gap-2">
                                <ValidationBadge label="8-12 Characters" isValid={hasRequiredLength} />
                                <ValidationBadge label="1 Capital Letter" isValid={hasCapital} />
                                <ValidationBadge label="1 Special Character" isValid={hasSpecial} />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <input
                                type="password"
                                id="confirm"
                                maxLength={12}
                                className={`${inputBase} ${formData.confirm_password && !isMatch ? 'border-red-400 focus:border-red-500 focus:ring-red-500/5' : ''}`}
                                placeholder=" "
                                value={formData.confirm_password}
                                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                required
                            />
                            <label htmlFor="confirm" className={labelBase}>Confirm New Password</label>
                            
                            {formData.confirm_password.length > 0 && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-sm font-bold animate-in fade-in zoom-in duration-300">
                                    {isMatch ? (
                                        <div className="flex items-center gap-1.5 text-emerald-600">
                                            <ShieldCheck size={20} strokeWidth={2.5} /> <span>Matched</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-rose-500">
                                            <AlertCircle size={20} strokeWidth={2.5} /> <span>Mismatch</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !isFormValid}
                            className="w-full sm:w-3/4 mx-auto bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-3xl transition-all shadow-lg shadow-blue-500/20 mt-4 active:scale-[0.98] text-lg flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Spinner />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SetPasswordPage;