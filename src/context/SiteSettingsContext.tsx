import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { adminApi } from '../services/adminApi';

interface SiteSettingsContextType {
  logoUrl: string;
  siteName: string;
  phoneNumber: string;
  contactEmail: string;
  enableChat: boolean;
  refreshSettings: () => Promise<void>;
  setLogoUrl: (url: string) => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [siteName, setSiteName] = useState<string>('Valora Healthcare');
  const [phoneNumber, setPhoneNumber] = useState<string>('+1 (800) 555-0199');
  const [contactEmail, setContactEmail] = useState<string>('admin@valorahealthcare.com');
  const [enableChat, setEnableChat] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const data = await adminApi.getPublicSettings();
      if (data) {
        if (data.site_logo_url !== undefined) setLogoUrl(data.site_logo_url);
        if (data.site_name) setSiteName(data.site_name);
        if (data.phone_number) setPhoneNumber(data.phone_number);
        if (data.contact_email) setContactEmail(data.contact_email);
        if (data.enable_chat !== undefined) setEnableChat(data.enable_chat);
      }
    } catch (e) {
      console.warn('Failed to load public settings:', e);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Socket.io for immediate real-time logo updates
    const socket: Socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
    });

    socket.on('logo_updated', (data: { logoUrl: string }) => {
      console.log('[Real-time] Brand logo updated immediately:', data.logoUrl);
      setLogoUrl(data.logoUrl || '');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{
        logoUrl,
        siteName,
        phoneNumber,
        contactEmail,
        enableChat,
        refreshSettings: fetchSettings,
        setLogoUrl,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
