// Script chặn quảng cáo FB & Reels 2025
let body = $response.body;
if (body) {
    try {
        let obj = JSON.parse(body);
        // Xử lý loại bỏ bài quảng cáo trong Reels & Video
        if (obj.data && Array.isArray(obj.data)) {
            obj.data = obj.data.filter(item => {
                const isSponsor = item.is_sponsored || item.sponsored_data || item.ad_id;
                return !isSponsor;
            });
        }
        // Xử lý News Feed
        if (obj.feed_stories) {
            obj.feed_stories.nodes = obj.feed_stories.nodes.filter(n => !n.is_sponsored);
        }
        body = JSON.stringify(obj);
    } catch (e) {
        // Nếu lỗi JSON (như lỗi "hello" trong ảnh), trả về body gốc để không bị treo app
    }
}
$done({ body });