//@ts-check
import HydraSynth from 'hydra-synth';

/**
 * Custom element with a global instance of `hydra-synth` embedded.
 */
export class HydraElement extends HTMLElement {
  static get observedAttributes() {
    return [
      'width',
      'height',
      'audio',
      'sources',
      'outputs',
      'precision',
    ];
  }

  constructor() {
    super();
    /**
     * Width of the canvas element to render to
     * @attr
     * @type {number}
     */
    this.width = window.innerWidth;
    /**
     * Height of the canvas element to render to
     * @attr
     * @type {number}
     */
    this.height = window.innerHeight;
    /**
     * Autodetect audio (ask for microphone)
     * @attr
     * @type {Boolean}
     */
    this.audio = false;
    /**
     * Number of source buffers to use
     * @attr
     * @type {number}
     */
    this.sources = 4;
    /**
     * Number of output buffers to use
     * @attr
     * @type {number}
     */
    this.outputs = 4;
    /**
     * Precision of the shaders
     * @attr
     * @type {"highp" | "mediump" | "lowp"}
     */
    this.precision = 'highp';
    this.attachShadow({ mode: 'open' });
    this.initCanvas();
    this.initOptions();
  }

  connectedCallback() {
    this.shadowRoot.appendChild(this.canvas);
    this.initHydraSynth({});
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'width':
        this.canvas.width = parseInt(newValue);
        break;
      case 'height': 
        this.canvas.height = parseInt(newValue);
        break;
      case 'audio':
        this.options = {...this.options, detectAudio: JSON.parse(newValue) };
        break;
      case 'sources': 
      this.options = {...this.options, numSources: parseInt(newValue) };
        break;
      case 'outputs':
        this.options = {...this.options, numOutputs: parseInt(newValue) };
        break;
      case 'precision':
        this.options = {...this.options, precision: newValue };
        break; 
    }
  }

  /**
   * Initialize the default `hydra-synth` options.
   */
  initOptions() {
    this.options = {
      detectAudio: this.audio,
      numSources: this.sources,
      numOutputs: this.outputs,
      precision: this.precision,
    };
  }

  /**
   * Initialize the canvas element to render to.
   */
  initCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    this.canvas = canvas;
  }

  /**
   * Initialize the `hydra-synth` engine with the passed options.
   * @param {*} options Partial of the `hydra-synth` options
   */
   initHydraSynth(options) {
    if (!this.hydra) {
      if (options) {
        this.options = {
          ...this.options,
          ...options,
        };
      }
      this.hydra = new HydraSynth({
        canvas: this.canvas,
        ...this.options,
      });
      this.hydra.eval(this.innerHTML);
    }
  }
}
