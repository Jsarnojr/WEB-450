/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre sales report API for the sales reports
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');

const router = express.Router();

/**
 * @description
 *
 * GET /regions
 *
 * Fetches a list of distinct sales regions.
 * This endpoint retrieves all unique sales regions from the "sales" collection.
 *
 * Example:
 * fetch('/regions')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/regions', (req, res, next) => {
  try {
    // Fetch distinct regions from the sales collection in the database
    mongo(async (db) => {
      const regions = await db.collection('sales').distinct('region');
      res.send(regions);  // Send the list of regions as the response
    }, next);
  } catch (err) {
    console.error('Error getting regions: ', err);
    next(err);  // Handle any errors and pass them to the next middleware
  }
});

/**
 * @description
 *
 * GET /regions/:region
 *
 * Fetches sales data for a specific region, grouped by salesperson.
 * This endpoint retrieves sales data for a given region, aggregated by salesperson.
 *
 * Example:
 * fetch('/regions/north')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/regions/:region', (req, res, next) => {
  try {
    // Fetch sales data for a specific region, grouped by salesperson
    mongo(async (db) => {
      const salesReportByRegion = await db.collection('sales').aggregate([
        { $match: { region: req.params.region } },  // Match the region from the request
        {
          $group: {
            _id: '$salesperson',  // Group by salesperson
            totalSales: { $sum: '$amount' }  // Sum up the total sales for each salesperson
          }
        },
        {
          $project: {
            _id: 0,  // Remove the _id field from the output
            salesperson: '$_id',  // Include salesperson as the result
            totalSales: 1  // Include totalSales in the result
          }
        },
        {
          $sort: { salesperson: 1 }  // Sort the results by salesperson name in ascending order
        }
      ]).toArray();
      res.send(salesReportByRegion);  // Send the grouped sales data as the response
    }, next);
  } catch (err) {
    console.error('Error getting sales data for region: ', err);
    next(err);  // Handle any errors and pass them to the next middleware
  }
});

/**
 * @description
 *
 * GET /api/sales/channel
 *
 * Fetches sales data grouped by channel.
 * This endpoint retrieves total sales data aggregated by the sales channel.
 * Channels can include online, retail, etc.
 *
 * Example:
 * fetch('/api/sales/channel')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/api/sales/channel', async (req, res) => {
  try {
    // Fetch sales data grouped by channel
    await mongo(async (db) => {
      const salesData = await db.collection('sales').aggregate([
        { $group: { _id: '$channel', totalSales: { $sum: '$amount' } } },  // Group by channel and calculate total sales for each channel
        { $project: { channel: '$_id', totalSales: 1, _id: 0 } }  // Return channel name and total sales, omit _id field
      ]).toArray();

      res.status(200).json(salesData);  // Send the sales data as the response
    });
  } catch (error) {
    console.error('Error fetching sales data by channel: ', error);
    res.status(500).json({
      message: 'Error fetching sales data by channel',
      error: error.message  // Provide an error message if something goes wrong
    });
  }
});

module.exports = router;
