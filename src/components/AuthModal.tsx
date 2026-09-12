import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { UserProfile } from '../types';
import { login, register } from '../lib/api';

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email et mot de passe requis.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        if (!firstName.trim() || !lastName.trim()) {
          setError('Prénom et nom requis pour créer un compte.');
          setLoading(false);
          return;
        }
        const res = await register({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
        });
        onLoginSuccess(res.user as UserProfile);
      } else {
        const res = await login({ email: email.trim(), password });
        onLoginSuccess(res.user as UserProfile);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur d’authentification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-black transition-colors rounded-full"
          aria-label="Fermer"
          id="auth-close-btn"
        >
          <X className="w-5 h-5 stroke-[2]" />
        </button>

        <div className="text-center mt-2 mb-8 px-2">
          <h2 className="text-lg md:text-xl font-bold text-black leading-snug">
            {isRegister
              ? 'Créez votre compte Tout là'
              : 'Connectez-vous à votre compte Tout là'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Librairie & fournitures scolaires en ligne
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {isRegister && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  required={isRegister}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Prénom"
                  className="w-full text-sm py-2.5 border-b-2 border-neutral-800 focus:border-blue-600 outline-hidden placeholder:text-neutral-500 font-medium"
                />
              </div>
              <div>
                <input
                  type="text"
                  required={isRegister}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nom"
                  className="w-full text-sm py-2.5 border-b-2 border-neutral-800 focus:border-blue-600 outline-hidden placeholder:text-neutral-500 font-medium"
                />
              </div>
            </div>
          )}

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

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 font-medium">
              {error}
            </p>
          )}

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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer text-center mt-3"
            id="auth-submit-btn"
          >
            {loading ? 'Veuillez patienter...' : isRegister ? 'Créer mon compte' : 'Se connecter'}
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setIsRegister(!isRegister);
              }}
              className="text-xs text-black font-semibold underline hover:text-blue-600 transition-colors cursor-pointer"
              id="auth-toggle-mode-btn"
            >
              {isRegister
                ? 'Vous avez déjà un compte ? Se connecter'
                : "Vous n'avez pas de compte ? Créer un compte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
