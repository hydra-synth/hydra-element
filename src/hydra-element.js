import HydraSynth from 'hydra-synth';

export class HydraElement extends HTMLElement {
  static get observedAttributes() {
    return [
      'width',
      'height',
      'auto',
      'audio',
      'sources',
      'outputs',
      'transforms',
      'precision',
      'pb',
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.initElement();
    this.createCanvas();
    new HydraSynth({
      canvas: this.canvas
    });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(this.canvas);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    
  }

  initElement() {
    this.code = '';
    this.width = 1280;
    this.height = 720;
    this.audio = false;
    this.sources = 4;
    this.outputs = 4;
    this.transforms = [];
    this.pb = null;
  }

  createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    this.canvas = canvas;
  }
}
