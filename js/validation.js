// ============================================
// VALIDATION DES FORMULAIRES
// Real Estate Referrer - Dubai
// Version 3.4.1 - Fix: remove emoji from password toggle
// ============================================

export function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
    const errors = [];
    if (!password || password.length < minLength) errors.push('minimum_8_chars');
    if (!hasUpperCase) errors.push('need_uppercase');
    if (!hasLowerCase) errors.push('need_lowercase');
    if (!hasNumber) errors.push('need_number');
    if (!hasSpecialChar) errors.push('need_special_char');
    return {
        isValid: errors.length === 0,
        errors,
        checks: {
            minLength: password && password.length >= minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecialChar
        }
    };
}

export function updatePasswordStrengthIndicator(password, elementId = 'passwordStrength') {
    const result = validatePassword(password);
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
    const strengthBar = document.getElementById('passwordStrengthBar');
    const strengthText = document.getElementById('passwordStrengthText');
    if (strengthBar && strengthText) {
        const validCount = Object.values(result.checks).filter(Boolean).length;
        const percentage = (validCount / 5) * 100;
        let color, text;
        if (validCount <= 2) { color = '#EF4444'; text = 'Faible'; }
        else if (validCount <= 3) { color = '#F59E0B'; text = 'Moyen'; }
        else if (validCount <= 4) { color = '#10B981'; text = 'Fort'; }
        else { color = '#059669'; text = 'Excellent'; }
        strengthBar.style.width = percentage + '%';
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }
}

export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^\+\d{1,3}\d{6,15}$/;
    return phoneRegex.test(cleanPhone);
}

export function validateName(name) {
    return name && name.trim().length >= 2;
}

function getPasswordFields() {
    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');
    if (newPassword && confirmNewPassword) {
        return { password: newPassword, confirmPassword: confirmNewPassword, mode: 'change-password' };
    }
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    return { password, confirmPassword, mode: 'signup' };
}

function checkPasswordMatch() {
    const fields = getPasswordFields();
    const i18next = window.i18next;
    if (!fields.password || !fields.confirmPassword) return;
    const password = fields.password.value;
    const confirmPassword = fields.confirmPassword.value;
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
        matchIndicator.innerHTML = match
            ? `<div class="text-green-400 text-sm flex items-center gap-2">✓ ${i18next?.t('auth:password_validation.passwords_match') || 'Les mots de passe correspondent'}</div>`
            : `<div class="text-red-400 text-sm flex items-center gap-2">✗ ${i18next?.t('auth:password_validation.passwords_no_match') || 'Les mots de passe ne correspondent pas'}</div>`;
        matchIndicator.classList.remove('hidden');
    }
    if (confirmError) {
        if (match) { confirmError.classList.add('hidden'); }
        else { confirmError.textContent = i18next?.t('auth:password_validation.passwords_no_match') || 'Les mots de passe ne correspondent pas'; confirmError.classList.remove('hidden'); }
    }
    if (confirmSuccess) {
        if (match) { confirmSuccess.classList.remove('hidden'); } else { confirmSuccess.classList.add('hidden'); }
    }
}

export function checkFormValidity() {
    const submitButton = document.getElementById('submitButton');
    if (!submitButton) return;
    const fields = getPasswordFields();
    if (fields.mode === 'change-password') {
        const password = fields.password?.value || '';
        const confirmPassword = fields.confirmPassword?.value || '';
        const passwordResult = validatePassword(password);
        const passwordsMatch = password && confirmPassword && password === confirmPassword;
        submitButton.disabled = !(passwordResult.isValid && passwordsMatch);
    } else {
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
        submitButton.disabled = !(nameValid && emailValid && phoneValid && passwordResult.isValid && passwordsMatch);
    }
}

export function attachPasswordValidation() {
    const fields = getPasswordFields();
    if (fields.password) {
        fields.password.addEventListener('input', (e) => {
            updatePasswordStrengthIndicator(e.target.value);
            if (fields.confirmPassword && fields.confirmPassword.value) checkPasswordMatch();
            checkFormValidity();
        });
    }
    if (fields.confirmPassword) {
        fields.confirmPassword.addEventListener('input', () => {
            checkPasswordMatch();
            checkFormValidity();
        });
    }
    if (fields.mode === 'signup') {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        if (nameInput) nameInput.addEventListener('input', checkFormValidity);
        if (emailInput) emailInput.addEventListener('input', checkFormValidity);
        if (phoneInput) phoneInput.addEventListener('input', checkFormValidity);
    }
}

export function validateSignupForm() {
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const countryCode = document.getElementById('countryCode')?.value;
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    const i18next = window.i18next;
    const errors = [];
    if (!validateName(name)) errors.push(i18next?.t('auth:errors.name_invalid') || 'Le nom doit contenir au moins 2 caractères');
    if (!validateEmail(email)) errors.push(i18next?.t('auth:errors.email_invalid') || 'Email invalide');
    const fullPhone = countryCode + phone;
    if (!validatePhone(fullPhone)) errors.push(i18next?.t('auth:errors.phone_invalid') || 'Numéro de téléphone invalide');
    const passwordResult = validatePassword(password);
    if (!passwordResult.isValid) errors.push(i18next?.t('auth:errors.password_weak') || 'Le mot de passe ne respecte pas tous les critères');
    if (password !== confirmPassword) errors.push(i18next?.t('auth:errors.passwords_dont_match') || 'Les mots de passe ne correspondent pas');
    return { isValid: errors.length === 0, errors };
}

// Fix #2 — SVG icons instead of emoji for password visibility toggle
const EYE_OPEN = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.957 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.957-9.542-7z"/></svg>`;
const EYE_CLOSED = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.957-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.957 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"/></svg>`;

export function togglePasswordVisibility(fieldId, button) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    if (field.type === 'password') {
        field.type = 'text';
        button.innerHTML = EYE_CLOSED;
    } else {
        field.type = 'password';
        button.innerHTML = EYE_OPEN;
    }
}

export function validateConfirmPassword() {
    checkPasswordMatch();
    checkFormValidity();
}
