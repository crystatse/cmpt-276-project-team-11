global.TextEncoder = require('text-encoding').TextEncoder;
global.TextDecoder = require('text-encoding').TextDecoder;

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, '../frontend/public/searchresults.html'), 'utf8');

let dom;
let container;

beforeEach(() => {
  dom = new JSDOM(html, { runScripts: 'dangerously' });
  container = dom.window.document.documentElement;
});

test('Renders without crashing', () => {

  // header testing
  expect(container.querySelector('#home_button a').getAttribute('href')).toBe('index.html');
  expect(container.querySelector('#home_button a img').getAttribute('src')).toBe('../images/home-icon-purple.png');
  expect(container.querySelector('#header_search input').placeholder).toBe('Search for papers...');
  expect(container.querySelector('#about_button a').textContent).toBe('About');
  expect(container.querySelector('#about_button a').getAttribute('href')).toBe('about.html');

  expect(container.querySelector('#title').textContent).toBe('Search Results for: ');
  expect(container.querySelector('#search-results-for').textContent).toBe('Search Results for: ');
  expect(container.querySelector('#article-container')).toBeTruthy();
  expect(container.querySelector('#article-button-container')).toBeTruthy();
  expect(container.querySelector('#search-results-container')).toBeTruthy();

  expect(container.querySelector('meta[name="viewport"]').getAttribute('content')).toBe('width=device-width, initial-scale=1.0');
  expect(container.querySelector('link[rel="stylesheet"]').getAttribute('href')).toBe('../css/searchresults.css');
  expect(container.querySelector('script').getAttribute('src')).toBe('../js/searchresults.js');
});
