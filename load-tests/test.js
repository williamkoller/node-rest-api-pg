import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export let options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '20s', target: 200 },
    { duration: '30s', target: 500 },
    { duration: '10s', target: 0 }, // ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.1'], // tolera no máximo 10% de falha
    http_req_duration: ['p(95)<500'], // 95% das requisições abaixo de 500ms
  },
};

const BASE_URL = 'http://nestjs_app:8000';

export default function () {
  const userId = randomIntBetween(1, 50000);
  const age = randomIntBetween(18, 70);

  const payload = JSON.stringify({
    name: `User${userId}`,
    email: `user${userId}@example.com`,
    age,
  });

  const headers = { 'Content-Type': 'application/json' };

  const endpoints = [
    () => http.get(`${BASE_URL}/users`),
    () => http.post(`${BASE_URL}/users`, payload, { headers }),
    () => http.put(`${BASE_URL}/users/${userId}`, payload, { headers }),
    () => http.get(`${BASE_URL}/users/${userId}`),
    () => http.del(`${BASE_URL}/users/${userId}`),
  ];

  const index = Math.floor(Math.random() * endpoints.length);
  const res = endpoints[index]();

  check(res, {
    'status is OK or expected': (r) => [200, 201, 204, 404].includes(r.status),
  });

  sleep(0.2); // menos descanso => mais agressivo
}
