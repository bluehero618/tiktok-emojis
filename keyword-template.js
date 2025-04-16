// keyword-template.js - 连接主要的关键词脚本文件

document.addEventListener('DOMContentLoaded', function() {
    // 确保主脚本文件已加载
    if (typeof initKeywordPage === 'undefined') {
        console.warn('关键词页面主脚本尚未加载，正在尝试加载...');
        
        // 创建脚本标签并加载主脚本
        const script = document.createElement('script');
        script.src = 'keyword-script.js';
        script.onload = function() {
            console.log('关键词页面主脚本加载成功！');
            
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
            }
        };
        script.onerror = function() {
            console.error('加载关键词页面主脚本失败！');
            document.getElementById('emojiCount').textContent = '加载失败，请刷新页面重试。';
        };
        
        document.head.appendChild(script);
    }
    
    // 确保表情数据已加载
    if (typeof emojiData === 'undefined') {
        console.warn('表情数据尚未加载，正在尝试加载主脚本...');
        
        // 创建脚本标签并加载主脚本
        const script = document.createElement('script');
        script.src = 'script.js';
        script.onload = function() {
            console.log('主脚本加载成功！');
        };
        script.onerror = function() {
            console.error('加载主脚本失败！');
        };
        
        document.head.appendChild(script);
    }
}); 