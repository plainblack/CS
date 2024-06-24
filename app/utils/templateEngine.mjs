import _ from 'lodash';
import v from 'voca';
import pluralize from 'pluralize';
import nunjucks from 'nunjucks';

nunjucks.configure({ autoescape: false });
nunjucks.configure('views').addFilter('in', val => {
  return val * 300;
});


export const templateEngine = {
    cssColorNames: {
      aliceblue: '#f0f8ff',
      antiquewhite: '#faebd7',
      aqua: '#00ffff',
      aquamarine: '#7fffd4',
      azure: '#f0ffff',
      beige: '#f5f5dc',
      bisque: '#ffe4c4',
      black: '#000000',
      blanchedalmond: '#ffebcd',
      blue: '#0000ff',
      blueviolet: '#8a2be2',
      brown: '#7c4700',
      burlywood: '#deb887',
      cadetblue: '#5f9ea0',
      chartreuse: '#7fff00',
      chocolate: '#d2691e',
      coral: '#ff7f50',
      cornflowerblue: '#6495ed',
      cornsilk: '#fff8dc',
      crimson: '#dc143c',
      cyan: '#00ffff',
      darkbrown: '#362312',
      darkblue: '#00008b',
      darkcyan: '#008b8b',
      darkgoldenrod: '#b8860b',
      darkgray: '#a9a9a9',
      darkgreen: '#006400',
      darkgrey: '#a9a9a9',
      darkkhaki: '#bdb76b',
      darkmagenta: '#8b008b',
      darkolivegreen: '#556b2f',
      darkorange: '#ff8c00',
      darkorchid: '#9932cc',
      darkred: '#8b0000',
      darksalmon: '#e9967a',
      darkseagreen: '#8fbc8f',
      darkslateblue: '#483d8b',
      darkslategray: '#2f4f4f',
      darkslategrey: '#2f4f4f',
      darkturquoise: '#00ced1',
      darkviolet: '#9400d3',
      deeppink: '#ff1493',
      deepskyblue: '#00bfff',
      dimgray: '#696969',
      dimgrey: '#696969',
      dodgerblue: '#1e90ff',
      firebrick: '#b22222',
      floralwhite: '#fffaf0',
      forestgreen: '#228b22',
      fuchsia: '#ff00ff',
      gainsboro: '#dcdcdc',
      ghostwhite: '#f8f8ff',
      goldenrod: '#daa520',
      gold: '#ffd700',
      gray: '#808080',
      green: '#008000',
      greenyellow: '#adff2f',
      grey: '#808080',
      honeydew: '#f0fff0',
      hotpink: '#ff69b4',
      indianred: '#cd5c5c',
      indigo: '#4b0082',
      ivory: '#fffff0',
      khaki: '#f0e68c',
      lavenderblush: '#fff0f5',
      lavender: '#e6e6fa',
      lawngreen: '#7cfc00',
      lemonchiffon: '#fffacd',
      lightblue: '#add8e6',
      lightcoral: '#f08080',
      lightcyan: '#e0ffff',
      lightgoldenrodyellow: '#fafad2',
      lightgray: '#d3d3d3',
      lightgreen: '#90ee90',
      lightgrey: '#d3d3d3',
      lightpink: '#ffb6c1',
      lightsalmon: '#ffa07a',
      lightseagreen: '#20b2aa',
      lightskyblue: '#87cefa',
      lightslategray: '#778899',
      lightslategrey: '#778899',
      lightsteelblue: '#b0c4de',
      lightyellow: '#ffffe0',
      lime: '#00ff00',
      limegreen: '#32cd32',
      linen: '#faf0e6',
      magenta: '#ff00ff',
      maroon: '#800000',
      mediumaquamarine: '#66cdaa',
      mediumblue: '#0000cd',
      mediumorchid: '#ba55d3',
      mediumpurple: '#9370db',
      mediumseagreen: '#3cb371',
      mediumslateblue: '#7b68ee',
      mediumspringgreen: '#00fa9a',
      mediumturquoise: '#48d1cc',
      mediumvioletred: '#c71585',
      midnightblue: '#191970',
      mintcream: '#f5fffa',
      mistyrose: '#ffe4e1',
      moccasin: '#ffe4b5',
      navajowhite: '#ffdead',
      navy: '#000080',
      oldlace: '#fdf5e6',
      olive: '#808000',
      olivedrab: '#6b8e23',
      orange: '#ffa500',
      orangered: '#ff4500',
      orchid: '#da70d6',
      palegoldenrod: '#eee8aa',
      palegreen: '#98fb98',
      paleturquoise: '#afeeee',
      palevioletred: '#db7093',
      papayawhip: '#ffefd5',
      peachpuff: '#ffdab9',
      peru: '#cd853f',
      pink: '#ffc0cb',
      plum: '#dda0dd',
      powderblue: '#b0e0e6',
      purple: '#800080',
      rebeccapurple: '#663399',
      red: '#ff0000',
      rosybrown: '#bc8f8f',
      royalblue: '#4169e1',
      saddlebrown: '#8b4513',
      salmon: '#fa8072',
      sandybrown: '#f4a460',
      seagreen: '#2e8b57',
      seashell: '#fff5ee',
      sienna: '#a0522d',
      silver: '#c0c0c0',
      skyblue: '#87ceeb',
      slateblue: '#6a5acd',
      slategray: '#708090',
      slategrey: '#708090',
      snow: '#fffafa',
      springgreen: '#00ff7f',
      steelblue: '#4682b4',
      tan: '#d2b48c',
      teal: '#008080',
      thistle: '#d8bfd8',
      tomato: '#ff6347',
      turquoise: '#40e0d0',
      violet: '#ee82ee',
      wheat: '#f5deb3',
      white: '#ffffff',
      whitesmoke: '#f5f5f5',
      yellow: '#ffff00',
      yellowgreen: '#9acd32',
    },
    getIdFromName(ctx, name) {
      if (name == '$previous') {
        return '$previous';
      }
      const design = ctx.design || {};
      if (design.groups) {
        for (let group of design.groups) {
          if (group.name == name) {
            return group.id;
          }
        }
      }
      const layers = ctx._layers || [];
      for (let layer of layers) {
        if (layer.name == name) {
          return layer.id;
        }
      }
      throw 'Referenced "' +
        name +
        '" in "' +
        ctx._object.name +
        '" before "' +
        name +
        '" is used.';
    },
    calcCenter(ctx, layerName) {
      const self = this;
      let centerOn = ctx.design;
      if (layerName) {
        let id;
        if (/:/.test(layerName)) {
          id = layerName;
        } else {
          id = templateEngine.getIdFromName(ctx, layerName);
        }
        const bounds = ctx._bounds || {};
        if (id && id in bounds && 'width' in bounds[id]) {
          centerOn = {
            width: bounds[id].width + bounds[id].x * 2,
            height: bounds[id].height + bounds[id].y * 2,
          };
        }
      }
      let x = 0;
      let y = 0;
      if (ctx._type == 'layer') {
        // calculation has to be done here because it involves the template engine
        if (ctx._object.kind == 'note') {
          // do nothing
        } else if (ctx._object.kind == 'polygon') {
          const sides = self.renderString(
            ctx._object.fields.sideCount.userValue.toString(),
            ctx
          );
          const radius = self.renderString(
            ctx._object.fields.radius.userValue.toString(),
            ctx
          );
          let halfWidth = radius;
          let halfHeight = radius;
          if (sides == 6) {
            halfWidth = radius * Math.cos(Math.PI / sides); // apothem
          } else if (sides == 3) {
            let sq3 = Math.sqrt(3);
            let side = sq3 * radius;
            halfWidth = side / 2;
            halfHeight = ((sq3 / 2) * side) / 2;
          }
          x = (centerOn.width - halfWidth * 2) / 2;
          y = (centerOn.height - halfHeight * 2) / 2;
        } else {
          let width = self.renderString(
            ctx._object.fields.width.userValue.toString(),
            ctx
          );
          let height = self.renderString(
            ctx._object.fields.height.userValue.toString(),
            ctx
          );
          if (ctx._object.kind == 'image') {
            let maintainAspectRatio = ctx._object.fields.maintainAspectRatio.userValue.toString();
            if (maintainAspectRatio != 'stretch') {
              let imageUrl = self.renderString(
                ctx._object.fields.image.userValue.toString(),
                ctx
              );
              let regex = /^https?:(.*)/;
              let found = imageUrl.match(regex);
              let key = _.findKey(ctx.images, [
                'url',
                found ? found[1] : imageUrl,
              ]);
              if (key) {
                let image = ctx.images[key];
                if (maintainAspectRatio == 'width') {
                  height = (image.height * width) / image.width;
                } else if (maintainAspectRatio == 'height') {
                  width = (image.width * height) / image.height;
                }
              }
            }
          }
          x = (centerOn.width - width) / 2;
          y = (centerOn.height - height) / 2;
        }
      }
      return [x, y];
    },
    renderString(template, vars) {
      if (template.match(/{/)) {
        return nunjucks.renderString(template, vars);
      }
      return template;
    },
    scratch: {},
    dependencyCount: 0,
    functions: {
      absoluteValue(number) {
        return Math.abs(number);
      },
      ceiling(number) {
        return Math.ceil(number);
      },
      cellBottom(name, excludePadding) {
        const bounds = this.ctx._bounds || {};
        if (bounds[name] && typeof bounds[name].y != 'undefined') {
          let value = bounds[name].y + bounds[name].height;
          if (excludePadding) {
            value += bounds[name].cellPadding;
          }
          return value;
        }
        console.warn('could not get bottom for name: ' + name);
        return null;
      },
      cellHeight(name, excludePadding) {
        const bounds = this.ctx._bounds || {};
        if (bounds[name] && typeof bounds[name].y != 'undefined') {
          let value = bounds[name].height;
          if (excludePadding) {
            value += bounds[name].cellPadding * 2;
          }
          return value;
        }
        console.warn('could not get height for name: ' + name);
        return null;
      },
      cellLeft(name, excludePadding) {
        const bounds = this.ctx._bounds || {};
        if (bounds[name] && typeof bounds[name].x != 'undefined') {
          let value = bounds[name].x;
          if (excludePadding) {
            value -= bounds[name].cellPadding;
          }
          return value;
        }
        console.warn('could not get left for name: ' + name);
        return null;
      },
      cellRight(name, excludePadding) {
        const bounds = this.ctx._bounds || {};
        if (bounds[name] && typeof bounds[name].x != 'undefined') {
          let value = bounds[name].x + bounds[name].width;
          if (excludePadding) {
            value += bounds[name].cellPadding;
          }
          return value;
        }
        console.warn('could not get right for name: ' + name);
        return null;
      },
      cellTop(name, excludePadding) {
        const bounds = this.ctx._bounds || {};
        if (bounds[name] && typeof bounds[name].y != 'undefined') {
          let value = bounds[name].y;
          if (excludePadding) {
            value -= bounds[name].cellPadding;
          }
          return value;
        }
        console.warn('could not get top for name: ' + name);
        return null;
      },
      cellWidth(name, excludePadding) {
        const bounds = this.ctx._bounds || {};
        if (bounds[name] && typeof bounds[name].x != 'undefined') {
          let value = bounds[name].width;
          if (excludePadding) {
            value += bounds[name].cellPadding * 2;
          }
          return value;
        }
        console.warn('could not get width for name: ' + name);
        return null;
      },
      cellValue(name, field) {
        const bounds = this.ctx._bounds || {};
        if (bounds[name] && typeof bounds[name][field] != 'undefined') {
          return bounds[name][field];
        }
        console.warn('could not get ' + field + ' for name: ' + name);
        return null;
      },
      centerMeX(name) {
        let out = templateEngine.calcCenter(this.ctx, name);
        return out[0];
      },
      centerMeY(name) {
        let out = templateEngine.calcCenter(this.ctx, name);
        return out[1];
      },
      cite(name) {
        let vars = null;
        if (this.ctx._object.object_name == 'V2Layer') {
          vars = {
            design: this.ctx.design,
            game: this.ctx.game,
            row: this.ctx.row,
            images: this.ctx.images,
            dataset: this.ctx.dataset,
            _bounds: this.ctx.bounds,
            _layers: this.ctx.layers,
            _type: 'layer',
            _object: this.ctx._object,
            _schema: this.ctx._schema,
            _save: 'saveCalcLayer',
            _solve: { [name]: this.ctx._schema[name] },
          };
        }
        if (this.ctx._object.object_name == 'V2Row') {
          vars = {
            images: this.ctx.images,
            game: this.ctx.game,
            dataset: this.ctx.dataset,
            _type: 'row',
            _object: this.ctx._object,
            _schema: this.ctx._schema,
            _save: 'saveCalcRow',
            _solve: { [name]: this.ctx._schema[name] },
          };
        }
        if (vars) {
          if (this.ctx._object.fields[name].userValue.match(/.*{{.*random\(/g)) {
            return '--ERROR cite() is not compatible with random()--';
          }
          templateEngine.dependencyCount++;
          if (templateEngine.dependencyCount < 100) {
            let processed = templateEngine.process(vars);
            templateEngine.dependencyCount = 0;
            return processed.fields[name].calcValue;
          } else {
            return '--ERROR circular dependency detected--';
          }
        } else {
          return '--ERROR cite() is only valid with dataset and layers--';
        }
      },
      cosine(number) {
        return Math.cos(number);
      },
      currentLayerName() {
        if (this.ctx._object.object_name == 'V2Layer') {
          return this.ctx._object.name;
        }
        console.warn('Layer name not found.');
        return null;
      },
      endsWith(string, end) {
        return string.endsWith(end);
      },
      floor(number) {
        return Math.floor(number);
      },
      format(...args) {
        return v.sprintf(...args);
      },
      get(key) {
        return templateEngine.scratch[key];
      },
      inList() {
        let args = Array.prototype.slice.call(arguments);
        let value = args.shift();
        return args.includes(value);
      },
      inText(string, find) {
        return string.includes(find);
      },
      join() {
        let args = Array.prototype.slice.call(arguments);
        let separator = args.shift();
        return args.join(separator);
      },
      layerBottom(name) {
        const id = templateEngine.getIdFromName(this.ctx, name);
        const bounds = this.ctx._bounds || {};
        if (id && bounds[id] && typeof bounds[id].y != 'undefined') {
          return bounds[id].y + bounds[id].height;
        }
        console.warn('could not get bottom for name: ' + name);
        return null;
      },
      layerHeight(name) {
        const id = templateEngine.getIdFromName(this.ctx, name);
        const bounds = this.ctx._bounds || {};
        if (id && bounds[id] && typeof bounds[id].y != 'undefined') {
          return bounds[id].height;
        }
        console.warn('could not get height for name: ' + name);
        return null;
      },
      layerLeft(name) {
        const id = templateEngine.getIdFromName(this.ctx, name);
        const bounds = this.ctx._bounds || {};
        if (id && bounds[id] && typeof bounds[id].x != 'undefined') {
          return bounds[id].x;
        }
        console.warn('could not get left for name: ' + name);
        return null;
      },
      layerRight(name) {
        const id = templateEngine.getIdFromName(this.ctx, name);
        const bounds = this.ctx._bounds || {};
        if (id && bounds[id] && typeof bounds[id].x != 'undefined') {
          return bounds[id].x + bounds[id].width;
        }
        console.warn('could not get right for name: ' + name);
        return null;
      },
      layerTop(name) {
        const id = templateEngine.getIdFromName(this.ctx, name);
        const bounds = this.ctx._bounds || {};
        if (id && bounds[id] && typeof bounds[id].y != 'undefined') {
          return bounds[id].y;
        }
        console.warn('could not get top for name: ' + name);
        return null;
      },
      layerWidth(name) {
        const id = templateEngine.getIdFromName(this.ctx, name);
        const bounds = this.ctx._bounds || {};
        if (id && bounds[id] && typeof bounds[id].x != 'undefined') {
          return bounds[id].width;
        }
        console.warn('could not get width for name: ' + name);
        return null;
      },
      layerVisible(name) {
        const id = templateEngine.getIdFromName(this.ctx, name);
        const bounds = this.ctx._bounds || {};
        if (id && bounds[id] && typeof bounds[id].visible != 'undefined') {
          return bounds[id].visible;
        }
        console.warn('could not get visible for name: ' + name);
        return null;
      },
      lowerCase(string) {
        return string.toLowerCase();
      },
      length(string) {
        return string.length;
      },
      max(number, max) {
        return number > max ? max : number;
      },
      maxOfAll() {
        return Math.max.apply(null, arguments);
      },
      min(number, min) {
        return number > min ? number : min;
      },
      minOfAll() {
        return Math.min.apply(null, arguments);
      },
      number(string) {
        return Number(string);
      },
      plural(string, count, inclusive) {
        return pluralize(string, count, inclusive);
      },
      pi: Math.PI,
      random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      range(number, min, max) {
        return templateEngine.functions.max(
          templateEngine.functions.min(number, min),
          max
        );
      },
      renderVersion(detail) {
        if (!detail) {
          detail = 7;
        }
        let now = new Date();
        let out = now.getFullYear();
        if (detail > 1) {
          out += '.' + now.getMonth();
        }
        if (detail > 2) {
          out += '.' + now.getDate();
        }
        if (detail > 3) {
          out += '.' + now.getHours();
        }
        if (detail > 4) {
          out += '.' + now.getMinutes();
        }
        if (detail > 5) {
          out += '.' + now.getSeconds();
        }
        return out;
      },
      repeat(string, number) {
        return string.repeat(number);
      },
      replace(string, find, replaceWith) {
        return string.replaceAll(find, replaceWith);
      },
      reverse(string) {
        return string
          .split('')
          .reverse()
          .join('');
      },
      reverseWords(string) {
        return string
          .split(' ')
          .reverse()
          .join(' ');
      },
      round(number) {
        return Math.round(number);
      },
      rows() {
        return this.ctx.enumerations;
      },
      set(key, value) {
        templateEngine.scratch[key] = value;
        return '';
      },
      setGet(key, value) {
        templateEngine.scratch[key] = value;
        return value;
      },
      sine(number) {
        return Math.sin(number);
      },
      split(string, position, delimiter) {
        let list = string.split(delimiter || '-');
        return list[parseInt(position || 0)];
      },
      squareRoot(number) {
        return Math.sqrt(number);
      },
      startsWith(string, start) {
        return string.startsWith(start);
      },
      substring(string, start, length) {
        return string.substring(start, start + length);
      },
      upperCase(string) {
        return string.toUpperCase();
      },
      upperCaseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      upperCaseEachWord(string) {
        const words = string.split(' ');
        for (let i = 0; i < words.length; i++) {
          words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
        return words.join(' ');
      },
    },
    string2hex(string) {
      if (typeof string === 'string') {
        string = this.cssColorNames[string.toLowerCase()] || string;
        if (string[0] === '#') {
          string = string.substr(1);
        }
        if (string.length == 3) {
          let chars = string.split('');
          string =
            chars[0] + chars[0] + chars[1] + chars[1] + chars[2] + chars[2];
        }
        if (string.length != 6 || string.match(/^[g-z]+/i)) {
          string = '!' + string;
        }
      }
      return parseInt(string, 16);
    },
    process(vars) {
      const self = this;
      const object = vars._object;
      const schema = vars._solve || vars._schema;
      vars = {
        ...vars,
        ...self.functions,
      };
      for (let x in schema) {
        if (!(x in object.fields)) {
          console.error(x + ' is missing from ' + object.name);
          continue;
        }
        let property = object.fields[x];
        delete property.error;
        property.hasError = false;
        var template = _.toString(property.userValue);
        try {
          property.calcValue = self.renderString(template, vars);
          if (property.calcValue.match(/--ERROR/g)) {
            throw new Error(property.calcValue.match(/(?<=--ERROR.).*?(?=--)/));
          }
        } catch (err) {
          property.hasError = true;
          let errorMessage = err.message
            .replace('(unknown path)', '')
            .replace('end of file', 'end');
          let changeOrder = (match, p1, p2, p3) => {
            return [p1, p3, p2].join(' ');
          };
          errorMessage = errorMessage.replace(
            /^(.*)(\[Line \d+, Column \d+\])(.*)$/gms,
            changeOrder
          );
          property.error = errorMessage;
        }
        if (!property.hasError) {
          if (
            schema[x].defaultUserValue == '-inherit-' &&
            property.calcValue == '-inherit-'
          ) {
            property.calcValue = null;
          } else if (schema[x].type == 'int') {
            if (property.userValue == '' && property.calcValue == '') {
              property.calcValue = 0;
            }
            property.calcValue = parseInt(property.calcValue);
            if (property.calcValue.toString() == 'NaN') {
              property.hasError = true;
              property.error = property.userValue + ' is not a number';
            }
            if (
              typeof schema[x].max != 'undefined' &&
              property.calcValue > schema[x].max
            ) {
              property.hasError = true;
              property.error =
                property.userValue +
                ' is greater than the maximum allowed value of ' +
                schema[x].max;
              property.calcValue = schema[x].max;
            }
            if (
              typeof schema[x].min != 'undefined' &&
              property.calcValue < schema[x].min
            ) {
              property.hasError = true;
              property.error =
                property.userValue +
                ' is less than the mininum allowed value of ' +
                schema[x].min;
              property.calcValue = schema[x].min;
            }
          } else if (schema[x].type == 'bool') {
            if (typeof property.calcValue == 'string') {
              if (
                property.calcValue == '' ||
                property.calcValue == 'false' ||
                property.calcValue == '0' ||
                property.calcValue == null
              ) {
                property.calcValue = false;
              } else {
                property.calcValue = true;
              }
            } else if (typeof property.calcValue == 'number') {
              if (property.calcValue == 0) {
                property.calcValue = false;
              } else {
                property.calcValue = true;
              }
            }
          } else if (schema[x].type == 'hex') {
            let value = property.calcValue;
            property.calcValue = _.padStart(
              self.string2hex(property.calcValue).toString(16),
              6,
              '0'
            );
            if (
              property.calcValue.length != 6 ||
              property.calcValue == '000NaN'
            ) {
              property.error = value + ' is not a color';
              property.hasError = true;
              property.calcValue = '000000';
            }
          } else if (schema[x].type == 'enum') {
            property.calcValue = _.trim(property.calcValue.toString());
            const possibleValues = schema[x].options.map(a => a.value);
            if (!possibleValues.includes(property.calcValue)) {
              property.error =
                property.calcValue +
                ' is not one of: ' +
                possibleValues.join(', ');
              property.hasError = true;
            }
          } else if (schema[x].type == 'image') {
            property.calcValue = _.trim(property.calcValue.toString());
            if (
              !property.calcValue.match(/^\//) &&
              !property.calcValue.match(/^.\//) &&
              !property.calcValue.match(/^http/) &&
              !property.calcValue.match(/^\/\//) &&
              property.calcValue != ''
            ) {
              property.error = property.calcValue + ' is not an image URL';
              property.hasError = true;
            }
          } else if (schema[x].type == 'str') {
            property.calcValue = property.calcValue.toString();
            property.calcValue = property.calcValue.replace(/&gt;/gm, '>');
            property.calcValue = property.calcValue.replace(/&lt;/gm, '<');
            property.calcValue = property.calcValue.replace(/&amp;/gm, '&');
            property.calcValue = property.calcValue.replace(/&#39;/gm, "'");
            property.calcValue = property.calcValue.replace(/&quot;/gm, '"');
            property.calcValue = property.calcValue.replace(/(\\n)/gm, '\n');
          }
        }
        object.fields[x] = property;
      }
      return object;
    },
  };
  