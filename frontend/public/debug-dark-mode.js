// Debug script to test dark mode functionality
console.log('=== DARK MODE DEBUG SCRIPT ===');

// 1. Check if ThemeContext is loaded
console.log('1. Checking ThemeContext...');
try {
    const root = document.documentElement;
    console.log('   - HTML element classes:', root.className);
    console.log('   - Has dark class:', root.classList.contains('dark'));
    console.log('   - Has light class:', root.classList.contains('light'));
} catch (e) {
    console.error('   ERROR:', e);
}

// 2. Check localStorage
console.log('2. Checking localStorage...');
try {
    const theme = localStorage.getItem('theme');
    console.log('   - Saved theme:', theme);
} catch (e) {
    console.error('   ERROR:', e);
}

// 3. Test toggle function
console.log('3. Creating test toggle function...');
window.testDarkMode = function () {
    const root = document.documentElement;
    const currentTheme = root.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    console.log(`   - Current theme: ${currentTheme}`);
    console.log(`   - Switching to: ${newTheme}`);

    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);

    console.log('   - New HTML classes:', root.className);
    console.log('   ✅ Toggle complete!');

    return `Switched from ${currentTheme} to ${newTheme}`;
};

console.log('4. Test function created!');
console.log('   Run: testDarkMode() in console to toggle theme');
console.log('=== END DEBUG ===');
