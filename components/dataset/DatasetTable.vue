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
            :contextMenu="contextMenuSettings"
            :filters="true"
            :search="{ searchResultClass: 'searchmatch' }"
            id="datasettable"
            >
        </hot-table>
    </client-only>
    <Sidebar v-model:visible="sidebarVisible" header="Right Sidebar" position="right" role="region" :modal="false">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </Sidebar>
</template>

<script setup>
  import { HotTable } from '@handsontable/vue3';
  import { registerAllModules } from 'handsontable/registry';
  import 'handsontable/dist/handsontable.full.css';
  import Handsontable from 'handsontable';
  import {range} from '#ving/utils/range.mjs';

  registerAllModules();
  const notify = useNotify();

  const sidebarVisible = ref(false);

  const props = defineProps({
      rows: Object,
      dataset: Object,
  });

  const columnHeaders = computed(() => {
    let out = ['', 'quantity', 'name'];
    for (let field of props.dataset.props.rowFieldOrder || []) {
      out.push(field);
    }
    return out;
  });

  const columnWidths = computed(() => {
      let columns = [62, 80, 120];
      let sizes = {
        int: 90,
        hex: 110,
        str: 300,
        image: 200,
        bool: 80,
      };
      for (let field of props.dataset.props.rowFieldOrder || []) {
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
      if (!(field in props.dataset.props.rowSchema)) {
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
    if (changes == null)
      return;
    suspendHotRender();
    const hotInstance = hotWrapper.value.hotInstance;
    let rowPos = null;
    let tableRow = null;
    let row = null;
    for (let change of changes) {
      if (rowPos != change[0]) {
        saveRow(row);
        rowPos = change[0];

        tableRow = hotInstance.getSourceDataAtRow(
          hotInstance.toPhysicalRow(rowPos)
        );
        row = props.rows.find(tableRow.props.id);
      }
      let field = dropProps(change[1]);
      if (field == 'name') {
        validateName(row, change[2]);
      } else if (field == 'quantity') {
        // do nothing
      } else if (field == 'id') {
        // do nothing
      } else {
        field = getFieldName(field);
        row.props = versionFieldHistory(row.props, [field]);
      }
    }
    saveRow(row);
    resumeHotRender();
  }
  
  const dropProps = (path) =>  path.replace(/^props\.(.*)/, '$1');
  const getFieldName = (path) =>  path.replace(/fields\.(.*)\.userValue/, '$1');

  const validateName = (row, was) => {
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
      row.props.name = was;
    }
  }

  const saveRow = (row) => {
    if (row) {
      row.props = recalcRow(props.dataset.props.rowSchema, row.props);
      row.update();
    }
  }

    const rowControlsRenderer = (instance, td, rowIndex) => {
        // implement this later
      let self = this;
      Handsontable.dom.empty(td);
      let deleteButton = document.createElement('button');
      deleteButton.classList.add('p-button', 'p-button-sm', 'p-button-danger', 'p-1');
      deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="vertical-align-middle" width="1rem" height="1rem" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"/></svg>';
      deleteButton.addEventListener('click', async function() {
        await deleteRows([
          instance.getSourceDataAtRow(instance.toPhysicalRow(rowIndex)),
        ]);
      });
      td.appendChild(deleteButton);
      let dupButton = document.createElement('button');
      dupButton.classList.add('p-button', 'b-button-sm', 'p-button-secondary', 'p-1');
      dupButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M6 16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1M9 20h10a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1z"/></svg>';
      dupButton.addEventListener('click', async function() {
        const tableRow = instance.getSourceDataAtRow(
          instance.toPhysicalRow(rowIndex)
        );
        const row = util.findObject(tableRow.id, self.rows);
        let newRow = await self.$store.dispatch('duplicateRow', row);
        self.$store.dispatch('addRowToServer', newRow);
        await props.rows.create(newRow);
      });
      td.appendChild(dupButton);
      return td;
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
      
      for (let field of props.dataset.props.rowFieldOrder || []) {
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
              sidebarVisible.value = true;
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

    const removeColumns = async (fields) => {
      if (
        confirm(
          'Are you sure you want to permanently remove ' +
            fields.join(', ') +
            '?'
        )
      ) {
        suspendHotRender();
        for (let field of fields) {
          const index = findIndex(field, props.dataset.props.rowFieldOrder);
          props.dataset.props.rowFieldOrder.splice(index, 1);
          delete props.dataset.props.rowSchema[field];
          if (props.dataset.props.enumerateOn == field) {
            props.dataset.props.enumerateOn = '';
          }
        }
        await props.dataset.update();
        resumeHotRender();
      }
    }

    const deleteRows = async (rows) => {
      let rowNames = [];
      for (let row of rows) {
        rowNames.push(row.props.name);
      }
      if (
        confirm(
          'Are you sure you wish to delete the row(s) named ' +
            rowNames.join(', ') +
            '?'
        )
      ) {
        exportRows(props.dataset, props.rows);
        for (let row of rows) {
          row.delete({skipConfirm:true});
        }
      }
    }

    const dropDownMenuSettings = ref({
        items: [
          {
            name: '<svg xmlns="http://www.w3.org/2000/svg" class="vertical-align-middle" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"/></svg> Delete Column(s)',
            disabled: disablePropertyColumns,
            async callback(key, selection) {
              let myself = this;
              let columnNames = [];
              for (let colNumber of range(
                selection[0].start.col,
                selection[0].end.col + 1
              ).reverse()) {
                columnNames.push(myself.getColHeader(colNumber));
              }
              await removeColumns(columnNames);
            },
          },
          '---------',
          {
            name: '<svg xmlns="http://www.w3.org/2000/svg" class="vertical-align-middle" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z"/></svg> Change Column Type',
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
            name: '<svg xmlns="http://www.w3.org/2000/svg" class="vertical-align-middle" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m18.988 2.012l3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287l-3-3L8 13z"/><path fill="currentColor" d="M19 19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2z"/></svg> Rename Column',
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
            name: '<svg xmlns="http://www.w3.org/2000/svg" class="vertical-align-middle" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M22 21H2V3h2v16h2v-9h4v9h2V6h4v13h2v-5h4z"/></svg> Stats',
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
              '<svg xmlns="http://www.w3.org/2000/svg" class="vertical-align-middle" width="1em" height="1em" viewBox="0 0 48 48"><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path d="M14 23.9917H42"/><path d="M26 36L14 24L26 12"/><path d="M5 36V12"/></g></svg> Move Column(s) To Far Left',
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
            name: '<svg xmlns="http://www.w3.org/2000/svg" class="vertical-align-middle" width="1em" height="1em" viewBox="0 0 48 48"><path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M31 36L19 24L31 12"/></svg> Move Column(s) Left',
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
            name: '<svg xmlns="http://www.w3.org/2000/svg" class="vertical-align-middle" width="1em" height="1em" viewBox="0 0 48 48"><path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M19 12L31 24L19 36"/></svg> Move Column(s) Right',
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
              '<svg xmlns="http://www.w3.org/2000/svg" class="vertical-align-middle" width="1em" height="1em" viewBox="0 0 48 48"><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path d="M34 24.0083H6"/><path d="M22 12L34 24L22 36"/><path d="M42 12V36"/></g></svg> Move Column(s) To Far Right',
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
            name: '<svg xmlns="http://www.w3.org/2000/svg" class="vertical-align-middle" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M12 6H8V2h4zM3.5 2H7v4H5a2 2 0 0 1-2-2V2.5a.5.5 0 0 1 .5-.5M15 6h-2V2h3.5a.5.5 0 0 1 .5.5V4a2 2 0 0 1-2 2m1.5 12a.5.5 0 0 0 .5-.5V16a2 2 0 0 0-2-2h-2v4zM12 18v-4H8v4zm-5 0H3.5a.5.5 0 0 1-.5-.5V16a2 2 0 0 1 2-2h2zm10.5-7.5a.5.5 0 0 0 0-1h-4.887c-.106.125-.224.24-.342.353l-.143.14l.143.14c.122.119.245.237.353.367zm-15-1h4.887a5 5 0 0 0 .342.353l.143.14l-.143.14a5 5 0 0 0-.353.367H2.5a.5.5 0 0 1 0-1m9.354 2.354a.5.5 0 0 0 0-.708L10.707 10l1.147-1.146a.5.5 0 0 0-.708-.708L10 9.293L8.854 8.146a.5.5 0 1 0-.708.708L9.293 10l-1.147 1.146a.5.5 0 0 0 .708.708L10 10.707l1.146 1.147a.5.5 0 0 0 .708 0"/></svg> Delete Row(s)',
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
          undo: '<svg xmlns="http://www.w3.org/2000/svg" class="vertical-align-middle" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 19v-2h7.1q1.575 0 2.738-1T18 13.5T16.838 11T14.1 10H7.8l2.6 2.6L9 14L4 9l5-5l1.4 1.4L7.8 8h6.3q2.425 0 4.163 1.575T20 13.5t-1.737 3.925T14.1 19z"/></svg> Undo',
          redo: '<svg xmlns="http://www.w3.org/2000/svg" class="vertical-align-middle" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M9.9 19q-2.425 0-4.163-1.575T4 13.5t1.738-3.925T9.9 8h6.3l-2.6-2.6L15 4l5 5l-5 5l-1.4-1.4l2.6-2.6H9.9q-1.575 0-2.738 1T6 13.5T7.163 16T9.9 17H17v2z"/></svg> Redo',
        },
      });
    
</script>