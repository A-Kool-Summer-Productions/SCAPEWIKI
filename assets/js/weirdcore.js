// Weirdcore Dynamic Text and Title Manager
class WeirdcoreManager {
    constructor() {
        this.phrases = [
            'REMEMBER',
            'YOU ARE HERE',
            'WAKE UP',
            "DON'T FORGET",
            "IT'S WATCHING",
            'ARE YOU REAL?',
            'LOOK BEHIND YOU',
            'TIME IS RUNNING OUT',
            'YOU WERE WARNED',
            'THIS IS NOT A DREAM',
            'THEY KNOW',
            'DISCONNECT',
            'SYSTEM ERROR',
            'REALITY CHECK',
            'DO YOU REMEMBER?'
        ];

        this.titles = [
            '[S]_C.A.P.E Wiki - System Mechanics',
            'WHERE ARE YOU?',
            'WAKE UP',
            'YOU\'RE NOT ALONE',
            'LOOK BEHIND YOU',
            'THIS ISN\'T REAL',
            'REMEMBER WHO YOU ARE',
            'THEY\'RE WATCHING',
            '[ERROR] Reality Not Found',
            'DO YOU FEEL IT?',
            'TIME TO WAKE UP',
            'SYSTEM BREACH DETECTED',
            '[S]_C.A.P.E Wiki - ??? ??? ???',
            'YOU CANNOT ESCAPE',
            'IT KNOWS YOUR NAME'
        ];

        this.originalTitle = document.title;
        this.isGlitching = false;
        
        this.init();
    }

    init() {
        this.createWeirdcoreElements();
        this.startTitleGlitch();
        this.animateBackgroundText();
        this.addRandomEvents();
    }

    createWeirdcoreElements() {
        // Create container if it doesn't exist
        if (!document.querySelector('.weirdcore-container')) {
            const container = document.createElement('div');
            container.className = 'weirdcore-container';
            document.body.insertBefore(container, document.body.firstChild);
        }

        const container = document.querySelector('.weirdcore-container');
        
        // Create multiple floating text elements
        for (let i = 0; i < 8; i++) {
            const textElement = document.createElement('div');
            textElement.className = 'weirdcore-text';
            const phrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
            textElement.textContent = phrase;
            textElement.setAttribute('data-text', phrase);
            
            // Random positioning
            textElement.style.left = Math.random() * 100 + '%';
            textElement.style.top = Math.random() * 100 + '%';
            textElement.style.animationDelay = Math.random() * 5 + 's';
            textElement.style.animationDuration = (10 + Math.random() * 10) + 's';
            
            container.appendChild(textElement);
        }
    }

    startTitleGlitch() {
        let normalCount = 0;
        const maxNormal = 3; // Return to normal after 3 normal cycles
        
        setInterval(() => {
            if (Math.random() > 0.7 || this.isGlitching) {
                // Glitch mode
                this.isGlitching = true;
                normalCount = 0;
                
                const glitchTitle = this.titles[Math.floor(Math.random() * this.titles.length)];
                document.title = glitchTitle;
                
                // Random glitch duration
                setTimeout(() => {
                    this.isGlitching = false;
                }, 1000 + Math.random() * 4000);
            } else {
                // Normal mode
                normalCount++;
                if (normalCount <= maxNormal) {
                    document.title = this.originalTitle;
                }
            }
        }, 3000 + Math.random() * 5000);
    }

    animateBackgroundText() {
        const textElements = document.querySelectorAll('.weirdcore-text');
        
        // Animate each text element on a 10 second cycle
        textElements.forEach((element, index) => {
            this.cycleTextElement(element, index * 1000); // Stagger the start
        });
    }

    cycleTextElement(element, delay) {
        setTimeout(() => {
            this.animateText(element);
            // Repeat every 10 seconds
            setInterval(() => {
                this.animateText(element);
            }, 10000);
        }, delay);
    }

    animateText(element) {
        // Fade out
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            // Change text and position while invisible
            const newPhrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
            element.textContent = newPhrase;
            element.setAttribute('data-text', newPhrase);
            
            // Set new starting position
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            element.style.left = startX + '%';
            element.style.top = startY + '%';
            
            // Calculate end position for movement
            const endX = Math.random() * 100;
            const endY = Math.random() * 100;
            element.style.setProperty('--end-x', endX + '%');
            element.style.setProperty('--end-y', endY + '%');
            
            // Fade in
            requestAnimationFrame(() => {
                element.style.opacity = '0.6';
                element.style.transform = 'translateY(0)';
                element.classList.add('glitch-active');
                
                setTimeout(() => {
                    element.classList.remove('glitch-active');
                }, 500);
            });
        }, 800); // Wait for fade out
    }

    addRandomEvents() {
        // Random text intensity changes
        setInterval(() => {
            if (Math.random() > 0.7) {
                const container = document.querySelector('.weirdcore-container');
                container.classList.toggle('intense');
                setTimeout(() => {
                    container.classList.remove('intense');
                }, 2000);
            }
        }, 10000);
    }
}

// Initialize when DOM is ready AND after a small delay to ensure everything is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => new WeirdcoreManager(), 100);
    });
} else {
    setTimeout(() => new WeirdcoreManager(), 100);
}

// Also handle page visibility to enhance the effect
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        setTimeout(() => {
            document.title = 'COME BACK';
        }, 1000);
    }
});
