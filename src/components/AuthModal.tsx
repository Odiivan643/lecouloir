import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  currentUser: UserProfile | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLoginSuccess,
  currentUser,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const user: UserProfile = {
      firstName: firstName.trim() || (isRegister ? 'Client' : 'Jean'),
      lastName: lastName.trim() || 'Kouassi',
      email: email.trim(),
      phone: phone.trim() || '+225 07 00 00 00 00',
    };

    onLoginSuccess(user);
  };

  const handleGoogleAuth = () => {
    const googleUser: UserProfile = {
      firstName: 'Ivan',
      lastName: 'Odi',
      email: 'ivanodi643@gmail.com',
      phone: '+225 01 02 03 04 05',
    };
    onLoginSuccess(googleUser);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-black transition-colors rounded-full"
          aria-label="Fermer"
          id="auth-close-btn"
        >
          <X className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Title matching Insciption et connexion.png */}
        <div className="text-center mt-2 mb-8 px-2">
          <h2 className="text-lg md:text-xl font-bold text-black leading-snug">
            {isRegister
              ? 'Créez votre compte LeCouloir'
              : 'Connectez-vous à votre compte LeCouloir'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Librairie & fournitures scolaires en ligne
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {isRegister && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Prénom"
                  className="w-full text-sm py-2.5 border-b-2 border-neutral-800 focus:border-blue-600 outline-hidden placeholder:text-neutral-500 font-medium"
                />
              </div>
              <div>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nom"
                  className="w-full text-sm py-2.5 border-b-2 border-neutral-800 focus:border-blue-600 outline-hidden placeholder:text-neutral-500 font-medium"
                />
              </div>
            </div>
          )}

          {/* Email input */}
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse E-mail"
              className="w-full text-sm py-2.5 border-b-2 border-neutral-800 focus:border-blue-600 outline-hidden placeholder:text-neutral-500 font-medium"
              id="auth-email-input"
            />
          </div>

          {isRegister && (
            <div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Numéro de Téléphone"
                className="w-full text-sm py-2.5 border-b-2 border-neutral-800 focus:border-blue-600 outline-hidden placeholder:text-neutral-500 font-medium"
              />
            </div>
          )}

          {/* Password input with toggle eye */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full text-sm py-2.5 pr-9 border-b-2 border-neutral-800 focus:border-blue-600 outline-hidden placeholder:text-neutral-500 font-medium"
              id="auth-password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-2.5 text-neutral-700 hover:text-black cursor-pointer"
              aria-label="Afficher/Masquer le mot de passe"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 stroke-[1.8]" />
              ) : (
                <Eye className="w-5 h-5 stroke-[1.8]" />
              )}
            </button>
          </div>

          {/* Forgot Password link */}
          {!isRegister && (
            <div className="flex justify-between items-center text-xs text-neutral-600 pt-1">
              <span>Mot de passe oublié ?</span>
              <button
                type="button"
                onClick={() => {
                  setForgotSent(true);
                  setTimeout(() => setForgotSent(false), 3000);
                }}
                className="text-neutral-600 hover:text-blue-600 font-medium underline cursor-pointer"
              >
                {forgotSent ? 'Email envoyé !' : 'Réinitialiser'}
              </button>
            </div>
          )}

          {/* Solid Blue Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer text-center mt-3"
            id="auth-submit-btn"
          >
            {isRegister ? 'Créer mon compte' : 'Se connecter'}
          </button>

          {/* Switch mode link */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-black font-semibold underline hover:text-blue-600 transition-colors cursor-pointer"
              id="auth-toggle-mode-btn"
            >
              {isRegister
                ? 'Vous avez déjà un compte ? Se connecter'
                : "Vous n'avez pas de compte ? Créer un compte"}
            </button>
          </div>

          {/* S'inscrire avec Google button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-3 px-4 bg-[#e3e3e3] hover:bg-[#d8d8d8] text-black font-bold text-xs md:text-sm rounded-2xl flex items-center justify-center gap-3 transition-colors cursor-pointer"
              id="auth-google-btn"
            >
              {/* Google multi-color G logo */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.24 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.98 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.24 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>S'inscrire avec Google</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
