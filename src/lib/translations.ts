export const translations = {
    en: {
        dashboard: 'Dashboard',
        letters: 'Letters',
        templates: 'Templates',
        reports: 'Reports',
        hr_management: 'HR Management',
        create_letter: 'Create Letter',
        sign_out: 'Sign Out',
        welcome_back: 'Welcome Back',
        recent_activity: 'Recent Activity',
        search_placeholder: 'Search...',
        status: 'Status',
        date: 'Date',
        subject: 'Subject',
        reference_number: 'Reference Number',
        type: 'Type',
    },
    am: {
        dashboard: 'ዳሽቦርድ',
        letters: 'ደብዳቤዎች',
        templates: 'ቴምፕሌቶች',
        reports: 'ሪፖርቶች',
        hr_management: 'የሰው ኃይል አስተዳደር',
        create_letter: 'ደብዳቤ ፍጠር',
        sign_out: 'ውጣ',
        welcome_back: 'እንኳን ደህና መጡ',
        recent_activity: 'የቅርብ ጊዜ እንቅስቃሴዎች',
        search_placeholder: 'ፈልግ...',
        status: 'ሁኔታ',
        date: 'ቀን',
        subject: 'ርዕስ',
        reference_number: 'የማጣቀሻ ቁጥር',
        type: 'ዓይነት',
    }
};

export type Language = 'en' | 'am';
export type TranslationKey = keyof typeof translations.en;
