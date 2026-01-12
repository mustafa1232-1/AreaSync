/**
 * app.js
 * ------
 * تعريف Express App
 * هنا نضيف routes لاحقاً
 */

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

module.exports = app;
