'use client';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function GoogleCaptchaWrapper({ children }) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  
  if (!recaptchaKey) {
    // Fallback if no key is provided yet
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey} scriptProps={{
      async: false,
      defer: false,
      appendTo: 'head',
      nonce: undefined
    }}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
