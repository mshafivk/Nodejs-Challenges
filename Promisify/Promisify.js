function promisify(callbackFunction) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      const callback = (result) => {
        if (result instanceof Error) {
          reject(result);
        } else {
          resolve(result);
        }
      };

      callbackFunction.apply(null, [...args, callback]);
    });
  };
}

/**
Sample implementation
**/

// Example callback-based function
function readFile(path, callback) {
  // Simulating asynchronous file read
  setTimeout(() => {
    const data = "Sample File content";

    callback(data);
  }, 1000);
}

// Using promisify to convert the callback-based function into a promise-based one
const promisifiedReadFile = promisify(readFile);

// Using the promisified function
promisifiedReadFile("path/to/file.txt")
  .then((data) => {
    console.log("File content:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
