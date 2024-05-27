<template>
  <VariableDropdown :variables="variables" label="func()" :sort="true" :wrap="true"></VariableDropdown>
</template>
  
<script setup>
const variables = [
        {
          label: 'absoluteValue(<i class="text-primary">num</i>)',
          value: 'absoluteValue(-30)',
        },
        {
          label: 'ceiling(<i class="text-primary">num</i>)',
          value: 'ceiling(25.19)',
        },
        {
          label: 'centerMeX(<i class="text-red-500">name</i>)',
          value: 'centerMeX()',
        },
        {
          label: 'centerMeY(<i class="text-red-500">name</i>)',
          value: 'centerMeY()',
        },
        {
          label: 'cite(<i class="text-primary">name</i>)',
          value: 'cite()',
        },
        {
          label: 'cosine(<i class="text-primary">rad</i>)',
          value: 'cosine(pi)',
        },
        {
          label: 'currentLayerName()',
          value: 'currentLayerName()',
        },
        {
          label:
            'endsWith(<i class="text-primary">end</i>, <i class="text-primary">str</i>)',
          value: "endsWith('Saturday', 'day')",
        },
        {
          label: 'floor(<i class="text-primary">num</i>)',
          value: 'floor(25.19)',
        },
        {
          label:
            'format(<i class="text-primary">format string</i>, <i class="text-primary">variable</i>, <i class="text-primary">variable</i>, <i class="text-primary">variable</i>)',
          value: 'format("%s has %d points", "Fighter", "12")',
        },
        {
          label: 'get(<i class="text-primary">key</i>)',
          value: "get('foo')",
        },
        {
          label:
            'inList(<i class="text-primary">str</i>, <i class="text-primary">option</i>, <i class="text-red-500">option</i>, <i class="text-red-500">option</i>)',
          value: "inList('red', 'blue','green','red')",
        },
        {
          label:
            'inText(<i class="text-primary">str</i>, <i class="text-primary">find</i>)',
          value: "inText('defacto', 'fact')",
        },
        {
          label: 'layerBottom(<i class="text-primary">name</i>)',
          value: "layerBottom('name goes here')",
        },
        {
          label: 'layerHeight(<i class="text-primary">name</i>)',
          value: "layerHeight('name goes here')",
        },
        {
          label: 'layerLeft(<i class="text-primary">name</i>)',
          value: "layerLeft('name goes here')",
        },
        {
          label: 'layerRight(<i class="text-primary">name</i>)',
          value: "layerRight('name goes here')",
        },
        {
          label: 'layerTop(<i class="text-primary">name</i>)',
          value: "layerTop('name goes here')",
        },
        {
          label: 'layerWidth(<i class="text-primary">name</i>)',
          value: "layerWidth('name goes here')",
        },
        {
          label: 'length(<i class="text-primary">str</i>)',
          value: "length('foo')",
        },
        {
          label: 'lowerCase(<i class="text-primary">str</i>)',
          value: "lowerCase('Foo')",
        },
        {
          label:
            'max(<i class="text-primary">num</i>, <i class="text-primary">max</i>)',
          value: 'max(1,5)',
        },
        {
          label:
            'maxOfAll(<i class="text-primary">num</i>, <i class="text-red-500">num</i>, <i class="text-red-500">num</i>)',
          value: 'maxOfAll(1,2,3)',
        },
        {
          label:
            'min(<i class="text-primary">num</i>, <i class="text-primary">min</i>)',
          value: 'min(40,5)',
        },
        {
          label:
            'minOfAll(<i class="text-primary">num</i>, <i class="text-red-500">num</i>, <i class="text-red-500">num</i>)',
          value: 'minOfAll(1,2,3)',
        },
        {
          label: 'number(<i class="text-primary">string</i>)',
          value: "number('1')",
        },
        { label: 'pi', value: 'pi' },
        {
          label:
            'plural(<i class="text-primary">str</i>, <i class="text-red-500">count</i>, <i class="text-red-500">include</i> )',
          value: "plural('test', 5, true)",
        },
        {
          label:
            'random(<i class="text-primary">min</i>, <i class="text-primary">max</i>)',
          value: 'random(2,12)',
        },
        {
          label:
            'range(<i class="text-primary">num</i>, <i class="text-primary">min</i>, <i class="text-primary">max</i>)',
          value: 'range(3, 1, 5)',
        },
        {
          label: 'renderVersion(<i class="text-red-500">detail</i>)',
          value: 'renderVersion(3)',
        },
        {
          label:
            'repeat(<i class="text-primary">str</i>, <i class="text-primary">num</i>)',
          value: "repeat('foo', 3)",
        },
        {
          label:
            'replace(<i class="text-primary">str</i>, <i class="text-primary">find</i>, <i class="text-primary">replacement</i>)',
          value: "replace('LEET', 'E', '3')",
        },
        {
          label: 'reverse(<i class="text-primary">str</i>)',
          value: "reverse('foo')",
        },
        {
          label: 'reverseWords(<i class="text-primary">str</i>)',
          value: "reverseWords('this is foo')",
        },
        {
          label: 'round(<i class="text-primary">num</i>)',
          value: 'round(3.14)',
        },
        {
          label: 'rows()',
          value: 'rows()',
        },
        {
          label:
            'set(<i class="text-primary">key</i>, <i class="text-primary">value</i>)',
          value: "set('foo','bar')",
        },
        {
          label:
            'setGet(<i class="text-primary">key</i>, <i class="text-primary">value</i>)',
          value: "setGet('foo','bar')",
        },
        { label: 'sine(<i class="text-primary">rad</i>)', value: 'sine(pi)' },
        {
          label:
            'split(<i class="text-primary">str</i>, <i class="text-red-500">position</i>, <i class="text-red-500">delimiter</i> )',
          value: "split('red-green-blue', 1)",
        },
        {
          label: 'squareRoot(<i class="text-primary">num</i>)',
          value: 'squareRoot(2)',
        },
        {
          label:
            'startsWith(<i class="text-primary">str</i>, <i class="text-primary">start</i>)',
          value: "startsWith('Saturday', 'Sat')",
        },
        {
          label:
            'substring(<i class="text-primary">str</i>, <i class="text-primary">start</i>, <i class="text-red-500">length</i>)',
          value: "substring('appendix',2,3)",
        },
        {
          label: 'upperCase(<i class="text-primary">str</i>)',
          value: "upperCase('foo')",
        },
        {
          label: 'upperCaseEachWord(<i class="text-primary">str</i>)',
          value: "upperCaseEachWord('this is foo')",
        },
        {
          label: 'upperCaseFirstLetter(<i class="text-primary">str</i>)',
          value: "upperCaseFirstLetter('foo')",
        },
]
</script>
