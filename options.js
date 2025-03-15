/**
 * Options page functionality
 */

// DOM Elements
const elements = {
  profilesTable: document.getElementById('profilesTable'),
  exportBtn: document.getElementById('exportBtn'),
  importBtn: document.getElementById('importBtn'),
  importFile: document.getElementById('importFile'),
  defaultNationality: document.getElementById('defaultNationality'),
  defaultGender: document.getElementById('defaultGender'),
  saveDefaultsBtn: document.getElementById('saveDefaultsBtn'),
  statusMessage: document.getElementById('statusMessage')
};

/**
 * Set a status message with optional class for styling
 */
function setStatus(message, className = '') {
  elements.statusMessage.textContent = message;
  elements.statusMessage.className = 'status ' + className;
  
  // Auto-clear the status after 5 seconds
  setTimeout(() => {
    elements.statusMessage.textContent = '';
    elements.statusMessage.className = 'status';
  }, 5000);
}

/**
 * Load and display all saved profiles
 */
function loadProfiles() {
  chrome.storage.sync.get(['profiles'], function(result) {
    const profiles = result.profiles || { 'default': {} };
    
    // Clear existing rows
    const tbody = elements.profilesTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    // Add each profile as a row
    Object.entries(profiles).forEach(([profileName, profileData]) => {
      const row = document.createElement('tr');
      
      // Profile name cell
      const nameCell = document.createElement('td');
      nameCell.textContent = profileName;
      row.appendChild(nameCell);
      
      // ID Type cell
      const idTypeCell = document.createElement('td');
      idTypeCell.textContent = profileData.idType || 'N/A';
      row.appendChild(idTypeCell);
      
      // Full name cell
      const fullNameCell = document.createElement('td');
      const fullName = [
        profileData.name || '', 
        profileData.firstSurname || '', 
        profileData.secondSurname || ''
      ].filter(Boolean).join(' ');
      fullNameCell.textContent = fullName || 'N/A';
      row.appendChild(fullNameCell);
      
      // Action buttons cell
      const actionsCell = document.createElement('td');
      actionsCell.className = 'action-buttons';
      
      // View button
      const viewBtn = document.createElement('button');
      viewBtn.textContent = 'View';
      viewBtn.addEventListener('click', () => viewProfile(profileName, profileData));
      actionsCell.appendChild(viewBtn);
      
      // Delete button - disable for default profile
      if (profileName !== 'default') {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.backgroundColor = '#d9534f';
        deleteBtn.addEventListener('click', () => deleteProfile(profileName));
        actionsCell.appendChild(deleteBtn);
      }
      
      row.appendChild(actionsCell);
      tbody.appendChild(row);
    });
  });
}

/**
 * View details of a specific profile
 */
function viewProfile(profileName, profileData) {
  // Create a formatted string of profile data
  const formattedData = Object.entries(profileData)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  
  alert(`Profile: ${profileName}\n\n${formattedData}`);
}

/**
 * Delete a specific profile
 */
function deleteProfile(profileName) {
  if (!confirm(`Are you sure you want to delete the profile "${profileName}"?`)) {
    return;
  }
  
  chrome.storage.sync.get(['profiles'], function(result) {
    const profiles = result.profiles || {};
    
    // Delete the profile
    delete profiles[profileName];
    
    chrome.storage.sync.set({ profiles }, function() {
      setStatus(`Profile "${profileName}" deleted.`, 'success');
      loadProfiles(); // Refresh the table
    });
  });
}

/**
 * Export all profiles as JSON download
 */
function exportProfiles() {
  chrome.storage.sync.get(['profiles'], function(result) {
    const profiles = result.profiles || {};
    
    // Create a JSON blob
    const blob = new Blob([JSON.stringify(profiles, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link to download the blob
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-data-inserter-profiles.json';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setStatus('Profiles exported successfully!', 'success');
    }, 0);
  });
}

/**
 * Import profiles from a JSON file
 */
function importProfiles() {
  const file = elements.importFile.files[0];
  if (!file) {
    setStatus('No file selected.', 'error');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const importedProfiles = JSON.parse(event.target.result);
      
      chrome.storage.sync.get(['profiles'], function(result) {
        const currentProfiles = result.profiles || {};
        
        // Confirm overwriting existing profiles
        const overwriteProfiles = Object.keys(importedProfiles).filter(name => 
          name !== 'default' && currentProfiles[name]
        );
        
        if (overwriteProfiles.length > 0) {
          if (!confirm(`The following profiles already exist and will be overwritten: ${overwriteProfiles.join(', ')}. Continue?`)) {
            setStatus('Import cancelled.', 'error');
            return;
          }
        }
        
        // Merge profiles, preserving default
        const mergedProfiles = { ...currentProfiles };
        Object.entries(importedProfiles).forEach(([name, data]) => {
          if (name !== 'default') {
            mergedProfiles[name] = data;
          }
        });
        
        chrome.storage.sync.set({ profiles: mergedProfiles }, function() {
          setStatus('Profiles imported successfully!', 'success');
          loadProfiles(); // Refresh the table
        });
      });
    } catch (error) {
      setStatus(`Error parsing file: ${error.message}`, 'error');
    }
  };
  
  reader.readAsText(file);
}

/**
 * Load default settings
 */
function loadDefaultSettings() {
  chrome.storage.sync.get(['defaultSettings'], function(result) {
    const defaultSettings = result.defaultSettings || {};
    
    elements.defaultNationality.value = defaultSettings.nationality || 'España';
    elements.defaultGender.value = defaultSettings.gender || 'Hombre';
  });
}

/**
 * Save default settings
 */
function saveDefaultSettings() {
  const defaultSettings = {
    nationality: elements.defaultNationality.value,
    gender: elements.defaultGender.value
  };
  
  chrome.storage.sync.set({ defaultSettings }, function() {
    setStatus('Default settings saved!', 'success');
  });
}

// ======== Event Listeners ========

// Load profiles and settings when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadProfiles();
  loadDefaultSettings();
});

// Export profiles button
elements.exportBtn.addEventListener('click', exportProfiles);

// Import profiles button - trigger file selection
elements.importBtn.addEventListener('click', function() {
  elements.importFile.click();
});

// Import file selected
elements.importFile.addEventListener('change', importProfiles);

// Save default settings button
elements.saveDefaultsBtn.addEventListener('click', saveDefaultSettings); 