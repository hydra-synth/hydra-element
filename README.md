# 🍬 \<hydra-element>

A custom element for wrapping the [hydra-synth](https://github.com/hydra-synth/hydra-synth) engine.

## Rationale

[Hydra](https://hydra.ojack.xyz/) is a set of tools for livecoding networked visuals developed by [Olivia Jack](https://ojack.xyz/). It stands out for its elegant DSL, modeled on a fluent interface.

This project aims to simplify the render of hydra sketches in html documents embedding [hydra-synth](https://github.com/hydra-synth/hydra-synth) (hydra's video synthesizer and shader compiler) in a [custom element](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).

## Installation

This package is published in the [npm](https://www.npmjs.com/) registry as `hydra-element`. You can load it via CDN (the easiest way) or install it with a package manager.

### CDN

Load the custom element via CDN adding the following script to your html file.

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/hydra-element"></script>
```

### Package

Install the package from [npm](https://docs.npmjs.com/cli/commands/npm) with the following command.

```sh
npm install hydra-element
```

Once you’ve done that, import the custom element in your javascript module.

```js
import "hydra-element"
```

## Usage

Include your code between the element tags.

```html
<hydra-element>
  s0.initImage("https://upload.wikimedia.org/wikipedia/commons/2/25/Hydra-Foto.jpg")

  osc(30,0.01,1)
    .mult(osc(() => (100 * Math.sin(time * 0.1)),-0.1,1).modulate(noise(3,1)).rotate(0.7))
    .blend(src(s0))
    .posterize([3,10,2].fast(0.5).smooth(1))
    .modulateRotate(o0, () => mouse.x * 0.003)
    .out()
</hydra-element>
```

Note you can load scripts as in the hydra editor.

```html
<hydra-element>
  await loadScript('https://cdn.jsdelivr.net/npm/hydra-midi@latest/dist/index.js')
  
  await midi.start({ input: '*', channel: '*' }).show()
</hydra-element>
```

If you need to update the code, use the `code` property with javascript.

```js
document.querySelector('hydra-element').code = 'osc().out()'
```

Finally, use css to style the element.

```css
hydra-element {
  width: 15rem;
  height: 15rem;
  color: white;
}
```

## Configuration

You can use the following attributes and properties to configure the embeded engine. Read the `hydra-synth` [API](https://github.com/hydra-synth/hydra-synth#api) documentation for more information about these options.

### Attributes `width` and `height`

In addition to the engine, the custom element also takes care of the canvas. By default it creates one the size of the window, which is useful for many cases. If this is not yours, you can use the `width` and `height` attributes to modify the canvas size. 

```html
<hydra-element width="250" height="250"></hydra-element>
```

### Property `canvas`

If you prefer to take care of the canvas yourself, use the `canvas` property to specify a canvas element to render to. In this case the component does not create any canvas but uses the assigned one.

```js
document.querySelector('hydra-element').canvas = yourCanvasElement
```

### Attribute `loop`

If you want to use your own render loop for triggering hydra updates, set the `loop` attribute to `false`.

```html
<hydra-element loop="false"></hydra-element>
```

Note you will need to call the `tick` method, where `dt` is the time elapsed in milliseconds since the last update.

```js
document.querySelector('hydra-element').tick(dt)
```

### Attribute `global`

The embed engine runs in global scope by default. If you want to safely use several elements on the same page, you should set the `global` attribute to `false` for the engine to run in function scope. In this scope all hydra functions, buffers, and variables are available via the `synth` object (e.g. `synth.osc()`). Consider destructuring the object to preserve the syntax.

```html
<hydra-element global="false">
  const { noise, o0, mouse } = synth
  
  noise()
    .modulateRotate(o0, () => mouse.x * 0.003)
    .out(o0)
</hydra-element>
```

> **Warning**
> Running the engine in function scope is experimental and may lead to unexpected behavior. For now use global mode whenever possible.

### Attribute `audio`

Hydra's audio capabilities are disabled by default because they require requesting microphone permissions from the page visitor and not all sketches use them, so don't forget to set the `audio` attribute to `true` if you use the `a` object in your sketch.


```html
<hydra-element audio="true">
  a.show()

  osc(10, 0, () => a.fft[0]*4).out()
</hydra-element>
```

### Attribute `sources`

You can use the `sources` attribute to set the number of source buffers available for multimedia resources. The default value is `4`.

```html
<hydra-element sources="8">
  s0.initCam()
  s1.initScreen()
  s6.initImage('https://upload.wikimedia.org/wikipedia/commons/2/25/Hydra-Foto.jpg')
  s7.initVideo('https://media.giphy.com/media/AS9LIFttYzkc0/giphy.mp4')

  src(s0)
    .blend(src(s1))
    .blend(src(s6))
    .blend(src(s7))
    .out()
</hydra-element>
```

### Attribute `outputs`

You can use the `outputs` attribute to set the number of output buffers to use. The default value is `4`.

```html
<hydra-element outputs="8">
  osc().out(o7)

  render(o7)
</hydra-element>
```

> **Warning**
> Note that `hydra-synth` itself has only been tested with `4` outputs, so use this attribute with caution.

### Attribute `precision`

You can use the `precision` attribute to force precision of shaders. By default no precision is specified, so the engine will use `highp` for iOS and `mediump` for everything else. Avaiblable options are `highp`, `mediump` and `lowp`.

```html
<hydra-element precision="highp"></hydra-element>
```

### Property `transforms`

You can add custom glsl functions setting the `transforms` property with javascript.

```js
document.querySelector('hydra-element').transforms = [{
  name: 'yourNoise',
  type: 'src',
  inputs: [
    { type: 'float', name: 'scale', default: 5 },
    { type: 'float', name: 'offset', default: 0.5 }
  ],
  glsl: `return vec4(vec3(_noise(vec3(_st*scale, offset*time))), 0.5);`
}]
```

Once done, you can use the new functions in your sketch.

```html
<hydra-element>yourNoise().out()</hydra-element>
```

### Property `pb`

If you have access to an instance of `rtc-patch-bay` for streaming, you can assign it to the `pb` property with javascript.

```js
document.querySelector('hydra-element').pb = yourRtcPatchBayInstance
```

## Limitations

Currently it is not possible to work with [p5.js](https://p5js.org) as in the hydra editor because `hydra-synth` does not include the necessary wrapper. However, you can load it from a CDN with `loadScript` and use it as follows.

```html
<hydra-element>
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.8.0/p5.min.js')

  s0.init({src: new p5(( sketch ) => {

    let x = 100;
    let y = 100;

    sketch.setup = () => {
      sketch.createCanvas(200, 200);
    };

    sketch.draw = () => {
      sketch.background(0);
      sketch.fill(255);
      sketch.rect(x,y,50,50);
    };

  }).canvas})

  src(s0).repeat().out()
</hydra-element>
```

## Development

This project uses [Vite](https://vitejs.dev/) for development and [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/) for testing. The following `npm` scripts are available:

- `dev`: serves `index.html` for _development_ (reloading on file changes)
- `test`: runs the test suites in a headless chrome
- `build`: bundles the custom element for _distribution_ (in the `dist` directory)

## Credits

- [Naoto Hieda](https://naotohieda.com/) for [forking](https://github.com/hydra-synth/hydra-element) and improving the usability of the custom element 🪄
- [Olivia Jack]() for creating such a fun tool as hydra 🌈
- The hydra community for turning the tool into something even more fun 🧩

## License

Distributed under the GNU Affero General Public License.
