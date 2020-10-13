class TalkRound extends HTMLElement {
  #MAX_LENGTH = 69;
  #TAP = '\u00A0\u00A0\u00A0\u00A0';
  #PLACE_HOLDER = '딜러님 딜이 좀 모자라서 전멸기를 봤는데 어떻게 생각하시는지 여쭤봐도 괜찮을까요?';
  #TEMPLATE = [
    [ 0,  0,  0, 67, 66, 65, 64, 63, 62, 61,  0,  0,  0],
    [ 0,  0, 68,  0,  0,  0,  0,  0,  0,  0, 60,  0,  0],
    [ 0, 69,  0,  0, 33, 32, 31, 30, 29,  0,  0, 59,  0],
    [70,  0,  0, 34,  0,  0,  0,  0,  0, 28,  0,  0, 58],
    [ 0,  0, 35,  0,  0, 11, 10,  9,  0,  0, 27,  0, 57],
    [ 0, 36,  0,  0, 12,  0,  0,  0,  8,  0, 26,  0, 56],
    [37,  0,  0, 13,  0,  0,  1,  0,  7,  0, 25,  0, 55],
    [38,  0, 14,  0,  0,  2,  0,  0,  6,  0, 24,  0, 54],
    [39,  0, 15,  0,  0,  3,  4,  5,  0,  0, 23,  0, 53],
    [40,  0,  0, 16,  0,  0,  0,  0,  0, 22,  0,  0, 52],
    [ 0, 41,  0,  0, 17, 18, 19, 20, 21,  0,  0, 51,  0],
    [ 0,  0, 42,  0,  0,  0,  0,  0,  0,  0, 50,  0,  0],
    [ 0,  0,  0, 43, 44, 45, 46, 47, 48, 49,  0,  0,  0],
  ];

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  connectedCallback() {
    this.#init();
  }

  #init() {
    const shadow = this.attachShadow({ mode: 'open' });

    const textareaNode = document.createElement('textarea', {
      rows: '1',
      cols: '50',
    });

    const textareaSheet = new CSSStyleSheet();
    textareaSheet.replaceSync(`
      textarea {
        color: red;
        resize: none;
        width: 100%;
        max-width: 480px;
      }
    `);

    const resultNode = document.createElement('div');
    resultNode.setAttribute('class', 'result');

    textareaNode.addEventListener('input', this.onChange);
    const textNode = document.createTextNode(this.#PLACE_HOLDER);

    textareaNode.appendChild(textNode);

    shadow.adoptedStyleSheets = [ ...shadow.adoptedStyleSheets, textareaSheet ]
    shadow.appendChild(textareaNode);
    shadow.appendChild(resultNode);

    const nodes = this.#getRoundNode(this.#PLACE_HOLDER);
    this.#changeNodeText(resultNode, nodes);
  }

  onChange(event) {
    const text = (event.target.value ?? '');
    const nodes = this.#getRoundNode(text);
    const parentNode = this.shadowRoot.querySelector('div.result');
    this.#changeNodeText(parentNode, nodes);
  }

  #changeNodeText(parentNode, nodes) {
    while (parentNode.firstChild) {
      parentNode.removeChild(parentNode.firstChild);
    }
    
    nodes.forEach(node => parentNode.appendChild(node));
  }

  #getRoundNode(word = '') {
    const reverseWord = word.replace(/(\s*)/g, '').substring(0, this.#MAX_LENGTH).split('').reverse().join('');
    const nodes = [];

    const sentenceList = this.#TEMPLATE.map(line =>
      line
        .map(pos => (pos === 0 || reverseWord[pos - 1] === undefined) ? this.#TAP : reverseWord[pos - 1])
        .join(''));
    sentenceList.forEach(sentence => {
      const textNode = document.createTextNode(sentence);
      const brNode = document.createElement('br');

      nodes.push(textNode);
      nodes.push(brNode);
    });

    return nodes;
  }
}


customElements.define('talk-round', TalkRound);