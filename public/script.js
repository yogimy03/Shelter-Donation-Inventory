// Main JavaScript file for Shelter Donation Inventory System

// Global variables for managing application state
let donations = [];
let currentEditId = null;

// DOM elements
const donationForm = document.getElementById('donationForm');
const editForm = document.getElementById('editForm');
const editModal = document.getElementById('editModal');
const donationsList = document.getElementById('donationsList');
const refreshBtn = document.getElementById('refreshBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const messageContainer = document.getElementById('messageContainer');

// Statistics elements
const totalDonationsEl = document.getElementById('totalDonations');
const totalMoneyEl = document.getElementById('totalMoney');
const totalEstimatedValueEl = document.getElementById('totalEstimatedValue');
const totalTypesEl = document.getElementById('totalTypes');
const typeBreakdownEl = document.getElementById('typeBreakdown');

// Donation type icons mapping
const donationTypeIcons = {
    'money': '💰',
    'food': '🍽️',
    'clothing': '👕',
    'electronics': '📱',
    'furniture': '🪑',
    'books': '📚',
    'toys': '🧸',
    'medical': '💊',
    'hygiene': '🧴',
    'other': '📦'
};

// Donation type display names
const donationTypeNames = {
    'money': 'Money',
    'food': 'Food',
    'clothing': 'Clothing',
    'electronics': 'Electronics',
    'furniture': 'Furniture',
    'books': 'Books',
    'toys': 'Toys',
    'medical': 'Medical Supplies',
    'hygiene': 'Hygiene Products',
    'other': 'Other'
};

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Shelter Donation Inventory System initialized');
    
    // Set today's date as default in the form
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    // Load initial data
    loadDonations();
    loadStatistics();
    
    // Set up event listeners
    setupEventListeners();
});

// Set up all event listeners for user interactions
function setupEventListeners() {
    // Form submission for adding new donations
    donationForm.addEventListener('submit', handleAddDonation);
    
    // Form submission for editing donations
    editForm.addEventListener('submit', handleEditDonation);
    
    // Refresh button to reload data
    refreshBtn.addEventListener('click', function() {
        loadDonations();
        loadStatistics();
        showMessage('Data refreshed successfully!', 'success');
    });
    
    // close functionality
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', closeEditModal);
    
    // Close when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === editModal) {
            closeEditModal();
        }
    });
    
    // donation type change to show/hide description field
    const donationTypeSelect = document.getElementById('donationType');
    donationTypeSelect.addEventListener('change', function() {
        const descriptionField = document.querySelector('.description-field');
        if (this.value === 'other') {
            descriptionField.style.display = 'block';
            document.getElementById('description').required = true;
        } else {
            descriptionField.style.display = 'none';
            document.getElementById('description').required = false;
        }
    });
    
    // edit donation type change
    const editDonationTypeSelect = document.getElementById('editDonationType');
    editDonationTypeSelect.addEventListener('change', function() {
        const descriptionField = document.querySelector('.edit-description-field');
        if (this.value === 'other') {
            descriptionField.style.display = 'block';
            document.getElementById('editDescription').required = true;
        } else {
            descriptionField.style.display = 'none';
            document.getElementById('editDescription').required = false;
        }
    });
}

// adding a new donation
async function handleAddDonation(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(donationForm);
    const donationData = {
        donorName: formData.get('donorName'),
        type: formData.get('donationType'),
        amount: parseFloat(formData.get('amount')),
        estimatedValue: formData.get('estimatedValue') ? parseFloat(formData.get('estimatedValue')) : undefined,
        description: formData.get('description'),
        contactEmail: formData.get('contactEmail'),
        contactPhone: formData.get('contactPhone'),
        date: formData.get('date')
    };
    
    // Validate form data
    if (!validateDonationData(donationData)) {
        return;
    }
    
    try {
        showLoading(true);
        
        // Send POST request to create new donation
        const response = await fetch('/api/donations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(donationData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newDonation = await response.json();
        
        // Add to local array and update display
        donations.unshift(newDonation);
        displayDonations();
        
        loadStatistics();
        
        donationForm.reset();
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
        document.querySelector('.description-field').style.display = 'none';
        showMessage('Donation added successfully!', 'success');
        
    } catch (error) {
        console.error('Error adding donation:', error);
        showMessage('Failed to add donation. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// editing an existing donation
async function handleEditDonation(event) {
    event.preventDefault();
    
    if (!currentEditId) {
        showMessage('No donation selected for editing.', 'error');
        return;
    }
    
    // Get form data
    const formData = new FormData(editForm);
    const donationData = {
        donorName: formData.get('editDonorName'),
        type: formData.get('editDonationType'),
        amount: parseFloat(formData.get('editAmount')),
        estimatedValue: formData.get('editEstimatedValue') ? parseFloat(formData.get('editEstimatedValue')) : undefined,
        description: formData.get('editDescription'),
        contactEmail: formData.get('editContactEmail'),
        contactPhone: formData.get('editContactPhone'),
        date: formData.get('editDate')
    };
    
    // Validate form data
    if (!validateDonationData(donationData)) {
        return;
    }
    
    try {
        showLoading(true);
        
        // Send PUT request to update donation
        const response = await fetch(`/api/donations/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(donationData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const updatedDonation = await response.json();
        
        // Update local array and refresh display
        const index = donations.findIndex(d => d._id === currentEditId);
        if (index !== -1) {
            donations[index] = updatedDonation;
        }
        
        displayDonations();
        loadStatistics();
        
        // Close and show success message
        closeEditModal();
        showMessage('Donation updated successfully!', 'success');
        
    } catch (error) {
        console.error('Error updating donation:', error);
        showMessage('Failed to update donation. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Validate donation data before sending to server
function validateDonationData(data) {
    if (!data.donorName || data.donorName.trim().length < 2) {
        showMessage('Please enter a valid donor name (at least 2 characters).', 'error');
        return false;
    }
    
    if (!data.type) {
        showMessage('Please select a donation type.', 'error');
        return false;
    }
    
    if (!data.amount || data.amount <= 0) {
        showMessage('Please enter a valid amount greater than 0.', 'error');
        return false;
    }
    
    if (!data.date) {
        showMessage('Please select a donation date.', 'error');
        return false;
    }
    
    // Check if date is not in the future
    const selectedDate = new Date(data.date);
    const today = new Date();
    if (selectedDate > today) {
        showMessage('Donation date cannot be in the future.', 'error');
        return false;
    }
    
    // Validate description is provided for "other" type
    if (data.type === 'other' && (!data.description || data.description.trim().length === 0)) {
        showMessage('Please provide a description for "other" type donations.', 'error');
        return false;
    }
    
    return true;
}

// Load all donations from the server
async function loadDonations() {
    try {
        showLoading(true);
        
        const response = await fetch('/api/donations');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        donations = await response.json();
        displayDonations();
        
    } catch (error) {
        console.error('Error loading donations:', error);
        showMessage('Failed to load donations. Please refresh the page.', 'error');
    } finally {
        showLoading(false);
    }
}

// Load statistics from the server
async function loadStatistics() {
    try {
        const response = await fetch('/api/statistics');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const stats = await response.json();
        updateStatisticsDisplay(stats);
        
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Update the statistics display on the page
function updateStatisticsDisplay(stats) {
    totalDonationsEl.textContent = stats.totalDonations;
    totalMoneyEl.textContent = `$${stats.totalMoney.toLocaleString()}`;
    totalEstimatedValueEl.textContent = `$${stats.totalEstimatedValue.toLocaleString()}`;
    
    // Calculate total types with donations
    const totalTypes = Object.values(stats.typeBreakdown).filter(count => count > 0).length;
    totalTypesEl.textContent = totalTypes;
    
    // Update type breakdown
    updateTypeBreakdown(stats.typeBreakdown);
}

// Update the type breakdown display
function updateTypeBreakdown(typeBreakdown) {
    const typeBreakdownHTML = Object.entries(typeBreakdown).map(([type, count]) => {
        if (count === 0) return '';
        
        return `
            <div class="type-item">
                <span class="type-icon">${donationTypeIcons[type] || '📦'}</span>
                <div class="type-name">${donationTypeNames[type] || type}</div>
                <div class="type-count">${count}</div>
            </div>
        `;
    }).join('');
    
    typeBreakdownEl.innerHTML = typeBreakdownHTML;
}

// Display donations in the list
function displayDonations() {
    if (donations.length === 0) {
        donationsList.innerHTML = `
            <div class="text-center" style="padding: 2rem; color: #666;">
                <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No donations found. Add your first donation above!</p>
            </div>
        `;
        return;
    }
    
    const donationsHTML = donations.map(donation => `
        <div class="donation-item" data-id="${donation._id}">
            <div class="donation-header">
                <span class="donor-name">${escapeHtml(donation.donorName)}</span>
                <span class="donation-type">${donationTypeIcons[donation.type]} ${donationTypeNames[donation.type]}</span>
            </div>
            
            <div class="donation-details">
                <div class="detail-item">
                    <span class="detail-label">Amount/Quantity:</span>
                    <span class="detail-value">
                        ${donation.type === 'money' ? '$' : ''}${donation.amount}${donation.type === 'money' ? '' : ' items'}
                    </span>
                </div>
                ${donation.estimatedValue ? `
                    <div class="detail-item">
                        <span class="detail-label">Estimated Value:</span>
                        <span class="detail-value">$${donation.estimatedValue.toLocaleString()}</span>
                    </div>
                ` : ''}
                ${donation.description ? `
                    <div class="detail-item">
                        <span class="detail-label">Description:</span>
                        <span class="detail-value">${escapeHtml(donation.description)}</span>
                    </div>
                ` : ''}
                <div class="detail-item">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${formatDate(donation.date)}</span>
                </div>
                ${donation.contactEmail || donation.contactPhone ? `
                    <div class="detail-item">
                        <span class="detail-label">Contact:</span>
                        <span class="detail-value">
                            ${donation.contactEmail ? `📧 ${escapeHtml(donation.contactEmail)}` : ''}
                            ${donation.contactEmail && donation.contactPhone ? '<br>' : ''}
                            ${donation.contactPhone ? `📞 ${escapeHtml(donation.contactPhone)}` : ''}
                        </span>
                    </div>
                ` : ''}
                <div class="detail-item">
                    <span class="detail-label">Added:</span>
                    <span class="detail-value">${formatDate(donation.createdAt)}</span>
                </div>
            </div>
            
            <div class="donation-actions">
                <button class="btn btn-edit" onclick="editDonation('${donation._id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger" onclick="deleteDonation('${donation._id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
    
    donationsList.innerHTML = donationsHTML;
}

// Edit a donation - opens the with pre-filled data
function editDonation(id) {
    const donation = donations.find(d => d._id === id);
    if (!donation) {
        showMessage('Donation not found.', 'error');
        return;
    }
    
    // Set current edit ID and populate form
    currentEditId = id;
    document.getElementById('editId').value = id;
    document.getElementById('editDonorName').value = donation.donorName;
    document.getElementById('editDonationType').value = donation.type;
    document.getElementById('editAmount').value = donation.amount;
    document.getElementById('editEstimatedValue').value = donation.estimatedValue || '';
    document.getElementById('editDescription').value = donation.description || '';
    document.getElementById('editContactEmail').value = donation.contactEmail || '';
    document.getElementById('editContactPhone').value = donation.contactPhone || '';
    document.getElementById('editDate').value = donation.date;
    
    // Show/hide description field based on type
    const descriptionField = document.querySelector('.edit-description-field');
    if (donation.type === 'other') {
        descriptionField.style.display = 'block';
        document.getElementById('editDescription').required = true;
    } else {
        descriptionField.style.display = 'none';
        document.getElementById('editDescription').required = false;
    }
    
    // Show the modal
    editModal.style.display = 'block';
}

// Delete a donation
async function deleteDonation(id) {
    if (!confirm('Are you sure you want to delete this donation? This action cannot be undone.')) {
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`/api/donations/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Remove from local array and update display
        donations = donations.filter(d => d._id !== id);
        displayDonations();
        
        // Update statistics
        loadStatistics();
        
        showMessage('Donation deleted successfully!', 'success');
        
    } catch (error) {
        console.error('Error deleting donation:', error);
        showMessage('Failed to delete donation. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Close the edit
function closeEditModal() {
    editModal.style.display = 'none';
    currentEditId = null;
    editForm.reset();
    document.querySelector('.edit-description-field').style.display = 'none';
}

// Show loading spinner
function showLoading(show) {
    loadingSpinner.style.display = show ? 'flex' : 'none';
}

// Show success or error messages
function showMessage(message, type = 'success') {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    messageContainer.appendChild(messageEl);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }, 5000);
}

// Utility function to escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Utility function to format dates
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Escape key to close
    if (event.key === 'Escape' && editModal.style.display === 'block') {
        closeEditModal();
    }
    
    // Ctrl+R or F5 to refresh
    if ((event.ctrlKey && event.key === 'r') || event.key === 'F5') {
        event.preventDefault();
        loadDonations();
        loadStatistics();
        showMessage('Data refreshed successfully!', 'success');
    }
});

// Add some helpful console messages for developers TESTING PURPOSES
console.log('Shelter Donation Inventory System loaded successfully!');
console.log('Available keyboard shortcuts:');
console.log('- Escape: Close modal');
console.log('- Ctrl+R or F5: Refresh data');