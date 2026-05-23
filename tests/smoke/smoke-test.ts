import http from 'k6/http';
import { check, sleep } from 'k6';
import type { Options } from 'k6/options';
import { ENV } from '../../config/environments.ts';
import { ENDPOINTS } from '../../config/endpoints.ts';
import { login } from '../../helpers/auth.ts';
import { jsonHeaders } from '../../helpers/utils.ts';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export const options: Options = {
    vus:1 ,
    duration: '30s',
    thresholds: {
        http_req_duration: ['p(95)<800'],
        http_req_failed: ['rate<0.01'],
        checks: ['rate>0.99'],
    },
};

export default function (): void {

    const token = login();
    check(token, {
        'login return token': (t) => t !== null && t.length > 0, 
    });

    if (!token) {
        sleep(1);
        return
    }

    sleep(1);

    // 2 blog publico
    const postsRes = http.get(`${ENV.BASE_URL}${ENDPOINTS.BLOG.PUBLIC_POSTS}?per_page=50`, { headers : jsonHeaders});
    check(postsRes, {
        'post status 200': (r) => r.status === 200,
        'posts response time < 800 ms': (r) => r.timings.duration < 800,
    })
    sleep(1);

}