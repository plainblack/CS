const findIndex = (id, list) => {
    if (typeof list[0] == 'object') {
      return list.findIndex(obj => {
        return obj.id === id;
      });
    } else {
      return list.indexOf(id);
    }
  }

  export const moveAfterElementInList = (id, list, afterId) => {
    let index = util.findIndex(id, list);
    let value = list[index];
    list.splice(index, 1);
    index = util.findIndex(afterId, list);
    list.splice(index, 0, value);
    return list;
  }

  export const moveToStartOfList = (id, list) => {
    let index = util.findIndex(id, list);
    let value = list[index];
    list.splice(index, 1);
    list.unshift(value);
    return list;
  }

  export const moveToEndOfList = (id, list) => {
    let index = util.findIndex(id, list);
    let value = list[index];
    list.splice(index, 1);
    list.push(value);
    return list;
  }

  export const moveTowardStartOfList = (id, list) => {
    let index = util.findIndex(id, list);
    let value = list[index];
    if (index > 0) {
      list.splice(index, 1);
      list.splice(index - 1, 0, value);
    }
    return list;
  }

  export const moveTowardEndOfList = (id, list) => {
    let index = util.findIndex(id, list);
    let value = list[index];
    if (index + 1 != list.length) {
      list.splice(index, 1);
      list.splice(index + 1, 0, value);
    }
    return list;
  }