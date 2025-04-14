// TikTok Emojis - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Data storage for emoji information
    let allEmojis = [];
    let filteredEmojis = [];
    let currentCategory = 'all';
    let searchQuery = '';
    
    // DOM Elements
    const emojiGrid = document.getElementById('emoji-grid');
    const searchInput = document.getElementById('search');
    const emojiCountElement = document.getElementById('emoji-count');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const toast = document.getElementById('toast');

    // Sample emoji data (replace with actual data from emojipedia.org/tiktok)
    // In a real implementation, this would be loaded from a JSON file or API
    const emojiData = [
        {
            emoji: "😀",
            name: "Grinning Face",
            unicode: "U+1F600",
            category: "smileys",
            trending: true,
            image: "emoji_png/grinning_face.png"
        },
        {
            emoji: "😂",
            name: "Face with Tears of Joy",
            unicode: "U+1F602",
            category: "smileys",
            trending: true,
            image: "emoji_png/face_with_tears_of_joy.png"
        },
        {
            emoji: "🥰",
            name: "Smiling Face with Hearts",
            unicode: "U+1F970",
            category: "smileys",
            trending: true,
            image: "emoji_png/smiling_face_with_hearts.png"
        },
        {
            emoji: "👋",
            name: "Waving Hand",
            unicode: "U+1F44B",
            category: "people",
            trending: false,
            image: "emoji_png/waving_hand.png"
        },
        {
            emoji: "🔥",
            name: "Fire",
            unicode: "U+1F525",
            category: "symbols",
            trending: true,
            image: "emoji_png/fire.png"
        },
        {
            emoji: "💯",
            name: "Hundred Points",
            unicode: "U+1F4AF",
            category: "symbols",
            trending: true,
            image: "emoji_png/hundred_points.png"
        },
        {
            emoji: "💕",
            name: "Two Hearts",
            unicode: "U+1F495",
            category: "symbols",
            trending: true,
            image: "emoji_png/two_hearts.png"
        },
        {
            emoji: "🤣",
            name: "Rolling on the Floor Laughing",
            unicode: "U+1F923",
            category: "smileys",
            trending: true,
            image: "emoji_png/rolling_on_the_floor_laughing.png"
        },
        {
            emoji: "❤️",
            name: "Red Heart",
            unicode: "U+2764 U+FE0F",
            category: "symbols",
            trending: true,
            image: "emoji_png/red_heart.png"
        },
        {
            emoji: "✨",
            name: "Sparkles",
            unicode: "U+2728",
            category: "symbols",
            trending: true,
            image: "emoji_png/sparkles.png"
        },
        {
            emoji: "😭",
            name: "Loudly Crying Face",
            unicode: "U+1F62D",
            category: "smileys",
            trending: true,
            image: "emoji_png/loudly_crying_face.png"
        },
        {
            emoji: "😍",
            name: "Smiling Face with Heart-Eyes",
            unicode: "U+1F60D",
            category: "smileys",
            trending: true,
            image: "emoji_png/smiling_face_with_heart_eyes.png"
        }
    ];

    // Initialize the emoji grid
    initializeEmojis(emojiData);

    // Create emoji card elements
    function createEmojiCards(emojis) {
        emojiGrid.innerHTML = '';
        
        if (emojis.length === 0) {
            emojiGrid.innerHTML = '<div class="col-span-full text-center py-10 text-gray-500">No emojis found matching your search.</div>';
            return;
        }
        
        emojis.forEach(emoji => {
            const card = document.createElement('div');
            card.className = 'emoji-card';
            
            card.innerHTML = `
                <div class="emoji-image">
                    <img src="${emoji.image}" alt="${emoji.name}" class="lazy-load">
                </div>
                <div class="emoji-info">
                    <div class="emoji-name">${emoji.name}</div>
                    <div class="emoji-unicode">${emoji.unicode}</div>
                    <div class="emoji-category">${capitalizeFirstLetter(emoji.category)}</div>
                </div>
                <div class="emoji-actions">
                    <div class="emoji-btn copy-btn" data-emoji="${emoji.emoji}">
                        <i class="fas fa-copy mr-1"></i> Copy
                    </div>
                    <div class="emoji-btn download-btn" data-image="${emoji.image}" data-name="${emoji.name}">
                        <i class="fas fa-download mr-1"></i> Download
                    </div>
                </div>
            `;
            
            emojiGrid.appendChild(card);
            
            // Add event listeners to buttons
            card.querySelector('.copy-btn').addEventListener('click', copyEmoji);
            card.querySelector('.download-btn').addEventListener('click', downloadEmoji);
        });
        
        // Lazy load images
        lazyLoadImages();
    }

    // Initialize emojis
    function initializeEmojis(data) {
        allEmojis = data;
        filteredEmojis = [...allEmojis];
        updateEmojiCount();
        createEmojiCards(filteredEmojis);
    }

    // Filter emojis by category
    function filterByCategory(category) {
        if (category === 'all') {
            filteredEmojis = [...allEmojis];
        } else if (category === 'trending') {
            filteredEmojis = allEmojis.filter(emoji => emoji.trending);
        } else {
            filteredEmojis = allEmojis.filter(emoji => emoji.category === category);
        }
        
        // Apply search query if it exists
        if (searchQuery) {
            filterBySearch(searchQuery);
        } else {
            updateEmojiCount();
            createEmojiCards(filteredEmojis);
        }
    }

    // Filter emojis by search query
    function filterBySearch(query) {
        searchQuery = query.toLowerCase();
        
        if (!searchQuery) {
            filterByCategory(currentCategory);
            return;
        }
        
        // Start with the category filter
        const categoryFiltered = currentCategory === 'all' 
            ? [...allEmojis] 
            : currentCategory === 'trending'
                ? allEmojis.filter(emoji => emoji.trending)
                : allEmojis.filter(emoji => emoji.category === currentCategory);
        
        // Then apply search filter
        filteredEmojis = categoryFiltered.filter(emoji => 
            emoji.name.toLowerCase().includes(searchQuery) || 
            emoji.unicode.toLowerCase().includes(searchQuery)
        );
        
        updateEmojiCount();
        createEmojiCards(filteredEmojis);
    }

    // Update emoji count display
    function updateEmojiCount() {
        if (currentCategory === 'all' && !searchQuery) {
            emojiCountElement.textContent = `Showing all ${filteredEmojis.length} emojis`;
        } else if (searchQuery) {
            emojiCountElement.textContent = `Found ${filteredEmojis.length} emojis matching "${searchQuery}"`;
        } else {
            emojiCountElement.textContent = `Showing ${filteredEmojis.length} ${currentCategory} emojis`;
        }
    }

    // Copy emoji to clipboard
    function copyEmoji(e) {
        const emoji = e.currentTarget.getAttribute('data-emoji');
        
        navigator.clipboard.writeText(emoji)
            .then(() => {
                showToast('Emoji copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy emoji: ', err);
                showToast('Failed to copy emoji', true);
            });
    }

    // Download emoji as PNG
    function downloadEmoji(e) {
        const imgSrc = e.currentTarget.getAttribute('data-image');
        const name = e.currentTarget.getAttribute('data-name');
        
        // Create a virtual link to download the image
        const a = document.createElement('a');
        a.href = imgSrc;
        a.download = `${name.toLowerCase().replace(/\s+/g, '_')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showToast('Emoji downloaded!');
    }

    // Show toast notification
    function showToast(message, isError = false) {
        toast.textContent = message;
        toast.className = isError 
            ? 'fixed bottom-4 right-4 bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg transform translate-y-0 opacity-1 transition-all duration-300'
            : 'fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-lg transform translate-y-0 opacity-1 transition-all duration-300';
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Lazy load images
    function lazyLoadImages() {
        const images = document.querySelectorAll('.lazy-load');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('src');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            images.forEach(img => {
                img.src = img.getAttribute('src');
                img.classList.add('loaded');
            });
        }
    }

    // Helper function to capitalize the first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Event Listeners
    searchInput.addEventListener('input', e => {
        filterBySearch(e.target.value);
    });

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update current category and filter
            currentCategory = this.getAttribute('data-category');
            filterByCategory(currentCategory);
        });
    });

    // Add infinite scrolling simulation (in a real app, you would load more emojis)
    window.addEventListener('scroll', function() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
            // In a real implementation, you would load more emojis here
            // For this demo, we'll just show/hide the loading indicator
            const loading = document.getElementById('loading');
            loading.classList.remove('hidden');
            
            setTimeout(() => {
                loading.classList.add('hidden');
            }, 1500);
        }
    });
}); 