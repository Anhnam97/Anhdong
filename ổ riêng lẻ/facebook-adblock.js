// Facebook Ad Blocker - Safe Version
// Chỉ xử lý request chứa quảng cáo, không làm hỏng API quan trọng

const url = $request?.url || '';
let body = $response.body;

// 1. KIỂM TRA URL - chỉ xử lý request chứa quảng cáo
const isAdRequest = url.includes('ads') || 
                    url.includes('sponsored') || 
                    url.includes('commercial') ||
                    url.includes('promoted');

// 2. Nếu KHÔNG phải request quảng cáo → bỏ qua
if (!isAdRequest) {
    // Đặc biệt cho phép các API quan trọng
    const importantAPIs = [
        '/graphql',
        '/api/graphql',
        '/home.php',
        '/feed',
        '/friends',
        '/messages',
        '/notifications',
        '/photos',
        '/videos',
        '/groups',
        '/events',
        '/marketplace'
    ];
    
    const isImportantAPI = importantAPIs.some(api => url.includes(api));
    
    if (isImportantAPI) {
        console.log(`Facebook Ad Blocker: Allowing important API: ${url.substring(0, 50)}...`);
        $done({body: body});
        return;
    }
}

// 3. CHỈ xử lý nếu là request quảng cáo HOẶC có dấu hiệu quảng cáo trong body
if (body && typeof body === 'string' && body.length < 500000) { // Giới hạn kích thước
    try {
        // Kiểm tra nhanh trước khi parse
        const adIndicators = [
            '"is_sponsored":true',
            '"label":"Sponsored"',
            '"label":"Quảng cáo"',
            '"sponsored_data"',
            '"ad_id"',
            '"commercial"',
            '"promoted"'
        ];
        
        const hasAds = adIndicators.some(indicator => body.includes(indicator));
        
        if (!hasAds) {
            console.log('Facebook Ad Blocker: No ad indicators found');
            $done({body: body});
            return;
        }
        
        const obj = JSON.parse(body);
        let modified = false;
        
        // Hàm xóa ads CHÍNH XÁC
        function removeAds(obj, depth = 0) {
            if (depth > 10) return obj; // Giới hạn độ sâu
            if (!obj || typeof obj !== 'object') return obj;
            
            // Xử lý mảng
            if (Array.isArray(obj)) {
                const result = [];
                for (const item of obj) {
                    // Kiểm tra xem item có phải quảng cáo không
                    const isAd = item && (
                        item.ad_id ||
                        item.is_sponsored === true ||
                        item.sponsored === true ||
                        item.promoted === true ||
                        (item.label && (
                            item.label === "Sponsored" ||
                            item.label === "Quảng cáo" ||
                            item.label.includes("Sponsored") ||
                            item.label.includes("Quảng cáo")
                        )) ||
                        (item.__typename && item.__typename.includes('Ad'))
                    );
                    
                    if (!isAd) {
                        // Tiếp tục làm sạch các phần tử con
                        result.push(removeAds(item, depth + 1));
                    } else {
                        modified = true;
                        console.log('Facebook Ad Blocker: Removed ad item');
                    }
                }
                return result;
            }
            
            // Xử lý object
            const result = {};
            for (const key in obj) {
                // CHỈ xóa các key QUẢNG CÁO RÕ RÀNG
                const isAdKey = (
                    key === 'ads' ||
                    key === 'sponsored_posts' ||
                    key === 'promoted_posts' ||
                    key === 'commercial_posts' ||
                    key === 'ad_campaigns' ||
                    key.startsWith('ad_') ||
                    key.endsWith('_ads')
                );
                
                if (!isAdKey) {
                    result[key] = removeAds(obj[key], depth + 1);
                } else {
                    modified = true;
                    console.log(`Facebook Ad Blocker: Removed ad key: ${key}`);
                }
            }
            return result;
        }
        
        // Thực hiện xóa ads
        const cleaned = removeAds(obj);
        
        if (modified) {
            body = JSON.stringify(cleaned);
            console.log('Facebook Ad Blocker: Successfully removed ads');
        } else {
            console.log('Facebook Ad Blocker: No ads to remove');
        }
        
    } catch (error) {
        console.error('Facebook Ad Blocker: JSON error:', error.message);
        // GIỮ NGUYÊN body nếu có lỗi
    }
}

// 4. Luôn trả về body (đã xử lý hoặc gốc)
$done({body: body});
