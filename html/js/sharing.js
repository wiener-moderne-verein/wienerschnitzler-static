document.addEventListener('DOMContentLoaded', function() {
    const resultDiv = document.getElementById('result');
    const shareBlueskyLink = document.getElementById('shareBluesky');

    if (resultDiv && shareBlueskyLink) {
        const resultContent = encodeURIComponent(resultDiv.innerText || resultDiv.textContent);
        const blueskyUrl = `https://bsky.app/intent/compose?text=${resultContent}`;
        shareBlueskyLink.href = blueskyUrl;
    }
});