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
            this.translations.en = await enResponse.json();
            
            // Load Norwegian translations
            const noResponse = await fetch('languages/no.json');
            this.translations.no = await noResponse.json();
        } catch (error) {
            console.error('Failed to load translations:', error);
            // Fallback to default English content
            this.translations.en = this.getDefaultTranslations();
            this.translations.no = this.getDefaultTranslations();
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
