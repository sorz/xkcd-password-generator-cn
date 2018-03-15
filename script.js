"use strict";
const $ = selector => document.querySelector(selector);
const NUM_PHRASE = 4;
let dict = null;

async function loadDict(url) {
  const resp = await fetch(url);
  const text = await resp.text();
  return text.split('\n')
    .filter(s => s.includes('\t'))
    .map(s => s.split('\t'))
    .map(([hans, pinyin]) => ({
      hans: hans.trim(),
      pinyin: pinyin.trim(),
    }));
}

(async function () {
  try {
    dict = await loadDict("dict.txt");
  } catch (e) {
    alert("Fail to load dict: " + e);
    return;
  }
  console.log(`${dict.length} phrases loaded`);
  document.querySelectorAll('.num-phrases')
    .forEach(elm => elm.textContent = `${dict.length}`);
  generatePassphrase();
  $('#generator').classList.remove('loading');
  $('#generate').disabled = false;
})();

function generatePassphrase() {
  const list = $('#phrases');
  list.innerHTML = '';
  let randoms = new Uint16Array(NUM_PHRASE);
  window.crypto.getRandomValues(randoms);
  Array.from(randoms)
    .map(n => dict[n % dict.length])
    .map(phraseToHTML)
    .forEach(html => list.appendChild(html));
}

function phraseToHTML(phrase) {
  const template = $('#phrase');
  const content = document.importNode(template, true).content;
  const li = content.querySelector('li');
  li.textContent = phrase.pinyin;
  li.dataset.hans = phrase.hans;
  return content;
}

$('#generator').addEventListener("submit", ev => {
  ev.preventDefault();
  generatePassphrase();
});
