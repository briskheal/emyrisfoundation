import '../index.css';
import '../App.css';

export const metadata = {
  title: 'Emyris Foundation | Together We Grow',
  description: 'Fostering community development, education, and health initiatives to ensure everyone can grow and thrive.',
  icons: {
    icon: '/emyris_logo.webp',
  },
};

import GoogleCaptchaWrapper from '../components/GoogleCaptchaWrapper';
import CopyProtection from '../components/CopyProtection';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body>
        <CopyProtection />
        <GoogleCaptchaWrapper>
          <div id="root">{children}</div>
        </GoogleCaptchaWrapper>
      </body>
    </html>
  );
}
