// keyword-script.js - Functions for keyword page

document.addEventListener('DOMContentLoaded', function() {
    // Get keyword parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('q') || 'trending emojis';
    
    // 检查是否主脚本已经加载了表情数据
    if (typeof emojiData === 'undefined') {
        console.error('Emoji data not found! Main script might not be loaded.');
        document.getElementById('emojiCount').textContent = 'Error: Emoji data not loaded. Please refresh the page.';
        return;
    }
    
    // Initialize page
    initKeywordPage(keyword);
    
    // Add event listeners
    setupEventListeners();
});

// Initialize page
function initKeywordPage(keyword) {
    // Update page title
    updatePageTitle(keyword);
    
    // Fetch and display emojis
    fetchAndDisplayEmojis(keyword);
    
    // Update keyword info
    updateKeywordInfo(keyword);
    
    // Load related keywords
    loadRelatedKeywords(keyword);
    
    // Load popular keywords
    loadPopularKeywords();
}

// Update page title
function updatePageTitle(keyword) {
    document.title = `${keyword} | TikTok Emojis Search Results`;
    document.getElementById('mainTitle').textContent = keyword;
    document.getElementById('subTitle').textContent = `TikTok emojis related to ${keyword}`;
    document.getElementById('keywordInfoTitle').textContent = `About "${keyword}"`;
}

// Fetch and display emojis
async function fetchAndDisplayEmojis(keyword) {
    try {
        // 确保有表情数据
        if (typeof emojiData === 'undefined' || !Array.isArray(emojiData)) {
            console.error('有效的表情数据不可用');
            document.getElementById('emojiCount').textContent = 'Error: Invalid emoji data.';
            return;
        }
        
        // 筛选符合关键词的表情
        const filteredEmojis = filterEmojisByKeyword(emojiData, keyword);
        
        // 更新表情计数
        updateEmojiCount(filteredEmojis.length);
        
        // 清除骨架加载器
        clearSkeletonLoaders();
        
        // 如果没有结果，显示无结果消息
        if (filteredEmojis.length === 0) {
            document.getElementById('noResults').classList.remove('hidden');
        } else {
            document.getElementById('noResults').classList.add('hidden');
            
            // 显示表情
            displayEmojis(filteredEmojis);
        }
    } catch (error) {
        console.error('加载表情数据时出错:', error);
        document.getElementById('emojiCount').textContent = '加载失败，请刷新页面重试。';
    }
}

// Filter emojis by keyword
function filterEmojisByKeyword(emojis, keyword) {
    const keywordLower = keyword.toLowerCase();
    
    return emojis.filter(emoji => {
        // Search name, description and category
        const nameMatch = emoji.name.toLowerCase().includes(keywordLower);
        const categoryMatch = emoji.category.toLowerCase().includes(keywordLower);
        const descriptionMatch = emoji.description && emoji.description.toLowerCase().includes(keywordLower);
        
        // Special keyword handling
        if (keywordLower === 'trending emojis' || keywordLower === 'trending') {
            return emoji.trending === true;
        } else if (keywordLower === 'special emojis' || keywordLower === 'special') {
            return emoji.category === 'special';
        } else if (keywordLower === 'happy emojis' || keywordLower === 'happy') {
            return emoji.category === 'happy';
        } else if (keywordLower === 'sad emojis' || keywordLower === 'sad') {
            return emoji.category === 'sad';
        } else if (keywordLower === 'love emojis' || keywordLower === 'love') {
            return emoji.category === 'love';
        } else if (keywordLower === 'angry emojis' || keywordLower === 'angry') {
            return emoji.category === 'angry';
        }
        
        // Default search matching
        return nameMatch || categoryMatch || descriptionMatch;
    });
}

// Clear skeleton loaders
function clearSkeletonLoaders() {
    const skeletonCards = document.querySelectorAll('.skeleton-card');
    skeletonCards.forEach(card => card.remove());
}

// Display emojis
function displayEmojis(emojis) {
    const container = document.getElementById('emojiContainer');
    
    // Clear container first
    container.innerHTML = '';
    
    // Apply current filter values
    const categoryFilter = document.getElementById('categoryFilter').value;
    const shapeFilter = document.getElementById('shapeFilter').value;
    const sortOption = document.getElementById('sortOption').value;
    const displayOption = document.getElementById('displayOption').value;
    
    // Apply filters
    let filteredEmojis = emojis;
    
    if (categoryFilter !== 'all') {
        filteredEmojis = filteredEmojis.filter(emoji => emoji.category === categoryFilter);
    }
    
    if (shapeFilter !== 'all') {
        filteredEmojis = filteredEmojis.filter(emoji => getEmojiShape(emoji) === shapeFilter);
    }
    
    if (displayOption === 'trending') {
        filteredEmojis = filteredEmojis.filter(emoji => emoji.trending === true);
    } else if (displayOption === 'special') {
        filteredEmojis = filteredEmojis.filter(emoji => emoji.category === 'special');
    }
    
    // Apply sorting
    if (sortOption === 'alphabetical') {
        filteredEmojis.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'recent') {
        // Assuming we have a dateAdded field, if not, use ID or other metric
        filteredEmojis.sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0));
    } else if (sortOption === 'trending') {
        // Trending first sort
        filteredEmojis.sort((a, b) => {
            if (a.trending === b.trending) return 0;
            return a.trending ? -1 : 1;
        });
    }
    
    // Update emoji count
    updateEmojiCount(filteredEmojis.length);
    
    // If no results, show no results message
    if (filteredEmojis.length === 0) {
        document.getElementById('noResults').classList.remove('hidden');
        return;
    } else {
        document.getElementById('noResults').classList.add('hidden');
    }
    
    // Create emoji cards
    filteredEmojis.forEach(emoji => {
        const card = createEmojiCard(emoji);
        container.appendChild(card);
    });
}

// Create emoji card
function createEmojiCard(emoji) {
    const card = document.createElement('div');
    card.className = 'bg-gray-800 rounded-lg p-4 flex flex-col items-center emoji-card';
    card.dataset.emoji = emoji.emoji;
    card.dataset.name = emoji.name;
    card.dataset.category = emoji.category;
    
    // Emoji image or character
    const emojiDisplay = document.createElement('div');
    emojiDisplay.className = 'text-5xl mb-3 emoji-display';
    
    // 处理特殊表情或普通表情
    if (emoji.isSpecial || emoji.image) {
        // 如果是特殊表情，创建图片元素
        const img = document.createElement('img');
        img.src = emoji.image || `emoji_png/${emoji.name.toLowerCase().replace(/\s+/g, '_')}.png`;
        img.alt = emoji.name;
        img.className = 'h-16 w-16 object-contain';
        emojiDisplay.appendChild(img);
    } else {
        // 普通表情直接使用文本
        emojiDisplay.textContent = emoji.emoji;
    }
    
    // Emoji name
    const emojiName = document.createElement('h3');
    emojiName.className = 'text-center font-medium mb-1 text-sm';
    emojiName.textContent = emoji.name;
    
    // Emoji category
    const emojiCategory = document.createElement('p');
    emojiCategory.className = 'text-xs text-gray-400 mb-3';
    emojiCategory.textContent = emoji.category;
    
    // Button container
    const btnContainer = document.createElement('div');
    btnContainer.className = 'flex gap-2 mt-auto w-full';
    
    // Copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'bg-pink-500 hover:bg-pink-600 text-white px-2 py-1 rounded text-xs flex-1 flex justify-center items-center';
    copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Copy
    `;
    copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyEmoji(emoji.emoji);
    });
    
    // Details button
    const infoBtn = document.createElement('button');
    infoBtn.className = 'bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs flex-1 flex justify-center items-center';
    infoBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Details
    `;
    infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showEmojiModal(emoji);
    });
    
    // Add to button container
    btnContainer.appendChild(copyBtn);
    btnContainer.appendChild(infoBtn);
    
    // Add to card
    card.appendChild(emojiDisplay);
    card.appendChild(emojiName);
    card.appendChild(emojiCategory);
    card.appendChild(btnContainer);
    
    // Click card to show details
    card.addEventListener('click', () => {
        showEmojiModal(emoji);
    });
    
    return card;
}

// 复制表情
function copyEmoji(emoji) {
    // 尝试使用Clipboard API
    if (navigator.clipboard) {
        navigator.clipboard.writeText(emoji)
            .then(() => {
                showToast('表情符号已复制到剪贴板！');
                // 如果在主脚本中存在，更新使用统计
                if (typeof updateEmojiUsage === 'function') {
                    updateEmojiUsage(emoji);
                }
            })
            .catch(err => {
                console.error('复制表情失败:', err);
                showToast('复制失败，请手动复制');
            });
    } else {
        // 回退方法
        const textarea = document.createElement('textarea');
        textarea.value = emoji;
        textarea.style.position = 'fixed';  // 避免滚动到页面底部
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showToast('表情符号已复制到剪贴板！');
                // 如果在主脚本中存在，更新使用统计
                if (typeof updateEmojiUsage === 'function') {
                    updateEmojiUsage(emoji);
                }
            } else {
                showToast('复制失败，请手动复制');
            }
        } catch (err) {
            console.error('复制表情失败:', err);
            showToast('复制失败，请手动复制');
        }
        
        document.body.removeChild(textarea);
    }
}

// 下载表情图片
function downloadEmoji(emoji) {
    // 如果主脚本中有下载函数，优先使用它
    if (typeof downloadEmojiImage === 'function') {
        downloadEmojiImage(emoji);
        return;
    }
    
    // 自己实现的下载方法
    // 创建画布
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 128;
    
    // 背景色
    ctx.fillStyle = '#36363c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制表情
    ctx.font = '80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText(emoji.emoji || emoji, canvas.width/2, canvas.height/2);
    
    // 创建下载链接
    const link = document.createElement('a');
    link.download = `tiktok-emoji-${emoji.name.toLowerCase().replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('表情已成功下载！');
}

// 获取表情形状
function getEmojiShape(emoji) {
    // 如果表情对象已经有shape属性，直接使用
    if (emoji.shape) return emoji.shape;
    
    // 类别为special的表情或者长度超过2的表情视为特殊形状
    if (emoji.category === 'special' || emoji.emoji.length > 2) {
        return 'special';
    } else {
        return 'circle'; // 默认形状
    }
}

// 显示表情弹窗
function showEmojiModal(emoji) {
    // 获取弹窗元素
    const modal = document.getElementById('emojiModal');
    const modalEmojiName = document.getElementById('modalEmojiName');
    const modalEmojiImage = document.getElementById('modalEmojiImage');
    const modalEmojiUnicode = document.getElementById('modalEmojiUnicode');
    const modalEmojiCategory = document.getElementById('modalEmojiCategory');
    const modalEmojiTrending = document.getElementById('modalEmojiTrending');
    const modalEmojiDescription = document.getElementById('modalEmojiDescription');
    const modalEmojiTikTokUsage = document.getElementById('modalEmojiTikTokUsage');
    
    // 填充弹窗内容
    modalEmojiName.textContent = emoji.name || '自定义表情';
    
    // 处理表情图像显示
    if (emoji.isSpecial || emoji.image) {
        modalEmojiImage.innerHTML = '';
        const img = document.createElement('img');
        img.src = emoji.image || `emoji_png/${emoji.name.toLowerCase().replace(/\s+/g, '_')}.png`;
        img.alt = emoji.name;
        img.className = 'h-24 w-24 object-contain';
        modalEmojiImage.appendChild(img);
    } else {
        modalEmojiImage.textContent = emoji.emoji;
    }
    
    modalEmojiUnicode.textContent = emoji.unicode || '自定义';
    modalEmojiCategory.textContent = emoji.category || '其他';
    modalEmojiTrending.textContent = emoji.trending ? '是' : '否';
    modalEmojiDescription.textContent = emoji.description || '标准TikTok表情。';
    modalEmojiTikTokUsage.textContent = emoji.tiktokUsage || '通常用于TikTok评论和视频中。';
    
    // 设置复制按钮
    document.getElementById('modalCopyEmoji').onclick = () => {
        copyEmoji(emoji.emoji);
    };
    
    // 设置下载按钮
    document.getElementById('modalDownloadEmoji').onclick = () => {
        downloadEmoji(emoji);
    };
    
    // 显示弹窗
    modal.classList.remove('hidden');
}

// 更新表情计数
function updateEmojiCount(count) {
    document.getElementById('emojiCount').textContent = `显示 ${count} 个表情${count !== 1 ? 's' : ''}`;
}

// 显示提示消息
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    
    // 显示提示
    toast.classList.remove('opacity-0', 'translate-y-10');
    toast.classList.add('opacity-100', 'translate-y-0');
    
    // 持续时间后隐藏提示
    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-10');
    }, duration);
}

// 更新关键词信息
function updateKeywordInfo(keyword) {
    const keywordInfoContent = document.getElementById('keywordInfoContent');
    const keywordLower = keyword.toLowerCase();
    
    // 默认内容
    let content = `
        <p class="mb-4">探索与"${keyword}"相关的最佳TikTok表情。我们的集合包括TikTok评论、视频和个人简介中使用的流行表情。</p>
        <p class="mb-4">您可以轻松地单击复制这些表情，或将它们下载为高质量的PNG图像，以用于您的内容创作。</p>
    `;
    
    // 针对特定关键词的内容
    if (keywordLower.includes('trending') || keywordLower.includes('popular')) {
        content = `
            <p class="mb-4">热门TikTok表情是当前平台上最流行的表情。这些表情经常出现在病毒视频、评论中，并被流行创作者使用。</p>
            <p class="mb-4">通过在您的内容中使用这些表情，跟上最新的TikTok趋势。只需点击任何表情即可将其复制到剪贴板。</p>
        `;
    } else if (keywordLower.includes('special')) {
        content = `
            <p class="mb-4">特殊TikTok表情包括在TikTok上流行的独特组合和自定义表情。这些特殊表情可以帮助您的评论和视频脱颖而出。</p>
            <p class="mb-4">这些特殊表情组合在TikTok文化中有特定的含义。使用它们以更真实的方式与TikTok社区联系。</p>
        `;
    } else if (keywordLower.includes('download') || keywordLower.includes('png')) {
        content = `
            <p class="mb-4">将TikTok表情下载为高质量PNG图像，用于您的内容创作。这些图像非常适合缩略图、叠加层和其他创意项目。</p>
            <p class="mb-4">所有PNG图像都是透明的，并针对数字使用进行了优化。点击任何表情上的下载按钮，将其保存到您的设备中。</p>
        `;
    }
    
    keywordInfoContent.innerHTML = content;
}

// 加载相关关键词
function loadRelatedKeywords(currentKeyword) {
    const container = document.getElementById('relatedKeywordsContainer');
    const keywordLower = currentKeyword.toLowerCase();
    let relatedKeywords = [];
    
    // 根据当前关键词获取相关关键词
    if (keywordLower.includes('trending') || keywordLower.includes('popular')) {
        relatedKeywords = ['viral tiktok emojis', 'new tiktok emojis', 'tiktok emoji trends 2023', 'most used tiktok emojis'];
    } else if (keywordLower.includes('special')) {
        relatedKeywords = ['tiktok secret emojis', 'unique tiktok emojis', 'custom tiktok emojis', 'rare tiktok emojis'];
    } else if (keywordLower.includes('happy') || keywordLower.includes('smile')) {
        relatedKeywords = ['tiktok smile emojis', 'tiktok laugh emojis', 'tiktok joy emojis', 'tiktok funny emojis'];
    } else if (keywordLower.includes('sad') || keywordLower.includes('cry')) {
        relatedKeywords = ['tiktok crying emojis', 'tiktok tears emojis', 'tiktok sad face emojis', 'tiktok emotional emojis'];
    } else if (keywordLower.includes('love')) {
        relatedKeywords = ['tiktok heart emojis', 'tiktok romantic emojis', 'tiktok kiss emojis', 'tiktok couple emojis'];
    } else if (keywordLower.includes('download') || keywordLower.includes('png')) {
        relatedKeywords = ['tiktok emoji images', 'tiktok emoji stickers', 'transparent tiktok emojis', 'high quality tiktok emojis'];
    } else {
        // 默认相关关键词
        relatedKeywords = ['trending tiktok emojis', 'special tiktok emojis', 'tiktok emoji meanings', 'tiktok emoji download'];
    }
    
    // 创建链接
    container.innerHTML = '';
    relatedKeywords.forEach(keyword => {
        const link = document.createElement('a');
        link.href = `keyword-template.html?q=${encodeURIComponent(keyword)}`;
        link.className = 'bg-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-600 transition';
        link.textContent = keyword;
        container.appendChild(link);
    });
}

// 加载流行关键词
function loadPopularKeywords() {
    const container = document.getElementById('popularKeywordsContainer');
    const popularKeywords = [
        'trending tiktok emojis',
        'special tiktok emojis',
        'happy tiktok emojis',
        'love tiktok emojis',
        'sad tiktok emojis',
        'tiktok emoji meanings',
        'tiktok emoji png download',
        'tiktok secret emojis'
    ];
    
    // 创建链接
    container.innerHTML = '';
    popularKeywords.forEach(keyword => {
        const link = document.createElement('a');
        link.href = `keyword-template.html?q=${encodeURIComponent(keyword)}`;
        link.className = 'bg-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-600 transition';
        link.textContent = keyword;
        container.appendChild(link);
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 关闭弹窗
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('emojiModal').classList.add('hidden');
    });
    
    // 类别筛选器
    document.getElementById('categoryFilter').addEventListener('change', function() {
        // 获取当前关键词
        const urlParams = new URLSearchParams(window.location.search);
        const keyword = urlParams.get('q') || 'trending emojis';
        
        // 重新加载表情
        fetchAndDisplayEmojis(keyword);
    });
    
    // 形状筛选器
    document.getElementById('shapeFilter').addEventListener('change', function() {
        // 获取当前关键词
        const urlParams = new URLSearchParams(window.location.search);
        const keyword = urlParams.get('q') || 'trending emojis';
        
        // 重新加载表情
        fetchAndDisplayEmojis(keyword);
    });
    
    // 排序选项
    document.getElementById('sortOption').addEventListener('change', function() {
        // 获取当前关键词
        const urlParams = new URLSearchParams(window.location.search);
        const keyword = urlParams.get('q') || 'trending emojis';
        
        // 重新加载表情
        fetchAndDisplayEmojis(keyword);
    });
    
    // 显示选项
    document.getElementById('displayOption').addEventListener('change', function() {
        // 获取当前关键词
        const urlParams = new URLSearchParams(window.location.search);
        const keyword = urlParams.get('q') || 'trending emojis';
        
        // 重新加载表情
        fetchAndDisplayEmojis(keyword);
    });
    
    // 搜索输入
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const keyword = searchInput.value.trim();
                if (keyword) {
                    window.location.href = `keyword-template.html?q=${encodeURIComponent(keyword)}`;
                }
            }
        });
    }
    
    // 搜索按钮
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const keyword = searchInput.value.trim();
            if (keyword) {
                window.location.href = `keyword-template.html?q=${encodeURIComponent(keyword)}`;
            }
        });
    }
    
    // 列表/网格视图切换
    document.getElementById('gridViewBtn').addEventListener('click', function() {
        const container = document.getElementById('emojiContainer');
        container.className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8';
        
        this.classList.add('bg-pink-500');
        this.classList.remove('bg-gray-700');
        document.getElementById('listViewBtn').classList.add('bg-gray-700');
        document.getElementById('listViewBtn').classList.remove('bg-pink-500');
    });
    
    document.getElementById('listViewBtn').addEventListener('click', function() {
        const container = document.getElementById('emojiContainer');
        container.className = 'flex flex-col gap-4 mb-8';
        
        this.classList.add('bg-pink-500');
        this.classList.remove('bg-gray-700');
        document.getElementById('gridViewBtn').classList.add('bg-gray-700');
        document.getElementById('gridViewBtn').classList.remove('bg-pink-500');
    });
} 