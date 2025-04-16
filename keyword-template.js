// keyword-template.js - 连接主要的关键词脚本文件

document.addEventListener('DOMContentLoaded', function() {
    // 确保主脚本文件已加载
    if (typeof emojiData === 'undefined') {
        console.warn('表情数据尚未加载，正在尝试加载主脚本...');
        
        // 创建脚本标签并加载主脚本
        const mainScript = document.createElement('script');
        mainScript.src = 'script.js';
        mainScript.onload = function() {
            console.log('主脚本加载成功！');
            
            // 加载关键词脚本
            loadKeywordScript();
        };
        mainScript.onerror = function() {
            console.error('加载主脚本失败！');
            document.getElementById('emojiCount').textContent = '加载失败，请刷新页面重试。';
        };
        
        document.head.appendChild(mainScript);
    } else {
        // 主脚本已加载，检查关键词脚本
        if (typeof initKeywordPage === 'undefined') {
            loadKeywordScript();
        } else {
            // 两个脚本都已加载，初始化页面
            initKeywordPage();
        }
    }
    
    // 加载关键词脚本
    function loadKeywordScript() {
        console.log('正在加载关键词页面脚本...');
        
        // 创建脚本标签并加载关键词脚本
        const keywordScript = document.createElement('script');
        keywordScript.src = 'keyword-script.js';
        keywordScript.onload = function() {
            console.log('关键词页面脚本加载成功！');
            
            // 获取URL中的关键词参数
            const urlParams = new URLSearchParams(window.location.search);
            const keyword = urlParams.get('q') || '热门表情';
            
            // 初始化页面
            if (typeof initKeywordPage === 'function') {
                initKeywordPage(keyword);
                
                // 添加事件监听器
                if (typeof setupEventListeners === 'function') {
                    setupEventListeners();
                }
            } else {
                console.error('无法找到initKeywordPage函数！');
                document.getElementById('emojiCount').textContent = '加载失败，请刷新页面重试。';
            }
        };
        keywordScript.onerror = function() {
            console.error('加载关键词页面脚本失败！');
            document.getElementById('emojiCount').textContent = '加载失败，请刷新页面重试。';
        };
        
        document.head.appendChild(keywordScript);
    }
    
    // 添加错误处理
    window.addEventListener('error', function(e) {
        console.error('页面加载错误:', e.message);
        if (document.getElementById('emojiCount')) {
            document.getElementById('emojiCount').textContent = '加载出错，请刷新页面重试。';
        }
    });
}); 