// TikTok Emojis - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Data storage for emoji information
    let emojiData = [];
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
    let toast = document.getElementById('toast');
    let toastTimeout;
    
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
            'angry', 'embarrassed', 'flushed', 'funnyface', 'happy', 
            'laughwithtears', 'lovely', 'scream', 'shout', 'smile', 'speechless', 
            'sulk', 'surprised', 'thinking', 'weep', 'wicked', 'wronged', 'yummy',
            'cry', 'drool', 'complacent', 'facewithrollingeyes', 'greedy'
        ];
        
        // 特殊组合表情通常使用方形布局
        const specialEmojis = [
            'fairy_blessing', 'shocked_expression', 'queen_flick', 'italian_gesture', 'stop_crying',
            'chair', 'sparkles', 'clown_face', 'birthday_cake', 'skull', 'person_standing', 'shy_bashful',
            'blushing_face', 'caught_in_the_act', 'deep_thinking', 'flirty_eyes', 
            'love_struck', 'peaceful_vibe', 'evil_eye'
        ];
        
        // 明确指定为方形的表情
        const squareEmojis = [
            'evil', 'cool'
        ];
        
        // 首先检查确切的名称匹配
        if (squareEmojis.includes(name)) {
            return 'square';
        } else if (roundEmojis.includes(name)) {
            return 'round';
        } else if (specialEmojis.includes(name)) {
            return 'special';
        } else if (name.includes('_') || name.includes(' ')) {
            // 添加额外检查：包含下划线或空格的名称通常是组合表情，应该归类为special
            return 'special';
        } else {
            return 'square'; // 默认为方形
        }
    }

    // 为emoji添加适当的分类和形状
    function assignCategoriesAndShape(emoji) {
        if (!emoji.categories) {
            emoji.categories = [];
        }
        
        // 根据表情名称和描述添加类别
        const name = emoji.name.toLowerCase();
        const desc = emoji.description ? emoji.description.toLowerCase() : '';
        
        // 检查是否应该属于happy类别
        if (name.includes('smile') || name.includes('grin') || name.includes('laugh') || 
            name.includes('joy') || name.includes('happy') || name.includes('hehe') || 
            desc.includes('happiness') || desc.includes('joy') || name.includes('blush') || 
            name.includes('love') || name.includes('heart')) {
            emoji.categories.push('happy');
        }
        
        // 检查是否应该属于sad类别
        if (name.includes('sad') || name.includes('cry') || name.includes('tear') || 
            name.includes('sob') || name.includes('disappointed') || name.includes('worried') || 
            desc.includes('sadness') || desc.includes('crying') || desc.includes('tears')) {
            emoji.categories.push('sad');
        }
        
        // 检查是否应该属于angry类别
        if (name.includes('angry') || name.includes('rage') || name.includes('mad') || 
            name.includes('furious') || name.includes('annoyed') || name.includes('frustrated') || 
            desc.includes('anger') || desc.includes('frustrated')) {
            emoji.categories.push('angry');
        }
        
        // 检查是否应该属于love类别
        if (name.includes('love') || name.includes('heart') || name.includes('kiss') || 
            name.includes('romantic') || name.includes('couple') || name.includes('affection') || 
            desc.includes('love') || desc.includes('romantic') || desc.includes('affection')) {
            emoji.categories.push('love');
        }
        
        // 检查是否应该属于special类别
        if (name.includes('special') || name.includes('unique') || emoji.isSpecial || 
            name.includes('_') || name.includes(' ') || (emoji.emoji && emoji.emoji.length > 2) ||
            ['blushing_face', 'caught_in_the_act', 'deep_thinking', 'flirty_eyes', 
            'love_struck', 'peaceful_vibe', 'evil_eye'].includes(name)) {
            emoji.categories.push('special');
            // 确保这些特殊表情的形状也设置为special
            emoji.shape = 'special';
        }
        
        // 如果没有分配任何类别，则分配到其主要类别或默认类别
        if (emoji.categories.length === 0 && emoji.category) {
            emoji.categories.push(emoji.category);
        }
        
        // 设置主要类别
        if (!emoji.category && emoji.categories.length > 0) {
            emoji.category = emoji.categories[0];
        } else if (!emoji.category) {
            emoji.category = 'other';
        }
        
        // 确保类别是唯一的
        emoji.categories = [...new Set(emoji.categories)];
        
        // 分配形状
        if (!emoji.shape) {
            emoji.shape = determineEmojiShape(emoji.name);
        }
        
        return emoji;
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
            emoji: "💅👑💅",
            name: "queen_flick",
            unicode: "U+1F485 U+1F451 U+1F485",
            category: "special",
            trending: true,
            description: "Showing confidence, dismissiveness or sass",
            image: "emoji_png/queen_flick.png"
        },
        {
            emoji: "🤌🤌🤌",
            name: "italian_gesture",
            unicode: "U+1F90C U+1F90C U+1F90C",
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
        },
        {
            emoji: "👁️❤️👁️",
            name: "flirty_eyes",
            unicode: "U+1F441 U+2764 U+1F441",
            category: "special",
            trending: true,
            description: "Flirtatious expression, often used to show interest in someone or something",
            image: "emoji_png/flirty_eyes.png"
        },
        {
            emoji: "😳❤️❤️",
            name: "blushing_face",
            unicode: "U+1F633 U+2764 U+2764",
            category: "special",
            trending: true,
            description: "Feeling shy and in love, used to express a crush or attraction",
            image: "emoji_png/blushing_face.png"
        },
        {
            emoji: "😳📸",
            name: "caught_in_the_act",
            unicode: "U+1F633 U+1F4F8",
            category: "special",
            trending: true,
            description: "Caught doing something embarrassing or unexpected",
            image: "emoji_png/caught_in_the_act.png"
        },
        {
            emoji: "🧿👄🧿",
            name: "evil_eye",
            unicode: "U+1F9FF U+1F444 U+1F9FF",
            category: "special",
            trending: true,
            description: "A protective expression against bad luck or evil spirits",
            image: "emoji_png/evil_eye.png"
        },
        {
            emoji: "😍💕",
            name: "love_struck",
            unicode: "U+1F60D U+1F495",
            category: "special",
            trending: true,
            description: "Deeply in love or obsessed with something or someone",
            image: "emoji_png/love_struck.png"
        },
        {
            emoji: "🤔💭",
            name: "deep_thinking",
            unicode: "U+1F914 U+1F4AD",
            category: "special",
            trending: true,
            description: "Lost in thought or contemplating something complex",
            image: "emoji_png/deep_thinking.png"
        },
        {
            emoji: "😌✨",
            name: "peaceful_vibe",
            unicode: "U+1F60C U+2728",
            category: "special",
            trending: true,
            description: "Feeling calm, peaceful, and positive about life",
            image: "emoji_png/peaceful_vibe.png"
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
    const categorizedEmojiData = combinedEmojiData.map(emoji => assignCategoriesAndShape(emoji));

    // 创建emoji图片的函数 - 修改为优先使用PNG图片
    function createEmojiImage(emoji, name) {
        // 优先使用本地PNG图片
        const imagePath = `emoji_png/${name}.png`;
        
        // 检查图片是否可以加载
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function() {
                resolve(imagePath);
            };
            img.onerror = function() {
                // 如果图片不存在，则使用Canvas生成emoji图片
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
                resolve(canvas.toDataURL('image/png'));
            };
            img.src = imagePath;
        });
    }

    // Create emoji card elements
    function createEmojiCards(emojis) {
        emojiGrid.innerHTML = '';
        
        if (emojis.length === 0) {
            emojiGrid.innerHTML = '<div class="col-span-full text-center py-10 text-gray-500">No emojis found matching your search.</div>';
            return;
        }
        
        // 更新排序逻辑：首先按形状分组，然后在每个形状组内按名称排序
        const roundEmojis = emojis.filter(emoji => emoji.shape === 'round');
        const squareEmojis = emojis.filter(emoji => emoji.shape === 'square');
        const specialEmojis = emojis.filter(emoji => emoji.shape === 'special');
        
        // 按名称对每个组内的表情进行排序
        roundEmojis.sort((a, b) => a.name.localeCompare(b.name));
        squareEmojis.sort((a, b) => a.name.localeCompare(b.name));
        specialEmojis.sort((a, b) => a.name.localeCompare(b.name));
        
        // 根据当前选择的形状筛选器决定显示顺序
        let sortedEmojis = [];
        
        if (currentShape === 'all') {
            // 如果选择"全部"，则按圆形->方形->特殊表情的顺序显示
            sortedEmojis = [...roundEmojis, ...squareEmojis, ...specialEmojis];
        } else if (currentShape === 'special') {
            sortedEmojis = specialEmojis;
        } else if (currentShape === 'square') {
            sortedEmojis = squareEmojis;
        } else if (currentShape === 'round') {
            sortedEmojis = roundEmojis;
        }
        
        const createEmojisPromises = sortedEmojis.map(emoji => {
            return new Promise((resolve) => {
                // 优先使用emoji.image中指定的PNG图片
                let imagePath = emoji.image;
                
                // 检查图片是否存在
                const img = new Image();
                img.onload = function() {
                    // 图片加载成功，使用该图片
                    createAndAppendEmojiCard(emoji, imagePath);
                    resolve();
                };
                img.onerror = function() {
                    // 图片加载失败，对于特殊表情尝试使用动态生成
                    if (emoji.name.includes('_') || emoji.shape === 'special') {
                        // 特殊表情使用动态生成
                        const canvas = createDynamicEmojiImage(emoji);
                        createAndAppendEmojiCard(emoji, canvas.toDataURL('image/png'));
                    } else {
                        // 普通表情使用文字渲染
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = 128;
                        canvas.height = 128;
                        
                        ctx.font = "90px Arial";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText(emoji.emoji, canvas.width/2, canvas.height/2);
                        
                        createAndAppendEmojiCard(emoji, canvas.toDataURL('image/png'));
                    }
                    resolve();
                };
                img.src = imagePath;
            });
        });
        
        Promise.all(createEmojisPromises).then(() => {
            // 所有表情卡片加载完成后执行懒加载
            lazyLoadImages();
        });
        
        function createAndAppendEmojiCard(emoji, imagePath) {
            // 确定卡片的样式类
            let cardClass = 'emoji-card';
            if (emoji.shape === 'round') {
                cardClass += ' round-emoji';
            } else if (emoji.shape === 'square') {
                cardClass += ' square-emoji';
            } else if (emoji.shape === 'special') {
                cardClass += ' special-emoji';
            }
            
            // 创建表情卡片HTML
            const card = document.createElement('div');
            card.className = cardClass;
            
            // 创建表情图片和信息HTML
            card.innerHTML = `
                <div class="emoji-image">
                    <img src="${imagePath}" alt="${emoji.name}" loading="lazy" class="lazy-load">
                </div>
                <div class="emoji-info">
                    <div class="emoji-name">${emoji.name.replace(/_/g, ' ')}</div>
                    <div class="emoji-unicode font-mono text-sm">${emoji.unicode}</div>
                    <div class="emoji-category">${emoji.category}</div>
                </div>
                <div class="emoji-actions">
                    <button class="emoji-btn copy-btn" data-emoji="${emoji.emoji}" aria-label="Copy emoji">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="emoji-btn download-btn" data-image="${imagePath}" data-name="${emoji.name}" aria-label="Download emoji">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="emoji-btn info-btn" data-name="${emoji.name}" data-unicode="${emoji.unicode}" data-description="${emoji.description || ''}" aria-label="Show emoji info">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            `;
            
            // 添加事件监听器
            const copyBtn = card.querySelector('.copy-btn');
            const downloadBtn = card.querySelector('.download-btn');
            const infoBtn = card.querySelector('.info-btn');
            
            copyBtn.addEventListener('click', copyEmoji);
            downloadBtn.addEventListener('click', downloadEmoji);
            infoBtn.addEventListener('click', showEmojiInfo);
            
            // 添加到网格
            emojiGrid.appendChild(card);
        }
    }

    // Initialize emojis
    function initializeEmojis(data) {
        // 确保每个表情都有正确的类别和形状
        emojiData = data.map(emoji => assignCategoriesAndShape(emoji));
        
        // 确保至少有一些表情被标记为trending（基本数据的trending标记）
        // 如果本地存储没有使用数据，设置一些默认的trending表情
        const hasLocalStorageTrending = checkLocalStorageTrending();
        
        if (!hasLocalStorageTrending) {
            // 将一些表情设置为默认trending
            const defaultTrendingNames = [
                'laugh', 'tears', 'smile', 'happy', 'angry', 'scream', 'shock',
                'thinking', 'fairy_blessing', 'shocked_expression', 'skull'
            ];
            
            emojiData.forEach(emoji => {
                if (defaultTrendingNames.includes(emoji.name)) {
                    emoji.trending = true;
                }
            });
        }
        
        filteredEmojis = [...emojiData];
        updateEmojiCount();
        updateFilterDisplay(); // 确保分类计数正确显示
        createEmojiCards(filteredEmojis);
    }

    // 检查本地存储中是否有trending数据
    function checkLocalStorageTrending() {
        const stats = JSON.parse(localStorage.getItem('emojiStats') || '{}');
        if (Object.keys(stats).length === 0) {
            return false;
        }
        
        // 更新trending表情
        updateTrendingEmojis();
        
        // 检查是否有至少一个表情被标记为trending
        return emojiData.some(emoji => emoji.trending);
    }

    // 更新热门表情 - 修改评分系统
    function updateTrendingEmojis() {
        const stats = JSON.parse(localStorage.getItem('emojiStats') || '{}');
        
        // 如果没有统计数据，返回
        if (Object.keys(stats).length === 0) {
            return;
        }
        
        // 计算每个表情的分数
        const scoredEmojis = Object.keys(stats)
            .map(name => {
                const emoji = emojiData.find(e => e.name === name);
                if (!emoji) return null;
                
                const stat = stats[name];
                // 调整评分公式，确保即使互动少的表情也能获得足够的分数被标记为trending
                const score = (stat.copies * 5) + (stat.shares * 8) + stat.views + 
                             (stat.downloads * 3) + (stat.infos * 2);
                
                return {
                    emoji: emoji,
                    score: score
                };
            })
            .filter(item => item !== null)
            .sort((a, b) => b.score - a.score);
        
        // 获取前15个表情名称（增加数量以确保有足够多的trending表情）
        const trendingNames = scoredEmojis.slice(0, 15).map(item => item.emoji.name);
        
        // 重置所有表情的trending状态
        emojiData.forEach(emoji => {
            // 保持原始trending表情的标记
            if (!trendingNames.includes(emoji.name)) {
                emoji.trending = emoji.originalTrending || false;
        } else {
                emoji.trending = true;
            }
        });
        
        // 确保至少有10个trending表情
        ensureMinimumTrendingEmojis(10);
    }

    // 确保最少有指定数量的trending表情
    function ensureMinimumTrendingEmojis(minCount) {
        // 计算当前trending表情数量
        const currentTrendingCount = emojiData.filter(emoji => emoji.trending).length;
        
        // 如果已经满足最小数量要求，则返回
        if (currentTrendingCount >= minCount) {
            return;
        }
        
        // 添加更多trending表情，优先选择原始数据中标记为trending的表情
        const additionalNeeded = minCount - currentTrendingCount;
        const nonTrendingEmojis = emojiData
            .filter(emoji => !emoji.trending)
            .sort((a, b) => (b.originalTrending ? 1 : 0) - (a.originalTrending ? 1 : 0));
        
        for (let i = 0; i < Math.min(additionalNeeded, nonTrendingEmojis.length); i++) {
            nonTrendingEmojis[i].trending = true;
        }
    }

    // 保存原始trending状态
    function preserveOriginalTrendingStatus() {
        emojiData.forEach(emoji => {
            emoji.originalTrending = emoji.trending;
        });
    }

    // Filter emojis by category and shape
    function filterEmojis() {
        filteredEmojis = emojiData.filter(emoji => {
            // 根据当前选择的类别过滤
            let categoryMatch = false;
            
            if (currentCategory === 'all') {
                categoryMatch = true;
            } else if (currentCategory === 'trending' && emoji.trending) {
                categoryMatch = true;
            } else if (emoji.category === currentCategory) {
                categoryMatch = true;
            } else if (emoji.categories && emoji.categories.includes(currentCategory)) {
                categoryMatch = true;
            }
            
            // 根据当前选择的形状过滤
            const shapeMatch = currentShape === 'all' || emoji.shape === currentShape;
            
            // 根据搜索查询过滤
            const searchMatch = searchQuery === '' || 
            emoji.name.toLowerCase().includes(searchQuery) || 
                              emoji.emoji.includes(searchQuery);
            
            return categoryMatch && shapeMatch && searchMatch;
        });
        
        // 按形状排序: 将特殊形状放在最后
        filteredEmojis.sort((a, b) => {
            const shapeOrder = { 'round': 0, 'square': 1, 'special': 2 };
            return shapeOrder[a.shape] - shapeOrder[b.shape];
        });
        
        updateEmojiCount();
        createEmojiCards(filteredEmojis);
    }

    // 更新分类和形状过滤器显示
    function updateFilterDisplay() {
        // 计算各个分类的表情数量
        const categoryCount = {
            all: emojiData.length,
            trending: emojiData.filter(emoji => emoji.trending).length,
            happy: emojiData.filter(emoji => emoji.category === 'happy' || (emoji.categories && emoji.categories.includes('happy'))).length,
            sad: emojiData.filter(emoji => emoji.category === 'sad' || (emoji.categories && emoji.categories.includes('sad'))).length,
            angry: emojiData.filter(emoji => emoji.category === 'angry' || (emoji.categories && emoji.categories.includes('angry'))).length,
            love: emojiData.filter(emoji => emoji.category === 'love' || (emoji.categories && emoji.categories.includes('love'))).length,
            special: emojiData.filter(emoji => emoji.category === 'special' || (emoji.categories && emoji.categories.includes('special'))).length
        };
        
        // 计算各个形状的表情数量
        const specialCount = emojiData.filter(emoji => emoji.shape === 'special').length;
        const squareCount = emojiData.filter(emoji => emoji.shape === 'square').length;
        const roundCount = emojiData.filter(emoji => emoji.shape === 'round').length;
        
        // 更新分类按钮上的数字
        document.querySelector('.category-btn[data-category="all"]').textContent = `All Categories (${categoryCount.all})`;
        document.querySelector('.category-btn[data-category="trending"]').textContent = `Trending (${categoryCount.trending})`;
        document.querySelector('.category-btn[data-category="happy"]').textContent = `Happy (${categoryCount.happy})`;
        document.querySelector('.category-btn[data-category="sad"]').textContent = `Sad (${categoryCount.sad})`;
        document.querySelector('.category-btn[data-category="angry"]').textContent = `Angry (${categoryCount.angry})`;
        document.querySelector('.category-btn[data-category="love"]').textContent = `Love (${categoryCount.love})`;
        document.querySelector('.category-btn[data-category="special"]').textContent = `Special (${categoryCount.special})`;
        
        // 更新形状按钮上的数字
        document.querySelector('.shape-btn[data-shape="all"]').textContent = `All Shapes (${emojiData.length})`;
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
        // 检查参数类型，允许传递事件或直接传递表情对象
        let emojiObj;
        let name, unicode, description;
        
        if (e.currentTarget) {
            // 通过事件调用
            name = e.currentTarget.getAttribute('data-name');
            unicode = e.currentTarget.getAttribute('data-unicode');
            description = e.currentTarget.getAttribute('data-description');
            
            // 找到对应的emoji对象
            emojiObj = emojiData.find(emoji => emoji.name === name);
        } else {
            // 直接传递了表情对象
            emojiObj = e;
            name = emojiObj.name;
            unicode = emojiObj.unicode;
            description = emojiObj.description || '';
        }
        
        // 创建模态对话框
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        
        // 创建模态内容
        let modalContent = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">${name.replace(/_/g, ' ')}</h3>
                    <button class="text-gray-400 hover:text-white" id="close-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="text-center mb-4">
                    <div class="emoji-display text-5xl mb-3">${emojiObj ? emojiObj.emoji : ''}</div>
                </div>
                <div class="mb-4">
                    <div class="text-sm text-gray-400 mb-1">Unicode:</div>
                    <div class="font-mono bg-gray-700 p-2 rounded">${unicode}</div>
                </div>`;
                
        // 添加描述信息（如果存在）
        if (description) {
            modalContent += `
                <div class="mb-4">
                    <div class="text-sm text-gray-400 mb-1">TikTok 含义:</div>
                    <div class="bg-gray-700 p-2 rounded">${description}</div>
                </div>`;
        } else {
            // 如果没有描述，添加通用描述
            if (name.includes('_')) {
                modalContent += `
                    <div class="mb-4">
                        <div class="text-sm text-gray-400 mb-1">TikTok 含义:</div>
                        <div class="bg-gray-700 p-2 rounded">这是一个TikTok特殊组合表情，在评论和视频中很流行。</div>
                    </div>`;
            } else {
                modalContent += `
                    <div class="mb-4">
                        <div class="text-sm text-gray-400 mb-1">TikTok 含义:</div>
                        <div class="bg-gray-700 p-2 rounded">标准表情，可用于TikTok评论和个人资料。</div>
                    </div>`;
            }
        }
        
        // 添加使用提示
        modalContent += `
                <div class="mb-4">
                    <div class="text-sm text-gray-400 mb-1">使用提示:</div>
                    <div class="bg-gray-700 p-2 rounded">
                        <p>- 点击<i class="fas fa-copy ml-1 mr-1"></i>复制表情</p>
                        <p>- 点击<i class="fas fa-download ml-1 mr-1"></i>下载PNG图片</p>
                    </div>
                </div>
                <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    复制表情
                </button>
            </div>
        `;
        
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);
        
        // 关闭按钮事件
        modal.querySelector('#close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // 点击模态外部区域关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // 复制按钮事件
        modal.querySelector('button.w-full').addEventListener('click', () => {
            if (emojiObj) {
                navigator.clipboard.writeText(emojiObj.emoji)
                    .then(() => {
                        document.body.removeChild(modal);
                        showToast('表情已复制到剪贴板！');
                    })
                    .catch(err => {
                        console.error('复制失败: ', err);
                        showToast('复制表情失败', true);
                    });
            }
        });
        
        // 记录表情互动
        if (emojiObj) {
            recordEmojiInteraction(emojiObj.name, 'views');
        }
    }

    // Show toast notification
    function showToast(message, isError = false, duration = 3000) {
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all duration-300';
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.className = isError 
            ? 'fixed bottom-4 right-4 bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all duration-300 max-w-md'
            : 'fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all duration-300 max-w-md';
        
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-lg transform translate-y-20 opacity-0 transition-all duration-300 max-w-md';
        }, duration);
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

    // 创建动态表情图片
    function createDynamicEmojiImage(emoji) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 128;
        
        // 特殊表情处理
        if (emoji.name.includes('_') || emoji.shape === 'special') {
            // 提取emoji字符，确保正确处理复合表情
            const parts = Array.from(emoji.emoji);
            
            // 先用纯色背景填充画布（半透明黑色背景以确保emoji能够很好地显示）
            ctx.fillStyle = 'rgba(54, 54, 54, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 根据不同的特殊表情设置不同的布局
            switch (emoji.name) {
                case 'fairy_blessing': // ✨🤖✨
                    ctx.font = 'bold 40px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    ctx.fillText(parts[0], 30, 64); // 左侧✨
                    ctx.font = 'bold 70px Arial';
                    ctx.fillText(parts[1], 64, 64); // 中间🤖
                    ctx.font = 'bold 40px Arial';
                    ctx.fillText(parts[2], 98, 64); // 右侧✨
                    break;
                    
                case 'shocked_expression': // 👁️👄👁️
                    ctx.font = 'bold 40px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    ctx.fillText(parts[0], 30, 45); // 左眼
                    ctx.font = 'bold 50px Arial';
                    ctx.fillText(parts[1], 64, 90); // 嘴
                    ctx.font = 'bold 40px Arial';
                    ctx.fillText(parts[2], 98, 45); // 右眼
                    break;
                    
                case 'queen_flick': // 💅👑💅
                    ctx.font = 'bold 35px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    ctx.fillText('💅', 30, 85); // 左手
                    ctx.font = 'bold 60px Arial';
                    ctx.fillText('👑', 64, 45); // 皇冠
                    ctx.font = 'bold 35px Arial';
                    ctx.fillText('💅', 98, 85); // 右手
                    break;
                    
                case 'italian_gesture': // 🤌🤌🤌
                    ctx.font = 'bold 40px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    ctx.fillText('🤌', 32, 64); // 左手
                    ctx.fillText('🤌', 64, 64); // 中间手
                    ctx.fillText('🤌', 96, 64); // 右手
                    break;
                    
                case 'stop_crying': // 😭✋
                    ctx.font = 'bold 50px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    ctx.fillText(parts[0], 45, 64); // 哭脸
                    ctx.font = 'bold 50px Arial'; 
                    ctx.fillText(parts[1], 85, 64); // 手
                    break;
                
                case 'flirty_eyes': // 👁️❤️👁️
                    ctx.font = 'bold 40px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    ctx.fillText(parts[0], 30, 45); // 左眼
                    ctx.font = 'bold 50px Arial';
                    ctx.fillStyle = '#ff5b79';
                    ctx.fillText(parts[1], 64, 80); // 心形
                    ctx.font = 'bold 40px Arial';
                    ctx.fillStyle = 'white';
                    ctx.fillText(parts[2], 98, 45); // 右眼
                    break;
                    
                case 'blushing_face': // 😳❤️❤️
                    ctx.font = 'bold 60px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    ctx.fillText(parts[0], 50, 64); // 脸
                    ctx.font = 'bold 40px Arial';
                    ctx.fillStyle = '#ff5b79';
                    ctx.fillText(parts[1], 90, 50); // 心形1
                    ctx.fillText(parts[2], 110, 75); // 心形2
                    break;
                    
                case 'caught_in_the_act': // 😳📸
                    ctx.font = 'bold 60px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    ctx.fillText(parts[0], 50, 64); // 脸
                    ctx.font = 'bold 50px Arial';
                    ctx.fillStyle = 'white';
                    ctx.fillText(parts[1], 100, 64); // 相机
                    break;
                    
                case 'evil_eye': // 🧿👄🧿
                    ctx.font = 'bold 40px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#42ddff';
                    ctx.fillText(parts[0], 30, 45); // 左护符
                    ctx.font = 'bold 50px Arial';
                    ctx.fillStyle = '#ff5b79';
                    ctx.fillText(parts[1], 64, 90); // 嘴
                    ctx.font = 'bold 40px Arial';
                    ctx.fillStyle = '#42ddff';
                    ctx.fillText(parts[2], 98, 45); // 右护符
                    break;
                    
                case 'love_struck': // 😍💕
                    ctx.font = 'bold 65px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    ctx.fillText(parts[0], 50, 64); // 脸
                    ctx.font = 'bold 50px Arial';
                    ctx.fillStyle = '#ff5b79';
                    ctx.fillText(parts[1], 100, 64); // 心形
                    break;
                    
                case 'deep_thinking': // 🤔💭
                    ctx.font = 'bold 65px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    ctx.fillText(parts[0], 50, 64); // 思考脸
                    ctx.font = 'bold 50px Arial';
                    ctx.fillStyle = 'white';
                    ctx.fillText(parts[1], 100, 50); // 思考泡泡
                    break;
                    
                case 'peaceful_vibe': // 😌✨
                    ctx.font = 'bold 65px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    ctx.fillText(parts[0], 50, 64); // 平静脸
                    ctx.font = 'bold 45px Arial';
                    ctx.fillStyle = '#ffeb3b';
                    ctx.fillText(parts[1], 100, 64); // 星星
                    break;
                    
                case 'shy_bashful': // 🫣👉👈
                    ctx.font = 'bold 50px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    ctx.fillText(parts[0], 64, 45); // 脸
                    ctx.font = 'bold 35px Arial';
                    ctx.fillText(parts[1], 45, 85); // 左手
                    ctx.fillText(parts[2], 85, 85); // 右手
                    break;
                    
                case 'chair': // 🪑
                case 'skull': // 💀
                case 'birthday_cake': // 🎂
                case 'person_standing': // 🧍
                case 'clown_face': // 🤡
                case 'sparkles': // ✨
                    // 单个特殊表情居中放大显示
                    ctx.font = 'bold 90px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    ctx.fillText(emoji.emoji, 64, 64);
                    break;
                    
                default:
                    // 默认布局 - 水平排列
                    const totalWidth = parts.length * 40;
                    const startX = (canvas.width - totalWidth) / 2 + 20;
                    
                    ctx.font = 'bold 40px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    
                    parts.forEach((part, index) => {
                        const x = startX + index * 40;
                        ctx.fillText(part, x, 64);
                    });
                    break;
            }
        } else {
            // 单个表情居中显示
            ctx.font = 'bold 80px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            ctx.fillText(emoji.emoji, 64, 64);
        }
        
        return canvas;
    }

    // 获取特殊表情图片路径 - 修改为优先检查PNG文件
    function getSpecialEmojiImagePath(emoji) {
        // 首先尝试加载PNG图片
        const pngPath = `emoji_png/${emoji.name}.png`;
        
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function() {
                // PNG图片存在，使用它
                resolve(pngPath);
            };
            img.onerror = function() {
                // PNG图片不存在，动态创建
                if (emoji.name.includes('_') || emoji.shape === 'special') {
                    const canvas = createDynamicEmojiImage(emoji);
                    resolve(canvas.toDataURL('image/png'));
                } else {
                    // 默认生成普通表情
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 128;
                    canvas.height = 128;
                    
                    // 添加半透明背景
                    ctx.fillStyle = 'rgba(54, 54, 54, 0.3)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    // 添加表情
                    ctx.font = 'bold 80px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    ctx.fillText(emoji.emoji, 64, 64);
                    
                    resolve(canvas.toDataURL('image/png'));
                }
            };
            img.src = pngPath;
        });
    }

    // 创建和显示表情卡片
    function createAndDisplayEmojiCard(emoji, cardContainerClass, cardClass) {
        const card = document.createElement('div');
        card.className = cardClass || 'emoji-card';
        card.dataset.emoji = emoji.emoji;
        card.dataset.name = emoji.name;
        card.dataset.category = emoji.category;
        card.dataset.unicode = emoji.unicode;

        // 检查是否是URL中指定的表情，如果是则添加高亮类
        if (emoji.name === getUrlParameter('emoji')) {
            card.classList.add('highlight-card');
            // 滚动到此卡片的位置
            setTimeout(() => {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }

        // 表情图片容器
        const imgContainer = document.createElement('div');
        imgContainer.className = 'emoji-img-container';
        
        // 创建图片元素
        const img = document.createElement('img');
        img.className = 'emoji-img lazy';
        img.dataset.src = emoji.image_path || getEmojiImagePath(emoji);
        img.alt = emoji.name;
        
        imgContainer.appendChild(img);
        
        // 表情名称
        const nameElem = document.createElement('div');
        nameElem.className = 'emoji-name';
        nameElem.textContent = emoji.name;
        
        // 操作按钮容器
        const actions = document.createElement('div');
        actions.className = 'emoji-actions';
        
        // 复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'emoji-btn copy-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.title = '复制表情';
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            copyEmoji(emoji);
            recordEmojiInteraction(emoji.name, 'copy');
        });
        
        // 下载按钮
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'emoji-btn download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
        downloadBtn.title = '下载图片';
        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            downloadEmoji(emoji);
            recordEmojiInteraction(emoji.name, 'download');
        });
        
        // 信息按钮
        const infoBtn = document.createElement('button');
        infoBtn.className = 'emoji-btn info-btn';
        infoBtn.innerHTML = '<i class="fas fa-info-circle"></i>';
        infoBtn.title = '表情信息';
        infoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showEmojiInfo(emoji);
            recordEmojiInteraction(emoji.name, 'info');
        });
        
        // 分享按钮
        const shareBtn = document.createElement('button');
        shareBtn.className = 'emoji-btn share-btn';
        shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
        shareBtn.title = '分享表情';
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            shareEmoji(emoji);
            recordEmojiInteraction(emoji.name, 'share');
        });
        
        actions.appendChild(copyBtn);
        actions.appendChild(downloadBtn);
        actions.appendChild(infoBtn);
        actions.appendChild(shareBtn);
        
        card.appendChild(imgContainer);
        card.appendChild(nameElem);
        card.appendChild(actions);
        
        // 点击卡片显示表情信息
        card.addEventListener('click', () => {
            showEmojiInfo(emoji);
            recordEmojiInteraction(emoji.name, 'view');
        });
        
        const container = document.querySelector(cardContainerClass);
        container.appendChild(card);
    }

    // 分享表情
    function shareEmoji(emoji) {
        const shareUrl = `${window.location.origin}${window.location.pathname}?emoji=${encodeURIComponent(emoji.name)}`;
        
        if (navigator.share && navigator.canShare) {
            navigator.share({
                title: `TikTok表情: ${emoji.name}`,
                text: `查看TikTok表情: ${emoji.emoji} ${emoji.name}`,
                url: shareUrl
            }).catch(err => {
                console.error('分享失败:', err);
                // 如果分享API失败，回退到复制链接
                copyToClipboard(shareUrl);
                showToast('链接已复制到剪贴板，可以粘贴分享');
            });
        } else {
            // 浏览器不支持分享API，直接复制链接
            copyToClipboard(shareUrl);
            showToast('链接已复制到剪贴板，可以粘贴分享');
        }
    }

    // 获取URL参数
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // 记录表情使用统计
    function recordEmojiInteraction(emojiName, action) {
        const stats = JSON.parse(localStorage.getItem('emojiStats') || '{}');
        
        if (!stats[emojiName]) {
            stats[emojiName] = {
                views: 0,
                copies: 0,
                downloads: 0,
                shares: 0,
                infos: 0,
                lastUsed: null
            };
        }
        
        // 更新统计数据
        stats[emojiName].lastUsed = new Date().toISOString();
        
        switch (action) {
            case 'view':
                stats[emojiName].views = (stats[emojiName].views || 0) + 1;
                break;
            case 'copy':
                stats[emojiName].copies = (stats[emojiName].copies || 0) + 1;
                break;
            case 'download':
                stats[emojiName].downloads = (stats[emojiName].downloads || 0) + 1;
                break;
            case 'share':
                stats[emojiName].shares = (stats[emojiName].shares || 0) + 1;
                break;
            case 'info':
                stats[emojiName].infos = (stats[emojiName].infos || 0) + 1;
                break;
        }
        
        localStorage.setItem('emojiStats', JSON.stringify(stats));
        
        // 更新热门表情排序
        updateTrendingEmojis();
    }

    // 检查URL参数中是否有指定表情
    function checkUrlForEmojiParam() {
        const emojiName = getUrlParameter('emoji');
        if (emojiName) {
            const emoji = emojiData.find(e => e.name.toLowerCase() === emojiName.toLowerCase());
            if (emoji) {
                // 在下一个渲染周期处理，确保DOM已经完全加载
                setTimeout(() => {
                    showEmojiInfo(emoji);
                }, 1000);
            }
        }
    }

    // 应用初始化
    function initApp() {
        // 加载表情数据
        initializeEmojis(categorizedEmojiData);
        
        // 保存原始trending状态
        preserveOriginalTrendingStatus();
        
        // 从本地存储加载使用统计
        updateTrendingEmojis();
        
        // 检查URL参数
        checkUrlForEmojiParam();
        
        // 处理搜索输入
        searchInput.addEventListener('input', function() {
            searchQuery = this.value.toLowerCase();
            filterEmojis();
        });
        
        // 设置各类别和形状按钮的点击事件
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
                currentCategory = this.getAttribute('data-category');
                document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
                filterEmojis();
            });
        });
        
        shapeButtons.forEach(button => {
            button.addEventListener('click', function() {
                currentShape = this.getAttribute('data-shape');
                document.querySelectorAll('.shape-btn').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                filterEmojis();
        });
    });
        
        // 懒加载图片
        lazyLoadImages();
        
        // 更新表情计数
        updateEmojiCount();
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

    // 新增函数：初始化使用统计
    function initializeUsageStats() {
        // 可以在这里添加代码，显示最常用的表情等统计信息
        const usageData = JSON.parse(localStorage.getItem('emojiUsageData')) || {};
        
        // 仅用于开发调试
        // console.log('表情使用统计:', usageData);
    }
}); 
// Updated script - 2023 