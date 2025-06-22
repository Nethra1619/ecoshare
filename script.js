// Sample data for demonstration
let sharedItems = [
    {
        id: 1,
        title: "Fresh Homegrown Tomatoes",
        description: "Just picked from my garden! Too many for my family to eat.",
        category: "food",
        location: "Oak Street",
        contact: "sarah.garden@email.com",
        expires: "2025-01-20",
        posted: "2025-01-15"
    },
    {
        id: 2,
        title: "Complete Harry Potter Book Set",
        description: "My kids outgrew these. All books in excellent condition.",
        category: "books",
        location: "Maple Avenue",
        contact: "bookworm42@email.com",
        expires: null,
        posted: "2025-01-14"
    },
    {
        id: 3,
        title: "Power Drill & Tool Set",
        description: "Available for borrowing. Great for small home projects.",
        category: "tools",
        location: "Pine Street",
        contact: "handyman.joe@email.com",
        expires: null,
        posted: "2025-01-13"
    },
    {
        id: 4,
        title: "Leftover Party Food",
        description: "Sandwiches, salads, and snacks from office party. Still fresh!",
        category: "food",
        location: "Downtown",
        contact: "office.manager@email.com",
        expires: "2025-01-16",
        posted: "2025-01-15"
    }
];

let currentFilter = 'all';
let itemIdCounter = 5;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderItems();
    setupEventListeners();
    updateStats();
    setMinDate();
});

function renderItems() {
    const itemsGrid = document.getElementById('items-grid');
    const filteredItems = currentFilter === 'all' 
        ? sharedItems 
        : sharedItems.filter(item => item.category === currentFilter);

    if (filteredItems.length === 0) {
        itemsGrid.innerHTML = '<div class="no-items"><p>No items found in this category. Be the first to share!</p></div>';
        return;
    }

    itemsGrid.innerHTML = filteredItems
        .sort((a, b) => new Date(b.posted) - new Date(a.posted))
        .map(item => `
            <div class="item-card" data-category="${item.category}">
                <div class="item-header">
                    <div class="item-category">${getCategoryIcon(item.category)} ${item.category}</div>
                    ${item.expires ? `<div class="item-expires ${isExpiringSoon(item.expires) ? 'urgent' : ''}">
                        Expires: ${formatDate(item.expires)}
                    </div>` : ''}
                </div>
                <h3 class="item-title">${item.title}</h3>
                <p class="item-description">${item.description}</p>
                <div class="item-footer">
                    <div class="item-location">📍 ${item.location}</div>
                    <div class="item-posted">Posted: ${formatDate(item.posted)}</div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-primary btn-sm" onclick="contactOwner('${item.contact}', '${item.title}')">
                        Contact Owner
                    </button>
                </div>
            </div>
        `).join('');
}

function setupEventListeners() {
    // Filter buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('filter-btn')) {
            currentFilter = e.target.dataset.filter;
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            renderItems();
        }
    });

    // Add item modal
    const addItemBtn = document.getElementById('add-item-btn');
    const modal = document.getElementById('add-item-modal');
    const modalClose = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('cancel-btn');
    
    addItemBtn.onclick = () => modal.classList.add('active');
    modalClose.onclick = () => modal.classList.remove('active');
    cancelBtn.onclick = () => modal.classList.remove('active');
    
    // Close modal on backdrop click
    modal.onclick = (e) => {
        if (e.target === modal) modal.classList.remove('active');
    };

    // Form submission
    document.getElementById('add-item-form').onsubmit = function(e) {
        e.preventDefault();
        
        const newItem = {
            id: itemIdCounter++,
            title: document.getElementById('item-title').value,
            description: document.getElementById('item-description').value,
            category: document.getElementById('item-category').value,
            location: document.getElementById('item-location').value,
            contact: document.getElementById('item-contact').value,
            expires: document.getElementById('item-expires').value || null,
            posted: new Date().toISOString().split('T')[0]
        };
        
        sharedItems.unshift(newItem);
        modal.classList.remove('active');
        e.target.reset();
        
        // Update the display
        renderItems();
        updateStats();
        
        // Show success message
        showNotification('Item shared successfully! 🎉');
    };
}

function getCategoryIcon(category) {
    const icons = {
        food: '🍎',
        books: '📚',
        tools: '🔧',
        household: '🏠',
        other: '📦'
    };
    return icons[category] || '📦';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
}

function isExpiringSoon(expiresDate) {
    const today = new Date();
    const expires = new Date(expiresDate);
    const diffTime = expires - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
}

function contactOwner(contact, itemTitle) {
    if (contact.includes('@')) {
        window.open(`mailto:${contact}?subject=Interest in: ${itemTitle}&body=Hi! I'm interested in the ${itemTitle} you posted on EcoShare. When would be a good time to arrange pickup?`);
    } else {
        // For phone numbers or other contact methods
        showNotification(`Contact: ${contact}`, 5000);
    }
}

function updateStats() {
    document.getElementById('items-count').textContent = sharedItems.length;
    document.getElementById('pounds-saved').textContent = Math.floor(sharedItems.length * 2.3);
    document.getElementById('neighbors-helped').textContent = Math.floor(sharedItems.length * 1.8);
}

function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, duration);
}

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('item-expires').setAttribute('min', today);
}