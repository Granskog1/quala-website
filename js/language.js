// Language management system
class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.init();
    }

    async init() {
        // Load translations
        await this.loadTranslations();
        
        // Set initial language from localStorage or browser preference
        const savedLang = localStorage.getItem('quala-language');
        const browserLang = navigator.language.split('-')[0];
        
        this.currentLanguage = savedLang || (browserLang === 'no' ? 'no' : 'en');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Apply initial language
        this.switchLanguage(this.currentLanguage);
    }

    async loadTranslations() {
        try {
            // Load English translations
            const enResponse = await fetch('languages/en.json');
            if (!enResponse.ok) throw new Error('English translations not found');
            this.translations.en = await enResponse.json();
            
            // Load Norwegian translations
            const noResponse = await fetch('languages/no.json');
            if (!noResponse.ok) throw new Error('Norwegian translations not found');
            this.translations.no = await noResponse.json();
            
            console.log('Translations loaded successfully:', this.translations);
        } catch (error) {
            console.error('Failed to load translations:', error);
            // Use embedded translations as fallback
            this.translations.en = {
                "page": { "title": "Quala - We revolutionize product training", "description": "Transform product training with Quala." },
                "nav": { "userLogin": "User Login", "adminLogin": "Admin Login" },
                "hero": { "title": "We transform product training", "subtitle": "With Quala, there is an end to isolated training solutions; suppliers and chains are given a common arena for product training and growth.", "cta": "Get started today", "admin": "Admin Login" },
                "learning": { "tag": "LEARNING THAT PAYS OFF", "title": "We create ambassadors", "rewards": { "title": "Rewards that work!", "description": "When employees complete courses, they not only enhance their knowledge but also earn additional rewards." }, "coins": { "title": "Coins", "description": "The number of coins earned is based on course length and quiz results." }, "tickets": { "title": "Tickets", "description": "Similar to coins, the tickets earned are based on course length and quiz performance." } },
                "partnership": { "title": "Stronger Together", "description": "Quala enhances the partnership between suppliers and retail chains for product training.", "cta": "Get started today" },
                "rewards": { "title": "More knowledge = More Reward", "description": "In Quala's reward system, gaining knowledge leads to tangible rewards." },
                "testimonials": { "title": "Hear it from our customers", "bilxtra": { "title": "A channel to reach all employees", "quote": "\"Vi i BilXtra bruker Quala aktivt både til kursing av ansatte...\"", "author": "Marketing Director at Bilxtra" } },
                "footer": { "description": "Quala streamlines product training by bringing chains, suppliers, and store employees together.", "info": { "title": "Info", "about": "About Us", "contact": "Contact Us" }, "copyright": "Quala AS 2025 - VAT 930 555 592" }
            };
            this.translations.no = {
                "page": { "title": "Quala - Vi revolusjonerer produktopplæring", "description": "Transformer produktopplæring med Quala." },
                "nav": { "userLogin": "Bruker pålogging", "adminLogin": "Admin pålogging" },
                "hero": { "title": "Vi transformerer produktopplæring", "subtitle": "Med Quala er det slutt på isolerte opplæringsløsninger; leverandører og kjeder får en felles arena for produktopplæring og vekst.", "cta": "Kom i gang i dag", "admin": "Admin pålogging" },
                "learning": { "tag": "LÆRING SOM LØNNER SEG", "title": "Vi skaper ambassadører", "rewards": { "title": "Belønninger som virker!", "description": "Når ansatte fullfører kurs, forbedrer de ikke bare sin kunnskap, men tjener også ekstra belønninger." }, "coins": { "title": "Mynter", "description": "Antall mynter som opptjenes er basert på kurslengde og quiz-resultater." }, "tickets": { "title": "Lodd", "description": "I likhet med mynter, er loddene som opptjenes basert på kurslengde og quiz-prestasjoner." } },
                "partnership": { "title": "Sterkere sammen", "description": "Quala forbedrer partnerskapet mellom leverandører og handelskjeder for produktopplæring.", "cta": "Kom i gang i dag" },
                "rewards": { "title": "Mer kunnskap = Mer belønning", "description": "I Qualas belønningssystem fører kunnskapstilegnelse til konkrete belønninger." },
                "testimonials": { "title": "Hør det fra våre kunder", "bilxtra": { "title": "En kanal for å nå alle ansatte", "quote": "\"Vi i BilXtra bruker Quala aktivt både til kursing av ansatte...\"", "author": "Markedsdirektør i Bilxtra" } },
                "footer": { "description": "Quala strømlinjeformer produktopplæring ved å bringe kjeder, leverandører og butikkansatte sammen.", "info": { "title": "Info", "about": "Om oss", "contact": "Kontakt oss" }, "copyright": "Quala AS 2025 - Org.nr. 930 555 592" }
            };
        }
    }

    getDefaultTranslations() {
        return {
            "page": {
                "title": "Quala - We revolutionize product training",
                "description": "Transform product training with Quala. End isolated training solutions and create a common arena for suppliers and chains."
            },
            "nav": {
                "login": "Log in"
            },
            "hero": {
                "title": "We transform product training",
                "subtitle": "With Quala, there is an end to isolated training solutions; suppliers and chains are given a common arena for product training and growth.",
                "cta": "Get started today",
                "admin": "Admin Login"
            }
        };
    }

    setupEventListeners() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(button => {
            button.addEventListener('click', () => {
                const lang = button.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });
    }

    switchLanguage(lang) {
        if (!this.translations[lang]) {
            console.warn(`Language ${lang} not available`);
            return;
        }

        // Add switching class for smooth transition
        document.body.classList.add('language-switching');
        
        setTimeout(() => {
            this.currentLanguage = lang;
            
            // Update language buttons
            this.updateLanguageButtons();
            
            // Update all text elements
            this.updateTextElements();
            
            // Update document language
            document.documentElement.lang = lang;
            
            // Save preference
            localStorage.setItem('quala-language', lang);
            
            // Remove switching class
            document.body.classList.remove('language-switching');
        }, 100);
    }

    updateLanguageButtons() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(button => {
            const buttonLang = button.getAttribute('data-lang');
            if (buttonLang === this.currentLanguage) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    updateTextElements() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (translation) {
                if (element.tagName === 'META' && element.getAttribute('name') === 'description') {
                    element.setAttribute('content', translation);
                } else if (element.tagName === 'TITLE' || element.tagName === 'META') {
                    element.textContent = translation;
                } else {
                    element.innerHTML = translation;
                }
            }
        });
    }

    getTranslation(key) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        // Navigate through the nested object
        for (const k of keys) {
            if (translation && translation[k] !== undefined) {
                translation = translation[k];
            } else {
                // Only fallback to English if the current language translation is completely missing
                if (this.currentLanguage !== 'en' && this.translations.en) {
                    let englishTranslation = this.translations.en;
                    for (const fallbackKey of keys) {
                        if (englishTranslation && englishTranslation[fallbackKey] !== undefined) {
                            englishTranslation = englishTranslation[fallbackKey];
                        } else {
                            return null;
                        }
                    }
                    return englishTranslation;
                }
                return null;
            }
        }
        
        return translation;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}
