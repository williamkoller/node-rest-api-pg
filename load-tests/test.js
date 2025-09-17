import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export let options = {
  stages: [
    { duration: '10s', target: 20 }, // aumentar usuários
    { duration: '30s', target: 20 },
    { duration: '10s', target: 0 },
  ],
};

const BASE_URL = 'http://nestjs_app:8000'; // nginx está redirecionando para os containers nestjs

export default function () {
  const userId = randomIntBetween(1, 100); // id aleatório para testes
  const age = randomIntBetween(18, 70);
  const payload = JSON.stringify({
    name: `User${userId}`,
    email: `user${userId}@example.com`,
    age,
  });

  const headers = { 'Content-Type': 'application/json' };

  // Executar requisições em sequência ou aleatoriamente
  const randomEndpoint = Math.floor(Math.random() * 5);

  let res;

  switch (randomEndpoint) {
    case 0:
      res = http.get(`${BASE_URL}/users`);
      check(res, {
        'GET /users: status is 200': (r) => r.status === 200,
      });
      break;

    case 1:
      res = http.post(`${BASE_URL}/users`, payload, { headers });
      check(res, {
        'POST /users: status is 201': (r) => r.status === 201,
      });
      break;

    case 2:
      res = http.put(`${BASE_URL}/users/${userId}`, payload, { headers });
      check(res, {
        'PUT /users/:id: status is 200 or 404': (r) =>
          r.status === 200 || r.status === 404,
      });
      break;

    case 3:
      res = http.get(`${BASE_URL}/users/${userId}`);
      check(res, {
        'GET /users/:id: status is 200 or 404': (r) =>
          r.status === 200 || r.status === 404,
      });
      break;

    case 4:
      res = http.del(`${BASE_URL}/users/${userId}`);
      check(res, {
        'DELETE /users/:id: status is 200 or 404': (r) =>
          r.status === 200 || r.status === 404,
      });
      break;
  }

  sleep(1); // aguarda 1 segundo por usuário virtual
}
