export default (promises, fn) => new Promise(resolve => {
  const queue = [];
  let i = 0;

  promises.map(promise => promise.then(data => {
    const f = () => fn(data).then(() => {
      queue.shift();
      i++;

      if (i === promises.length) {
        resolve('YO');
      } else if (queue.length > 0) {
        queue.shift()();
      }
    });

    if (queue.length === 0) {
      queue.push(1);
      f();
    } else {
      queue.push(f);
    }
  }));
});
