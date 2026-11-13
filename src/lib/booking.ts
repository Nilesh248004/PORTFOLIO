// Call booking is switched on by setting NEXT_PUBLIC_CAL_USERNAME to your Cal.com username.
// While it is empty, the /book page returns "not found" in production and every "Book a call"
// button falls back to the contact form, so visitors never see a broken calendar.
export const calUsername = (process.env.NEXT_PUBLIC_CAL_USERNAME || '').trim().replace(/^\/+|\/+$/g, '');
export const bookingEnabled = calUsername.length > 0;
