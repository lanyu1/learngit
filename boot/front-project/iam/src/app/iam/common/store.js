/**
 * Created by jaywoods on 2017/6/27.
 */

export default function store(name) {
  return function (target) {
    Object.assign(target.prototype, {
      getStoreName: function () {
        return name;
      }
    });
  }
}
