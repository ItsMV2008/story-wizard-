// A simple client-side check for temporary email domains.
// In a real-world application, this list would be much larger and likely managed on a server.
const tempMailDomains = [
    '10minutemail.com',
    'temp-mail.org',
    'guerrillamail.com',
    'mailinator.com',
    'throwawaymail.com',
    'getairmail.com',
    'yopmail.com',
];

export const isTempMail = (email: string): boolean => {
    const domain = email.split('@')[1];
    if (!domain) {
        return false;
    }
    return tempMailDomains.includes(domain.toLowerCase());
}
