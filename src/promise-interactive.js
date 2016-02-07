export default (promises, fn) => new Promise(resolve => {
  let result = Promise.resolve();
  let i = 0;

  const acc = data => {
    result = result.then(() => fn(data).then(() => {
      if (++i === promises.length) {
        resolve();
      }
    }));
  };

  promises.map(promise => promise.then(acc, err => {
    console.log(err);
    if (++i === promises.length) {
      resolve();
    }
  }));
});
