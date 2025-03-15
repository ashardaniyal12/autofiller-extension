/**
 * Sercom Form Filler - Fills form fields using exact element IDs
 */

// Add debug flag at the top
const DEBUG_MODE = false;

// Helper function for conditional logging
function debugLog(...args) {
  if (DEBUG_MODE) {
    console.log(...args);
  }
}

function debugError(...args) {
  if (DEBUG_MODE) {
    console.error(...args);
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  debugLog("Form Data Inserter: Message received", request);
  
  if (request.action === "insertData") {
    const result = fillSercomFormWithExactPaths(request.data);
    sendResponse(result);
    return true;
  }
  
  if (request.action === 'getFieldInfo') {
    const isSercomForm = !!document.querySelector('.Passes__Header, .QuickActivation__Form');
    sendResponse({ success: true, fieldInfo: { formDetected: isSercomForm } });
    return true;
  }
  
  return false;
});

/**
 * Sleep function for async/await
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fill a text field with proper Vue event handling
 * Uses multiple techniques to ensure the value sticks
 */
async function fillTextField(selectorOrElement, value) {
  if (!value) {
    debugLog(`Form Data Inserter: No value provided for text field`);
    return false;
  }

  let element;
  
  // Check if selector is a string or an HTML Element
  if (typeof selectorOrElement === 'string') {
    element = document.querySelector(selectorOrElement);
  } else if (selectorOrElement instanceof HTMLElement) {
    element = selectorOrElement;
  } else {
    debugLog(`Form Data Inserter: Invalid selector type provided`);
    return false;
  }

  if (!element) {
    debugLog(`Form Data Inserter: Element not found`);
    return false;
  }

  debugLog(`Form Data Inserter: Setting text field to "${value}"`);
  
  // Clear the field first
  element.value = '';
  element.dispatchEvent(new Event('input', { bubbles: true }));
  
  // Set the new value
  element.value = value;
  
  // Dispatch events in sequence
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));
  
  // Force Vue to update by focusing and blurring
  element.focus();
  await sleep(50);
  element.blur();
  
  // Verify the value was set
  if (element.value !== value) {
    debugLog(`Form Data Inserter: Value verification failed. Trying again...`);
    
    // Try again with a different approach
    element.value = value;
    
    // Use InputEvent instead of Event
    element.dispatchEvent(new InputEvent('input', { bubbles: true, data: value }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Wait a bit and check again
    await sleep(100);
    
    if (element.value !== value) {
      debugLog(`Form Data Inserter: Second attempt failed`);
      return false;
    }
  }
  
  debugLog(`Form Data Inserter: Successfully set text field to "${value}"`);
  return true;
}

/**
 * Direct approach to select an option from a dropdown based on the exact HTML structure
 */
async function selectDropdownOptionDirect(selector, value) {
  debugLog(`Selecting dropdown option directly: ${value}`);
  
  try {
    // Get the element if a selector was provided
    let element = selector;
    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    }
    
    if (!element) {
      debugError('Dropdown element not found');
      return false;
    }
    
    // Find the input element inside the dropdown
    const input = element.querySelector('input[readonly]');
    if (!input) {
      debugError('Could not find readonly input in dropdown');
      return false;
    }
    
    // Click the input to open the dropdown
    debugLog('Clicking input to open dropdown');
    input.click();
    
    // Wait for the dropdown to open
    await sleep(1000);
    
    // Look for the menu content that should be open
    const menuContent = document.querySelector('.v-menu__content:not([style*="display: none"])');
    if (!menuContent) {
      debugError('Could not find open menu content');
      return false;
    }
    
    debugLog('Found open menu content');
    
    // Look for list tiles with the exact structure from the HTML
    const listTiles = menuContent.querySelectorAll('.v-list__tile');
    debugLog(`Found ${listTiles.length} list tiles`);
    
    if (listTiles.length === 0) {
      debugError('No list tiles found in menu content');
      return false;
    }
    
    // Log all list tiles for debugging
    Array.from(listTiles).forEach((tile, index) => {
      debugLog(`List tile ${index}: "${tile.textContent.trim()}"`);
    });
    
    // Try to find a match
    let matchFound = false;
    for (const tile of listTiles) {
      const tileTitle = tile.querySelector('.v-list__tile__title');
      if (!tileTitle) continue;
      
      const titleText = tileTitle.textContent.trim();
      debugLog(`Checking tile title: "${titleText}"`);
      
      if (titleText.toLowerCase() === value.toLowerCase()) {
        debugLog(`Found exact match for ${value}: ${titleText}`);
        tile.click();
        matchFound = true;
        return true;
      }
    }
    
    // If no exact match, try fuzzy matching
    if (!matchFound) {
      for (const tile of listTiles) {
        const tileTitle = tile.querySelector('.v-list__tile__title');
        if (!tileTitle) continue;
        
        const titleText = tileTitle.textContent.trim();
        
        if (titleText.toLowerCase().includes(value.toLowerCase()) || 
            value.toLowerCase().includes(titleText.toLowerCase())) {
          debugLog(`Found fuzzy match for ${value}: ${titleText}`);
          tile.click();
          matchFound = true;
          return true;
        }
      }
    }
    
    // If still no match and we have items, select the first one as fallback
    if (!matchFound && listTiles.length > 0) {
      debugLog(`No match found for ${value}, selecting first item as fallback: "${listTiles[0].textContent.trim()}"`);
      listTiles[0].click();
      return true;
    }
    
    // Close the dropdown by clicking elsewhere
    document.body.click();
    
    return false;
  } catch (error) {
    debugError('Error selecting dropdown option directly:', error);
    return false;
  }
}

/**
 * Select an option from a dropdown
 */
async function selectDropdownOption(selector, value) {
  debugLog(`Selecting dropdown option: ${value}`);
  
  try {
    // Get the element if a selector was provided
    let element = selector;
    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    }
    
    if (!element) {
      debugError('Dropdown element not found');
      return false;
    }
    
    // Find the input element - for both readonly and regular inputs
    let input = element.querySelector('input[readonly], input[type="text"]');
    if (!input && element.tagName === 'INPUT') {
      input = element;
    }
    
    if (!input) {
      debugError('Could not find input element');
      return false;
    }
    
    // Focus and click the input
    input.focus();
    input.click();
    
    // For v-autocomplete (nationality), we need to set the value first
    if (element.classList.contains('v-autocomplete')) {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Wait for dropdown
    await sleep(500);
    
    // Look for menu content
    let menuContent = document.querySelector('.v-menu__content:not([style*="display: none"])');
    if (!menuContent) {
      // Try clicking again and wait longer
      input.click();
      await sleep(1000);
      menuContent = document.querySelector('.v-menu__content:not([style*="display: none"])');
    }
    
    if (!menuContent) {
      debugError('Could not find open menu content');
      return false;
    }
    
    // Look for list items
    const listItems = menuContent.querySelectorAll('.v-list__tile');
    debugLog(`Found ${listItems.length} list items`);
    
    if (listItems.length === 0) {
      debugError('No list items found');
      return false;
    }
    
    // Log all items
    Array.from(listItems).forEach((item, index) => {
      const titleEl = item.querySelector('.v-list__tile__title');
      debugLog(`Item ${index}: "${titleEl ? titleEl.textContent.trim() : item.textContent.trim()}"`);
    });
    
    // Try to find exact match
    for (const item of listItems) {
      const titleEl = item.querySelector('.v-list__tile__title');
      const itemText = titleEl ? titleEl.textContent.trim() : item.textContent.trim();
      
      if (itemText.toLowerCase() === value.toLowerCase()) {
        debugLog(`Found exact match: ${itemText}`);
        item.click();
        await sleep(100);
        return true;
      }
    }
    
    // If no exact match, try fuzzy matching
    for (const item of listItems) {
      const titleEl = item.querySelector('.v-list__tile__title');
      const itemText = titleEl ? titleEl.textContent.trim() : item.textContent.trim();
      
      if (itemText.toLowerCase().includes(value.toLowerCase()) || 
          value.toLowerCase().includes(itemText.toLowerCase())) {
        debugLog(`Found fuzzy match: ${itemText}`);
        item.click();
        await sleep(100);
        return true;
      }
    }
    
    // If still no match and we have items, select first one
    if (listItems.length > 0) {
      debugLog('No match found, selecting first item');
      listItems[0].click();
      await sleep(100);
      return true;
    }
    
    // Close dropdown
    document.body.click();
    return false;
  } catch (error) {
    debugError('Error selecting dropdown option:', error);
    return false;
  }
}

/**
 * Fill date fields (day, month, year)
 */
async function fillDateFields(dateInputs, dateString) {
  if (!dateInputs || dateInputs.length < 3 || !dateString) return false;
  
  const dateParts = dateString.split('/');
  if (dateParts.length !== 3) return false;
  
  const [day, month, year] = dateParts;
  debugLog(`Filling date: ${day}/${month}/${year}`);
  
  // Fill day
  dateInputs[0].focus();
  dateInputs[0].value = day;
  dateInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
  dateInputs[0].dispatchEvent(new Event('change', { bubbles: true }));
  await sleep(200);
  
  // Fill month
  dateInputs[1].focus();
  dateInputs[1].value = month;
  dateInputs[1].dispatchEvent(new Event('input', { bubbles: true }));
  dateInputs[1].dispatchEvent(new Event('change', { bubbles: true }));
  await sleep(200);
  
  // Fill year
  dateInputs[2].focus();
  dateInputs[2].value = year;
  dateInputs[2].dispatchEvent(new Event('input', { bubbles: true }));
  dateInputs[2].dispatchEvent(new Event('change', { bubbles: true }));
  
  return true;
}

/**
 * Attempt to directly interact with Vue.js component data
 * This is a more direct approach that bypasses the DOM
 */
async function setVueComponentValue(element, value, propertyName = null) {
  debugLog(`Form Data Inserter: Attempting to directly set Vue component value to "${value}"`);
  
  try {
    // Find the Vue component instance
    let vueInstance = null;
    
    // Look for Vue instance on the element itself
    for (const key in element) {
      if (key.startsWith('__vue__')) {
        vueInstance = element[key];
        debugLog('Form Data Inserter: Found Vue instance directly on element');
        break;
      }
    }
    
    // If not found, look in parent elements
    if (!vueInstance) {
      let currentElement = element;
      for (let i = 0; i < 5; i++) { // Check up to 5 levels up
        if (!currentElement.parentElement) break;
        
        currentElement = currentElement.parentElement;
        for (const key in currentElement) {
          if (key.startsWith('__vue__')) {
            vueInstance = currentElement[key];
            debugLog('Form Data Inserter: Found Vue instance on parent element');
            break;
          }
        }
        
        if (vueInstance) break;
      }
    }
    
    if (vueInstance) {
      debugLog('Form Data Inserter: Found Vue instance, attempting to set value');
      
      // If a specific property name is provided, try that first
      if (propertyName && vueInstance[propertyName] !== undefined) {
        vueInstance[propertyName] = value;
        vueInstance.$forceUpdate();
        debugLog(`Form Data Inserter: Set Vue component ${propertyName} to "${value}"`);
        return true;
      }
      
      // Try different properties that might hold the value
      if (vueInstance.$data) {
        // Common Vue.js component properties
        const possibleProperties = [
          'internalValue', 'lazyValue', 'inputValue', 'value', 'selectedValue',
          'selected', 'selectedItem', 'selectedItems', 'model'
        ];
        
        for (const prop of possibleProperties) {
          if (vueInstance.$data[prop] !== undefined) {
            // Handle different types of values
            if (typeof vueInstance.$data[prop] === 'object' && vueInstance.$data[prop] !== null) {
              // For array properties (like selectedItems)
              if (Array.isArray(vueInstance.$data[prop])) {
                vueInstance.$data[prop] = [{text: value, value: value}];
              } else {
                // For object properties
                vueInstance.$data[prop] = {text: value, value: value};
              }
            } else {
              // For primitive values
              vueInstance.$data[prop] = value;
            }
            
            vueInstance.$forceUpdate();
            debugLog(`Form Data Inserter: Set Vue component $data.${prop} to "${value}"`);
            return true;
          }
        }
        
        // If we couldn't find a standard property, log all available properties for debugging
        debugLog('Form Data Inserter: Available Vue component $data properties:', Object.keys(vueInstance.$data));
      }
      
      // Try to call a method to set the value
      const possibleMethods = ['setValue', 'select', 'selectItem', 'updateValue'];
      for (const method of possibleMethods) {
        if (typeof vueInstance[method] === 'function') {
          vueInstance[method](value);
          debugLog(`Form Data Inserter: Called Vue component method ${method} with "${value}"`);
          return true;
        }
      }
      
      debugLog('Form Data Inserter: Could not find a way to set Vue component value');
    } else {
      debugLog('Form Data Inserter: Could not find Vue component instance');
    }
  } catch (error) {
    debugError('Form Data Inserter: Error setting Vue component value:', error);
  }
  
  return false;
}

/**
 * Spanish document types mapping
 */
const DOCUMENT_TYPES = {
  'Passport': 'Pasaporte',
  'P': 'Pasaporte',
  'ID Card': 'DNI',
  'Residence Card': 'Tarjeta de residencia'
};

/**
 * Spanish gender mapping
 */
const GENDERS = {
  'Male': 'Hombre',
  'Female': 'Mujer'
};

/**
 * Spanish country names mapping
 * Only includes officially supported countries with exact Spanish translations
 */
const COUNTRIES = {
  'Germany': 'Alemania',
  'France': 'Francia',
  'United Kingdom': 'Reino Unido',
  'United States': 'Estados Unidos de America', // Exact match from the dropdown (without accent)
  'Italy': 'Italia',
  'Brazil': 'Brasil',
  'Australia': 'Australia',
  'Morocco': 'Marruecos',
  'Algeria': 'Argelia',
  'South Africa': 'Sudáfrica'
};

// Add robust element finding strategies
const ELEMENT_SELECTORS = {
  name: {
    selectors: ['#fieldFirstName', '[name="firstName"]', 'input[placeholder*="First Name"]'],
    attributes: ['firstName', 'name', 'given-name']
  },
  firstSurname: {
    selectors: ['#fieldSecondName', '[name="firstSurname"]', 'input[placeholder*="First Surname"]'],
    attributes: ['surname', 'lastName', 'family-name']
  },
  secondSurname: {
    selectors: ['#fieldLastName', '[name="secondSurname"]', 'input[placeholder*="Second Surname"]'],
    attributes: ['secondSurname', 'additionalName']
  },
  idNumber: {
    selectors: ['#fieldIdNumber', '[name="idNumber"]', 'input[placeholder*="Passport"]'],
    attributes: ['passport', 'idNumber', 'documentNumber']
  },
  idType: {
    selectors: ['#fieldIdType', '[name="idType"]', 'select[placeholder*="ID Type"]'],
    attributes: ['documentType', 'idType']
  },
  gender: {
    selectors: ['#fieldGender', '[name="gender"]', 'select[placeholder*="Gender"]'],
    attributes: ['gender', 'sex']
  },
  nationality: {
    selectors: ['#fieldNationality', '[name="nationality"]', 'select[placeholder*="Nationality"]'],
    attributes: ['nationality', 'country']
  }
};

/**
 * Find element using multiple strategies
 */
function findElement(elementType) {
  const config = ELEMENT_SELECTORS[elementType];
  if (!config) return null;

  let element = null;

  // Try CSS selectors
  for (const selector of config.selectors) {
    element = document.querySelector(selector);
    if (element) {
      debugLog(`Form Data Inserter: Found ${elementType} using selector: ${selector}`);
      return element;
    }
  }

  // Try data attributes
  for (const attr of config.attributes) {
    element = document.querySelector(`[data-${attr}]`);
    if (element) {
      debugLog(`Form Data Inserter: Found ${elementType} using data attribute: ${attr}`);
      return element;
    }
  }

  // Try aria labels
  element = document.querySelector(`[aria-label*="${elementType}"]`);
  if (element) {
    debugLog(`Form Data Inserter: Found ${elementType} using aria-label`);
    return element;
  }

  // Try placeholder text
  element = document.querySelector(`input[placeholder*="${elementType}" i]`);
  if (element) {
    debugLog(`Form Data Inserter: Found ${elementType} using placeholder`);
    return element;
  }

  debugLog(`Form Data Inserter: Could not find ${elementType} element`);
  return null;
}

/**
 * Enhanced dropdown handling with multiple strategies
 */
async function selectDropdownOptionEnhanced(selector, value) {
  debugLog(`Form Data Inserter: Attempting to select dropdown option: ${value}`);
  
  const strategies = [
    selectDropdownOptionDirect,
    selectDropdownOption
  ];

  for (const strategy of strategies) {
    try {
      const result = await strategy(selector, value);
      if (result) {
        debugLog(`Form Data Inserter: Successfully selected option using ${strategy.name}`);
        return true;
      }
    } catch (error) {
      debugLog(`Form Data Inserter: Strategy ${strategy.name} failed:`, error);
    }
  }

  debugLog('Form Data Inserter: All dropdown selection strategies failed');
  return false;
}

/**
 * Vue version detection and adaptation
 */
function detectVueVersion() {
  try {
    // Check for Vue 3
    if (window.__VUE_APP__) {
      return { version: 3, instance: window.__VUE_APP__ };
    }
    
    // Check for Vue 2
    if (window.__vue__) {
      return { version: 2, instance: window.__vue__ };
    }
    
    // Check for Vue devtools
    const vueElement = document.querySelector('[data-v-app]') || document.querySelector('[data-v-]');
    if (vueElement) {
      return { version: 'unknown', hasVue: true };
    }
    
    return { version: null, hasVue: false };
  } catch (error) {
    debugError('Form Data Inserter: Error detecting Vue version:', error);
    return { version: null, hasVue: false };
  }
}

/**
 * Main form filling function with enhanced robustness
 */
async function fillSercomFormWithExactPaths(data) {
  debugLog('Form Data Inserter: Starting form fill with data:', data);
  
  const results = {};
  const retryAttempts = 3;
  
  try {
    // Get all form elements using enhanced finding strategy
    const elements = {
      name: findElement('name'),
      firstSurname: findElement('firstSurname'),
      secondSurname: findElement('secondSurname'),
      idNumber: findElement('idNumber'),
      idType: findElement('idType'),
      gender: findElement('gender'),
      nationality: findElement('nationality'),
      dateInputs: document.querySelectorAll('.InputDate__FieldInput, [data-date-input]')
    };

    // Log found elements
    debugLog('Form Data Inserter: Elements found:', 
      Object.entries(elements).reduce((acc, [key, val]) => {
        acc[key] = val ? (Array.isArray(val) ? val.length : true) : false;
        return acc;
      }, {})
    );

    // Detect Vue.js presence
    const vueInfo = detectVueVersion();
    debugLog('Form Data Inserter: Vue.js detection:', vueInfo);

    // Process fields in a specific order to handle dependencies
    const fieldOrder = [
      'nationality', // Do nationality first as it might affect other fields
      'idType',     // Then ID type as it might affect ID number
      'idNumber',   // Then ID number
      'name',       // Then personal info
      'firstSurname',
      'secondSurname',
      'birthDate',
      'gender'
    ];

    // Process fields in order
    for (const field of fieldOrder) {
      const value = data[field];
      if (!value) continue;

      debugLog(`Form Data Inserter: Processing field: ${field} with value: ${value}`);
      
      let success = false;
      for (let attempt = 1; attempt <= retryAttempts && !success; attempt++) {
        try {
          switch (field) {
            case 'name':
            case 'firstSurname':
            case 'secondSurname':
            case 'idNumber':
              success = await fillTextField(elements[field], value);
              break;

            case 'idType':
              const spanishDocType = DOCUMENT_TYPES[value] || value;
              success = await selectDropdownOptionEnhanced(elements[field], spanishDocType);
              break;

            case 'gender':
              const spanishGender = GENDERS[value] || value;
              success = await selectDropdownOptionEnhanced(elements[field], spanishGender);
              break;

            case 'nationality':
              const spanishCountry = COUNTRIES[value];
              if (spanishCountry) {
                success = await selectNationality(elements[field], value);
              }
              break;

            case 'birthDate':
              if (elements.dateInputs?.length >= 3) {
                success = await fillDateFields(elements.dateInputs, value);
              }
              break;
          }

          if (success) {
            debugLog(`Form Data Inserter: Successfully set ${field} on attempt ${attempt}`);
            results[field] = true;
            break;
          } else if (attempt < retryAttempts) {
            debugLog(`Form Data Inserter: Retrying ${field} (attempt ${attempt + 1}/${retryAttempts})`);
            await sleep(500 * attempt); // Exponential backoff
          }
        } catch (error) {
          debugError(`Form Data Inserter: Error setting ${field} (attempt ${attempt}):`, error);
        }
      }

      if (!success) {
        debugError(`Form Data Inserter: Failed to set ${field} after ${retryAttempts} attempts`);
        results[field] = false;
      }
    }

    debugLog('Form Data Inserter: Form filling completed with results:', results);
    return { success: Object.values(results).every(Boolean), results };
  } catch (error) {
    debugError('Form Data Inserter: Error filling form:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Select a nationality from the dropdown
 */
async function selectNationality(selector, value) {
  debugLog(`Form Data Inserter: Starting nationality selection for: ${value}`);
  
  try {
    // Get the element if a selector was provided
    let element = selector;
    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    }
    
    if (!element) {
      debugError('Form Data Inserter: Nationality element not found');
      return false;
    }
    
    // Convert to Spanish country name if needed
    const spanishValue = COUNTRIES[value];
    if (!spanishValue) {
      debugError(`Form Data Inserter: No Spanish translation found for "${value}"`);
      return false;
    }

    // Find the input element
    let input = element.querySelector('input[type="text"]');
    if (!input && element.tagName === 'INPUT') {
      input = element;
    }
    
    if (!input) {
      // Try to find the input by traversing up to find the v-autocomplete
      let parent = element;
      while (parent && !parent.classList.contains('v-autocomplete')) {
        parent = parent.parentElement;
        if (!parent) break;
      }
      if (parent) {
        input = parent.querySelector('input[type="text"]');
      }
    }
    
    if (!input) {
      debugError('Form Data Inserter: Could not find nationality input');
      return false;
    }
    
    debugLog('Form Data Inserter: Found nationality input element');

    // Check if the value is already correctly set
    if (input.value === spanishValue) {
      debugLog(`Form Data Inserter: Nationality is already set to "${spanishValue}", skipping selection`);
      return true;
    }
    
    // Clear the input first
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await sleep(500);
    
    // Focus and click the input
    input.focus();
    input.click();
    await sleep(500);
    
    // Type the first few characters to trigger filtering
    const firstChars = spanishValue.substring(0, 3);
    input.value = firstChars;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await sleep(1000);
    
    // Look for menu content
    let menuContent = document.querySelector('.v-menu__content:not([style*="display: none"])');
    if (!menuContent) {
      debugLog('Form Data Inserter: Menu not found on first try, attempting again');
      input.click();
      await sleep(1500);
      menuContent = document.querySelector('.v-menu__content:not([style*="display: none"])');
    }
    
    if (!menuContent) {
      debugError('Form Data Inserter: Could not find open menu content');
      return false;
    }
    
    debugLog('Form Data Inserter: Found open menu content');
    
    // Now set the full value
    input.value = spanishValue;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await sleep(500);
    
    // Look for list items
    const options = menuContent.querySelectorAll('.v-list__tile');
    debugLog(`Form Data Inserter: Found ${options.length} filtered nationality options`);
    
    if (options.length === 0) {
      debugError('Form Data Inserter: No options found in filtered dropdown');
      document.body.click(); // Close dropdown
      return false;
    }
    
    // Log filtered options
    const availableOptions = Array.from(options).map(option => {
      const titleEl = option.querySelector('.v-list__tile__title');
      return titleEl ? titleEl.textContent.trim() : option.textContent.trim();
    });
    debugLog('Form Data Inserter: Available filtered options:', availableOptions);
    
    // Try to find exact match
    for (const option of options) {
      const titleEl = option.querySelector('.v-list__tile__title');
      const optionText = titleEl ? titleEl.textContent.trim() : option.textContent.trim();
      
      debugLog(`Form Data Inserter: Comparing "${optionText}" with "${spanishValue}"`);
      
      if (optionText === spanishValue) {
        debugLog(`Form Data Inserter: Found exact nationality match: ${optionText}`);
        option.click();
        await sleep(100);
        return true;
      }
    }
    
    // If no exact match, try fuzzy matching
    for (const option of options) {
      const titleEl = option.querySelector('.v-list__tile__title');
      const optionText = titleEl ? titleEl.textContent.trim() : option.textContent.trim();
      
      if (optionText.toLowerCase().includes(spanishValue.toLowerCase()) || 
          spanishValue.toLowerCase().includes(optionText.toLowerCase())) {
        debugLog(`Form Data Inserter: Found fuzzy match: ${optionText}`);
        option.click();
        await sleep(100);
        return true;
      }
    }
    
    debugLog('Form Data Inserter: No matches found');
    document.body.click(); // Close dropdown
    return false;
  } catch (error) {
    debugError('Form Data Inserter: Error selecting nationality:', error);
    return false;
  }
}

// Replace final console.log with debugLog
debugLog('Sercom Form Filler loaded');

// Log a welcome message
debugLog("Form Data Inserter: Content script loaded and ready");   