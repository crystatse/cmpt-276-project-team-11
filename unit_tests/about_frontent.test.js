const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, '../frontend/public/about.html'), 'utf8');

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

    expect(container.querySelector('#title').textContent).toBe('ResearchBuddy');
    expect(container.querySelector('h1').textContent).toBe('About');
    // needs some more tests for html elements

    // testing for chatbot.css and chatbot.js is linked
    expect(container.querySelector('meta[name="viewport"]').getAttribute('content')).toBe('width=device-width, initial-scale=1.0');
    expect(container.querySelector('link[rel="stylesheet"]').getAttribute('href')).toBe('../css/about.css');
    expect(container.querySelector('script').getAttribute('src')).toBe('../js/about.js');
});
