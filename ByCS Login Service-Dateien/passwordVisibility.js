
const buttonNewPasswordId = "toggle-button-new-password";
const buttonConfirmPasswordId = "toggle-button-confirm-password";
const ariaControls = "aria-controls";

const toggle = (button) =>  {
    const passwordElement = document.getElementById(button.getAttribute(ariaControls));
    if(button.id === buttonNewPasswordId || button.id === buttonConfirmPasswordId) {
        //"Password Reset Page" - KMBYCSIDP-443: Both Password fields should "toggle" when one of the both "eye symbols" was clicked
        togglePasswordElement(passwordElement, button);
        toggleSecondPasswordElement(button.id);
    } else {
        //"Login Page"
        togglePasswordElement(passwordElement, button);
    }
}

function toggleSecondPasswordElement(buttonId) {
    let button2 = null;
    if (buttonId === buttonNewPasswordId) {
        button2 = document.getElementById(buttonConfirmPasswordId);
    } else {
        button2 = document.getElementById(buttonNewPasswordId);
    }
    const passwordElement2 = document.getElementById(button2.getAttribute(ariaControls));
    if (passwordElement2 && button2) {
        togglePasswordElement(passwordElement2, button2);
    }
}

function togglePasswordElement(passwordElement, button) {
    if (passwordElement.type === "password") {
        passwordElement.type = "text";
        button.className = button.dataset.iconHide;
        button.children.item(0).title = button.dataset.titleHide;
        button.setAttribute("aria-label", button.dataset.labelHide);
    } else if (passwordElement.type === "text") {
        passwordElement.type = "password";
        button.className = button.dataset.iconShow;
        button.children.item(0).title = button.dataset.titleShow;
        button.setAttribute("aria-label", button.dataset.labelShow);
    }
}

document.querySelectorAll('[data-password-toggle]')
    .forEach(button => button.onclick = () => toggle(button));