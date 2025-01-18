/**
 * Author: Professor Krasso
 * Date: 10 September 2024
 * File: index.spec.js
 * Description: Test the sales report API, including regions and sales by channel
 */

// Require the necessary modules
const request = require('supertest');  // For making HTTP requests to the API in tests
const app = require('../../../../src/app');  // The application to test
const { mongo } = require('../../../../src/utils/mongo');  // The MongoDB utility for database interaction

// Mocking the MongoDB utility to isolate tests from the actual database
jest.mock('../../../../src/utils/mongo');

// Test suite for Sales Report API - Regions
describe('Apre Sales Report API - Regions', () => {
  beforeEach(() => {
    mongo.mockClear();  // Clear mock data before each test
  });

  // Test case for fetching a list of distinct sales regions
  it('should fetch a list of distinct sales regions', async () => {
    // Mock the MongoDB implementation to return a list of regions
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockResolvedValue(['North', 'South', 'East', 'West'])  // Mocked data for regions
      };
      await callback(db);
    });

    // Make a GET request to the /api/reports/sales/regions endpoint
    const response = await request(app).get('/api/reports/sales/regions');

    // Validate that the response status is 200 and that the correct regions are returned
    expect(response.status).toBe(200);
    expect(response.body).toEqual(['North', 'South', 'East', 'West']);
  });

  // Test case for handling an invalid endpoint (404 error)
  it('should return 404 for an invalid endpoint', async () => {
    // Make a GET request to an invalid endpoint
    const response = await request(app).get('/api/reports/sales/invalid-endpoint');
    // Expect a 404 status code and a "Not Found" message
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Not Found',
      status: 404,
      type: 'error'
    });
  });

  // Test case for handling when no regions are found (empty response)
  it('should return 200 with an empty array if no regions are found', async () => {
    // Mock the MongoDB implementation to return an empty array for regions
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockResolvedValue([])  // No regions found
      };
      await callback(db);
    });

    // Make a GET request to fetch the sales regions
    const response = await request(app).get('/api/reports/sales/regions');

    // Expect the response status to be 200 and an empty array to be returned
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

// Test suite for Sales Report API - Sales by Region
describe('Apre Sales Report API - Sales by Region', () => {
  beforeEach(() => {
    mongo.mockClear();  // Clear mock data before each test
  });

  // Test case for fetching sales data for a specific region, grouped by salesperson
  it('should fetch sales data for a specific region, grouped by salesperson', async () => {
    // Mock the MongoDB implementation to return sales data for a specific region
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            { salesperson: 'John Doe', totalSales: 1000 },
            { salesperson: 'Jane Smith', totalSales: 1500 }
          ])
        })
      };
      await callback(db);
    });

    // Make a GET request to fetch sales data for the "north" region
    const response = await request(app).get('/api/reports/sales/regions/north');

    // Validate that the response contains the correct sales data
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { salesperson: 'John Doe', totalSales: 1000 },
      { salesperson: 'Jane Smith', totalSales: 1500 }
    ]);
  });

  // Test case for handling a region with no sales data (empty response)
  it('should return 200 and an empty array if no sales data is found for the region', async () => {
    // Mock the MongoDB implementation to return an empty array for sales data
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([])  // No sales data found
        })
      };
      await callback(db);
    });

    // Make a GET request to fetch sales data for the "unknown-region"
    const response = await request(app).get('/api/reports/sales/regions/unknown-region');

    // Expect the response to contain an empty array of sales data
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  // Test case for handling an invalid endpoint (404 error)
  it('should return 404 for an invalid endpoint', async () => {
    // Make a GET request to an invalid endpoint
    const response = await request(app).get('/api/reports/sales/invalid-endpoint');

    // Expect a 404 status code and a "Not Found" message
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Not Found',
      status: 404,
      type: 'error'
    });
  });
});

// Test suite for Sales Report API - Sales by Channel (New Tests)
describe('Sales API - Fetch by Channel', () => {
  beforeEach(() => {
    mongo.mockClear();  // Clear mock data before each test
  });

  // Test case for fetching sales data grouped by channel
  it('should fetch sales data grouped by channel', async () => {
    // Mock the MongoDB implementation to return sales data grouped by channel
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            { channel: 'Online', totalSales: 5000 },
            { channel: 'Retail', totalSales: 3000 }
          ])
        })
      };
      await callback(db);
    });

    // Make a GET request to fetch sales data by channel
    const response = await request(app).get('/api/sales/channel');

    // Validate the response contains correct data for channels
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { channel: 'Online', totalSales: 5000 },
      { channel: 'Retail', totalSales: 3000 }
    ]);
  });

  // Test case for when no sales data is found (empty response)
  it('should return an empty array if no sales data is found', async () => {
    // Mock the MongoDB implementation to return an empty array for sales data
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([])  // No sales data found
        })
      };
      await callback(db);
    });

    // Make a GET request to fetch sales data by channel
    const response = await request(app).get('/api/sales/channel');

    // Expect the response to contain an empty array of sales data
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  // Test case for handling a database error (500 status code)
  it('should return 500 if an error occurs', async () => {
    // Mock the MongoDB implementation to throw an error
    mongo.mockImplementation(async () => {
      throw new Error('Database error');  // Simulate a database error
    });

    // Make a GET request to fetch sales data by channel
    const response = await request(app).get('/api/sales/channel');

    // Expect a 500 status code and a detailed error message
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: 'Error fetching sales data by channel',
      error: 'Database error'
    });
  });
});
