// @ts-check
import { test, expect } from '@playwright/test';
import { envConfig } from './config/env.config.js';

test.describe('Cars API POST /api/cars', () => {
  /** @type {import('@playwright/test').APIRequestContext} */
  let api;
  /** @type {number | undefined} */
  let createdCarId;

  test.beforeAll(async ({ playwright }) => {
    api = await playwright.request.newContext({
      baseURL: envConfig.baseURL,
      httpCredentials: envConfig.httpCredentials,
    });

    const signinResponse = await api.post('/api/auth/signin', {
      data: {
        email: envConfig.user.email,
        password: envConfig.user.password,
        remember: false,
      },
    });
    expect(signinResponse.status()).toBe(200);
  });

  test.afterAll(async () => {
    if (createdCarId) {
      await api.delete(`/api/cars/${createdCarId}`);
    }
    await api.dispose();
  });

  test('Positive: creates a car with valid brand, model and mileage', async () => {
    const payload = {
      carBrandId: 1,
      carModelId: 1,
      mileage: 150,
    };

    const response = await api.post('/api/cars', { data: payload });
    const body = await response.json();

    expect(response.status()).toBe(201);
    expect(body.status).toBe('ok');
    expect(body.data).toMatchObject({
      carBrandId: payload.carBrandId,
      carModelId: payload.carModelId,
      mileage: payload.mileage,
      brand: 'Audi',
      model: 'TT',
    });
    expect(body.data.id).toBeTruthy();

    createdCarId = body.data.id;
  });

  test('Negative: returns 400 when required carModelId is missing', async () => {
    const response = await api.post('/api/cars', {
      data: {
        carBrandId: 1,
        mileage: 100,
      },
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.status).toBe('error');
    expect(body.message).toBe('Car model id is required');
  });

  test('Negative: returns 400 when mileage is out of allowed range', async () => {
    const response = await api.post('/api/cars', {
      data: {
        carBrandId: 1,
        carModelId: 1,
        mileage: -1,
      },
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.status).toBe('error');
    expect(body.message).toBe('Mileage has to be from 0 to 999999');
  });
});
