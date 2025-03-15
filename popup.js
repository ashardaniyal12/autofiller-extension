/**
 * Main functionality for the popup interface
 */

// ======== DOM Elements ========
const elements = {
  // Remove profile elements
  // profileSelect: document.getElementById('profileSelect'),
  // saveProfile: document.getElementById('saveProfile'),
  // deleteProfile: document.getElementById('deleteProfile'),
  
  // Form elements
  name: document.getElementById('name'),
  firstSurname: document.getElementById('firstSurname'),
  secondSurname: document.getElementById('secondSurname'),
  idType: document.getElementById('idType'),
  idNumber: document.getElementById('idNumber'),
  birthDate: document.getElementById('birthDate'),
  gender: document.getElementById('gender'),
  nationality: document.getElementById('nationality'),
  
  // Action buttons
  generateBtn: document.getElementById('generateBtn'),
  insertBtn: document.getElementById('insertBtn'),
  
  // Status message
  statusMessage: document.getElementById('statusMessage')
};

// ======== Helper Functions ========

/**
 * Set status message with appropriate styling
 */
function setStatus(message, type = 'info') {
  elements.statusMessage.textContent = message;
  elements.statusMessage.className = 'status ' + type;
  
  // Clear status after 3 seconds
  setTimeout(() => {
    elements.statusMessage.textContent = '';
    elements.statusMessage.className = 'status';
  }, 3000);
}

/**
 * Get all form data as an object
 */
function getFormData() {
  return {
    name: elements.name.value,
    firstSurname: elements.firstSurname.value,
    secondSurname: elements.secondSurname.value,
    idType: elements.idType.value,
    idNumber: elements.idNumber.value,
    birthDate: elements.birthDate.value,
    gender: elements.gender.value,
    nationality: elements.nationality.value
  };
}

/**
 * Fill the form with profile data
 */
function fillFormWithProfileData(data) {
  // Save the current ID type selection
  const currentIdType = elements.idType.value;
  
  // Fill in form fields
  if (data.name) elements.name.value = data.name;
  if (data.firstSurname) elements.firstSurname.value = data.firstSurname;
  if (data.secondSurname) elements.secondSurname.value = data.secondSurname;
  // Don't change ID type - keep it as Passport
  // if (data.idType) elements.idType.value = data.idType;
  if (data.idNumber) elements.idNumber.value = data.idNumber;
  if (data.birthDate) elements.birthDate.value = data.birthDate;
  if (data.gender) elements.gender.value = data.gender;
  if (data.nationality) elements.nationality.value = data.nationality;
  
  // Restore the ID type to Passport
  elements.idType.value = "Passport";
}

/**
 * Update nationality dropdown with supported countries
 */
function updateNationalityDropdown() {
  const nationalitySelect = document.getElementById('nationality');
  nationalitySelect.innerHTML = ''; // Clear existing options
  
  // Add default empty option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '-- Select Nationality --';
  nationalitySelect.appendChild(defaultOption);
  
  // Add supported countries
  const countries = [
    'Germany',
    'France',
    'United Kingdom',
    'United States',
    'Italy',
    'Brazil',
    'Australia',
    'Morocco',
    'Algeria',
    'South Africa'
  ];
  
  countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    nationalitySelect.appendChild(option);
  });
}

/**
 * Generate random data based on selected options
 */
function generateRandomData() {
  const gender = document.getElementById('gender').value;
  const nationality = document.getElementById('nationality').value;
  
  // Convert gender to Male/Female format for DataGenerator
  const genderForGenerator = gender === 'Hombre' ? 'Male' : 'Female';
  
  const profile = DataGenerator.generateProfile(genderForGenerator, nationality);
  if (profile) {
    document.getElementById('name').value = profile.name;
    document.getElementById('firstSurname').value = profile.firstSurname;
    document.getElementById('secondSurname').value = profile.secondSurname;
    document.getElementById('idType').value = profile.idType;
    document.getElementById('idNumber').value = profile.idNumber;
    document.getElementById('birthDate').value = profile.birthDate;
    document.getElementById('gender').value = profile.gender;
    document.getElementById('nationality').value = profile.nationality;
    
    setStatus('Random data generated successfully!', 'success');
  } else {
    setStatus('Error generating random data. Please try again.', 'error');
  }
}

/**
 * Insert the current form data into the target webpage
 */
function insertDataIntoPage() {
  const data = getFormData();
  
  // Set status to indicate we're working
  setStatus('Inserting data...', 'info');
  
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (!tabs || !tabs[0] || !tabs[0].id) {
      setStatus('Error: No active tab found', 'error');
      return;
    }
    
    // Send message to content script
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "insertData", data: data },
      function(response) {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
          setStatus('Error: Content script not available. Please refresh the page.', 'error');
          return;
        }
        
        if (response && response.success) {
          setStatus('Data inserted successfully!', 'success');
        } else {
          setStatus('Error inserting data. Check the console for details.', 'error');
        }
      }
    );
  });
}

// ======== Event Listeners ========

document.addEventListener('DOMContentLoaded', () => {
  // Initialize form elements
  updateNationalityDropdown();
  
  // Add event listeners
  document.getElementById('generateBtn').addEventListener('click', generateRandomData);
  document.getElementById('insertBtn').addEventListener('click', insertDataIntoPage);
  
  // Set initial status
  setStatus('Ready to generate and insert data', 'info');
});

// Load when popup opens
document.addEventListener('DOMContentLoaded', function() {
  // Set default ID type to Passport
  elements.idType.value = "Passport";
  
  // Check if we're on a compatible page
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs && tabs[0] && tabs[0].id) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'getFieldInfo' },
        function(response) {
          if (chrome.runtime.lastError) {
            // Content script not available, disable insert button
            elements.insertBtn.disabled = true;
            elements.insertBtn.title = "Please refresh the page to use this extension";
            setStatus('Please refresh the page to use this extension', 'warning');
            return;
          }
          
          if (response && response.fieldInfo && response.fieldInfo.formDetected) {
            // Form detected, enable insert button
            elements.insertBtn.disabled = false;
          } else {
            // No form detected, disable insert button
            elements.insertBtn.disabled = true;
            elements.insertBtn.title = "No compatible form detected on this page";
            setStatus('No compatible form detected on this page', 'warning');
          }
        }
      );
    }
  });
}); 