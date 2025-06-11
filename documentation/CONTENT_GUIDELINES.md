# Content Authoring Guidelines

This document provides guidelines for creating and adding new content to this repository, particularly when dealing with HTML, JavaScript, and data that might be embedded within them. Following these guidelines will help prevent common syntax errors and ensure content loads correctly.

## General HTML Best Practices

*   **Validate HTML:** Use an HTML validator to check for unclosed tags, incorrect nesting, or other structural issues.
*   **Character Encoding:** Ensure all HTML files are saved with UTF-8 encoding.
*   **Escape Special Characters:** When you need to display characters like `<`, `>`, `&`, or `"` as literal text in HTML (not as part of a tag), use their HTML entities: `&lt;`, `&gt;`, `&amp;`, `&quot;` respectively.

## JavaScript Best Practices

*   **Browser Developer Console:** Always check the browser's developer console for errors when adding or modifying JavaScript.
*   **Syntax Checkers/Linters:** Use a JavaScript linter (like ESLint, JSHint) to catch syntax errors and style issues early.
*   **Script Placement:**
    *   For scripts that manipulate the DOM, either place them at the end of the `<body>` or use the `defer` attribute if they are in the `<head>`, or wrap the logic in a `DOMContentLoaded` event listener.
    *   Example:
        ```html
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // Your code that interacts with the DOM
            });
        </script>
        ```
*   **Strict Mode:** Use `'use strict';` at the beginning of your scripts to catch common coding mistakes.

## Embedding Data in JavaScript (e.g., JSON-like objects in arrays)

This is a common source of errors if not handled carefully. The `Uncaught SyntaxError: Unexpected token '<'` or similar errors often originate here.

*   **String Literals:**
    *   **Quotes:** If your string data contains single quotes (apostrophes), and the string is defined with single quotes, you MUST escape the internal ones:
        *   Correct: `const myString = 'This is Bob\\\'s data.';`
        *   Incorrect: `const myString = 'This is Bob's data.';` (This will break!)
    *   Similarly, if your string is defined with double quotes and contains double quotes, escape them:
        *   Correct: `const myString = "He said, \\\"Hello!\\\"";`
        *   Incorrect: `const myString = "He said, "Hello!"";`
    *   **Mixing Quotes:** A common and often safer way is to use the other type of quote to define the string if your content primarily uses one type:
        *   `const myString = "This is Bob's data and it's fine.";`
        *   `const myString = 'He said, "Hello!" and that was fine.';`
*   **Special Characters in Strings:**
    *   **Backslashes:** If you need a literal backslash in your string, you must escape it. For example, to represent the path `C:\Users\User` in a JavaScript string, you would write:
        *   `const path = 'C:\\\\Users\\\\User';`
    *   **Newlines:** Literal newlines are not allowed in standard JavaScript strings. Use `\\n` for a newline character.
        *   Correct: `const myString = 'Line 1\\nLine 2';`
    *   **HTML within JavaScript Strings:** If you are embedding HTML markup within a JavaScript string, remember that it's still a JavaScript string. All the above escaping rules for quotes and special characters apply.
        *   `const htmlString = '<div><p>Bob\\\'s message: \\\"Hello!\\\"</p></div>';`
*   **JSON Data:** If you are embedding data that is essentially JSON, ensure it strictly follows JSON syntax rules, which are even more restrictive than JavaScript object literals (e.g., property names must be double-quoted). However, when assigning to a JavaScript variable, it becomes a JavaScript object/array literal.
*   **Trailing Commas:** While modern JavaScript allows trailing commas in array and object definitions, older browsers (especially if not using a transpiler) might fail. It's safer to remove them if compatibility is a concern, but generally okay for modern development.
    *   `const myArray = [1, 2, 3,]; // Trailing comma might be an issue in very old environments.`

## Markdown Content (`.md` files)

*   Standard Markdown syntax should be used.
*   If embedding HTML within Markdown, ensure it's valid HTML.

## Console Errors to Watch For

*   **`Uncaught SyntaxError: Unexpected token '<'`**: Often means you have an HTML tag appearing where JavaScript is expected. This is commonly due to:
    1.  A previous JavaScript string not being closed properly (e.g., missing quote, unescaped quote inside).
    2.  A `<script>` tag trying to load a file that is actually HTML (like a 404 page).
    3.  An error in a `<script>` tag causing the parser to fail and then misinterpret subsequent HTML.
*   **`Uncaught TypeError: Cannot read properties of null (reading 'classList')`** (or similar): Usually means your JavaScript is trying to access an HTML element (e.g., `document.body` or `document.getElementById('someId')`) before it has been loaded into the DOM. Ensure scripts run after the DOM is ready (see "Script Placement" above).
*   **`Uncaught ReferenceError: functionOrVariable is not defined`**: Means you're trying to use a variable or function that hasn't been declared in the current scope or isn't available yet.

By being mindful of these common issues, you can create more robust content and avoid many frustrating debugging sessions.
