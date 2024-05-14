<template>
    <client-only>
        <hot-table 
            :colHeaders="columnHeaders"
            :columns="columnFields"
            :data="rows.records"
            :columnSorting="true"
            :fixedColumnsLeft="3"
            :autoWrapCol="true"
            :autoWrapRow="true"
            :autoRowSize="true"
            height="96vh"
            :viewportRowRenderingOffset="100"
            :manualRowResize="true"
            :manualColumnResize="true"
            :colWidths="columnWidths"
            licenseKey="467cc-a5a56-132e4-3471d-0fa33"
            ref="hotWrapper"
            :afterChange="tableUpdate"
            :afterViewRender="tableInit"
            :afterColumnResize="saveColumnWidth"
            :rowHeaders="true" 
            :manualColumnMove="true"
            :afterColumnMove="saveColumnMove"
            :dropdownMenu="dropDownMenuSettings"
            :filters="true"
            :search="{ searchResultClass: 'searchmatch' }"
            id="datasettable"
            >
        </hot-table>
    </client-only>
</template>

<script setup>
  import { HotTable } from '@handsontable/vue3';
  import { registerAllModules } from 'handsontable/registry';
  import 'handsontable/dist/handsontable.full.css';
  import Handsontable from 'handsontable';
  import {range} from '#ving/utils/range.mjs';

  registerAllModules();
  const notify = useNotify();

  const props = defineProps({
      rows: Object,
      dataset: Object,
  });

  const columnHeaders = computed(() => {
    let out = ['', 'quantity', 'name'];
    for (let field of props.dataset.props.rowFieldOrder) {
      out.push(field);
    }
    return out;
  });

  const columnWidths = computed(() => {
      let columns = [58, 80];
      columns.push(props.dataset.props.rowSchema?.name?.size || 120);
      let sizes = {
        int: 90,
        hex: 110,
        str: 300,
        image: 200,
        bool: 80,
      };
      for (let field of props.dataset.props.rowFieldOrder) {
        columns.push(
          props.dataset.props.rowSchema[field]?.size || sizes[props.dataset.props.rowSchema[field]?.type] || 300
        );
      }
      return columns;
  });

  const saveColumnWidth = async (newSize, columnIndex) => {
      if (columnIndex < 3) {
        return;
      }
      let field = dropProps(getFieldName(columnFields.value[columnIndex].data));
      if (!("field" in props.dataset.props.rowSchema)) {
        props.dataset.props.rowSchema[field] = { size: 120 };
      }
      props.dataset.props.rowSchema[field].size = newSize;
      await props.dataset.save('rowSchema');
  }

  const saveColumnMove = async () => {
      let cols = [];
      for (let col of hotWrapper.value.hotInstance.getColHeader()) {
        if (!['', 'id', 'name', 'quantity'].includes(col)) {
          cols.push(col);
        }
      }
      await props.dataset.save('rowFieldOrder',cols);
  }

  const tableUpdate = (changes) => {
    if (changes != null) {
      const hotInstance = hotWrapper.value.hotInstance;
      for (let change of changes) {
        const tableRow = hotInstance.getSourceDataAtRow(
          hotInstance.toPhysicalRow(change[0])
        );
        const row = props.rows.find(tableRow.props.id);
        let field = dropProps(change[1]);
        if (field == 'name') {
          saveName(row, change[2]);
        } else if (field == 'quantity') {
          saveProp(row);
        } else if (field == 'id') {
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
  
  const dropProps = (path) =>  path.replace(/^props\.(.*)/, '$1');
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
        await deleteRows([
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
      
      for (let field of props.dataset.props.rowFieldOrder) {
        columns.push({
          data: 'props.fields.' + field + '.userValue',
          type: 'text',
          renderer(instance, td, row) {
            //, , col, prop, value, cellProperties)
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            let rowIndex = instance.toPhysicalRow(row);
            let fieldType = props.dataset.props.rowSchema[field]?.type || 'str'; // get it again to reflect real-time type changes
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

    const disablePropertyColumns = () => {
      const instance = hotWrapper.value.hotInstance;
      if (
        ['', 'id', 'name', 'quantity'].includes(
          instance.getColHeader(instance.getSelectedLast()[1])
        )
      ) {
        return true;
      }
      return false;
    }

    const disablePropertyColumnsExceptQuantity = () => {
      const instance = hotWrapper.value.hotInstance;
      if (
        ['', 'id', 'name'].includes(
          instance.getColHeader(instance.getSelectedLast()[1])
        )
      ) {
        return true;
      }
      return false;
    }

    const deleteRows = async (rows) => {
      let rowNames = [];
      for (let row of rows) {
        rowNames.push(row.name);
      }
      if (
        confirm(
          'Are you sure you wish to delete the row(s) named ' +
            rowNames.join(', ') +
            '?'
        )
      ) {
        for (let row of rows) {
          console.log('row to delete', row)
          // TODO
          //self.$store.dispatch('deleteRow', row);
        }
      }
    }

    const dropDownMenuSettings = ref({
        items: [
          {
            name: '<i class="fas fa-trash-alt"></i> Delete Column(s)',
            disabled: disablePropertyColumns,
            callback(key, selection) {
              let myself = this;
              let columnNames = [];
              for (let colNumber of range(
                selection[0].start.col,
                selection[0].end.col + 1
              ).reverse()) {
                columnNames.push(myself.getColHeader(colNumber));
              }
              self.removeColumns(columnNames);
            },
          },
          '---------',
          {
            name: '<i class="fas fa-sliders-h-square"></i> Change Column Type',
            disabled: disablePropertyColumns,
            callback(key, selection) {
              let myself = this;
              let columnNames = [];
              for (let colNumber of range(
                selection[0].start.col,
                selection[0].end.col + 1
              )) {
                columnNames.push(myself.getColHeader(colNumber));
              }
              self.columnsToEdit = columnNames;
              self.$modal.show('datsetcoltype');
            },
          },
          {
            name: '<i class="fas fa-edit"></i> Edit Column Name',
            disabled: disablePropertyColumns,
            callback(key, selection) {
              let myself = this;
              if (selection[0].start.col != selection[0].end.col) {
                wing.error('You must edit the column names one at a time.');
              } else {
                self.columnToEdit = myself.getColHeader(selection[0].start.col);
                self.$modal.show('editcolumnname');
              }
            },
          },
          '---------',
          {
            name: '<i class="fas fa-chart-bar"></i> Stats',
            disabled: disablePropertyColumnsExceptQuantity,
            callback(key, selection) {
              let myself = this;
              let columnNames = [];
              for (let colNumber of range(
                selection[0].start.col,
                selection[0].end.col + 1
              )) {
                columnNames.push(myself.getColHeader(colNumber));
              }
              self.columnsToAnalyize = columnNames;
              self.$modal.show('datasetcolstats');
            },
          },
          '---------',
          {
            name:
              '<i class="fas fa-arrow-to-left"></i> Move Column(s) To Far Left',
            disabled: disablePropertyColumns,
            async callback(key, selection) {
              let myself = this;
              for (let colNumber of range(
                selection[0].start.col,
                selection[0].end.col + 1
              ).reverse()) {
                props.dataset.props.rowFieldOrder = moveToStartOfList(myself.getColHeader(colNumber), props.dataset.props.rowFieldOrder);
                await props.dataset.save('rowFieldOrder');
              }
            },
          },
          {
            name: '<i class="fas fa-chevron-left"></i> Move Column(s) Left',
            disabled: disablePropertyColumns,
            async callback(key, selection) {
              let myself = this;
              for (let colNumber of range(
                selection[0].start.col,
                selection[0].end.col + 1
              ).reverse()) {
                props.dataset.props.rowFieldOrder = moveTowardStartOfList(myself.getColHeader(colNumber), props.dataset.props.rowFieldOrder);
                await props.dataset.save('rowFieldOrder');
              }
            },
          },
          {
            name: '<i class="fas fa-chevron-right"></i> Move Column(s) Right',
            disabled: disablePropertyColumns,
            async callback(key, selection) {
              let myself = this;
              for (let colNumber of range(
                selection[0].start.col,
                selection[0].end.col + 1
              )) {
                props.dataset.props.rowFieldOrder = moveTowardEndOfList(myself.getColHeader(colNumber), props.dataset.props.rowFieldOrder);
                await props.dataset.save('rowFieldOrder');
              }
            },
          },
          {
            name:
              '<i class="fas fa-arrow-to-right"></i> Move Column(s) To Far Right',
            disabled: disablePropertyColumns,
            async callback(key, selection) {
              let myself = this;
              for (let colNumber of range(
                selection[0].start.col,
                selection[0].end.col + 1
              )) {
                props.dataset.props.rowFieldOrder = moveToEndOfList(myself.getColHeader(colNumber), props.dataset.props.rowFieldOrder);
                await props.dataset.save('rowFieldOrder');
              }
            },
          },
          '---------',
          'filter_by_condition',
          'filter_action_bar',
        ],
      });
      
      const contextMenuSettings = ref({
        items: {
          delete_rows: {
            name: 'Delete Row(s)',
            async callback(key, selection) {
              let instance = this;
              let rows = [];
              for (let rowNumber of range(
                selection[0].start.row,
                selection[0].end.row + 1
              )) {
                rows.push(
                  instance.getSourceDataAtRow(instance.toPhysicalRow(rowNumber))
                );
              }
              await deleteRows(rows);
            },
          },
          sp1: '---------',
          undo: 'Undo',
          redo: 'Redo',
        },
      });
    
</script>