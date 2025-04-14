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

    // 检查emoji_png文件夹是否存在, 如果不存在则创建
    checkAndCreateEmojiFolder();

    // 检查和创建emoji文件夹的函数
    function checkAndCreateEmojiFolder() {
        const folderPath = 'emoji_png';
        
        // 在生产环境中，这部分逻辑会在服务器端实现
        console.log('Checking for emoji_png folder...');
        
        // 在客户端无法直接创建文件夹，这里仅作为提示
        console.log('Note: Make sure the emoji_png folder exists in your root directory');
    }

    // TikTok自定义表情数据 - 使用截图中的表情
    const emojiData = [
        {
            emoji: "😇",
            name: "angel",
            unicode: "U+1F607",
            category: "smileys",
            trending: true,
            image: "emoji_png/angel.png"
        },
        {
            emoji: "😡",
            name: "angry",
            unicode: "U+1F621",
            category: "smileys",
            trending: true,
            image: "emoji_png/angry.png"
        },
        {
            emoji: "😯",
            name: "astonish",
            unicode: "U+1F62F",
            category: "smileys",
            trending: false,
            image: "emoji_png/astonish.png"
        },
        {
            emoji: "😓",
            name: "awkward",
            unicode: "U+1F613",
            category: "smileys",
            trending: false,
            image: "emoji_png/awkward.png"
        },
        {
            emoji: "😉",
            name: "blink",
            unicode: "U+1F609",
            category: "smileys",
            trending: true,
            image: "emoji_png/blink.png"
        },
        {
            emoji: "😎",
            name: "complacent",
            unicode: "U+1F60E",
            category: "smileys",
            trending: true,
            image: "emoji_png/complacent.png"
        },
        {
            emoji: "😈",
            name: "cool",
            unicode: "U+1F608",
            category: "smileys",
            trending: true,
            image: "emoji_png/cool.png"
        },
        {
            emoji: "😢",
            name: "cry",
            unicode: "U+1F622",
            category: "smileys",
            trending: true,
            image: "emoji_png/cry.png"
        },
        {
            emoji: "🥰",
            name: "cute",
            unicode: "U+1F970",
            category: "smileys",
            trending: true,
            image: "emoji_png/cute.png"
        },
        {
            emoji: "😒",
            name: "disdain",
            unicode: "U+1F612",
            category: "smileys",
            trending: false,
            image: "emoji_png/disdain.png"
        },
        {
            emoji: "🤤",
            name: "drool",
            unicode: "U+1F924",
            category: "smileys",
            trending: true,
            image: "emoji_png/drool.png"
        },
        {
            emoji: "😞",
            name: "embarrassed",
            unicode: "U+1F61E",
            category: "smileys",
            trending: false,
            image: "emoji_png/embarrassed.png"
        },
        {
            emoji: "😈",
            name: "evil",
            unicode: "U+1F608",
            category: "smileys",
            trending: true,
            image: "emoji_png/evil.png"
        },
        {
            emoji: "😆",
            name: "excited",
            unicode: "U+1F606",
            category: "smileys",
            trending: true,
            image: "emoji_png/excited.png"
        },
        {
            emoji: "🙄",
            name: "facewithrollingeyes",
            unicode: "U+1F644",
            category: "smileys",
            trending: true,
            image: "emoji_png/facewithrollingeyes.png"
        },
        {
            emoji: "😊",
            name: "flushed",
            unicode: "U+1F60A",
            category: "smileys",
            trending: true,
            image: "emoji_png/flushed.png"
        },
        {
            emoji: "😛",
            name: "funnyface",
            unicode: "U+1F61B",
            category: "smileys",
            trending: true,
            image: "emoji_png/funnyface.png"
        },
        {
            emoji: "🤑",
            name: "greedy",
            unicode: "U+1F911",
            category: "smileys",
            trending: false,
            image: "emoji_png/greedy.png"
        },
        {
            emoji: "😊",
            name: "happy",
            unicode: "U+1F60A",
            category: "smileys",
            trending: true,
            image: "emoji_png/happy.png"
        },
        {
            emoji: "😄",
            name: "hehe",
            unicode: "U+1F604",
            category: "smileys",
            trending: true,
            image: "emoji_png/hehe.png"
        },
        {
            emoji: "😃",
            name: "joyful",
            unicode: "U+1F603",
            category: "smileys",
            trending: true,
            image: "emoji_png/joyful.png"
        },
        {
            emoji: "😂",
            name: "laugh",
            unicode: "U+1F602",
            category: "smileys",
            trending: true,
            image: "emoji_png/laugh.png"
        },
        {
            emoji: "😹",
            name: "laughwithtears",
            unicode: "U+1F639",
            category: "smileys",
            trending: true,
            image: "emoji_png/laughwithtears.png"
        },
        {
            emoji: "😍",
            name: "loveface",
            unicode: "U+1F60D",
            category: "smileys",
            trending: true,
            image: "emoji_png/loveface.png"
        },
        {
            emoji: "🥰",
            name: "lovely",
            unicode: "U+1F970",
            category: "smileys",
            trending: true,
            image: "emoji_png/lovely.png"
        },
        {
            emoji: "😴",
            name: "nap",
            unicode: "U+1F634",
            category: "smileys",
            trending: false,
            image: "emoji_png/nap.png"
        },
        {
            emoji: "😤",
            name: "pride",
            unicode: "U+1F624",
            category: "smileys",
            trending: false,
            image: "emoji_png/pride.png"
        },
        {
            emoji: "😌",
            name: "proud",
            unicode: "U+1F60C",
            category: "smileys",
            trending: false,
            image: "emoji_png/proud.png"
        },
        {
            emoji: "😡",
            name: "rage",
            unicode: "U+1F621",
            category: "smileys",
            trending: true,
            image: "emoji_png/rage.png"
        },
        {
            emoji: "😱",
            name: "scream",
            unicode: "U+1F631",
            category: "smileys",
            trending: true,
            image: "emoji_png/scream.png"
        },
        {
            emoji: "😱",
            name: "shock",
            unicode: "U+1F631",
            category: "smileys",
            trending: true,
            image: "emoji_png/shock.png"
        },
        {
            emoji: "😲",
            name: "shout",
            unicode: "U+1F632",
            category: "smileys",
            trending: false,
            image: "emoji_png/shout.png"
        },
        {
            emoji: "👋",
            name: "slap",
            unicode: "U+1F44B",
            category: "people",
            trending: false,
            image: "emoji_png/slap.png"
        },
        {
            emoji: "🙂",
            name: "smile",
            unicode: "U+1F642",
            category: "smileys",
            trending: true,
            image: "emoji_png/smile.png"
        },
        {
            emoji: "😀",
            name: "smileface",
            unicode: "U+1F600",
            category: "smileys",
            trending: true,
            image: "emoji_png/smileface.png"
        },
        {
            emoji: "😶",
            name: "speechless",
            unicode: "U+1F636",
            category: "smileys",
            trending: false,
            image: "emoji_png/speechless.png"
        },
        {
            emoji: "😮",
            name: "stun",
            unicode: "U+1F62E",
            category: "smileys",
            trending: false,
            image: "emoji_png/stun.png"
        },
        {
            emoji: "😠",
            name: "sulk",
            unicode: "U+1F620",
            category: "smileys",
            trending: false,
            image: "emoji_png/sulk.png"
        },
        {
            emoji: "😲",
            name: "surprised",
            unicode: "U+1F632",
            category: "smileys",
            trending: true,
            image: "emoji_png/surprised.png"
        },
        {
            emoji: "😭",
            name: "tears",
            unicode: "U+1F62D",
            category: "smileys",
            trending: true,
            image: "emoji_png/tears.png"
        },
        {
            emoji: "🤔",
            name: "thinking",
            unicode: "U+1F914",
            category: "smileys",
            trending: true,
            image: "emoji_png/thinking.png"
        },
        {
            emoji: "😢",
            name: "weep",
            unicode: "U+1F622",
            category: "smileys",
            trending: true,
            image: "emoji_png/weep.png"
        },
        {
            emoji: "😈",
            name: "wicked",
            unicode: "U+1F608",
            category: "smileys",
            trending: true,
            image: "emoji_png/wicked.png"
        },
        {
            emoji: "😮",
            name: "wow",
            unicode: "U+1F62E",
            category: "smileys",
            trending: true,
            image: "emoji_png/wow.png"
        },
        {
            emoji: "😞",
            name: "wronged",
            unicode: "U+1F61E",
            category: "smileys",
            trending: false,
            image: "emoji_png/wronged.png"
        },
        {
            emoji: "😋",
            name: "yummy",
            unicode: "U+1F60B",
            category: "smileys",
            trending: true,
            image: "emoji_png/yummy.png"
        }
    ];

    // 创建emoji图片的函数 - 修改以支持自定义表情图片
    function createEmojiImage(emoji, name) {
        // 尝试加载本地图片
        const img = new Image();
        img.src = `emoji_png/${name}.png`;
        
        // 如果本地图片存在则直接返回
        if (img.complete) {
            return img.src;
        }
        
        // 否则使用Canvas生成emoji图片
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 128;
        
        // 设置emoji字体
        ctx.font = "90px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // 绘制emoji到canvas
        ctx.fillText(emoji, canvas.width/2, canvas.height/2);
        
        // 生成图片数据
        return canvas.toDataURL('image/png');
    }

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
        
        showToast('Emoji downloaded successfully!');
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

    // Initialize app
    // Load emoji data and set up event listeners
    function initApp() {
        initializeEmojis(emojiData);
        
        // Search input event listener
        searchInput.addEventListener('input', function() {
            filterBySearch(this.value);
        });
        
        // Category button event listeners
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                currentCategory = this.getAttribute('data-category');
                
                // Update active button
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                filterByCategory(currentCategory);
            });
        });
    }
    
    // Start the app
    initApp();

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