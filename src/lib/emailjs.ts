// EmailJS sends the contact form straight from the visitor's browser, so these three values are public
// by design (they are not secrets). The defaults are the ones the previous version of this site used.
// To use a different EmailJS account, set the NEXT_PUBLIC_EMAILJS_* variables in .env.local and on your host.
export const emailjsConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_xz409jc',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_dn9bnl8',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'ZCF0kUzP2t4A3aMKu',
};
