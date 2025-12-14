// Toggle functionality
function toggleView(view) {
    const calcSection = document.getElementById('calculator-section');
    const outfitSection = document.getElementById('outfit-section');
    const calcToggle = document.getElementById('calc-toggle');
    const outfitToggle = document.getElementById('outfit-toggle');
    
    if (view === 'calculator') {
        calcSection.classList.add('active');
        outfitSection.classList.remove('active');
        calcToggle.classList.add('active');
        outfitToggle.classList.remove('active');
    } else {
        calcSection.classList.remove('active');
        outfitSection.classList.add('active');
        calcToggle.classList.remove('active');
        outfitToggle.classList.add('active');
    }
}

// Calculator functionality
let display = document.getElementById('display');
let currentInput = '0';
let shouldResetDisplay = false;

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    
    display.value = currentInput;
}

function clearDisplay() {
    currentInput = '0';
    display.value = currentInput;
    shouldResetDisplay = false;
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    display.value = currentInput;
}

function calculate() {
    try {
        // Replace × with * for calculation
        let expression = currentInput.replace(/×/g, '*');
        let result = eval(expression);
        
        // Round to avoid floating point errors
        if (result % 1 !== 0) {
            result = Math.round(result * 100000000) / 100000000;
        }
        
        currentInput = result.toString();
        display.value = currentInput;
        shouldResetDisplay = true;
    } catch (error) {
        display.value = 'Error';
        currentInput = '0';
        shouldResetDisplay = true;
    }
}

// Gender selection
let selectedGender = 'woman';

function selectGender(gender) {
    selectedGender = gender;
    const womanBtn = document.getElementById('woman-btn');
    const manBtn = document.getElementById('man-btn');
    
    if (gender === 'woman') {
        womanBtn.classList.add('active');
        manBtn.classList.remove('active');
    } else {
        manBtn.classList.add('active');
        womanBtn.classList.remove('active');
    }
}

// Outfit Generator functionality - Women's (Feminine) Collection
const womenOutfits = {
    tops: [
        { name: 'Silk Blouse', emoji: '👔', color: 'Ivory', style: 'Elegant', brand: 'Celine', url: 'https://www.celine.com' },
        { name: 'Cashmere Sweater', emoji: '🧥', color: 'Cream', style: 'Luxurious', brand: 'Brunello Cucinelli', url: 'https://shop.brunellocucinelli.com' },
        { name: 'Lace Camisole', emoji: '💃', color: 'Champagne', style: 'Feminine', brand: 'La Perla', url: 'https://www.laperla.com' },
        { name: 'Tailored Blazer', emoji: '🤵', color: 'Navy', style: 'Sophisticated', brand: 'Saint Laurent', url: 'https://www.ysl.com' },
        { name: 'Silk Wrap Top', emoji: '👚', color: 'Rose', style: 'Romantic', brand: 'Chloé', url: 'https://www.chloe.com' },
        { name: 'Designer T-Shirt', emoji: '👕', color: 'White', style: 'Minimalist', brand: 'The Row', url: 'https://www.therow.com' }
    ],
    bottoms: [
        { name: 'Tailored Trousers', emoji: '👖', color: 'Charcoal', style: 'Professional', brand: 'Theory', url: 'https://www.theory.com' },
        { name: 'A-Line Skirt', emoji: '👗', color: 'Black', style: 'Classic', brand: 'Dior', url: 'https://www.dior.com' },
        { name: 'Silk Midi Skirt', emoji: '👘', color: 'Dusty Rose', style: 'Elegant', brand: 'Gucci', url: 'https://www.gucci.com' },
        { name: 'Wide-Leg Pants', emoji: '👖', color: 'Camel', style: 'Modern', brand: 'Max Mara', url: 'https://www.maxmara.com' },
        { name: 'Leather Skirt', emoji: '👗', color: 'Black', style: 'Edgy', brand: 'Balenciaga', url: 'https://www.balenciaga.com' },
        { name: 'Pleated Midi Skirt', emoji: '👘', color: 'Burgundy', style: 'Vintage', brand: 'Miu Miu', url: 'https://www.miumiu.com' }
    ],
    shoes: [
        { name: 'Heeled Boots', emoji: '👢', color: 'Tan', style: 'Chic', brand: 'Bottega Veneta', url: 'https://www.bottegaveneta.com' },
        { name: 'Classic Pumps', emoji: '👠', color: 'Nude', style: 'Timeless', brand: 'Christian Louboutin', url: 'https://www.christianlouboutin.com' },
        { name: 'Ankle Boots', emoji: '🥾', color: 'Black', style: 'Versatile', brand: 'Acne Studios', url: 'https://www.acnestudios.com' },
        { name: 'Designer Sneakers', emoji: '👟', color: 'White', style: 'Casual', brand: 'Golden Goose', url: 'https://www.goldengoose.com' },
        { name: 'Strappy Sandals', emoji: '👡', color: 'Gold', style: 'Glamorous', brand: 'Manolo Blahnik', url: 'https://www.manoloblahnik.com' },
        { name: 'Loafers', emoji: '👞', color: 'Burgundy', style: 'Preppy', brand: 'Tod\'s', url: 'https://www.tods.com' }
    ],
    accessories: [
        { name: 'Designer Handbag', emoji: '👜', color: 'Camel', style: 'Luxury', brand: 'Hermès', url: 'https://www.hermes.com' },
        { name: 'Pearl Necklace', emoji: '💍', color: 'White', style: 'Classic', brand: 'Mikimoto', url: 'https://www.mikimoto.com' },
        { name: 'Silk Scarf', emoji: '🧣', color: 'Floral', style: 'Parisian', brand: 'Hermès', url: 'https://www.hermes.com' },
        { name: 'Sunglasses', emoji: '🕶️', color: 'Tortoise', style: 'Cool', brand: 'Celine', url: 'https://www.celine.com' },
        { name: 'Leather Belt', emoji: '⛓️', color: 'Brown', style: 'Classic', brand: 'Gucci', url: 'https://www.gucci.com' },
        { name: 'Diamond Earrings', emoji: '💎', color: 'Platinum', style: 'Elegant', brand: 'Tiffany & Co.', url: 'https://www.tiffany.com' }
    ],
    styles: [
        'Business Elegance',
        'Evening Glamour',
        'Parisian Chic',
        'Minimalist Luxury',
        'Modern Classic',
        'Romantic Femininity',
        'Power Dressing',
        'Avant-Garde'
    ]
};

// Outfit Generator functionality - Men's (Manly) Collection
const menOutfits = {
    tops: [
        { name: 'Oxford Shirt', emoji: '👔', color: 'White', style: 'Classic', brand: 'Brooks Brothers', url: 'https://www.brooksbrothers.com' },
        { name: 'Cashmere Sweater', emoji: '🧥', color: 'Navy', style: 'Refined', brand: 'Brunello Cucinelli', url: 'https://shop.brunellocucinelli.com' },
        { name: 'Tailored Blazer', emoji: '🤵', color: 'Charcoal', style: 'Sophisticated', brand: 'Tom Ford', url: 'https://www.tomford.com' },
        { name: 'Designer T-Shirt', emoji: '👕', color: 'Black', style: 'Minimalist', brand: 'Rick Owens', url: 'https://www.rickowens.eu' },
        { name: 'Polo Shirt', emoji: '👕', color: 'Navy', style: 'Preppy', brand: 'Ralph Lauren', url: 'https://www.ralphlauren.com' },
        { name: 'Leather Jacket', emoji: '🧥', color: 'Black', style: 'Edgy', brand: 'Saint Laurent', url: 'https://www.ysl.com' }
    ],
    bottoms: [
        { name: 'Tailored Trousers', emoji: '👖', color: 'Charcoal', style: 'Professional', brand: 'Zegna', url: 'https://www.zegna.com' },
        { name: 'Chinos', emoji: '👖', color: 'Khaki', style: 'Casual', brand: 'J.Crew', url: 'https://www.jcrew.com' },
        { name: 'Designer Jeans', emoji: '👖', color: 'Indigo', style: 'Modern', brand: 'Acne Studios', url: 'https://www.acnestudios.com' },
        { name: 'Wool Trousers', emoji: '👖', color: 'Navy', style: 'Elegant', brand: 'Canali', url: 'https://www.canali.com' },
        { name: 'Cargo Pants', emoji: '👖', color: 'Olive', style: 'Utilitarian', brand: 'Stone Island', url: 'https://www.stoneisland.com' },
        { name: 'Suit Pants', emoji: '👖', color: 'Black', style: 'Formal', brand: 'Brioni', url: 'https://www.brioni.com' }
    ],
    shoes: [
        { name: 'Oxford Shoes', emoji: '👞', color: 'Black', style: 'Classic', brand: 'Church\'s', url: 'https://www.church-footwear.com' },
        { name: 'Chelsea Boots', emoji: '👢', color: 'Brown', style: 'Versatile', brand: 'Common Projects', url: 'https://www.commonprojects.com' },
        { name: 'Designer Sneakers', emoji: '👟', color: 'White', style: 'Casual', brand: 'Golden Goose', url: 'https://www.goldengoose.com' },
        { name: 'Loafers', emoji: '👞', color: 'Burgundy', style: 'Preppy', brand: 'Tod\'s', url: 'https://www.tods.com' },
        { name: 'Derby Shoes', emoji: '👞', color: 'Tan', style: 'Sophisticated', brand: 'John Lobb', url: 'https://www.johnlobb.com' },
        { name: 'Combat Boots', emoji: '🥾', color: 'Black', style: 'Edgy', brand: 'Rick Owens', url: 'https://www.rickowens.eu' }
    ],
    accessories: [
        { name: 'Leather Briefcase', emoji: '💼', color: 'Brown', style: 'Professional', brand: 'Valextra', url: 'https://www.valextra.com' },
        { name: 'Watch', emoji: '⌚', color: 'Steel', style: 'Luxury', brand: 'Rolex', url: 'https://www.rolex.com' },
        { name: 'Silk Tie', emoji: '👔', color: 'Navy', style: 'Classic', brand: 'Hermès', url: 'https://www.hermes.com' },
        { name: 'Sunglasses', emoji: '🕶️', color: 'Black', style: 'Cool', brand: 'Persol', url: 'https://www.persol.com' },
        { name: 'Leather Belt', emoji: '⛓️', color: 'Brown', style: 'Classic', brand: 'Hermès', url: 'https://www.hermes.com' },
        { name: 'Cufflinks', emoji: '💎', color: 'Silver', style: 'Elegant', brand: 'Tiffany & Co.', url: 'https://www.tiffany.com' }
    ],
    styles: [
        'Business Professional',
        'Italian Elegance',
        'Street Style',
        'Minimalist Sophistication',
        'Classic Gentleman',
        'Modern Edge',
        'Preppy Refinement',
        'Avant-Garde'
    ]
};

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateOutfit() {
    const outfitData = selectedGender === 'woman' ? womenOutfits : menOutfits;
    
    const top = getRandomItem(outfitData.tops);
    const bottom = getRandomItem(outfitData.bottoms);
    const shoes = getRandomItem(outfitData.shoes);
    const accessory = getRandomItem(outfitData.accessories);
    const overallStyle = getRandomItem(outfitData.styles);
    
    const outfitDisplay = document.getElementById('outfit-display');
    
    outfitDisplay.innerHTML = `
        <a href="${top.url}" target="_blank" rel="noopener noreferrer" class="outfit-item outfit-link">
            <h3><span class="emoji">${top.emoji}</span>${top.name}</h3>
            <p><strong>Color:</strong> ${top.color} | <strong>Style:</strong> ${top.style}</p>
            <span class="brand">${top.brand}</span>
            <span class="shop-label">Click to Shop →</span>
        </a>
        <a href="${bottom.url}" target="_blank" rel="noopener noreferrer" class="outfit-item outfit-link">
            <h3><span class="emoji">${bottom.emoji}</span>${bottom.name}</h3>
            <p><strong>Color:</strong> ${bottom.color} | <strong>Style:</strong> ${bottom.style}</p>
            <span class="brand">${bottom.brand}</span>
            <span class="shop-label">Click to Shop →</span>
        </a>
        <a href="${shoes.url}" target="_blank" rel="noopener noreferrer" class="outfit-item outfit-link">
            <h3><span class="emoji">${shoes.emoji}</span>${shoes.name}</h3>
            <p><strong>Color:</strong> ${shoes.color} | <strong>Style:</strong> ${shoes.style}</p>
            <span class="brand">${shoes.brand}</span>
            <span class="shop-label">Click to Shop →</span>
        </a>
        <a href="${accessory.url}" target="_blank" rel="noopener noreferrer" class="outfit-item outfit-link">
            <h3><span class="emoji">${accessory.emoji}</span>${accessory.name}</h3>
            <p><strong>Color:</strong> ${accessory.color} | <strong>Style:</strong> ${accessory.style}</p>
            <span class="brand">${accessory.brand}</span>
            <span class="shop-label">Click to Shop →</span>
        </a>
        <div class="outfit-style-header">
            ${overallStyle}
        </div>
    `;
}

// Fashion Rain Animation and Outfit Generation
const fashionItems = ['👗', '👠', '👢', '👜', '👔', '👕', '🧥', '👖', '👡', '💍', '🕶️', '👞', '💎', '🧣', '👘', '👚'];

function startFashionRain() {
    // Start the animation
    const container = document.getElementById('animation-container');
    const itemCount = 50; // Number of items to fall
    
    // Clear any existing items
    container.innerHTML = '';
    
    // Use requestAnimationFrame for smoother creation
    let created = 0;
    
    function createItem() {
        if (created >= itemCount) return;
        
        const item = document.createElement('div');
        item.className = 'falling-item';
        item.textContent = fashionItems[Math.floor(Math.random() * fashionItems.length)];
        
        // Random horizontal position
        const leftPosition = Math.random() * 100;
        item.style.left = leftPosition + '%';
        
        // Random animation duration (2-4 seconds)
        const duration = 2 + Math.random() * 2;
        item.style.animationDuration = duration + 's';
        
        // Random delay for staggered effect (reduced for smoother start)
        item.style.animationDelay = Math.random() * 0.3 + 's';
        
        container.appendChild(item);
        
        // Force reflow to ensure element is rendered before animation starts
        void item.offsetHeight;
        
        // Use double requestAnimationFrame for smoother start
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                item.classList.add('animate');
            });
        });
        
        // Remove item after animation completes
        setTimeout(() => {
            if (item.parentNode) {
                item.parentNode.removeChild(item);
            }
        }, (duration + 0.3) * 1000);
        
        created++;
        
        // Create next item with smoother timing
        if (created < itemCount) {
            requestAnimationFrame(() => {
                setTimeout(createItem, 30);
            });
        }
    }
    
    // Start creating items
    createItem();
    
    // Generate and display outfit after 2 seconds
    setTimeout(() => {
        generateAndShowOutfit();
    }, 2000);
}

function generateAndShowOutfit() {
    // Determine gender based on current selection
    const outfitData = selectedGender === 'woman' ? womenOutfits : menOutfits;
    
    const top = getRandomItem(outfitData.tops);
    const bottom = getRandomItem(outfitData.bottoms);
    const shoes = getRandomItem(outfitData.shoes);
    const accessory = getRandomItem(outfitData.accessories);
    const overallStyle = getRandomItem(outfitData.styles);
    
    const popupOutfitDisplay = document.getElementById('popup-outfit-display');
    
    popupOutfitDisplay.innerHTML = `
        <a href="${top.url}" target="_blank" rel="noopener noreferrer" class="outfit-item outfit-link">
            <h4><span class="emoji">${top.emoji}</span>${top.name}</h4>
            <p><strong>Color:</strong> ${top.color} | <strong>Style:</strong> ${top.style}</p>
            <span class="brand">${top.brand}</span>
            <span class="shop-label">Click to Shop →</span>
        </a>
        <a href="${bottom.url}" target="_blank" rel="noopener noreferrer" class="outfit-item outfit-link">
            <h4><span class="emoji">${bottom.emoji}</span>${bottom.name}</h4>
            <p><strong>Color:</strong> ${bottom.color} | <strong>Style:</strong> ${bottom.style}</p>
            <span class="brand">${bottom.brand}</span>
            <span class="shop-label">Click to Shop →</span>
        </a>
        <a href="${shoes.url}" target="_blank" rel="noopener noreferrer" class="outfit-item outfit-link">
            <h4><span class="emoji">${shoes.emoji}</span>${shoes.name}</h4>
            <p><strong>Color:</strong> ${shoes.color} | <strong>Style:</strong> ${shoes.style}</p>
            <span class="brand">${shoes.brand}</span>
            <span class="shop-label">Click to Shop →</span>
        </a>
        <a href="${accessory.url}" target="_blank" rel="noopener noreferrer" class="outfit-item outfit-link">
            <h4><span class="emoji">${accessory.emoji}</span>${accessory.name}</h4>
            <p><strong>Color:</strong> ${accessory.color} | <strong>Style:</strong> ${accessory.style}</p>
            <span class="brand">${accessory.brand}</span>
            <span class="shop-label">Click to Shop →</span>
        </a>
        <div class="outfit-style-header">
            ${overallStyle}
        </div>
    `;
    
    // Show the popup
    document.getElementById('outfit-popup').classList.add('show');
}

function closeOutfitPopup() {
    document.getElementById('outfit-popup').classList.remove('show');
}

// Keyboard support for calculator
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-' || key === '*') {
        appendToDisplay(key);
    } else if (key === '/') {
        event.preventDefault();
        appendToDisplay('/');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});
