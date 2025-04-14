// TikTok Emojis - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Data storage for emoji information
    let allEmojis = [];
    let filteredEmojis = [];
    let currentCategory = 'all';
    let currentShape = 'all';
    let searchQuery = '';
    
    // DOM Elements
    const emojiGrid = document.getElementById('emoji-grid');
    const searchInput = document.getElementById('search');
    const emojiCountElement = document.getElementById('emoji-count');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const shapeButtons = document.querySelectorAll('.shape-btn');
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

    // 判断表情是圆形还是方形
    function determineEmojiShape(name) {
        // 圆形表情列表 - 基于截图中的表情形状
        const roundEmojis = [
            'angry', 'embarrassed', 'evil', 'flushed', 'funnyface', 'happy', 
            'laughwithtears', 'lovely', 'scream', 'shout', 'smile', 'speechless', 
            'sulk', 'surprised', 'thinking', 'weep', 'wicked', 'wronged', 'yummy',
            'cry', 'drool', 'complacent'
        ];
        
        // 特殊组合表情通常使用方形布局
        const specialEmojis = [
            'fairy_blessing', 'shocked_expression', 'queen_flick', 'italian_gesture', 'stop_crying',
            'chair', 'sparkles', 'clown_face', 'birthday_cake', 'skull', 'person_standing', 'shy_bashful'
        ];
        
        // 明确指定为方形的表情
        const squareEmojis = [
            'facewithrollingeyes', 'greedy'
        ];
        
        if (roundEmojis.includes(name)) {
            return 'round';
        } else if (specialEmojis.includes(name)) {
            return 'special';
        } else if (squareEmojis.includes(name)) {
            return 'square';
        } else {
            return 'square'; // 默认为方形
        }
    }

    // 为emoji添加适当的分类和形状
    function assignCategoriesAndShape(emojiData) {
        return emojiData.map(emoji => {
            // 将所有emoji默认设为smileys类别
            let categories = ['smileys'];
            
            // 根据emoji名称分配额外的类别
            const name = emoji.name.toLowerCase();
            
            // 判断形状
            const shape = determineEmojiShape(name);
            
            // 特殊表情类别
            if (name.includes('_') || 
                ['chair', 'sparkles', 'clown_face', 'birthday_cake', 'skull', 'person_standing'].includes(name)) {
                categories.push('special');
            }
            
            // 快乐表情
            if (name.includes('happy') || name.includes('smile') || name.includes('laugh') || 
                name.includes('joy') || name.includes('grin') || name.includes('hehe') || 
                name.includes('excited') || name.includes('flush') || name.includes('cute') ||
                name.includes('yummy') || name.includes('joyful') || name.includes('fairy')) {
                categories.push('happy');
            }
            
            // 悲伤表情
            if (name.includes('sad') || name.includes('cry') || name.includes('tear') || 
                name.includes('weep') || name.includes('wrong') || name.includes('embarrassed') ||
                name.includes('stop_crying')) {
                categories.push('sad');
            }
            
            // 愤怒表情
            if (name.includes('angry') || name.includes('rage') || name.includes('sulk') || 
                name.includes('mad') || name.includes('disdain') || name.includes('shocked')) {
                categories.push('angry');
            }
            
            // 爱心表情
            if (name.includes('love') || name.includes('heart') || name.includes('lovely') || 
                name.includes('cute')) {
                categories.push('love');
            }
            
            // 人物相关
            if (name.includes('slap') || name.includes('hand') || name.includes('gesture') || 
                name.includes('queen') || name.includes('italian') || name.includes('flick') ||
                name.includes('person') || name.includes('shy_bashful')) {
                categories.push('people');
            }
            
            // 返回更新后的emoji对象
            return {
                ...emoji,
                categories: categories,
                shape: shape
            };
        });
    }

    // TikTok自定义表情数据 - 基本表情
    const basicEmojiData = [
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
    
    // TikTok特殊组合表情数据
    const specialEmojiData = [
        {
            emoji: "✨🤖✨",
            name: "fairy_blessing",
            unicode: "U+2728 U+1F916 U+2728",
            category: "special",
            trending: true,
            description: "Used on TikTok as a way to wish good luck or special blessings",
            image: "emoji_png/fairy_blessing.png"
        },
        {
            emoji: "👁️👄👁️",
            name: "shocked_expression",
            unicode: "U+1F441 U+1F444 U+1F441",
            category: "special",
            trending: true,
            description: "I am observing and somewhat engrossed in this content",
            image: "emoji_png/shocked_expression.png"
        },
        {
            emoji: "💅✨",
            name: "queen_flick",
            unicode: "U+1F485 U+2728",
            category: "special",
            trending: true,
            description: "Showing confidence, dismissiveness or sass",
            image: "emoji_png/queen_flick.png"
        },
        {
            emoji: "🤌✨",
            name: "italian_gesture",
            unicode: "U+1F90C U+2728",
            category: "special",
            trending: true,
            description: "Italian hand gesture, often used sarcastically or to emphasize a point",
            image: "emoji_png/italian_gesture.png"
        },
        {
            emoji: "😭✋",
            name: "stop_crying",
            unicode: "U+1F62D U+270B",
            category: "special",
            trending: true,
            description: "Used to express extreme emotion or to tell someone to stop being dramatic",
            image: "emoji_png/stop_crying.png"
        }
    ];
    
    // 添加第二张截图中的TikTok特殊含义表情
    const tiktokMeaningEmojiData = [
        {
            emoji: "🪑",
            name: "chair",
            unicode: "U+1FA91",
            category: "objects",
            trending: true,
            description: "Used on TikTok as a placeholder with no single meaning. One use is implied to be sexual, other times simply to create confusion or to fill space. New in September 2021.",
            image: "emoji_png/chair.png"
        },
        {
            emoji: "✨",
            name: "sparkles",
            unicode: "U+2728",
            category: "symbols",
            trending: true,
            description: "Emphasis on a point, sometimes used for sarcasm or mocking. May be used as an alternative to italics.",
            image: "emoji_png/sparkles.png"
        },
        {
            emoji: "🤡",
            name: "clown_face",
            unicode: "U+1F921",
            category: "smileys",
            trending: true,
            description: "Describing someone selfish or unintelligent",
            image: "emoji_png/clown_face.png"
        },
        {
            emoji: "🎂",
            name: "birthday_cake",
            unicode: "U+1F382",
            category: "food",
            trending: true,
            description: "Alternative to 🍑 Peach when referring to buttocks (eg 'nice 🎂')",
            image: "emoji_png/birthday_cake.png"
        },
        {
            emoji: "💀",
            name: "skull",
            unicode: "U+1F480",
            category: "smileys",
            trending: true,
            description: "Figurative 'I'm dead' (I found this very funny, an alternative to 😂 Face with Tears of Joy)",
            image: "emoji_png/skull.png"
        },
        {
            emoji: "🧍",
            name: "person_standing",
            unicode: "U+1F9CD",
            category: "people",
            trending: true,
            description: "Standing awkwardly. 'I don't know what I just watched' and/or mimicking a passer-by in a video",
            image: "emoji_png/person_standing.png"
        },
        {
            emoji: "🫣👉👈",
            name: "shy_bashful",
            unicode: "U+1FAE3 U+1F449 U+1F448",
            category: "special",
            trending: true,
            description: "Shy or bashful; available as a hidden TikTok emote using the shortcode [wronged]",
            image: "emoji_png/shy_bashful.png"
        }
    ];

    // 合并所有表情数据
    const combinedEmojiData = [...basicEmojiData, ...specialEmojiData, ...tiktokMeaningEmojiData];

    // 添加分类并初始化数据
    const categorizedEmojiData = assignCategoriesAndShape(combinedEmojiData);

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
        
        // 更新排序逻辑：首先按形状分组，然后在每个形状组内按名称排序
        const specialEmojis = emojis.filter(emoji => emoji.shape === 'special');
        const squareEmojis = emojis.filter(emoji => emoji.shape === 'square');
        const roundEmojis = emojis.filter(emoji => emoji.shape === 'round');
        
        // 按名称对每个组内的表情进行排序
        specialEmojis.sort((a, b) => a.name.localeCompare(b.name));
        squareEmojis.sort((a, b) => a.name.localeCompare(b.name));
        roundEmojis.sort((a, b) => a.name.localeCompare(b.name));
        
        // 根据当前选择的形状筛选器决定显示顺序
        let sortedEmojis = [];
        
        if (currentShape === 'all') {
            // 如果选择"全部"，则按特殊->方形->圆形的顺序显示
            sortedEmojis = [...specialEmojis, ...squareEmojis, ...roundEmojis];
        } else if (currentShape === 'special') {
            sortedEmojis = specialEmojis;
        } else if (currentShape === 'square') {
            sortedEmojis = squareEmojis;
        } else if (currentShape === 'round') {
            sortedEmojis = roundEmojis;
        }
        
        sortedEmojis.forEach(emoji => {
            const card = document.createElement('div');
            card.className = `emoji-card ${emoji.shape}-emoji`;
            
            // 为特殊组合表情使用不同的卡片结构
            if (emoji.shape === 'special') {
                card.innerHTML = `
                    <div class="emoji-image special-image">
                        <img src="${emoji.image}" alt="${emoji.name}" class="lazy-load">
                    </div>
                    <div class="emoji-info">
                        <div class="emoji-name">${emoji.name.replace(/_/g, ' ')}</div>
                        <div class="emoji-category">TikTok Features</div>
                    </div>
                    <div class="emoji-actions">
                        <button class="emoji-btn copy-btn" data-emoji="${emoji.emoji}" title="Copy Emoji">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                        <button class="emoji-btn download-btn" data-image="${emoji.image}" data-name="${emoji.name}" title="Download PNG">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="emoji-image">
                        <img src="${emoji.image}" alt="${emoji.name}" class="lazy-load">
                    </div>
                    <div class="emoji-info">
                        <div class="emoji-name">${emoji.name.replace(/_/g, ' ')}</div>
                        <div class="emoji-unicode">${emoji.unicode}</div>
                        <div class="emoji-category">${emoji.categories ? emoji.categories[0] : emoji.category}</div>
                    </div>
                    <div class="emoji-actions">
                        <button class="emoji-btn copy-btn" data-emoji="${emoji.emoji}" title="Copy Emoji">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                        <button class="emoji-btn download-btn" data-image="${emoji.image}" data-name="${emoji.name}" title="Download PNG">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                `;
            }
            
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

    // Filter emojis by category and shape
    function filterEmojis() {
        filteredEmojis = allEmojis.filter(emoji => {
            // 根据当前选择的类别过滤
            const categoryMatch = currentCategory === 'all' || 
                                (currentCategory === 'trending' && emoji.trending) ||
                                (emoji.categories && emoji.categories.includes(currentCategory));
            
            // 根据当前选择的形状过滤
            const shapeMatch = currentShape === 'all' || emoji.shape === currentShape;
            
            // 根据搜索查询过滤
            const searchMatch = searchQuery === '' || 
                               emoji.name.toLowerCase().includes(searchQuery) ||
                               emoji.emoji.includes(searchQuery);
            
            return categoryMatch && shapeMatch && searchMatch;
        });
        
        // 按形状排序: 圆形优先，然后是特殊形状，最后是方形
        filteredEmojis.sort((a, b) => {
            const shapeOrder = { 'round': 0, 'special': 1, 'square': 2 };
            return shapeOrder[a.shape] - shapeOrder[b.shape];
        });
        
        updateEmojiCount();
        createEmojiCards(filteredEmojis);
    }

    // 更新形状过滤器显示
    function updateShapeFilterDisplay() {
        const specialCount = allEmojis.filter(emoji => emoji.shape === 'special').length;
        const squareCount = allEmojis.filter(emoji => emoji.shape === 'square').length;
        const roundCount = allEmojis.filter(emoji => emoji.shape === 'round').length;
        
        // 更新形状按钮上的数字
        document.querySelector('.shape-btn[data-shape="all"]').textContent = `All Shapes (${allEmojis.length})`;
        document.querySelector('.shape-btn[data-shape="special"]').textContent = `Special (${specialCount})`;
        document.querySelector('.shape-btn[data-shape="square"]').textContent = `Square (${squareCount})`;
        document.querySelector('.shape-btn[data-shape="round"]').textContent = `Round (${roundCount})`;
    }

    // Update emoji count display
    function updateEmojiCount() {
        if (currentCategory === 'all' && currentShape === 'all' && !searchQuery) {
            emojiCountElement.textContent = `Showing all ${filteredEmojis.length} emojis`;
        } else {
            let filterText = [];
            
            if (currentCategory !== 'all') {
                filterText.push(currentCategory);
            }
            
            if (currentShape !== 'all') {
                filterText.push(currentShape);
            }
            
            if (searchQuery) {
                filterText.push(`matching "${searchQuery}"`);
            }
            
            emojiCountElement.textContent = `Showing ${filteredEmojis.length} ${filterText.join(' ')} emojis`;
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
    
    // Show emoji info
    function showEmojiInfo(e) {
        const name = e.currentTarget.getAttribute('data-name');
        const unicode = e.currentTarget.getAttribute('data-unicode');
        const description = e.currentTarget.getAttribute('data-description');
        
        if (description) {
            showToast(`${name}: ${description}`);
        } else if (unicode) {
            showToast(`${name} (${unicode})`);
        } else {
            showToast(`${name}`);
        }
    }

    // Show toast notification
    function showToast(message, isError = false) {
        toast.textContent = message;
        toast.className = isError 
            ? 'fixed bottom-4 right-4 bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all duration-300'
            : 'fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all duration-300';
        
        setTimeout(() => {
            toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-lg transform translate-y-20 opacity-0 transition-all duration-300';
        }, 3000);
    }

    // Lazy load images
    function lazyLoadImages() {
        const lazyImages = document.querySelectorAll('.lazy-load');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        image.classList.remove('lazy-load');
                        imageObserver.unobserve(image);
                    }
                });
            });
            
            lazyImages.forEach(image => {
                imageObserver.observe(image);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            lazyImages.forEach(image => {
                image.classList.remove('lazy-load');
            });
        }
    }

    // Initialize app
    // Load emoji data and set up event listeners
    function initApp() {
        initializeEmojis(categorizedEmojiData);
        updateShapeFilterDisplay();
        
        // Search input event listener
        searchInput.addEventListener('input', function() {
            searchQuery = this.value.toLowerCase();
            filterEmojis();
        });
        
        // Category button event listeners
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                currentCategory = this.getAttribute('data-category');
                
                // Update active button
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                filterEmojis();
            });
        });
        
        // Shape button event listeners
        shapeButtons.forEach(button => {
            button.addEventListener('click', function() {
                currentShape = this.getAttribute('data-shape');
                
                // Update active button
                shapeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                filterEmojis();
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
// Updated script - 2023 