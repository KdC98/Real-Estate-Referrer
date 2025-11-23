// ============================================
// VALIDATION DES FORMULAIRES
// Real Estate Referrer - Dubai
// ============================================

// Validation renforcée du mot de passe
export function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
    
    const errors = [];
    
    if (!password || password.length < minLength) {
        errors.push('minimum_8_chars');
    }
    
    if (!hasUpperCase) {
        errors.push('need_uppercase');
    }
    
    if (!hasLowerCase) {
        errors.push('need_lowercase');
    }
    
    if (!hasNumber) {
        errors.push('need_number');
    }
    
    if (!hasSpecialChar) {
        errors.push('need_special_char');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors,
        checks: {
            minLength: password && password.length >= minLength,
            hasUpperCase: hasUpperCase,
            hasLowerCase: hasLowerCase,
            hasNumber: hasNumber,
            hasSpecialChar: hasSpecialChar
        }
    };
}

// Mettre à jour l'affichage des critères en temps réel
export function updatePasswordStrengthIndicator(password, elementId = 'passwordStrength') {
    const result = validatePassword(password);
    const indicator = document.getElementById(elementId);
    
    if (!indicator) return;
    
    const i18next = window.i18next;
    
    // Créer l'HTML des critères
    const criteriaHTML = `
        <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2 ${result.checks.minLength ? 'text-green-400' : 'text-gray-400'}">
                ${result.checks.minLength ? '✓' : '○'} ${i18next?.t('auth:password_validation.min_8_chars') || 'Minimum 8 caractères'}
            </div>
            <div class="flex items-center gap-2 ${result.checks.hasUpperCase ? 'text-green-400' : 'text-gray-400'}">
                ${result.checks.hasUpperCase ? '✓' : '○'} ${i18next?.t('auth:password_validation.uppercase') || 'Une majuscule (A-Z)'}
            </div>
            <div class="flex items-center gap-2 ${result.checks.hasLowerCase ? 'text-green-400' : 'text-gray-400'}">
                ${result.checks.hasLowerCase ? '✓' : '○'} ${i18next?.t('auth:password_validation.lowercase') || 'Une minuscule (a-z)'}
            </div>
            <div class="flex items-center gap-2 ${result.checks.hasNumber ? 'text-green-400' : 'text-gray-400'}">
                ${result.checks.hasNumber ? '✓' : '○'} ${i18next?.t('auth:password_validation.number') || 'Un chiffre (0-9)'}
            </div>
            <div class="flex items-center gap-2 ${result.checks.hasSpecialChar ? 'text-green-400' : 'text-gray-400'}">
                ${result.checks.hasSpecialChar ? '✓' : '○'} ${i18next?.t('auth:password_validation.special_char') || 'Un caractère spécial (!@#$%...)'}
            </div>
        </div>
    `;
    
    indicator.innerHTML = criteriaHTML;
    indicator.classList.remove('hidden');
}

// Validation de l'email
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validation du téléphone (format international)
export function validatePhone(phone) {
    // Accepte +XXX suivi de 6 à 15 chiffres
    const phoneRegex = /^\+\d{1,3}\d{6,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Validation du nom (pas vide, au moins 2 caractères)
export function validateName(name) {
    return name && name.trim().length >= 2;
}

// Attacher les événements de validation
export function attachPasswordValidation() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            updatePasswordStrengthIndicator(e.target.value);
            
            // Vérifier la correspondance avec la confirmation
            if (confirmPasswordInput && confirmPasswordInput.value) {
                checkPasswordMatch();
            }
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', () => {
            checkPasswordMatch();
        });
    }
}

// Vérifier la correspondance des mots de passe
function checkPasswordMatch() {
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    const matchIndicator = document.getElementById('passwordMatchIndicator');
    
    if (!matchIndicator || !confirmPassword) return;
    
    const i18next = window.i18next;
    
    if (password === confirmPassword) {
        matchIndicator.innerHTML = `
            <div class="text-green-400 text-sm flex items-center gap-2">
                ✓ ${i18next?.t('auth:password_validation.passwords_match') || 'Les mots de passe correspondent'}
            </div>
        `;
        matchIndicator.classList.remove('hidden');
    } else {
        matchIndicator.innerHTML = `
            <div class="text-red-400 text-sm flex items-center gap-2">
                ✗ ${i18next?.t('auth:password_validation.passwords_no_match') || 'Les mots de passe ne correspondent pas'}
            </div>
        `;
        matchIndicator.classList.remove('hidden');
    }
}

// Valider le formulaire d'inscription complet
export function validateSignupForm() {
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const countryCode = document.getElementById('countryCode')?.value;
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    
    const i18next = window.i18next;
    const errors = [];
    
    // Validation du nom
    if (!validateName(name)) {
        errors.push(i18next?.t('auth:errors.name_invalid') || 'Le nom doit contenir au moins 2 caractères');
    }
    
    // Validation de l'email
    if (!validateEmail(email)) {
        errors.push(i18next?.t('auth:errors.email_invalid') || 'Email invalide');
    }
    
    // Validation du téléphone
    const fullPhone = countryCode + phone;
    if (!validatePhone(fullPhone)) {
        errors.push(i18next?.t('auth:errors.phone_invalid') || 'Numéro de téléphone invalide');
    }
    
    // Validation du mot de passe
    const passwordResult = validatePassword(password);
    if (!passwordResult.isValid) {
        errors.push(i18next?.t('auth:errors.password_weak') || 'Le mot de passe ne respecte pas tous les critères');
    }
    
    // Vérification de la correspondance
    if (password !== confirmPassword) {
        errors.push(i18next?.t('auth:errors.passwords_dont_match') || 'Les mots de passe ne correspondent pas');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}
