export const versionFieldHistory = (object, fields) => {
    for (let field of fields) {
      if (object.fields[field].history[0] != object.fields[field].userValue) {
        object.fields[field].history.unshift(object.fields[field].userValue);
      }
      object.fields[field].history.splice(10, 1000); // only keep the last 10 elements
    }
    return object;
}