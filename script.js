class PasswordGenerator {
    constructor() {
        this.passwordOutput = document.getElementById('password-output');
        this.generateBtn = document.getElementById('generate-btn');
        this.copyBtn = document.getElementById('copy-btn');
        this.lengthInput = document.getElementById('length');
        this.lengthValue = document.getElementById('length-value');

        this.uppercaseCheck = document.getElementById('include-uppercase');
        this.lowercaseCheck = document.getElementById('include-lowercase');
        this.numbersCheck = document.getElementById('include-numbers');
        this.symbolsCheck = document.getElementById('include-symbols');

        this.setupEventListeners();
        this.initBackgroundChars();
        this.setupCursorTracking();
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generatePassword());
        this.copyBtn.addEventListener('click', () => this.copyPassword());
        this.lengthInput.addEventListener('input', () => {
            this.lengthValue.textContent = this.lengthInput.value;
        });
    }

    initBackgroundChars() {
        const container = document.querySelector('.falling-chars');
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        
        const createChar = () => {
            const char = document.createElement('span');
            char.classList.add('falling-char');
            char.textContent = chars[Math.floor(Math.random() * chars.length)];
            
            const size = Math.random() * 30 + 15; 
            char.style.fontSize = `${size}px`;
            
            const left = Math.random() * window.innerWidth;
            char.style.left = `${left}px`;
            char.style.top = '-10px';
            
            const duration = Math.random() * 10 + 5;
            char.style.animationDuration = `${duration}s`;
            
            container.appendChild(char);
            
            setTimeout(() => {
                container.removeChild(char);
                createChar();
            }, duration * 1000);
        };

        // Create initial chars
        for (let i = 0; i < 50; i++) {
            createChar();
        }
    }

    generatePassword() {
        const length = parseInt(this.lengthInput.value);
        const characterSets = this.getSelectedCharacterSets();
        
        if (characterSets.length === 0) {
            alert('Selecciona al menos un tipo de caracter');
            return;
        }

        const password = this.createPassword(length, characterSets);
        this.passwordOutput.value = password;
    }

    getSelectedCharacterSets() {
        const characterSets = [];
        
        if (this.uppercaseCheck.checked) {
            characterSets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        }
        if (this.lowercaseCheck.checked) {
            characterSets.push('abcdefghijklmnopqrstuvwxyz');
        }
        if (this.numbersCheck.checked) {
            characterSets.push('0123456789');
        }
        if (this.symbolsCheck.checked) {
            characterSets.push('!@#$%^&*()_+-=[]{}|;:,.<>?');
        }

        return characterSets;
    }

    createPassword(length, characterSets) {
        let password = '';
        const allCharacters = characterSets.join('');

        // Asegurar al menos un caracter de cada conjunto seleccionado
        characterSets.forEach(set => {
            password += set.charAt(Math.floor(Math.random() * set.length));
        });

        // Completar la contraseña
        while (password.length < length) {
            password += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
        }

        // Mezclar la contraseña
        return this.shuffleString(password);
    }

    shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    copyPassword() {
        if (this.passwordOutput.value) {
            navigator.clipboard.writeText(this.passwordOutput.value)
                .then(() => {
                    alert('Contraseña copiada al portapapeles');
                })
                .catch(err => {
                    console.error('Error al copiar: ', err);
                });
        }
    }

    setupCursorTracking() {
        const container = document.querySelector('.falling-chars');
        let mouseX = 0, mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const updateCharsPosition = () => {
            const chars = container.querySelectorAll('.falling-char');
            chars.forEach(char => {
                const charRect = char.getBoundingClientRect();
                const charCenterX = charRect.left + charRect.width / 2;
                const charCenterY = charRect.top + charRect.height / 2;

                const distanceX = mouseX - charCenterX;
                const distanceY = mouseY - charCenterY;
                const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

                // Subtle movement based on cursor proximity
                const maxInfluenceRadius = 300;
                const normalizedDistance = Math.max(0, 1 - distance / maxInfluenceRadius);
                
                char.style.transform = `translate(${distanceX * 0.05 * normalizedDistance}px, ${distanceY * 0.05 * normalizedDistance}px)`;
            });

            requestAnimationFrame(updateCharsPosition);
        };

        updateCharsPosition();
    }
}

// Inicializar el generador de contraseñas
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
});

export default PasswordGenerator;