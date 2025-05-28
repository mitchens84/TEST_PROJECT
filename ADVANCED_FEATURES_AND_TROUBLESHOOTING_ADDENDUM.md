# Advanced Features & Troubleshooting Addendum

This document serves as an addendum to the `COMPREHENSIVE_FRONTEND_GUIDE.md`. It provides detailed explanations, code examples, and troubleshooting advice for advanced features and common issues encountered during project development, based on lessons learned.

## 1. Robust `localStorage` Management

For complex applications, especially those built with React, a structured approach to `localStorage` is crucial for managing client-side state persistence effectively.

### 1.1. `localStorageUtils.js` (Recommended Utility Module)

Create a utility file (e.g., `src/utils/localStorageUtils.js` or within your React app's `src/utils/`) to centralize `localStorage` operations. This helps with namespacing, JSON handling, and error management.

```javascript
// Example: src/utils/localStorageUtils.js
const PROJECT_KEY_PREFIX = 'myProject_'; // IMPORTANT: Change 'myProject' for each distinct project

/**
 * Retrieves a value from localStorage.
 * @param {string} key - The key to retrieve (without prefix).
 * @param {*} defaultValue - The value to return if the key is not found or an error occurs.
 * @returns {*} The stored value or the defaultValue.
 */
export function getStoredValue(key, defaultValue) {
  const fullKey = PROJECT_KEY_PREFIX + key;
  try {
    const saved = localStorage.getItem(fullKey);
    if (saved === null || saved === undefined) {
      return defaultValue;
    }
    // Attempt to parse if it looks like JSON, otherwise return as is.
    // This handles cases where simple strings are stored directly.
    if ((saved.startsWith('{') && saved.endsWith('}')) || (saved.startsWith('[') && saved.endsWith(']'))) {
      try {
        return JSON.parse(saved);
      } catch (parseError) {
        console.error(`Error parsing localStorage key "${fullKey}" as JSON:`, parseError);
        return defaultValue; // Return default if parsing fails
      }
    }
    return saved; // Return as is for non-JSON strings
  } catch (error) {
    console.error(`Error reading localStorage key "${fullKey}":`, error);
    return defaultValue;
  }
}

/**
 * Stores a value in localStorage.
 * @param {string} key - The key to store under (without prefix).
 * @param {*} value - The value to store. If undefined, the key is removed.
 */
export function setStoredValue(key, value) {
  const fullKey = PROJECT_KEY_PREFIX + key;
  try {
    if (value === undefined) {
      localStorage.removeItem(fullKey);
    } else {
      // Store objects/arrays as JSON, primitives directly if not objects.
      const valueToStore = (typeof value === 'object' && value !== null) ? JSON.stringify(value) : value;
      localStorage.setItem(fullKey, valueToStore);
    }
  } catch (error) {
    console.error(`Error setting localStorage key "${fullKey}":`, error);
    // This can happen if storage is full or (in rare cases) if value is too complex.
    // Consider notifying the user or implementing a more robust error handling strategy.
  }
}

/**
 * Removes a value from localStorage.
 * @param {string} key - The key to remove (without prefix).
 */
export function removeStoredValue(key) {
  const fullKey = PROJECT_KEY_PREFIX + key;
  try {
    localStorage.removeItem(fullKey);
  } catch (error) {
    console.error(`Error removing localStorage key "${fullKey}":`, error);
  }
}
```

### 1.2. Using with React `useState` and `useEffect`

```jsx
// Example in a React component
import React, { useState, useEffect } from 'react';
// Adjust path based on your project structure
import { getStoredValue, setStoredValue } from './utils/localStorageUtils';

const UserSettingsComponent = () => {
  // Initialize state from localStorage, providing a default value
  const [theme, setTheme] = useState(() => getStoredValue('userSettings_theme', 'light'));
  const [notificationsEnabled, setNotificationsEnabled] = useState(() =>
    getStoredValue('userSettings_notificationsEnabled', true)
  );

  // Persist theme changes to localStorage
  useEffect(() => {
    setStoredValue('userSettings_theme', theme);
  }, [theme]);

  // Persist notification preference changes
  useEffect(() => {
    setStoredValue('userSettings_notificationsEnabled', notificationsEnabled);
  }, [notificationsEnabled]);

  return (
    <div>
      <label>
        Theme:
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={notificationsEnabled}
          onChange={(e) => setNotificationsEnabled(e.target.checked)}
        />
        Enable Notifications
      </label>
      <p>Current Theme: {theme}</p>
      <p>Notifications: {notificationsEnabled ? 'Enabled' : 'Disabled'}</p>
    </div>
  );
};

export default UserSettingsComponent;
```

### 1.3. Key Considerations for `localStorage`

*   **Namespacing:** Crucial. Always prefix keys (e.g., `projectName_componentName_valueName`) to prevent collisions. The `PROJECT_KEY_PREFIX` in `localStorageUtils.js` handles the project-level prefix.
*   **Data Serialization:** `localStorage` stores everything as strings. `JSON.stringify()` objects/arrays before saving and `JSON.parse()` when retrieving. Wrap parsing in `try...catch`.
*   **Storage Limits:** Typically 5-10MB per origin. Be mindful of storing large data. For larger needs, consider IndexedDB.
*   **Sensitive Data:** **Do NOT store sensitive information** (passwords, PII, tokens that should be httpOnly) in `localStorage`. It's accessible via JavaScript and browser dev tools.
*   **Availability & Errors:** `localStorage` can be unavailable (private browsing, user settings) or operations can fail (storage full). Wrap operations in `try...catch`.
*   **Default Values:** Always provide sensible default values when retrieving items, in case the key doesn't exist or data is corrupted.
*   **Synchronous API:** `localStorage` operations are synchronous and can block the main thread if overused or with large data.

### 1.4. Troubleshooting `localStorage` Issues

*   **Data Not Saving/Loading:**
    *   Verify keys (including prefix) are identical for saving and loading (typos, case sensitivity).
    *   Ensure `JSON.stringify` is used for complex data and `JSON.parse` for loading, with error handling.
    *   Check browser dev tools (Application > Local Storage) to inspect stored keys/values.
    *   Confirm `localStorage` is available and not full.
*   **Key Collisions:** Ensure unique keys, especially if multiple components store similar data. Use distinct component/feature names in your keys.
*   **Incorrect Default State:** If a component loads with an unexpected default, ensure `getStoredValue` has the correct key and the intended default value.
*   **Type Mismatches on Load:** If you store a string "false" and expect a boolean `false`, `JSON.parse("false")` will work, but direct retrieval might give the string. Be consistent. The improved `getStoredValue` tries to be smarter about parsing.

## 2. User Notification System

Providing feedback for user actions (e.g., "Settings saved," "Error occurred") enhances UX.

### 2.1. React Context-Based Notification System

A global system using React Context is a common pattern.

1.  **`NotificationContext.js` (or `.tsx`)**
    ```jsx
    // src/contexts/NotificationContext.js
    import React, { createContext, useState, useCallback, useRef, useContext } from 'react';

    const NotificationContext = createContext(null);

    export const useNotification = () => {
      const context = useContext(NotificationContext);
      if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
      }
      return context;
    };

    export const NotificationProvider = ({ children }) => {
      const [notifications, setNotifications] = useState([]);
      const notificationIdRef = useRef(0);

      const addNotification = useCallback((message, type = 'info', duration = 3000) => {
        const id = notificationIdRef.current++;
        setNotifications(prev => [...prev, { id, message, type }]);
        
        if (duration > 0) { // Allow duration 0 for persistent notifications
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
          }, duration);
        }
        return id; // Return ID if manual dismissal is needed
      }, []);

      const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, []);

      return (
        <NotificationContext.Provider value={{ addNotification, removeNotification }}>
          {children}
          <div className="notification-container"> {/* Position this with CSS */}
            {notifications.map(n => (
              <div key={n.id} className={`notification notification-${n.type}`}>
                {n.message}
                {/* Optional: Add a close button that calls removeNotification(n.id) */}
                {/* <button onClick={() => removeNotification(n.id)}>X</button> */}
              </div>
            ))}
          </div>
        </NotificationContext.Provider>
      );
    };
    ```

2.  **Basic CSS for Notifications (e.g., in `App.css` or a dedicated `Notifications.css`)**
    ```css
    .notification-container {
      position: fixed;
      top: 20px; /* Or bottom, left, etc. */
      right: 20px;
      z-index: 1050; /* High z-index */
      display: flex;
      flex-direction: column;
      gap: 10px; /* Spacing between notifications */
    }

    .notification {
      padding: 12px 18px;
      border-radius: 5px;
      color: #fff;
      background-color: #333; /* Default background */
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      min-width: 280px;
      /* Add transitions for smooth appearance/disappearance */
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .notification-info { background-color: #2196F3; } /* Blue */
    .notification-success { background-color: #4CAF50; } /* Green */
    .notification-warning { background-color: #ff9800; } /* Orange */
    .notification-error { background-color: #f44336; } /* Red */

    /* Example for a close button if you add one */
    .notification button.close {
      background: transparent;
      border: none;
      color: white;
      float: right;
      margin-left: 10px;
      cursor: pointer;
      font-size: 1.2em;
    }
    ```

3.  **Wrap your `App` with `NotificationProvider` (e.g., in `src/main.tsx` or `src/App.tsx`)**
    ```jsx
    // In your main application entry point (e.g., main.tsx or App.tsx)
    import { NotificationProvider } from './contexts/NotificationContext'; // Adjust path

    // ... other imports
    // ReactDOM.createRoot(document.getElementById('root')).render(
    //   <React.StrictMode>
    //     <NotificationProvider>
    //       <App />
    //     </NotificationProvider>
    //   </React.StrictMode>
    // );
    ```

4.  **Using the `useNotification` Hook in a Component**
    ```jsx
    // In any component that needs to show notifications
    import React from 'react';
    import { useNotification } from '../contexts/NotificationContext'; // Adjust path

    const MyFeatureComponent = () => {
      const { addNotification } = useNotification();

      const handleSave = async () => {
        try {
          // const response = await api.saveSomeData();
          addNotification('Data saved successfully!', 'success');
        } catch (error) {
          addNotification('Failed to save data. Please try again.', 'error');
        }
      };

      return <button onClick={handleSave}>Save Data</button>;
    };
    export default MyFeatureComponent;
    ```

## 3. Multi-Tab Interfaces

Organizing content or functionality into tabs is a common UI pattern.

### 3.1. React Pattern for Tabbed Components

1.  **State Management:** Use `useState` for the active tab.
2.  **Conditional Rendering:** Display content based on the active tab.
3.  **Persistence (Optional):** Use `localStorageUtils` to save and load the active tab.
4.  **Accessibility:** Implement ARIA attributes for tabs (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`).

```jsx
// src/components/TabbedComponent.jsx
import React, { useState, useEffect } from 'react';
// Assuming you have localStorageUtils from section 1
import { getStoredValue, setStoredValue } from '../utils/localStorageUtils'; 

// Define your tab content components elsewhere
const OverviewTab = () => <div>Overview Content</div>;
const DetailsTab = () => <div>Details Content</div>;
const SettingsTab = () => <div>Settings Content</div>;

const TABS_CONFIG = [
  { id: 'overview', label: 'Overview', component: <OverviewTab /> },
  { id: 'details', label: 'Details', component: <DetailsTab /> },
  { id: 'settings', label: 'Settings', component: <SettingsTab /> },
];
const DEFAULT_TAB_ID = TABS_CONFIG[0].id;
// Make the localStorage key specific to this component instance if multiple exist
const LOCAL_STORAGE_KEY_ACTIVE_TAB = 'tabbedComponent_activeTab'; 

const TabbedComponent = ({ instanceId = 'default' }) => { // instanceId for unique localStorage keys
  const storageKey = `${LOCAL_STORAGE_KEY_ACTIVE_TAB}_${instanceId}`;
  const [activeTabId, setActiveTabId] = useState(() =>
    getStoredValue(storageKey, DEFAULT_TAB_ID)
  );

  useEffect(() => {
    setStoredValue(storageKey, activeTabId);
  }, [activeTabId, storageKey]);

  return (
    <div className="tab-component">
      <div className="tab-navigation" role="tablist" aria-label="Sample Tabs">
        {TABS_CONFIG.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTabId === tab.id}
            aria-controls={`panel-${instanceId}-${tab.id}`}
            id={`tab-${instanceId}-${tab.id}`}
            className={`tab-button ${activeTabId === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content-area">
        {TABS_CONFIG.map(tab => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${instanceId}-${tab.id}`}
            aria-labelledby={`tab-${instanceId}-${tab.id}`}
            className="tab-panel"
            hidden={activeTabId !== tab.id} // Use hidden attribute for accessibility
          >
            {/* Render content only if active to potentially save resources, or always render if simple */}
            {activeTabId === tab.id && tab.component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabbedComponent;
```

**Basic CSS for Tabs (example):**
```css
.tab-component { /* Styles for the overall tab container */ }
.tab-navigation { display: flex; border-bottom: 1px solid #ccc; }
.tab-button {
  padding: 10px 15px;
  border: 1px solid transparent;
  border-bottom: none;
  background-color: #f0f0f0;
  cursor: pointer;
  margin-right: 2px;
  border-radius: 4px 4px 0 0;
}
.tab-button.active {
  background-color: #fff;
  border-color: #ccc;
  border-bottom-color: #fff; /* Make it look connected to content */
  position: relative;
  top: 1px; /* Align with content border */
}
.tab-button:focus { outline: 2px solid blue; /* Accessibility */ }
.tab-content-area { /* Styles for the content area below tabs */ }
.tab-panel {
  padding: 20px;
  border: 1px solid #ccc;
  border-top: none; /* If buttons are styled to merge */
}
/* .tab-panel[hidden] { display: none; } */ /* 'hidden' attribute handles this */
```

## 4. Internal React Applications (Project-Contained)

This refers to self-contained React (or other framework) applications built within a sub-project (e.g., `src_react/my_internal_app/`) and then integrated into the main static site structure.

### 4.1. Key Configuration: `vite.config.ts` (or `.js`)

For the internal React app, its `vite.config.ts` is critical:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // If using path aliases

export default defineConfig({
  plugins: [react()],
  // CRUCIAL for embedded content: Ensures all asset paths in the built
  // index.html are relative (e.g., "./assets/index.js")
  base: './', 
  build: {
    outDir: 'dist', // Standard output directory
    assetsDir: 'assets', // Subfolder for assets within dist
    rollupOptions: {
      output: {
        // Consistent naming for predictable paths after build
        // Helps avoid issues if the main site also has assets folders
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    }
  },
  resolve: { // Optional: if you use path aliases like @/
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### 4.2. `build.sh` Script Integration (Robust Example)

The main project's `build.sh` script needs to navigate to the internal app, build it, and copy the results.

```bash
#!/bin/bash

# --- Define Internal App Variables ---
# These should be defined for each internal app you have.
# It's good practice to list them at the top of your build.sh or in a config.
INTERNAL_APP_NAME_EXAMPLE="myInternalApp" # Descriptive name for logs
INTERNAL_APP_SRC_DIR_EXAMPLE="src_react/my_react_app_actual_folder_name" # Actual source folder
INTERNAL_APP_TARGET_DIR_EXAMPLE="EXPRESS/some_section/my_react_app_actual_folder_name" # Target in EXPRESS

# Function to build a single internal app
build_internal_app() {
  local app_display_name="$1"
  local app_src_dir="$2"
  local app_target_dir="$3"
  local original_dir=$(pwd) # Save current directory

  echo "--- Processing Internal App: $app_display_name ---"
  echo "Source: $app_src_dir"
  echo "Target: $app_target_dir"

  if [ ! -d "$app_src_dir" ]; then
    echo "ERROR: Source directory $app_src_dir does not exist. Skipping."
    return 1
  fi

  cd "$app_src_dir"
  if [ $? -ne 0 ]; then
    echo "ERROR: Failed to navigate to $app_src_dir. Skipping."
    cd "$original_dir" # Go back
    return 1
  fi

  # Check for package.json and install dependencies if node_modules is missing or outdated
  if [ -f "package.json" ]; then
    if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules/." ]; then # Check if package.json is newer
      echo "Installing dependencies for $app_display_name..."
      if ! npm install; then
        echo "ERROR: npm install failed for $app_display_name."
        cd "$original_dir"
        return 1
      fi
    fi

    echo "Building $app_display_name (npm run build)..."
    if ! npm run build; then
      echo "ERROR: npm run build failed for $app_display_name."
      cd "$original_dir"
      return 1
    fi
  else
    echo "WARNING: package.json not found in $app_src_dir. Assuming no build step needed."
  fi
  
  cd "$original_dir" # Navigate back to original directory BEFORE copying

  # Copy built assets
  local dist_dir="$app_src_dir/dist"
  if [ -d "$dist_dir" ]; then
    echo "Copying built assets from $dist_dir to $app_target_dir..."
    mkdir -p "$app_target_dir" # Ensure target directory exists
    # Use rsync for robust copy, deleting extraneous files in target.
    # The trailing slash on source ($dist_dir/) is important for rsync.
    if ! rsync -a --delete "$dist_dir/" "$app_target_dir/"; then
        echo "ERROR: rsync failed to copy assets for $app_display_name."
        return 1
    fi
    echo "Copy complete for $app_display_name."
  else
    echo "WARNING: dist directory not found in $app_src_dir after build. Nothing to copy for $app_display_name."
    # This might be an error if a build was expected
  fi
  
  echo "--- Finished processing $app_display_name ---"
  return 0
}

# --- Main Build Steps ---
echo "Starting main build process..."

# Example: Build one internal app
# build_internal_app "$INTERNAL_APP_NAME_EXAMPLE" "$INTERNAL_APP_SRC_DIR_EXAMPLE" "$INTERNAL_APP_TARGET_DIR_EXAMPLE"
# if [ $? -ne 0 ]; then
#   echo "Build failed for $INTERNAL_APP_NAME_EXAMPLE. Exiting."
#   exit 1
# fi

# Add calls for other internal apps here...

# ... other main build steps (ToC generation, HTML validation, etc.) ...

echo "Main build process complete."
```
**To use this in your `build.sh`:**
1.  Copy the `build_internal_app` function.
2.  Define variables like `INTERNAL_APP_NAME_EXAMPLE`, `INTERNAL_APP_SRC_DIR_EXAMPLE`, `INTERNAL_APP_TARGET_DIR_EXAMPLE` for each of your internal apps.
3.  Call the function: `build_internal_app "My App Name" "src_react/my-app" "EXPRESS/section/my-app"`

### 4.3. Troubleshooting Internal React Apps

*   **Blank Page After Build/Copy (Most Common):**
    *   **`base: './'` in `vite.config.ts`:** This is the #1 culprit. Ensure it's set for the internal app.
    *   **Copy Process:** The `build.sh` must copy the *contents* of the internal app's `dist/` folder (e.g., `dist/*` or `dist/.`) into the target `EXPRESS/some_section/my_app/` directory, NOT the `dist` folder itself as a subdirectory.
    *   **Browser Dev Tools (Console & Network):** Check for 404 errors for JS/CSS files. View the source of the embedded `index.html` in the browser – paths to assets should be relative (e.g., `./assets/index-XXXX.js` or `assets/index-XXXX.js`).
*   **Asset Loading Failures (404s for JS, CSS, Images):**
    *   Usually related to the `base` path or incorrect copy process (see above).
    *   If using image paths directly in CSS (e.g., `background-image: url(...)`), ensure these paths are correct relative to the final CSS file location. Vite often handles this for assets imported into JS/TSX.
*   **Build Failures within the Internal App:**
    *   **Isolate the build:** Navigate manually into the internal app's directory (e.g., `cd src_react/my_internal_app/`).
    *   Run `npm install` (or `yarn install`, `pnpm install`).
    *   Run `npm run build` directly to see detailed error messages (TypeScript errors, missing dependencies, Vite configuration problems).
    *   Check the internal app's `package.json` for all necessary dependencies (React, ReactDOM, Vite, TypeScript, plugins, etc.).
*   **Styling Conflicts:**
    *   CSS from the internal React app might conflict with the main shell page's global styles, or vice-versa.
    *   **CSS Modules:** The most robust solution. Use `*.module.css` files in the React app for locally scoped class names. (e.g., `import styles from './MyComponent.module.css'; <div className={styles.myClass}>...</div>`)
    *   **Namespacing:** Manually prefix all CSS classes in the React app with a unique identifier (e.g., `.my-internal-app-button {}`).
    *   **Increased Specificity:** If necessary, use more specific CSS selectors.
    *   **Avoid Global Styles:** Minimize global styles within the internal React app if it's meant to be embedded.
*   **JavaScript Conflicts:**
    *   Less common if the React app is well-contained. Ensure no global variables from the main page accidentally interfere with the React app's environment.
    *   If the main page uses different versions of libraries also used by the React app (and they are not bundled with the app), conflicts can occur. Bundling dependencies with the React app (default Vite behavior) usually prevents this.

## 5. Key Troubleshooting Insights (General)

### 5.1. Component Content Not Rendering Despite No Console Errors

This was a significant lesson learned. If an HTML element or a component's output is unexpectedly not visible:

*   **Check CSS `display` Property:**
    *   Inspect the element in browser developer tools.
    *   Look for any CSS rule (from your own styles, a library, or browser defaults) that might be setting `display: none !important;` or simply `display: none;` on the element or one of its parent containers.
    *   This can happen if a class meant for conditional visibility (like a "hide" or "hidden" class) is applied unintentionally or not removed correctly by JavaScript.
*   **Check Visibility and Opacity:** Also inspect `visibility: hidden;` or `opacity: 0;`.
*   **Dimensions:** Ensure the element and its parents have actual dimensions (width/height). An element with `width: 0; height: 0;` or `overflow: hidden;` on a zero-dimension parent won't be visible.
*   **Positioning:** Check if the element is positioned off-screen (e.g., `position: absolute; left: -9999px;`).
*   **React Conditional Rendering:** Double-check the logic in your React components. Is a condition `false` when you expect it to be `true`? Use `console.log` or the React DevTools to inspect state and props.

### 5.2. Build Script Best Practices

*   **Permissions:** Ensure `build.sh` is executable (`chmod +x build.sh`).
*   **Path Issues:**
    *   Use relative paths carefully. `cd` into directories and use paths relative to that location, or use absolute paths where appropriate.
    *   The `build_internal_app` function example uses `cd` and then navigates back, which is a safer pattern.
*   **Command Not Found:** Ensure all CLI tools used in the script (Node, npm, rsync, etc.) are installed and in the system's PATH, especially in CI/CD environments.
*   **Silent Failures:** Add `set -e` at the top of your `build.sh` to make the script exit immediately if any command fails. This helps catch errors early. Add `set -o pipefail` if you use pipes and want the pipe to fail if any command in it fails.
*   **Dependency Installation:** Always run `npm install` (or equivalent) before `npm run build` for internal apps, especially in clean CI environments or if `package.json` has changed.
*   **File and Directory Naming:** For paths that will be part of URLs or are processed by build scripts (e.g., `EXPRESS/` subdirectories, `src_react/` app names), avoid spaces and special characters (e.g., `?`, `#`, `&`, `*`, `(`, `)`, `!`, etc.). Use kebab-case or snake_case for clarity and to prevent unexpected behavior during builds or deployment, especially with static site hosts like GitHub Pages.

## 6. References (Master List)

This section provides links to key documentation, tools, and further reading relevant to the technologies and practices discussed in the main guide and this addendum.

### 6.1. Data Visualization
*   **D3.js Documentation:** [https://d3js.org/](https://d3js.org/)
*   **Observable:** [https://observablehq.com/](https://observablehq.com/) (Many D3.js examples)
*   **The Data Visualisation Catalogue:** [https://datavizcatalogue.com/](https://datavizcatalogue.com/)
*   **ColorBrewer2:** [https://colorbrewer2.org/](https://colorbrewer2.org/) (Color schemes, accessibility)
*   **Chart.js Documentation:** [https://www.chartjs.org/docs/latest/](https://www.chartjs.org/docs/latest/)
*   **Three.js Documentation:** [https://threejs.org/docs/](https://threejs.org/docs/)
*   **React Three Fiber Documentation:** [https://docs.pmnd.rs/react-three-fiber/getting-started/introduction](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)

### 6.2. Core Web Technologies & Frameworks
*   **MDN Web Docs (Mozilla Developer Network):** [https://developer.mozilla.org/](https://developer.mozilla.org/) (HTML, CSS, JS)
*   **Vite Documentation:** [https://vitejs.dev/](https://vitejs.dev/)
*   **React Documentation:** [https://react.dev/](https://react.dev/)
*   **TypeScript Documentation:** [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
*   **Node.js Documentation:** [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/)

### 6.3. Deployment & CI/CD
*   **GitHub Pages Documentation:** [https://docs.github.com/en/pages](https://docs.github.com/en/pages)
*   **Netlify Documentation:** [https://docs.netlify.com/](https://docs.netlify.com/)
*   **GitHub Actions Documentation:** [https://docs.github.com/en/actions](https://docs.github.com/en/actions)

### 6.4. Data & APIs
*   **Airtable API Documentation:** [https://airtable.com/developers/web/api](https://airtable.com/developers/web/api)
*   **Fetch API (MDN):** [https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

### 6.5. Accessibility
*   **Web Accessibility Initiative (WAI) – W3C:** [https://www.w3.org/WAI/](https://www.w3.org/WAI/)
*   **ARIA Authoring Practices Guide (APG):** [https://www.w3.org/WAI/ARIA/apg/](https://www.w3.org/WAI/ARIA/apg/)

### 6.6. Tools & Utilities
*   **Can I use... Support tables for HTML5, CSS3, etc.:** [https://caniuse.com/](https://caniuse.com/)
*   **ESLint:** [https://eslint.org/](https://eslint.org/) (JavaScript/TypeScript Linter)
*   **Prettier:** [https://prettier.io/](https://prettier.io/) (Code Formatter)
*   **BrowserStack / Sauce Labs / LambdaTest:** (Cross-browser testing platforms)

---
*This addendum should be kept up-to-date as new patterns emerge or further complex issues are resolved.*
