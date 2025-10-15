// Main JavaScript functionality
class QualaWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupSmoothScrolling();
        this.setupFormHandling();
        this.setupImageLazyLoading();
        this.setupAnalytics();
    }

    setupScrollAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe sections for animation
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.add('animate-on-scroll');
            observer.observe(section);
        });

        // Add CSS for animations
        this.addScrollAnimationCSS();
    }

    addScrollAnimationCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .animate-on-scroll.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Stagger animations for children */
            .features-grid .feature {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .animate-in .features-grid .feature {
                opacity: 1;
                transform: translateY(0);
            }
            
            .animate-in .features-grid .feature:nth-child(1) { transition-delay: 0.1s; }
            .animate-in .features-grid .feature:nth-child(2) { transition-delay: 0.2s; }
            .animate-in .features-grid .feature:nth-child(3) { transition-delay: 0.3s; }
        `;
        document.head.appendChild(style);
    }

    setupSmoothScrolling() {
        // Smooth scroll for internal links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    setupFormHandling() {
        // Handle contact form if present
        const contactForms = document.querySelectorAll('form');
        contactForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        });
    }

    handleFormSubmission(form) {
        // Basic form validation and submission handling
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitButton = form.querySelector('[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            // Reset form
            form.reset();
            
            // Show success message
            this.showNotification('Thank you! Your message has been sent.', 'success');
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    }

    setupImageLazyLoading() {
        // Lazy loading for images
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                img.classList.add('lazy');
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    setupAnalytics() {
        // Track button clicks and interactions
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Track CTA clicks
            if (target.classList.contains('cta-btn')) {
                this.trackEvent('CTA Click', {
                    text: target.textContent.trim(),
                    href: target.href
                });
            }
            
            // Track login button clicks
            if (target.classList.contains('login-btn')) {
                this.trackEvent('Login Button Click', {
                    href: target.href
                });
            }
            
            // Track language switches
            if (target.classList.contains('lang-btn')) {
                this.trackEvent('Language Switch', {
                    language: target.dataset.lang
                });
            }
        });
    }

    trackEvent(eventName, data = {}) {
        // Basic event tracking (replace with your analytics service)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        console.log('Event tracked:', eventName, data);
    }

    showNotification(message, type = 'info') {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
        `;
        
        // Add close functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        document.body.appendChild(notification);
        
        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // Utility methods
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize website functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.qualaWebsite = new QualaWebsite();
    
    // Add performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
            }, 0);
        });
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QualaWebsite;
}
