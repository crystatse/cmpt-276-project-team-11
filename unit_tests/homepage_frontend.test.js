// Import the necessary libraries
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Read your HTML file into a string
const html = fs.readFileSync(path.resolve(__dirname, '../frontend/public/index.html'), 'utf8');

// Initialize the DOM environment with your HTML
let dom;
let container;

beforeEach(() => {
  // Construct a new JSDOM instance with the HTML
  dom = new JSDOM(html, { runScripts: 'dangerously' });
  // Get the HTML element out of the document
  container = dom.window.document.documentElement;
});

// Write your test inside a test block
test('Renders without crashing', () => {
  // Use expect to make assertions about the HTML elements
  expect(container.querySelector('h1').textContent).toBe('ResearchBuddy');
  expect(container.querySelector('#search').placeholder).toBe('Search for papers...');
  expect(container.querySelector('#home_button a').getAttribute('href')).toBe('index.html');
  expect(container.querySelector('#about_button a').textContent).toBe('About');

  // Additional tests
  expect(container.querySelector('title').textContent).toBe('ResearchBuddy');
  expect(container.querySelector('.header')).toBeTruthy();
  expect(container.querySelector('.search-wrapper')).toBeTruthy();
  expect(container.querySelectorAll('.icons').length).toBe(3);
  expect(container.querySelector('#new')).toBeTruthy();
  expect(container.querySelector('#recent')).toBeTruthy();
  expect(container.querySelectorAll('nav.header div').length).toBe(2);
  expect(container.querySelectorAll('.icons img').length).toBe(3);
  expect(container.querySelector('meta[name="viewport"]').getAttribute('content')).toBe('width=device-width, initial-scale=1.0');
  expect(container.querySelector('link[rel="stylesheet"]').getAttribute('href')).toBe('../css/homepage.css');
  expect(container.querySelector('script').getAttribute('src')).toBe('../js/homepage.js');
});
