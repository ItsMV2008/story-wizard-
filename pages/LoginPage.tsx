import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { isTempMail } from '../services/authService';
import { useLocalization } from '../contexts/LocalizationContext';

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className={`${theme} font-sans`}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="flex items-center gap-3 mb-8">
                <BookIcon className="h-10 w-10 text-primary-500" />
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">StoryWizard</h1>
            </div>
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                {isSignIn ? <SignInForm setIsSignIn={setIsSignIn} /> : <SignUpForm setIsSignIn={setIsSignIn} />}
            </div>
        </div>
    </div>
  );
};

interface FormProps {
    setIsSignIn: (isSignIn: boolean) => void;
}

const SignInForm: React.FC<FormProps> = ({ setIsSignIn }) => {
    const { login, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { t } = useLocalization();

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            login({ email, password });
        }
    };
    
    // Simulate social login by creating a dummy user
    const handleSocialLogin = (provider: string) => {
        login({ email: `${provider.toLowerCase()}-${Date.now()}@example.com`, password: "social-login-password-placeholder" });
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">{t('sign_in_to_account')}</h2>
            <form onSubmit={handleSignIn} className="space-y-4">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('email_address')} className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('password')} className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none" required />
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button type="submit" className="w-full py-3 bg-primary-600 text-white font-bold rounded hover:bg-primary-700 transition-colors">{t('sign_in')}</button>
            </form>
            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">{t('or_continue_with')}</span>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                    <SocialButton onClick={() => handleSocialLogin('Google')}><GoogleIcon/></SocialButton>
                    <SocialButton onClick={() => handleSocialLogin('Facebook')}><FacebookIcon/></SocialButton>
                    <SocialButton onClick={() => handleSocialLogin('Apple')}><AppleIcon/></SocialButton>
                </div>
            </div>
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                {t('dont_have_account')}{' '}
                <button onClick={() => setIsSignIn(false)} className="font-medium text-primary-600 hover:underline">{t('sign_up')}</button>
            </p>
        </div>
    )
}

const SignUpForm: React.FC<FormProps> = ({ setIsSignIn }) => {
    const { signup, error: authError } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState('');
    const { t } = useLocalization();

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (isTempMail(email)) {
            setFormError(t('temp_mail_error'));
            return;
        }
        if (password !== confirmPassword) {
            setFormError(t('password_mismatch'));
            return;
        }
        signup({ email, name, password });
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">{t('create_an_account')}</h2>
            <form onSubmit={handleSignUp} className="space-y-4">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t('name_optional')} className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('email_address')} className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('password')} className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none" required />
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder={t('confirm_password')} className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none" required />
                {(formError || authError) && <p className="text-red-500 text-sm text-center">{formError || authError}</p>}
                <button type="submit" className="w-full py-3 bg-primary-600 text-white font-bold rounded hover:bg-primary-700 transition-colors">{t('sign_up')}</button>
            </form>
             <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                {t('already_have_account')}{' '}
                <button onClick={() => setIsSignIn(true)} className="font-medium text-primary-600 hover:underline">{t('sign_in')}</button>
            </p>
        </div>
    );
};

const SocialButton: React.FC<{children: React.ReactNode, onClick: () => void}> = ({ children, onClick }) => (
    <button onClick={onClick} className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
        {children}
    </button>
)

// Icons
const BookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
);
const GoogleIcon = () => (<svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 74.2C313.6 119.3 283.5 104 248 104c-88.8 0-160.1 72.1-160.1 161.5s71.3 161.5 160.1 161.5c37.2 0 71.2-12.2 98.6-32.9l77.6 77.6C397.6 480.2 328.7 504 248 504z"></path></svg>);
const FacebookIcon = () => (<svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>);
const AppleIcon = () => (<svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C39.2 141.6 0 184.8 0 249.4c0 37.3 18.6 92.8 68.5 128.4-33.1 42.8-47.8 82.4-47.8 114.2 0 10.7 1.9 21.2 5.3 31.4 2.6 7.8 6.5 14.8 11.2 21.5 8.6 12.2 19.8 23.4 33.6 32.7 20.2 13.5 44.1 20.7 65.6 20.7 26.8 0 50.2-8.3 69.4-20.7 20.2-13.4 32.7-30.9 43.1-52.6 10.9-22.8 14.8-50.9 14.8-76.4 0-23.7-5.3-48.4-15.4-69.4zM240.2 84c12.2-16.2 24.7-40.3 24.7-57.8 0-16.2-8.3-32.4-24.7-32.4-12.2 0-24.7 16.2-24.7 32.4 0 16.2 8.3 32.4 24.7 57.8z"></path></svg>);


export default LoginPage;