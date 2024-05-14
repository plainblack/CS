<template>
    <client-only>
        <hot-table 
            :data="rows.records"
            :columns="columnFields"
            :colHeaders="columnHeaders"
            :afterViewRender="tableInit"
            :afterChange="tableUpdate"
            :rowHeaders="true" 
            :columnSorting="true"
            :fixedColumnsLeft="3"
            :autoWrapCol="true"
            :autoWrapRow="true"
            :autoRowSize="true"
            height="96vh"
            :manualRowResize="true"
            :viewportRowRenderingOffset="100"
            :manualColumnResize="true"
            :manualColumnMove="true"
            :filters="true"
            :search="{ searchResultClass: 'searchmatch' }"
            id="datasettable"
            licenseKey="467cc-a5a56-132e4-3471d-0fa33"
            ref="hotWrapper">
        </hot-table>
    </client-only>
</template>

<script setup>
  import { HotTable } from '@handsontable/vue3';
  import { registerAllModules } from 'handsontable/registry';
  import 'handsontable/dist/handsontable.full.css';
  import Handsontable from 'handsontable';

  registerAllModules();
  const notify = useNotify();

  const props = defineProps({
      rows: Object,
      dataset: Object,
  });

  const columnHeaders = computed(() => {
    let out = ['', 'quantity', 'name'];
    for (let field of rowFieldOrder.value) {
      out.push(field);
    }
    return out;
  });

  const tableUpdate = (changes) => {
    if (changes != null) {
      const hotInstance = hotWrapper.value.hotInstance;
      for (let change of changes) {
        const tableRow = hotInstance.getSourceDataAtRow(
          hotInstance.toPhysicalRow(change[0])
        );
        const row = props.rows.find(tableRow.props.id);
        let field = change[1];
        if (field == 'props.name') {
          saveName(row, change[2]);
        } else if (field == 'props.quantity') {
          saveProp(row);
        } else if (field == 'props.id') {
          // do nothing
        } else {
          field = getFieldName(field);
          // TODO:
         /* self.$store.dispatch('saveRowFieldHistory', {
            row: row,
            fields: [field],
          });*/
        }
      }
    }
  }
  
  const getFieldName = (path) =>  path.replace(/fields\.(.*)\.userValue/, '$1');

  const saveName = (row, was) => {
    if (row.props.name == '') {
      notify.error('You must give the row a name.');
      return;
    }
    let error = false;
    for (let other of props.rows.records) {
      if (other.props.name == row.props.name && other.props.id != row.props.id) {
        error = true;
      }
    }
    if (error) {
      notify.error('You already have another row named ' + row.props.name + '.');
      console.log(was)
      row.props.name = was;
    } else {
      saveProp(row);
    }
  }

  const saveProp = (row) => {
    row.update();
    // TODO: 
  //   this.$store.dispatch('calcRow', row);
  }

    const rowControlsRenderer = (instance, td, rowIndex) => {
        return td;
        // implement this later
        /*
      let self = this;
      Handsontable.dom.empty(td);
      let deleteButton = document.createElement('button');
      deleteButton.classList.add('btn', 'btn-sm', 'btn-danger', 'p-1');
      deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
      deleteButton.addEventListener('click', function() {
        self.deleteRows([
          instance.getSourceDataAtRow(instance.toPhysicalRow(rowIndex)),
        ]);
      });
      td.appendChild(deleteButton);
      let dupButton = document.createElement('button');
      dupButton.classList.add('btn', 'btn-sm', 'btn-secondary', 'p-1');
      dupButton.innerHTML = '<i class="fas fa-clone"></i>';
      dupButton.addEventListener('click', async function() {
        const tableRow = instance.getSourceDataAtRow(
          instance.toPhysicalRow(rowIndex)
        );
        const row = util.findObject(tableRow.id, self.rows);
        let newRow = await self.$store.dispatch('duplicateRow', row);
        self.$store.dispatch('addRowToServer', newRow);
      });
      td.appendChild(dupButton);
      return td;
      */
    }

    const schema = computed(() => {
        return props.dataset.props?.rowSchema;
    });

    const rowFieldOrder = computed(() => {
        return props.dataset.props?.rowFieldOrder || [];
    });

    /*
    const editField = (id, name) => {
      let current = this.$store.getters.currentRowField;
      current.id = id;
      current.field = name;
      this.$store.commit('setCurrentRowField', current);
      setTimeout(() => {
        // gotta give the commit time to react
        this.$root.$emit('bv::toggle::collapse', 'rowfieldeditor');
      }, 100);
    }
    */

    const columnFields = computed(() => {
      const columns = [
        {
          data: 'props.id',
          type: 'text',
          readOnly: true,
          renderer: rowControlsRenderer,
        },
        { data: 'props.quantity', type: 'numeric' },
        {
          data: 'props.name',
          type: 'text',
          columnSorting: {
            compareFunctionFactory(sortOrder) {
              return (value, nextValue) => {
                if (sortOrder == 'desc') {
                  [nextValue, value] = [value, nextValue];
                }
                return value.localeCompare(nextValue, undefined, {
                  numeric: true,
                  sensitivity: 'base',
                });
              };
            },
          },
        },
      ];
      
      for (let field of rowFieldOrder.value) {
        columns.push({
          data: 'props.fields.' + field + '.userValue',
          type: 'text',
          renderer(instance, td, row) {
            //, , col, prop, value, cellProperties)
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            let rowIndex = instance.toPhysicalRow(row);
            //let fieldType = schema?.value?[field]?.type || 'str'; // get it again to reflect real-time type changes
            let fieldType = 'str';
            td.style.position = 'relative';
            let div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.bottom = 0;
            div.style.right = 0;
            let tableRow = instance.getSourceDataAtRow(rowIndex);
            if (
              tableRow &&
              tableRow.fields &&
              tableRow.fields[field] &&
              tableRow.fields[field].hasError
            ) {
              td.className = 'border border-danger';
            }
            switch (fieldType) {
              case 'image': {
                let image = document.createElement('img');
                image.style.height = '30px';
                image.style.maxWidth = '100px';
                image.style.verticalAlign = 'top';
                if (tableRow && tableRow.fields && tableRow.fields[field]) {
                  image.src = tableRow.fields[field].calcValue;
                }
                image.classList.add('border', 'rounded');
                div.appendChild(image);
                break;
              }
              case 'hex': {
                let color = document.createElement('div');
                color.style.height = '30px';
                color.style.width = '15px';
                color.style.padding = 0;
                color.style.margin = 0;
                color.style.display = 'inline-block';
                color.style.verticalAlign = 'top';
                if (tableRow && tableRow.fields && tableRow.fields[field]) {
                  color.style.backgroundColor =
                    '#' + tableRow.fields[field].calcValue;
                }
                color.classList.add('border', 'rounded');
                div.appendChild(color);
                break;
              }
            }

            let button = document.createElement('button');
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><g fill="currentColor"><circle cx="10" cy="15" r="2"/><circle cx="10" cy="10" r="2"/><circle cx="10" cy="5" r="2"/></g></svg>';
            button.classList.add(
              'p-button',
              'p-button-secondary',
              'p-button-sm',
              'p-0',
            );
            div.addEventListener('click', function() {
            //  self.editField(tableRow.id, field);
            });
            div.appendChild(button);
            td.appendChild(div);
            return td;
          },
        });
      }
      return columns;
    });

    const hotWrapper = useState('hotWrapper', () => null);
    const renderCount = ref(0);
    const tableInit = () => {
      if (renderCount.value < 2) {
        // fixes weird render bug
        hotWrapper.value.hotInstance
          .getPlugin('autoRowSize')
          .recalculateAllRowsHeight();
        renderCount.value++;
      }
    }
</script>