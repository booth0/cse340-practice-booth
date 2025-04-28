const failingStep = () => {
    return new Promise((resolve, reject) => {
        reject("Something went wrong!");
    });
};
 
failingStep()
    .then((result) => {
        console.log("This will not run:", result);
    })
    .catch((error) => {
        console.error("Caught an error:", error);
    })
    .finally(() => {
        console.log("Execution finished.");
    });

    // test