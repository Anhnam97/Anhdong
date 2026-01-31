const url = $request.url;
let body = $response.body;

if (body && typeof body === 'string') {
    try {
        // Nén JSON để xử lý nhanh hơn
        const compressed = body.replace(/\s+/g, '');
        
        // Kiểm tra nhanh
        if (compressed.includes('"is_sponsored":true') || 
            compressed.includes('"label":"Sponsored"')) {
            
            const obj = JSON.parse(body);
            
            // Hàm xóa ads đệ quy
            function clean(obj) {
                if (Array.isArray(obj)) {
                    return obj.filter(item => {
                        if (!item) return false;
                        return !(item.ad_id || item.is_sponsored || item.label === "Sponsored");
                    }).map(clean);
                }
                
                if (obj && typeof obj === 'object') {
                    const newObj = {};
                    for (const key in obj) {
                        if (!key.includes('ad') && !key.includes('sponsor')) {
                            newObj[key] = clean(obj[key]);
                        }
                    }
                    return newObj;
                }
                
                return obj;
            }
            
            body = JSON.stringify(clean(obj));
        }
    } catch (e) {
        // Bỏ qua lỗi
    }
}

$done({ body });
