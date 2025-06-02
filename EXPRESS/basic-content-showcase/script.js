
document.addEventListener('DOMContentLoaded', () => {
    // DOM Manipulation Example
    const changeTextBtn = document.getElementById('change-text-btn');
    const domTextElement = document.getElementById('dom-text');
    if (changeTextBtn && domTextElement) {
        changeTextBtn.addEventListener('click', () => {
            domTextElement.textContent = 'The text has been changed by JavaScript!';
            domTextElement.style.color = 'var(--accent-color)';
        });
    }

    // Event Handling Example
    const eventBox = document.getElementById('event-box');
    const eventOutput = document.getElementById('event-output');
    if (eventBox && eventOutput) {
        eventBox.addEventListener('mouseover', () => {
            eventOutput.textContent = 'Event: Mouseover detected on the box.';
            eventBox.style.backgroundColor = 'var(--accent-color)';
        });
        eventBox.addEventListener('mouseout', () => {
            eventOutput.textContent = 'Event: Mouseout detected on the box.';
            eventBox.style.backgroundColor = 'var(--secondary-color)';
        });
        eventBox.addEventListener('click', () => {
            eventOutput.textContent = 'Event: Click detected on the box!';
            alert('Box clicked!');
        });
    }

    // Simple function to demonstrate script loading
    console.log("Basic Content Showcase script.js loaded and executed.");

    // Apply theme to dynamic elements if necessary (though CSS variables should handle most cases)
    // Example: If you were creating elements with JS and needed to explicitly set themed classes
    function applyThemeToDynamicElements(theme) {
        // const dynamicElement = document.getElementById('some-dynamic-element');
        // if (dynamicElement) {
        //     if (theme === 'dark') {
        //         dynamicElement.classList.add('dynamic-dark-styles');
        //         dynamicElement.classList.remove('dynamic-light-styles');
        //     } else {
        //         dynamicElement.classList.add('dynamic-light-styles');
        //         dynamicElement.classList.remove('dynamic-dark-styles');
        //     }
        // }
    }

    // Listen for theme changes from the main window (if this page is in an iframe)
    // or from local theme toggle if this page had one.
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'themeChange') {
            // console.log('Basic showcase received themeChange message:', event.data.theme);
            // applyThemeToDynamicElements(event.data.theme);
        }
    });
     // Initial call if needed, based on current theme from localStorage or parent
    try {
        const currentTheme = localStorage.getItem('theme') || 'light';
        // applyThemeToDynamicElements(currentTheme);
    } catch(e) { /* ignore */ }

});
