let delayTime = 0;

// Quá trình, vui lòng không thay đổi
let fbDtsg = require('DTSGInitialData').token;
let uid = document.cookie.split(';').find(cookie => cookie.includes('c_user')).split('=')[1];

console.log('fb_dtsg:', fbDtsg);
console.log('uid:', uid);

(async () => {
    console.log('Bắt đầu...');
    console.log('Bỏ theo dõi tất cả người không phải là bạn bè của bạn');
    console.log('---------------------------');
    console.log('Chuẩn bị bỏ theo dõi...');

    if (!window.location.href.includes('https://www.facebook.com/me/following')) {
        console.error('Vui lòng điều hướng đến https://www.facebook.com/me/following trước khi chạy đoạn mã này.');
        return;
    }

    try {
        let allFollowing = await getAllFollowing(500);
        let notFriends = allFollowing.filter(user => user.node.__typename === 'User');
        console.log(`${notFriends.length} người dùng sẽ bị bỏ theo dõi...`);
        console.log('---------------------------');
        
        let unfollowCount = 0;
        for (let user of notFriends) {
            await unfollowNotFriend(user.node.id);
            unfollowCount++;
            console.log(`Đã bỏ theo dõi ${unfollowCount}, còn lại... ${notFriends.length - unfollowCount} người dùng.`);
            await new Promise(resolve => setTimeout(resolve, delayTime));
        }
        console.log('HOÀN THÀNH!');
    } catch (error) {
        console.error('Lỗi:', error);
    }
})();

function getAllFollowing(count) {
    return new Promise((resolve, reject) => {
        request('POST', 'https://www.facebook.com/api/graphql/', {
            fb_dtsg: fbDtsg,
            fb_api_caller_class: 'RelayModern',
            fb_api_req_friendly_name: 'ProfileCometTopAppSectionQuery',
            variables: { count, scale: 1, userID: uid },
            doc_id: 'bf03dcd6ed9ef'
        }).then(response => {
            try {
                let data = JSON.parse(response);
                let pageItems = data.data.viewer.rootView.timeline_nav_app_sections.payloads[0].style_renderer.edges[0].node.collection.pageItems;
                let allItems = pageItems.edges;
                let hasNextPage = pageItems.page_info.has_next_page;
                let endCursor = pageItems.page_info.end_cursor;

                async function fetchAll(cursor) {
                    if (hasNextPage) {
                        let nextPageItems = await getNextListFollowing(cursor, count);
                        allItems = allItems.concat(nextPageItems.edges);
                        hasNextPage = nextPageItems.page_info.has_next_page;
                        endCursor = nextPageItems.page_info.end_cursor;
                        return fetchAll(endCursor);
                    } else {
                        return allItems;
                    }
                }

                fetchAll(endCursor).then(resolve).catch(reject);
            } catch (error) {
                reject(error);
            }
        }).catch(reject);
    });
}

function getNextListFollowing(cursor, count) {
    return new Promise((resolve, reject) => {
        request('POST', 'https://www.facebook.com/api/graphql/', {
            fb_dtsg: fbDtsg,
            fb_api_caller_class: 'RelayModern',
            fb_api_req_friendly_name: 'ProfileCometAppCollectionListRendererPaginationQuery',
            variables: { count, cursor, scale: 1, search: null, id: uid },
            doc_id: 'abdd4b9c393ee'
        }).then(response => {
            try {
                let data = JSON.parse(response);
                resolve(data.data.node.pageItems);
            } catch (error) {
                reject(error);
            }
        }).catch(reject);
    });
}

function unfollowNotFriend(userId) {
    return new Promise((resolve, reject) => {
        request('POST', 'https://www.facebook.com/api/graphql/', {
            fb_dtsg: fbDtsg,
            fb_api_caller_class: 'RelayModern',
            fb_api_req_friendly_name: 'CometUserUnfollowMutation',
            variables: {
                action_render_location: 'PROFILE',
                input: { subscribe_location: 'WWW_COMET_PROFILE', unsubscribee_id: userId, actor_id: uid, client_mutation_id: '7' },
                scale: 1
            },
            doc_id: 'd1a57d1fa7da0'
        }).then(resolve).catch(reject);
    });
}

function request(method, url, params) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'text';
        xhr.open(method, url);

        if (method === 'POST') {
            let formData = new FormData();
            for (let key in params) {
                formData.append(key, typeof params[key] === 'string' ? params[key] : JSON.stringify(params[key]));
            }
            xhr.send(formData);
        } else if (method === 'GET') {
            url += '?' + new URLSearchParams(params).toString();
            xhr.send();
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    reject('Lỗi: ' + xhr.status);
                } else {
                    resolve(xhr.responseText);
                }
            }
        };
    });
}