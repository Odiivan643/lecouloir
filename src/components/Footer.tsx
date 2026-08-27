import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <>
      <footer className="w-full bg-black text-white pt-8 pb-7 px-5 mt-10 transition-all">
        <div className="max-w-md md:max-w-4xl mx-auto flex flex-col gap-6">
          <div className="flex flex-row justify-between items-start">
            {/* Service Client Info */}
            <div className="flex flex-col gap-2.5 text-xs text-neutral-300">
              <span className="font-semibold text-sm text-white">Service client :</span>
              <p className="text-neutral-400">Heures de service : 8h30-18h Du lundi au vendredi</p>
              <p className="text-neutral-300">
                WhatsApp :{' '}
                <a
                  href="https://wa.me/2250102030405"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 underline transition-colors"
                >
                  +225 01 02 03 04 05
                </a>
              </p>
              <p className="text-neutral-300">
                Courriel :{' '}
                <a
                  href="mailto:contact@lecouloir.ci"
                  className="hover:text-blue-400 underline transition-colors"
                >
                  contact@lecouloir.ci
                </a>
              </p>
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="text-neutral-400 underline hover:text-white transition-colors text-left pt-1 cursor-pointer w-fit"
                id="footer-privacy-link"
              >
                Politique de confidentialité
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Facebook Icon */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Page Facebook LeCouloir"
                className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* TikTok Icon */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compte TikTok LeCouloir"
                className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01v8.66c0 1.94-.48 3.92-1.57 5.51-1.12 1.6-2.78 2.76-4.68 3.23-1.9.48-3.95.27-5.74-.59-1.78-.85-3.26-2.34-4.07-4.14-.8-1.79-.88-3.86-.24-5.74.64-1.87 2-3.44 3.76-4.32 1.76-.87 3.82-1.01 5.76-.39.01 1.44.01 2.89 0 4.33-1.06-.39-2.25-.42-3.32-.08-1.07.34-1.98 1.13-2.47 2.14-.49 1.01-.5 2.21-.03 3.23.47 1.02 1.39 1.81 2.47 2.15 1.08.34 2.28.18 3.25-.44.97-.62 1.58-1.69 1.66-2.84.05-2.82.01-5.64.02-8.47.01-4.94.01-9.87.01-14.81z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Copyright line */}
          <div className="text-center pt-4 border-t border-neutral-800 text-xs text-neutral-400 font-medium">
            ©2026 LeCouloir Copyright.
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-black rounded-2xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-black mb-3">Politique de Confidentialité - LeCouloir</h3>
            <div className="text-sm text-neutral-700 space-y-3 leading-relaxed">
              <p>
                Chez <strong>LeCouloir</strong>, la protection de vos données personnelles est une priorité absolue.
              </p>
              <p>
                <strong>1. Données collectées :</strong> Nous collectons uniquement les informations nécessaires au traitement de vos commandes (Nom, prénom, numéro de téléphone, adresse de livraison, email).
              </p>
              <p>
                <strong>2. Utilisation :</strong> Ces données servent exclusivement à la livraison de vos fournitures scolaires, au suivi de commande et à l'assistance client.
              </p>
              <p>
                <strong>3. Sécurité :</strong> Aucune donnée n'est vendue ni cédée à des tiers. Les transactions financières sont sécurisées.
              </p>
            </div>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
};
