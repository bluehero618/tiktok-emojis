// keyword-script.js - 为关键词页面提供功能支持

document.addEventListener('DOMContentLoaded', function() {
    // 获取URL中的关键词参数
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('q') || '热门表情';
    
    // 初始化页面
    initKeywordPage(keyword);
    
    // 添加事件监听器
    setupEventListeners();
});

// 初始化页面
function initKeywordPage(keyword) {
    // 更新页面标题
    updatePageTitle(keyword);
    
    // 获取表情数据并显示
    fetchAndDisplayEmojis(keyword);
    
    // 更新关键词详情
    updateKeywordInfo(keyword);
    
    // 加载相关关键词
    loadRelatedKeywords(keyword);
    
    // 加载热门关键词
    loadPopularKeywords();
}

// 更新页面标题
function updatePageTitle(keyword) {
    document.title = `${keyword} | TikTok表情搜索结果`;
    document.getElementById('mainTitle').textContent = keyword;
    document.getElementById('subTitle').textContent = `${keyword}相关的TikTok表情符号`;
    document.getElementById('keywordInfoTitle').textContent = `关于"${keyword}"`;
}

// 获取并显示表情
async function fetchAndDisplayEmojis(keyword) {
    try {
        // 这里假设emojiData已经在全局作用域中可用
        // 如果不可用，可以从服务器或本地数据源加载
        if (typeof emojiData === 'undefined') {
            console.error('表情数据未找到！');
            return;
        }
        
        // 根据关键词过滤表情
        const filteredEmojis = filterEmojisByKeyword(emojiData, keyword);
        
        // 更新表情计数
        updateEmojiCount(filteredEmojis.length);
        
        // 清除加载骨架屏
        clearSkeletonLoaders();
        
        // 显示表情
        displayEmojis(filteredEmojis);
        
        // 如果没有结果，显示无结果信息
        if (filteredEmojis.length === 0) {
            document.getElementById('noResults').classList.remove('hidden');
        }
    } catch (error) {
        console.error('加载表情数据时出错:', error);
        document.getElementById('emojiCount').textContent = '加载失败，请刷新页面重试。';
    }
}

// 根据关键词过滤表情
function filterEmojisByKeyword(emojis, keyword) {
    const keywordLower = keyword.toLowerCase();
    
    return emojis.filter(emoji => {
        // 搜索名称、描述和类别
        const nameMatch = emoji.name.toLowerCase().includes(keywordLower);
        const categoryMatch = emoji.category.toLowerCase().includes(keywordLower);
        const descriptionMatch = emoji.description && emoji.description.toLowerCase().includes(keywordLower);
        
        // 如果是特殊关键词，进行特殊处理
        if (keywordLower === '热门表情' || keywordLower === '热门') {
            return emoji.trending === true;
        } else if (keywordLower === '特殊表情' || keywordLower === '特殊') {
            return emoji.category === 'special';
        } else if (keywordLower === '开心表情' || keywordLower === '开心') {
            return emoji.category === 'happy';
        } else if (keywordLower === '伤心表情' || keywordLower === '伤心') {
            return emoji.category === 'sad';
        } else if (keywordLower === '爱心表情' || keywordLower === '爱心') {
            return emoji.category === 'love';
        } else if (keywordLower === '生气表情' || keywordLower === '生气') {
            return emoji.category === 'angry';
        }
        
        // 默认搜索匹配
        return nameMatch || categoryMatch || descriptionMatch;
    });
}

// 清除骨架屏加载器
function clearSkeletonLoaders() {
    const skeletonCards = document.querySelectorAll('.skeleton-card');
    skeletonCards.forEach(card => card.remove());
}

// 显示表情
function displayEmojis(emojis) {
    const container = document.getElementById('emojiContainer');
    
    // 应用当前过滤器值
    const categoryFilter = document.getElementById('categoryFilter').value;
    const shapeFilter = document.getElementById('shapeFilter').value;
    const sortOption = document.getElementById('sortOption').value;
    const displayOption = document.getElementById('displayOption').value;
    
    // 应用过滤器
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
    
    // 应用排序
    if (sortOption === 'alphabetical') {
        filteredEmojis.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'recent') {
        // 假设我们有一个添加日期字段，如果没有，可以使用ID或其他指标
        filteredEmojis.sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0));
    } else if (sortOption === 'trending') {
        // 热门优先排序
        filteredEmojis.sort((a, b) => {
            if (a.trending === b.trending) return 0;
            return a.trending ? -1 : 1;
        });
    }
    
    // 更新表情计数
    updateEmojiCount(filteredEmojis.length);
    
    // 清空容器
    // container.innerHTML = '';
    
    // 如果没有结果，显示无结果信息
    if (filteredEmojis.length === 0) {
        document.getElementById('noResults').classList.remove('hidden');
        return;
    } else {
        document.getElementById('noResults').classList.add('hidden');
    }
    
    // 创建表情卡片
    filteredEmojis.forEach(emoji => {
        const card = createEmojiCard(emoji);
        container.appendChild(card);
    });
}

// 创建表情卡片
function createEmojiCard(emoji) {
    const card = document.createElement('div');
    card.className = 'bg-gray-800 rounded-lg p-4 flex flex-col items-center emoji-card';
    card.dataset.emoji = emoji.emoji;
    card.dataset.name = emoji.name;
    card.dataset.category = emoji.category;
    
    // 表情图像或字符
    const emojiDisplay = document.createElement('div');
    emojiDisplay.className = 'text-5xl mb-3 emoji-display';
    emojiDisplay.textContent = emoji.emoji;
    
    // 表情名称
    const emojiName = document.createElement('h3');
    emojiName.className = 'text-center font-medium mb-1 text-sm';
    emojiName.textContent = emoji.name;
    
    // 表情类别
    const emojiCategory = document.createElement('p');
    emojiCategory.className = 'text-xs text-gray-400 mb-3';
    emojiCategory.textContent = emoji.category;
    
    // 按钮容器
    const btnContainer = document.createElement('div');
    btnContainer.className = 'flex gap-2 mt-auto w-full';
    
    // 复制按钮
    const copyBtn = document.createElement('button');
    copyBtn.className = 'bg-pink-500 hover:bg-pink-600 text-white px-2 py-1 rounded text-xs flex-1 flex justify-center items-center';
    copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        复制
    `;
    copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyEmoji(emoji.emoji);
    });
    
    // 详情按钮
    const infoBtn = document.createElement('button');
    infoBtn.className = 'bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs flex-1 flex justify-center items-center';
    infoBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        详情
    `;
    infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showEmojiModal(emoji);
    });
    
    // 添加到按钮容器
    btnContainer.appendChild(copyBtn);
    btnContainer.appendChild(infoBtn);
    
    // 添加到卡片
    card.appendChild(emojiDisplay);
    card.appendChild(emojiName);
    card.appendChild(emojiCategory);
    card.appendChild(btnContainer);
    
    // 点击卡片显示详情
    card.addEventListener('click', () => {
        showEmojiModal(emoji);
    });
    
    return card;
}

// 复制表情
function copyEmoji(emoji) {
    navigator.clipboard.writeText(emoji)
        .then(() => {
            showToast('已复制表情到剪贴板！');
        })
        .catch(err => {
            console.error('复制失败:', err);
            showToast('复制失败，请手动复制表情。');
        });
}

// 下载表情图像
function downloadEmoji(emoji) {
    // 创建Canvas元素
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;
    
    // 设置背景透明
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制表情
    ctx.font = '200px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, canvas.width / 2, canvas.height / 2);
    
    // 将Canvas转换为图像URL
    const imageUrl = canvas.toDataURL('image/png');
    
    // 创建下载链接
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.download = 'tiktok-emoji.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    showToast('表情下载成功！');
}

// 获取表情形状
function getEmojiShape(emoji) {
    // 简单形状判断，根据表情的特点进行判断
    // 这里只是示例，实际应用可以有更复杂的逻辑
    if (emoji.category === 'special') {
        return 'special';
    }
    
    // 默认为圆形
    return 'circle';
}

// 显示表情信息模态框
function showEmojiModal(emoji) {
    const modal = document.getElementById('emojiModal');
    
    // 更新模态框内容
    document.getElementById('modalEmojiName').textContent = emoji.name;
    document.getElementById('modalEmojiImage').textContent = emoji.emoji;
    document.getElementById('modalEmojiUnicode').textContent = `U+${emoji.unicode || '不可用'}`;
    document.getElementById('modalEmojiCategory').textContent = emoji.category;
    document.getElementById('modalEmojiTrending').textContent = emoji.trending ? '是' : '否';
    
    // 表情描述
    const description = emoji.description || `这是一个${emoji.category}类别的表情，可用于表达相关情感。`;
    document.getElementById('modalEmojiDescription').textContent = description;
    
    // TikTok用法
    const tiktokUsage = emoji.tiktokUsage || `在TikTok中，这个表情常用于${emoji.category === 'happy' ? '表达开心和愉悦的情绪' : emoji.category === 'sad' ? '表达伤心和难过的情绪' : emoji.category === 'love' ? '表达爱意和喜欢' : emoji.category === 'angry' ? '表达生气和不满' : '各种场合'}。`;
    document.getElementById('modalEmojiTikTokUsage').textContent = tiktokUsage;
    
    // 绑定按钮事件
    document.getElementById('modalCopyEmoji').onclick = () => copyEmoji(emoji.emoji);
    document.getElementById('modalDownloadEmoji').onclick = () => downloadEmoji(emoji.emoji);
    
    // 显示模态框
    modal.classList.remove('hidden');
}

// 更新表情计数
function updateEmojiCount(count) {
    document.getElementById('emojiCount').textContent = `找到 ${count} 个表情`;
}

// 显示提示框
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    
    // 显示提示框
    toast.classList.remove('translate-y-10', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    
    // 设置定时器，自动隐藏提示框
    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-10', 'opacity-0');
    }, duration);
}

// 更新关键词详情
function updateKeywordInfo(keyword) {
    const keywordLower = keyword.toLowerCase();
    let infoContent = '';
    
    // 根据不同关键词提供不同内容
    if (keywordLower.includes('热门') || keywordLower.includes('trending')) {
        infoContent = `
            <p class="mb-4">TikTok热门表情是指在平台上频繁使用并广受欢迎的表情符号。这些表情经常出现在评论区、视频回复和用户之间的互动中。</p>
            <p class="mb-4">热门表情通常能够更好地表达情感，增加评论的可见度。使用热门表情可以让您的互动更紧跟潮流，提高与其他TikTok用户的共鸣。</p>
            <p>我们定期更新热门表情列表，确保您能够获取到最新的流行表情。</p>
        `;
    } else if (keywordLower.includes('特殊') || keywordLower.includes('special')) {
        infoContent = `
            <p class="mb-4">TikTok特殊表情是指那些不同于普通单个表情符号的组合或独特表情。这些特殊表情通常由多个Unicode字符组合而成，创造出独特的视觉效果。</p>
            <p class="mb-4">特殊表情在TikTok上非常受欢迎，因为它们能够表达复杂的情感或成为特定梗的一部分。例如"👁️👄👁️"成为了表示震惊或不知所措的热门表情。</p>
            <p>使用这些特殊表情可以让您的评论脱颖而出，增加被创作者注意到的机会。</p>
        `;
    } else if (keywordLower.includes('开心') || keywordLower.includes('happy')) {
        infoContent = `
            <p class="mb-4">开心类表情是TikTok上最常用的表情之一，用于表达各种积极情绪，如喜悦、愉快、兴奋和满足。</p>
            <p class="mb-4">从基本的笑脸😊到大笑🤣，再到带有特殊元素的组合表情，开心类表情能够有效地传达您对视频内容的积极反应。</p>
            <p>在TikTok上使用开心表情是与创作者建立良好互动的简单方式，也能增加您的评论获得回复的可能性。</p>
        `;
    } else if (keywordLower.includes('伤心') || keywordLower.includes('sad')) {
        infoContent = `
            <p class="mb-4">伤心类表情在TikTok上用于表达各种消极情绪，如悲伤、失望、遗憾或同情。</p>
            <p class="mb-4">从流泪的表情😢到更夸张的大哭表情😭，这些表情符号能够让您表达对感人内容的情感共鸣或对不幸事件的同情。</p>
            <p>在TikTok的情感视频或分享艰难经历的内容下，适当使用伤心表情能够表达您的理解和支持。</p>
        `;
    } else {
        // 默认内容
        infoContent = `
            <p class="mb-4">TikTok表情是增强您在平台上互动体验的重要元素。无论是评论、私信还是创建视频，恰当的表情符号都能帮助您更好地表达情感和想法。</p>
            <p class="mb-4">我们的集合包含了所有流行的TikTok表情，从标准Unicode表情到特殊的组合表情。您可以轻松复制这些表情并直接在TikTok上使用。</p>
            <p>定期查看我们的更新，掌握最新的表情潮流，让您的TikTok互动更加丰富多彩。</p>
        `;
    }
    
    document.getElementById('keywordInfoContent').innerHTML = infoContent;
}

// 加载相关关键词
function loadRelatedKeywords(currentKeyword) {
    // 定义相关关键词映射
    const keywordRelations = {
        '热门表情': ['特殊表情', '开心表情', '伤心表情', 'TikTok梗', '流行表情'],
        '特殊表情': ['组合表情', '创意表情', '热门表情', 'TikTok专属表情', '表情符号艺术'],
        '开心表情': ['笑脸表情', '欢乐表情', '喜悦表情', '积极表情', '大笑表情'],
        '伤心表情': ['哭泣表情', '失望表情', '悲伤表情', '抑郁表情', '难过表情'],
        '爱心表情': ['浪漫表情', '爱情表情', '喜欢表情', '心动表情', '表白表情'],
        '生气表情': ['愤怒表情', '不满表情', '恼火表情', '暴怒表情', '烦躁表情']
    };
    
    // 查找当前关键词的相关关键词
    let relatedKeywords = [];
    const currentKeywordLower = currentKeyword.toLowerCase();
    
    // 根据当前关键词匹配
    for (const [key, values] of Object.entries(keywordRelations)) {
        if (currentKeywordLower.includes(key.toLowerCase())) {
            relatedKeywords = values;
            break;
        }
    }
    
    // 如果没有找到匹配项，使用默认相关关键词
    if (relatedKeywords.length === 0) {
        relatedKeywords = ['热门表情', '特殊表情', '开心表情', '伤心表情', '爱心表情', '生气表情'];
    }
    
    // 更新相关关键词容器
    const relatedKeywordsContainer = document.getElementById('relatedKeywordsContainer');
    relatedKeywordsContainer.innerHTML = '';
    
    relatedKeywords.forEach(keyword => {
        const link = document.createElement('a');
        link.href = `keyword-template.html?q=${encodeURIComponent(keyword)}`;
        link.className = 'bg-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-600 transition';
        link.textContent = keyword;
        relatedKeywordsContainer.appendChild(link);
    });
}

// 加载热门关键词
function loadPopularKeywords() {
    // 定义热门关键词
    const popularKeywords = [
        '热门表情',
        '特殊表情',
        'TikTok梗',
        '组合表情',
        '笑脸表情',
        '哭泣表情',
        '爱心表情',
        '生气表情',
        '惊讶表情',
        '表情符号艺术'
    ];
    
    // 更新热门关键词容器
    const popularKeywordsContainer = document.getElementById('popularKeywordsContainer');
    popularKeywordsContainer.innerHTML = '';
    
    popularKeywords.forEach(keyword => {
        const link = document.createElement('a');
        link.href = `keyword-template.html?q=${encodeURIComponent(keyword)}`;
        link.className = 'bg-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-600 transition';
        link.textContent = keyword;
        popularKeywordsContainer.appendChild(link);
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索表单提交
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            window.location.href = `keyword-template.html?q=${encodeURIComponent(searchTerm)}`;
        }
    });
    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                window.location.href = `keyword-template.html?q=${encodeURIComponent(searchTerm)}`;
            }
        }
    });
    
    // 过滤器变化
    const filterElements = [
        document.getElementById('categoryFilter'),
        document.getElementById('shapeFilter'),
        document.getElementById('sortOption'),
        document.getElementById('displayOption')
    ];
    
    filterElements.forEach(element => {
        element.addEventListener('change', () => {
            // 获取URL中的关键词参数
            const urlParams = new URLSearchParams(window.location.search);
            const keyword = urlParams.get('q') || '热门表情';
            
            // 获取并显示表情
            fetchAndDisplayEmojis(keyword);
        });
    });
    
    // 视图切换按钮
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    
    gridViewBtn.addEventListener('click', () => {
        document.getElementById('emojiContainer').classList.remove('flex-col');
        document.getElementById('emojiContainer').classList.add('grid');
        gridViewBtn.classList.add('bg-pink-500');
        gridViewBtn.classList.remove('bg-gray-700');
        listViewBtn.classList.add('bg-gray-700');
        listViewBtn.classList.remove('bg-pink-500');
    });
    
    listViewBtn.addEventListener('click', () => {
        document.getElementById('emojiContainer').classList.remove('grid');
        document.getElementById('emojiContainer').classList.add('flex-col');
        listViewBtn.classList.add('bg-pink-500');
        listViewBtn.classList.remove('bg-gray-700');
        gridViewBtn.classList.add('bg-gray-700');
        gridViewBtn.classList.remove('bg-pink-500');
    });
    
    // 关闭模态框
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('emojiModal').classList.add('hidden');
    });
    
    // 点击模态框外部关闭模态框
    document.getElementById('emojiModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('emojiModal')) {
            document.getElementById('emojiModal').classList.add('hidden');
        }
    });
} 