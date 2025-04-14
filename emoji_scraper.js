// Emoji Scraper for TikTok Emojis
// This script helps extract emoji data from Emojipedia
// Usage: Run in browser console on https://emojipedia.org/tiktok

/**
 * This script is intended to be run in the browser console on the Emojipedia TikTok page
 * It will extract emoji information and generate JSON data for use in the website
 */

function scrapeTikTokEmojis() {
    const emojiElements = document.querySelectorAll('.emoji-list li');
    const emojiData = [];
    
    console.log(`Found ${emojiElements.length} emojis to process...`);
    
    emojiElements.forEach(element => {
        try {
            // Extract emoji symbol
            const emojiSymbol = element.querySelector('.emoji').textContent.trim();
            
            // Extract name
            const emojiName = element.querySelector('a').getAttribute('title').trim();
            
            // Calculate filename (lowercase with underscores)
            const filename = emojiName.toLowerCase().replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');
            
            // Default category mapping (this would need to be refined with actual data)
            let category = 'symbols';
            if (emojiName.includes('Face') || emojiName.includes('Smiling') || emojiName.includes('Crying')) {
                category = 'smileys';
            } else if (emojiName.includes('Person') || emojiName.includes('Hand') || emojiName.includes('Body')) {
                category = 'people';
            } else if (emojiName.includes('Animal') || emojiName.includes('Plant')) {
                category = 'animals';
            } else if (emojiName.includes('Food') || emojiName.includes('Drink')) {
                category = 'food';
            } else if (emojiName.includes('Place') || emojiName.includes('Travel')) {
                category = 'travel';
            } else if (emojiName.includes('Activity') || emojiName.includes('Sport')) {
                category = 'activities';
            } else if (emojiName.includes('Object') || emojiName.includes('Tool')) {
                category = 'objects';
            } else if (emojiName.includes('Flag')) {
                category = 'flags';
            }
            
            // Is it trending? (This is placeholder logic - actual trending data would come from analytics)
            // For now, popular emojis are marked as trending
            const popularEmojis = ['😂', '❤️', '🔥', '👍', '😍', '🥰', '✨', '😊', '🙏', '🤣', '😭', '🥺', '⭐', '💯', '🫶', '💕', '👏'];
            const isTrending = popularEmojis.includes(emojiSymbol);
            
            // Push emoji data to array
            emojiData.push({
                emoji: emojiSymbol,
                name: emojiName,
                // Unicode code point not directly accessible, would need additional work
                // This is a placeholder approach
                unicode: Array.from(emojiSymbol).map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase()).join(' '),
                category: category,
                trending: isTrending,
                image: `emoji_png/${filename}.png`
            });
        } catch (error) {
            console.error(`Error processing emoji: ${error.message}`);
        }
    });

    console.log(`Successfully processed ${emojiData.length} emojis.`);
    
    // Output formatted JSON
    console.log(JSON.stringify(emojiData, null, 2));
    
    // Create downloadable JSON file
    downloadJson(emojiData, 'tiktok_emojis.json');
    
    return emojiData;
}

function downloadJson(data, filename) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Instructions for using this script
console.log(`
=== TikTok Emoji Scraper ===
This script will extract emoji data from the Emojipedia TikTok page.
Steps to use:
1. Make sure you're on https://emojipedia.org/tiktok
2. Run the 'scrapeTikTokEmojis()' function
3. A JSON file will be downloaded with the emoji data
4. The emoji data will also be logged to the console

Usage example: scrapeTikTokEmojis()
`);

// To use this script, call:
// scrapeTikTokEmojis(); 