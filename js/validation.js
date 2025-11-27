// ============================================
// VALIDATION DES FORMULAIRES
// Real Estate Referrer - Dubai
// Version 3.4.0 - Fix change password validation
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
    
    // Mettre à jour les éléments req-* individuellement
    const updateRequirement = (id, isValid) => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('text-green-400', 'text-gray-400', 'text-red-400');
            el.classList.add(isValid ? 'text-green-400' : 'text-gray-400');
            const bullet = el.querySelector('span:first-child');
            if (bullet) bullet.textContent = isValid ? '✓' : '•';
        }
    };
    
    updateRequirement('req-length', result.checks.minLength);
    updateRequirement('req-letter', result.checks.hasUpperCase && result.checks.hasLowerCase);
    updateRequirement('req-number', result.checks.hasNumber);
    updateRequirement('req-special', result.checks.hasSpecialChar);
    
    // Mettre à jour la barre de force
    const strengthBar = document.getElementById('passwordStrengthBar');
    const strengthText = document.getElementById('passwordStrengthText');
    
    if (strengthBar && strengthText) {
        const validCount = Object.values(result.checks).filter(Boolean).length;
        const percentage = (validCount / 5) * 100;
        
        let color, text;
        if (validCount <= 2) {
            color = '#EF4444'; text = 'Faible';
        } else if (validCount <= 3) {
            color = '#F59E0B'; text = 'Moyen';
        } else if (validCount <= 4) {
            color = '#10B981'; text = 'Fort';
        } else {
            color = '#059669'; text = 'Excellent';
        }
        
        strengthBar.style.width = percentage + '%';
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }
}

// Validation de l'email
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validation du téléphone (format international)
export function validatePhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^\+\d{1,3}\d{6,15}$/;
    return phoneRegex.test(cleanPhone);
}

// Validation du nom (pas vide, au moins 2 caractères)
export function validateName(name) {
    return name && name.trim().length >= 2;
}

// ✅ CORRIGÉ: Détecte automatiquement le mode (signup ou change-password)
function getPasswordFields() {
    // Mode change-password
    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');
    
    if (newPassword && confirmNewPassword) {
        return {
            password: newPassword,
            confirmPassword: confirmNewPassword,
            mode: 'change-password'
        };
    }
    
    // Mode signup
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    return {
        password: password,
        confirmPassword: confirmPassword,
        mode: 'signup'
    };
}

// ✅ CORRIGÉ: Vérifier la correspondance des mots de passe
function checkPasswordMatch() {
    const fields = getPasswordFields();
    const i18next = window.i18next;
    
    if (!fields.password || !fields.confirmPassword) return;
    
    const password = fields.password.value;
    const confirmPassword = fields.confirmPassword.value;
    
    // Afficher l'indicateur sous le champ confirmation
    const matchIndicator = document.getElementById('passwordMatchIndicator');
    const confirmError = document.getElementById('confirmPasswordError');
    const confirmSuccess = document.getElementById('confirmPasswordSuccess');
    
    if (confirmPassword.length === 0) {
        if (matchIndicator) matchIndicator.classList.add('hidden');
        if (confirmError) confirmError.classList.add('hidden');
        if (confirmSuccess) confirmSuccess.classList.add('hidden');
        return;
    }
    
    const match = password === confirmPassword;
    
    if (matchIndicator) {
        if (match) {
            matchIndicator.innerHTML = `
                <div class="text-green-400 text-sm flex items-center gap-2">
                    ✓ ${i18next?.t('auth:password_validation.passwords_match') || 'Les mots de passe correspondent'}
                </div>
            `;
        } else {
            matchIndicator.innerHTML = `
                <div class="text-red-400 text-sm flex items-center gap-2">
                    ✗ ${i18next?.t('auth:password_validation.passwords_no_match') || 'Les mots de passe ne correspondent pas'}
                </div>
            `;
        }
        matchIndicator.classList.remove('hidden');
    }
    
    if (confirmError) {
        if (match) {
            confirmError.classList.add('hidden');
        } else {
            confirmError.textContent = i18next?.t('auth:password_validation.passwords_no_match') || 'Les mots de passe ne correspondent pas';
            confirmError.classList.remove('hidden');
        }
    }
    
    if (confirmSuccess) {
        if (match) {
            confirmSuccess.classList.remove('hidden');
        } else {
            confirmSuccess.classList.add('hidden');
        }
    }
}

// ✅ CORRIGÉ: Vérifier la validité du formulaire et activer/désactiver le bouton
export function checkFormValidity() {
    const submitButton = document.getElementById('submitButton');
    if (!submitButton) return;
    
    const fields = getPasswordFields();
    
    if (fields.mode === 'change-password') {
        // Mode change-password: seulement mot de passe + confirmation
        const password = fields.password?.value || '';
        const confirmPassword = fields.confirmPassword?.value || '';
        
        const passwordResult = validatePassword(password);
        const passwordsMatch = password && confirmPassword && password === confirmPassword;
        
        const allValid = passwordResult.isValid && passwordsMatch;
        submitButton.disabled = !allValid;
        
        console.log('🔐 Change password validation:', { 
            passwordValid: passwordResult.isValid, 
            passwordsMatch, 
            allValid 
        });
        
    } else {
        // Mode signup: tous les champs
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        const password = fields.password?.value || '';
        const confirmPassword = fields.confirmPassword?.value || '';
        
        const nameValid = validateName(name);
        const emailValid = validateEmail(email);
        const phoneValid = phone && phone.length >= 6;
        const passwordResult = validatePassword(password);
        const passwordsMatch = password && confirmPassword && password === confirmPassword;
        
        const allValid = nameValid && emailValid && phoneValid && passwordResult.isValid && passwordsMatch;
        submitButton.disabled = !allValid;
    }
}

// ✅ CORRIGÉ: Attacher les événements de validation
export function attachPasswordValidation() {
    const fields = getPasswordFields();
    
    console.log('🔧 Attaching password validation for mode:', fields.mode);
    
    if (fields.password) {
        fields.password.addEventListener('input', (e) => {
            updatePasswordStrengthIndicator(e.target.value);
            if (fields.confirmPassword && fields.confirmPassword.value) {
                checkPasswordMatch();
            }
            checkFormValidity();
        });
        console.log('✅ Password input listener attached');
    }
    
    if (fields.confirmPassword) {
        fields.confirmPassword.addEventListener('input', () => {
            checkPasswordMatch();
            checkFormValidity();
        });
        console.log('✅ Confirm password input listener attached');
    }
    
    // Attacher aussi aux autres champs (mode signup uniquement)
    if (fields.mode === 'signup') {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        
        if (nameInput) nameInput.addEventListener('input', checkFormValidity);
        if (emailInput) emailInput.addEventListener('input', checkFormValidity);
        if (phoneInput) phoneInput.addEventListener('input', checkFormValidity);
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
    
    if (!validateName(name)) {
        errors.push(i18next?.t('auth:errors.name_invalid') || 'Le nom doit contenir au moins 2 caractères');
    }
    
    if (!validateEmail(email)) {
        errors.push(i18next?.t('auth:errors.email_invalid') || 'Email invalide');
    }
    
    const fullPhone = countryCode + phone;
    if (!validatePhone(fullPhone)) {
        errors.push(i18next?.t('auth:errors.phone_invalid') || 'Numéro de téléphone invalide');
    }
    
    const passwordResult = validatePassword(password);
    if (!passwordResult.isValid) {
        errors.push(i18next?.t('auth:errors.password_weak') || 'Le mot de passe ne respecte pas tous les critères');
    }
    
    if (password !== confirmPassword) {
        errors.push(i18next?.t('auth:errors.passwords_dont_match') || 'Les mots de passe ne correspondent pas');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Toggle Password Visibility
export function togglePasswordVisibility(fieldId, button) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    if (field.type === 'password') {
        field.type = 'text';
        button.innerHTML = '<span class="text-xl">🙈</span>';
    } else {
        field.type = 'password';
        button.innerHTML = '<span class="text-xl">👁️</span>';
    }
}

// Fonction simple pour valider confirmation (appelée par oninput)
export function validateConfirmPassword() {
    checkPasswordMatch();
    checkFormValidity();
}
