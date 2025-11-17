// ============================================
// VALIDATION DES FORMULAIRES
// ============================================

import { t } from './translations.js';

// Valider le nom
export function validateName() {
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('nameError');
    
    if (!nameInput || !nameError) return true;
    const name = nameInput.value.trim();
    
    if (name.length === 0) {
        nameError.textContent = '';
        nameError.classList.add('hidden');
        nameInput.classList.remove('border-green-500', 'border-red-500');
        return false;
    }
    
    if (name.length < 2) {
        nameError.textContent = 'Le nom doit contenir au moins 2 caractères';
        nameError.classList.remove('hidden');
        nameInput.classList.add('border-red-500');
        nameInput.classList.remove('border-green-500');
        return false;
    }
    
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
    if (!nameRegex.test(name)) {
        nameError.textContent = 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes';
        nameError.classList.remove('hidden');
        nameInput.classList.add('border-red-500');
        nameInput.classList.remove('border-green-500');
        return false;
    }
    
    nameError.textContent = '';
    nameError.classList.add('hidden');
    nameInput.classList.remove('border-red-500');
    nameInput.classList.add('border-green-500');
    checkFormValidity();
    return true;
}

// Valider le téléphone
export function validatePhone() {
    const phoneField = document.getElementById('phone');
    const phoneError = document.getElementById('phoneError');
    
    if (!phoneField || !phoneError) return true;
    const phone = phoneField.value.trim();
    
    const internationalPattern = /^[0-9]{6,15}$/;
    
    if (!phone) {
        phoneError.textContent = t('auth:errors.phone_required') || 'Le numéro de téléphone est requis';
        phoneError.classList.remove('hidden');
        phoneField.classList.add('border-red-500');
        return false;
    }
    
    if (!internationalPattern.test(phone)) {
        phoneError.textContent = t('auth:errors.phone_invalid') || 'Le numéro doit contenir entre 6 et 15 chiffres';
        phoneError.classList.remove('hidden');
        phoneField.classList.add('border-red-500');
        return false;
    }
    
    phoneError.classList.add('hidden');
    phoneField.classList.remove('border-red-500');
    phoneField.classList.add('border-green-500');
    checkFormValidity();
    return true;
}

// Valider l'email
export function validateEmail() {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    
    if (!emailInput || !emailError) return true;
    const email = emailInput.value.trim();
    
    if (email.length === 0) {
        emailError.textContent = '';
        emailError.classList.add('hidden');
        emailInput.classList.remove('border-green-500', 'border-red-500');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailError.textContent = "Format d'email invalide";
        emailError.classList.remove('hidden');
        emailInput.classList.add('border-red-500');
        emailInput.classList.remove('border-green-500');
        return false;
    }
    
    emailError.textContent = '';
    emailError.classList.add('hidden');
    emailInput.classList.remove('border-red-500');
    emailInput.classList.add('border-green-500');
    checkFormValidity();
    return true;
}

// Valider le mot de passe
export function validatePassword() {
    const passwordInput = document.getElementById('password') || document.getElementById('newPassword');
    const passwordError = document.getElementById('passwordError');
    const strengthBar = document.getElementById('passwordStrengthBar');
    const strengthText = document.getElementById('passwordStrengthText');
    const reqLength = document.getElementById('req-length');
    const reqLetter = document.getElementById('req-letter');
    const reqNumber = document.getElementById('req-number');
    
    if (!passwordInput) return true;
    const password = passwordInput.value;
    
    // Mise à jour des indicateurs visuels
    if (reqLength && reqLetter && reqNumber) {
        if (password.length >= 8) {
            reqLength.classList.add('text-green-400');
            reqLength.querySelector('span:first-child').textContent = '✓';
        } else {
            reqLength.classList.remove('text-green-400');
            reqLength.querySelector('span:first-child').textContent = '•';
        }

        if (/[a-zA-Z]/.test(password)) {
            reqLetter.classList.add('text-green-400');
            reqLetter.querySelector('span:first-child').textContent = '✓';
        } else {
            reqLetter.classList.remove('text-green-400');
            reqLetter.querySelector('span:first-child').textContent = '•';
        }

        if (/[0-9]/.test(password)) {
            reqNumber.classList.add('text-green-400');
            reqNumber.querySelector('span:first-child').textContent = '✓';
        } else {
            reqNumber.classList.remove('text-green-400');
            reqNumber.querySelector('span:first-child').textContent = '•';
        }
    }
    
    // Barre de force
    if (strengthBar && strengthText) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        let color, text, width;
        if (password.length === 0) {
            width = 0; text = ''; color = 'bg-gray-600';
        } else if (strength <= 2) {
            width = 33; text = 'Faible'; color = 'bg-red-500';
        } else if (strength === 3) {
            width = 66; text = 'Moyen'; color = 'bg-yellow-500';
        } else {
            width = 100; text = 'Fort'; color = 'bg-green-500';
        }
        
        strengthBar.style.width = width + '%';
        strengthBar.className = `h-full transition-all duration-300 ${color}`;
        strengthText.textContent = text;
        strengthText.className = `min-w-[60px] ${color.replace('bg-', 'text-')}`;
    }
    
    if (!passwordError) return true;
    
    // Validation stricte
    if (password.length === 0) {
        passwordError.classList.add('hidden');
        passwordInput.classList.remove('border-green-500', 'border-red-500');
        checkFormValidity();
        return false;
    }
    
    if (password.length < 8) {
        passwordError.textContent = `Minimum 8 caractères requis (${password.length}/8)`;
        passwordError.classList.remove('hidden');
        passwordInput.classList.add('border-red-500');
        passwordInput.classList.remove('border-green-500');
        checkFormValidity();
        return false;
    }
    
    if (!/[a-z]/.test(password)) {
        passwordError.textContent = 'Au moins une lettre minuscule requise (a-z)';
        passwordError.classList.remove('hidden');
        passwordInput.classList.add('border-red-500');
        passwordInput.classList.remove('border-green-500');
        checkFormValidity();
        return false;
    }
    
    if (!/[A-Z]/.test(password)) {
        passwordError.textContent = 'Au moins une lettre majuscule requise (A-Z)';
        passwordError.classList.remove('hidden');
        passwordInput.classList.add('border-red-500');
        passwordInput.classList.remove('border-green-500');
        checkFormValidity();
        return false;
    }
    
    if (!/[0-9]/.test(password)) {
        passwordError.textContent = 'Au moins un chiffre requis (0-9)';
        passwordError.classList.remove('hidden');
        passwordInput.classList.add('border-red-500');
        passwordInput.classList.remove('border-green-500');
        checkFormValidity();
        return false;
    }
    
    if (!/[^a-zA-Z0-9]/.test(password)) {
        passwordError.textContent = 'Au moins un caractère spécial requis (!@#$%^&*...)';
        passwordError.classList.remove('hidden');
        passwordInput.classList.add('border-red-500');
        passwordInput.classList.remove('border-green-500');
        checkFormValidity();
        return false;
    }
    
    passwordError.classList.add('hidden');
    passwordInput.classList.remove('border-red-500');
    passwordInput.classList.add('border-green-500');
    
    const confirmPasswordInput = document.getElementById('confirmPassword') || document.getElementById('confirmNewPassword');
    if (confirmPasswordInput && confirmPasswordInput.value.length > 0) {
        validateConfirmPassword();
    }
    
    checkFormValidity();
    return true;
}

// Valider confirmation mot de passe
export function validateConfirmPassword() {
    const passwordInput = document.getElementById('password') || document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword') || document.getElementById('confirmNewPassword');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const confirmPasswordSuccess = document.getElementById('confirmPasswordSuccess');
    
    if (!passwordInput || !confirmPasswordInput || !confirmPasswordError || !confirmPasswordSuccess) return true;
    
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (confirmPassword.length === 0) {
        confirmPasswordError.classList.add('hidden');
        confirmPasswordSuccess.classList.add('hidden');
        confirmPasswordInput.classList.remove('border-green-500', 'border-red-500');
        checkFormValidity();
        return false;
    }
    
    if (password !== confirmPassword) {
        confirmPasswordError.textContent = 'Les mots de passe ne correspondent pas';
        confirmPasswordError.classList.remove('hidden');
        confirmPasswordSuccess.classList.add('hidden');
        confirmPasswordInput.classList.add('border-red-500');
        confirmPasswordInput.classList.remove('border-green-500');
        checkFormValidity();
        return false;
    }
    
    confirmPasswordError.classList.add('hidden');
    confirmPasswordSuccess.classList.remove('hidden');
    confirmPasswordInput.classList.remove('border-red-500');
    confirmPasswordInput.classList.add('border-green-500');
    checkFormValidity();
    return true;
}

// Vérifier validité globale du formulaire
export function checkFormValidity() {
    const submitButton = document.getElementById('submitButton');
    if (!submitButton) return;
    
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password') || document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword') || document.getElementById('confirmNewPassword');
    
    const nameValid = !nameInput || nameInput.value.trim().length >= 2;
    const emailValid = !emailInput || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
    
    let phoneValid = !phoneInput;
    if (phoneInput) {
        const phone = phoneInput.value.trim();
        phoneValid = /^[0-9]{6,15}$/.test(phone);
    }
    
    let passwordValid = false;
    if (passwordInput) {
        const pwd = passwordInput.value;
        passwordValid = pwd.length >= 8 && /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd);
    }
    
    const confirmPasswordValid = !confirmPasswordInput || 
                                (confirmPasswordInput.value.length > 0 && 
                                 confirmPasswordInput.value === passwordInput?.value);
    
    const allValid = nameValid && phoneValid && emailValid && passwordValid && confirmPasswordValid;
    
    if (allValid) {
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        submitButton.disabled = true;
        submitButton.classList.add('opacity-50', 'cursor-not-allowed');
    }
}
