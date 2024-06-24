import { saveAs } from 'file-saver';
import Papa from 'papaparse';

export const exportRows = (dataset) => {
    const columns = ['quantity', 'name'];
    for (const field of dataset.props.rowFieldOrder) {
        columns.push(field);
    }
    let csv = Papa.unparse([columns]);
    for (const row of dataset.props.rows) {
        const csvrow = [row.quantity, row.name];
        for (const field of dataset.props.rowFieldOrder) {
            csvrow.push(row.fields[field].userValue);
        }
        csv += '\r\n' + Papa.unparse([csvrow]);
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, dataset.props.name + '.csv');
};
