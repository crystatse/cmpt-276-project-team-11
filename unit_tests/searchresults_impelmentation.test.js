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

  // Reset container content
  container.innerHTML = '';
});

// Import the Jest test cases
const { searchArXiv, displayResults } = require('../frontend/js/searchresults.js'); // Uncomment this line

// Mocking the fetch function for testing purposes
global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('<xml>Mocked XML data</xml>'),
  })
);

// Mocking localStorage
global.localStorage = {
  getItem: jest.fn().mockReturnValue(null),
  removeItem: jest.fn(),
  setItem: jest.fn(),
};

// Mocking DOMParser
global.DOMParser = function () {
  return {
    parseFromString: jest.fn().mockReturnValue({
      querySelectorAll: jest.fn(() => []),
    }),
  };
};

describe('searchArXiv', () => {
  test('searchArXiv should fetch data from ArXiv API and parse XML', async () => {
    await searchArXiv('test', 5);

    // Check if the fetch function was called
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('https://export.arxiv.org/api/query'));

    // Check if the DOMParser was called
    expect(global.DOMParser().parseFromString).toHaveBeenCalledWith('<xml>Mocked XML data</xml>', 'text/xml');
  });
});

describe('displayResults', () => {
  test('displayResults should render results correctly on the HTML page', () => {
    // Mocking the HTML elements using the container
    container.innerHTML = `
      <div id="search-results-container"></div>
      <div id="article-button-container"></div>
    `;

    const results = [
      { title: 'Test Title 1', summary: 'Summary 1', authors: 'Author 1', link: 'http://example.com/1' },
      { title: 'Test Title 2', summary: 'Summary 2', authors: 'Author 2', link: 'http://example.com/2' },
    ];

    displayResults(results);

    // Check if the results are rendered correctly using the container instead of document
    expect(container.querySelectorAll('.results-div')).toHaveLength(results.length);
    expect(container.querySelectorAll('.hyperlink-style')).toHaveLength(results.length);
    expect(container.querySelectorAll('.article-icons')).toHaveLength(results.length);
  });
});
