import React, { useState } from 'react';
import { ArrowLeft, Check, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onBack: () => void;
  onSave: (updated: UserProfile) => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onBack,
  onSave,
  onLogout,
}) => {
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...user,
      firstName,
      lastName,
      email,
      phone,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onBack();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="max-w-md mx-auto w-full px-5 py-5 flex flex-col flex-1">
        {/* Header matching Informations.png */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Retour"
            id="profile-back-btn"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2]" />
          </button>
          <h1 className="text-base md:text-lg font-bold text-black text-center flex-1 pr-10">
            Vos Informations Personnelle
          </h1>
        </div>

        {/* Form with rounded inputs matching Informations.png */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
          {/* Prénom * */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-black">
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-black focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-hidden text-sm text-black font-medium transition-all"
              id="profile-firstname-input"
            />
          </div>

          {/* Nom * */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-black">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-black focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-hidden text-sm text-black font-medium transition-all"
              id="profile-lastname-input"
            />
          </div>

          {/* Adresse E-mail * */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-black">
              Adresse E-mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-black focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-hidden text-sm text-black font-medium transition-all"
              id="profile-email-input"
            />
          </div>

          {/* Numéro de Téléphone */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-black">
              Numéro de Téléphone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-black focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-hidden text-sm text-black font-medium transition-all"
              id="profile-phone-input"
            />
          </div>

          {/* Submit button matching Informations.png */}
          <div className="mt-auto pt-8 pb-4">
            <button
              type="submit"
              className={`w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 ${
                savedSuccess ? 'bg-emerald-600 hover:bg-emerald-600' : ''
              }`}
              id="profile-submit-btn"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-5 h-5" /> Modifications enregistrées !
                </>
              ) : (
                'Valider les modifications'
              )}
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-full mt-3 py-2.5 text-xs text-neutral-500 hover:text-red-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Se déconnecter de mon compte
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
