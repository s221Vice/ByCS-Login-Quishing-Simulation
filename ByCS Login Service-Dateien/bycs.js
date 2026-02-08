
const focusColor = '#7d94b2';
const errorColor = '#ee0000';
const borderColor = '#BFBFBF';
const borderColorContrast = '#1C1D2F';
let contrastModeActive = false;

window.addEventListener('bycs-contrast-mode-activated', (e) => {
    contrastModeActive = true;
    toggleContrastConfirmPwd();
    toggleContrastNewPwd();
});
window.addEventListener('bycs-contrast-mode-deactivated', (e) => {
    contrastModeActive = false;
    toggleContrastConfirmPwd();
    toggleContrastNewPwd();
});

window.addEventListener('bycs-font-size-increased', (e) => {
    if(e.detail && e.detail.data && e.detail.data.size) {
        sessionStorage.setItem('fontSize', e.detail.data.size);
    }

});
window.addEventListener('bycs-font-size-decreased', (e) => {
    if(e.detail && e.detail.data && e.detail.data.size) {
        sessionStorage.setItem('fontSize', e.detail.data.size);
    }
});


function ready(fn) {
    if(sessionStorage.getItem('fontSize')) {
        document.documentElement.style.fontSize = sessionStorage.getItem('fontSize') + "px";
    }

    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function highlightPasswordPolicies(event) {
    const newPwd = document.getElementById("password-new");
    const confirmPwd = document.getElementById("password-confirm");
    let element = event.target;
    const elements = document.querySelectorAll('#password-criteria .criterion');

    if (elements) {
        if(newPwd === document.activeElement) {
            elements.forEach(value => {
                value.classList.remove("error");
            });
            elements.forEach(value => {
                const regex = value.dataset["regex"]
                if (!regex || regex.length === 0) {
                    console.warn("%o does not have a regex assigned to it", value);
                    return;
                }
                if (element.value.match(regex)) {
                    if(value.classList.value.includes("error")) {
                        value.classList.remove("error");
                    }
                    value.classList.add("met");
                } else {
                    value.classList.remove("met");
                }
            });
        }

        if(confirmPwd === document.activeElement) {
            let element = newPwd
            elements.forEach(value => {
                const regex = value.dataset["regex"]
                if (!regex || regex.length === 0) {
                    console.warn("%o does not have a regex assigned to it", value);
                    return;
                }
                if (element.value.match(regex)) {
                    value.classList.add("met")
                } else {
                    value.classList.remove("met");
                    value.classList.add("error");
                }
            });
        }
    }
}

function resetPasswordPoliciesErrorStyle() {
    const newPwd = document.getElementById("password-new");
    if(newPwd && newPwd === document.activeElement) {
        const elements = document.querySelectorAll('#password-criteria .criterion');
        if (elements) {
            elements.forEach(value => {
                value.classList.remove("error");
            });
        }
    }
}

ready(function (event) {
    const passwordNew = document.querySelector('#password-new');
    const passwordConfirm = document.querySelector('#password-confirm');
    const pwdInputSubmit = document.getElementById("input-submit");
    const criterionInfoIcon = document.getElementById("criterion-icon-info");

    if(pwdInputSubmit) {
        pwdInputSubmit.disabled = 'true';
    }
    if (criterionInfoIcon) {
        document.body.addEventListener('click', function(e) {
            if (e.target !== criterionInfoIcon) {
                document.getElementById("criterion-info-text").style.display = 'none';
            }
        });
    }

    if (passwordNew) {
        passwordNew.addEventListener('input', () => {
            document.querySelector('.regex-message').style.display = 'block';
        });
        passwordNew.addEventListener('blur', handleFocusLostNewPassword);
        passwordNew.addEventListener('input', highlightPasswordPolicies);
        passwordNew.addEventListener('input', toggleSaveButton);
        passwordNew.addEventListener('input', handleInputPasswordNew);
        passwordNew.addEventListener('focus', resetPasswordPoliciesErrorStyle);
        passwordNew.addEventListener('focus', handleFocusNewPassword);
    }
    if (passwordConfirm) {
        passwordConfirm.addEventListener('blur', handleFocusLostPasswordConfirm);
        passwordConfirm.addEventListener('focus', handleFocusConfirmPassword);
        passwordConfirm.addEventListener('focus', highlightPasswordPolicies);
        passwordConfirm.addEventListener('input', toggleSaveButton);
        passwordConfirm.addEventListener('input', handleInputForPasswordsEquality);
        passwordConfirm.addEventListener('focus', handleInputForPasswordsEquality);
    }
})

function handleFocusNewPassword() {
    if(!isPasswordSignAllowed(document.activeElement.value)) {
        document.getElementById("message-illegal-sign").style.display = 'block';
        document.activeElement.style.borderColor = errorColor;
        document.activeElement.style.setProperty('--bycs-border-highlight-color', errorColor);
    } else {
        document.activeElement.style.borderColor = focusColor;
        document.activeElement.style.setProperty('--bycs-border-highlight-color', focusColor);
    }
    handleErrorPwdNotEquals();
}

function handleFocusLostNewPassword() {
    const newPwd = document.getElementById("password-new");
    if(newPwd) {
        if (document.activeElement === document.body && !isPasswordSignAllowed(newPwd.value)) {
            newPwd.style.borderColor = errorColor;
        } else {
            handleBorderColor(newPwd);
        }
    }
}

function handleFocusLostPasswordConfirm() {
    const confirmPwd = document.getElementById("password-confirm");
    if(confirmPwd) {
        if(document.activeElement === document.body && !isPwdInputsEquals() && confirmPwd.value.length > 0) {
            confirmPwd.style.borderColor = errorColor;
        } else if (document.activeElement === document.body) {
            handleBorderColor(confirmPwd);
        }
    }
}

function handleBorderColor(element) {
    if(element) {
        if (contrastModeActive) {
            element.style.borderColor = borderColorContrast;
        } else {
            element.style.borderColor = borderColor;
        }
    }
}

function handleFocusConfirmPassword() {
    if(isRegexCriteriaFulfilled() && isPasswordValid(document.getElementById("password-new").value)) {
        handleBorderColor(document.getElementById("password-new"));
    } else {
        document.getElementById("password-new").style.borderColor = errorColor;
        document.querySelector('.regex-message').style.display = 'block';
    }
}

function toggleSaveButton() {
    document.getElementById("input-submit").disabled =
        !(isRegexCriteriaFulfilled() && isPwdInputsEquals() && !isPwdInputFieldsEmpty() &&
            isPasswordValid(document.getElementById("password-new").value));
}

function isRegexCriteriaFulfilled() {
    const metCriteria = document.querySelectorAll('#password-criteria .criterion.met');
    return metCriteria.length === 3;
}

function isPwdInputsEquals() {
    return document.getElementById("password-new").value === document.getElementById("password-confirm").value;
}

function isPwdInputFieldsEmpty() {
    return document.getElementById("password-new").value.length === 0 && document.getElementById("password-confirm").value.length === 0;
}

function handleInputPasswordNew() {
    const newPassword = document.getElementById("password-new");
    const value = document.getElementById("password-new").value;

    //Check illegal character
    if(value.length === 0) {
        document.getElementById("message-illegal-sign").style.display = 'none';
        document.getElementById("message-illegal-sign").style.paddingBottom = "5px"
        changeBorderColorForNewPasswordInput(focusColor);
    } else if(!isPasswordSignAllowed(value)) {
        document.getElementById("message-illegal-sign").style.display = 'block';
        changeBorderColorForNewPasswordInput(errorColor);
    } else if(document.activeElement === document.body) {
        changeBorderColorForNewPasswordInput(errorColor);
    } else {
        document.getElementById("message-illegal-sign").style.display = 'none';
        changeBorderColorForNewPasswordInput(focusColor);
    }

    if(newPassword === document.activeElement) {
        handleErrorPwdNotEquals();
    }
}

function handleErrorPwdNotEquals() {
    const confirmPwd = document.getElementById("password-confirm");

    if(isConfirmedPasswordNotEmptyAndNotEqualsNewPassword()) {
        document.getElementById("message-pwd-not-equals").style.display = 'block';
        confirmPwd.style.borderColor = errorColor;
    } else {
        document.getElementById("message-pwd-not-equals").style.display = 'none';
        handleBorderColor(confirmPwd);
    }
}

function toggleContrastConfirmPwd() {
    const confirmPwd = document.getElementById("password-confirm");

    if(isConfirmedPasswordNotEmptyAndNotEqualsNewPassword()) {
        confirmPwd.style.borderColor = errorColor;
    } else {
        handleBorderColor(confirmPwd);
    }
}

function toggleContrastNewPwd() {
    const newPassword = document.getElementById("password-new");
    if(newPassword) {
        const value = newPassword.value;
        if(isConfirmedPasswordNotEmptyAndNotEqualsNewPassword()) {
            newPassword.style.borderColor = errorColor;
        } else if(!isPasswordSignAllowed(value)) {
            newPassword.style.borderColor = errorColor;
        } else if(document.activeElement === document.body) {
            newPassword.style.borderColor = errorColor;
        } else {
            handleBorderColor(newPassword);
        }
    }
}

function isConfirmedPasswordNotEmptyAndNotEqualsNewPassword() {
    const newPassword = document.getElementById("password-new");
    const confirmPwd = document.getElementById("password-confirm");
    return confirmPwd && confirmPwd.value && confirmPwd.value.length > 0 &&
        newPassword && confirmPwd.value !== newPassword.value;
}

function isPasswordSignAllowed(value) {
    const regex = /^([a-zA-ZöäüÖÄÜ\d-+*#_.:,;$%&/=?!]*)$/;
    return regex.test(value);
}

function changeBorderColorForNewPasswordInput(color){
    document.activeElement.style.borderColor = color;
    document.activeElement.style.setProperty('--bycs-border-highlight-color', color);
}

function handleInputForPasswordsEquality() {
    const newPwd = document.getElementById("password-new");
    const confirmPwd = document.getElementById("password-confirm");
    if(confirmPwd === document.activeElement && confirmPwd.value.length > 0 && confirmPwd.value !== newPwd.value) {
        //Passwort bestätigen noch nicht korrekt
        document.getElementById("message-pwd-not-equals").style.display = 'block';
        document.getElementById("password-new").style.borderColor = errorColor;
        document.activeElement.style.borderColor = errorColor;
        document.activeElement.style.setProperty('--bycs-border-highlight-color', errorColor);
    } else if(confirmPwd === document.activeElement && confirmPwd.value.length > 0 && confirmPwd.value === newPwd.value) {
        //Passwort bestätigen korrekt
        document.getElementById("message-pwd-not-equals").style.display = 'none';
        if(isPasswordValid(confirmPwd.value)) {
            handleBorderColor(document.getElementById("password-new"));
        }
        document.activeElement.style.borderColor = focusColor;
        document.activeElement.style.setProperty('--bycs-border-highlight-color', focusColor);
    } else {
        document.getElementById("message-pwd-not-equals").style.display = 'none';
        document.activeElement.style.borderColor = focusColor;
        document.activeElement.style.setProperty('--bycs-border-highlight-color', focusColor);
    }
}

function isPasswordValid(value) {
    const regex = /^(?=.*[a-zöäü])(?=.*[A-ZÖÄÜ])(?=.*[\d-+*#_.:,;$%&/=?!])([a-zA-ZöäüÖÄÜ\d-+*#_.:,;$%&/=?!]{8,64})$/;
    return regex.test(value);
}

function showInfoText() {
    document.getElementById('criterion-icon-info').addEventListener('keydown', function(event) {
        //Zeigt den Info-Layer bei Tastatur-Event (Enter, Leertaste)
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault(); // Verhindert das Scrollen bei der Leertaste
            document.getElementById("criterion-info-text").style.display = 'block';
        }
    });
    // Event Listener für die Escape-Taste zum Schließen des Info-Layers
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.getElementById("criterion-info-text").style.display = 'none';
        }
    });
    //Zeigt den Info-Layer bei einem Klick aufs Icon an
    document.getElementById("criterion-info-text").style.display = 'block';
}
function hideInfoText() {
    //Schliesst den Info-Layer bei einem Klick "in die Seite" (nicht aufs Icon)
    document.getElementById("criterion-info-text").style.display = 'none';
}

function toggleLostMfaDeviceMessage() {
    let display = document.getElementById("kc-lost-mfa-device-message").style.display;
    if(display === 'none' || display === '') {
        document.getElementById("kc-lost-mfa-device-message").style.display = 'block';
        changePseudoElementContent("#lost-mfa-device-button::before", "\\f107", "1px");
    } else {
        document.getElementById("kc-lost-mfa-device-message").style.display = 'none';
        changePseudoElementContent("#lost-mfa-device-button::before", "\\f105", "5px");
    }
}

function toggleNewMfaDeviceMessage() {
    let display = document.getElementById("kc-new-mfa-device-message").style.display;
    if(display === 'none' || display === '') {
        document.getElementById("kc-new-mfa-device-message").style.display = 'block';
        changePseudoElementContent("#new-mfa-device-button::before", "\\f107", "1px");
    } else {
        document.getElementById("kc-new-mfa-device-message").style.display = 'none';
        changePseudoElementContent("#new-mfa-device-button::before", "\\f105", "5px");
    }
}

function changePseudoElementContent(selector, newContent, marginRight) {
    for (let sheet of document.styleSheets) {
        try {
            for (let rule of sheet.cssRules) {
                if (rule.selectorText === selector) {
                    rule.style.setProperty('content', `"${newContent}"`);
                    rule.style.setProperty('margin-right', `${marginRight}`);
                    return;
                }
            }
        } catch (e) {
            console.error("Stylesheet konnte nicht ge├ñndert werden", e);
        }
    }
}
