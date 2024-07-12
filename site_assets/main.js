// this is where we'll output the results of the API call in later steps
const messageDiv = document.getElementById('response-message');
// the config has the Lambda function URL or the API Gateway URL
fetch('./config.json')
  .then(async (response) => {
    const res = await response.json();
    console.log(res);
    if (res.api_url) {
      loadAPIURL(res.api_url);
    } else if (res.function_url) {
      loadAPIURL(res.function_url);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });

function loadAPIURL(url) {
  console.log(`loading the API URL: ${url}`);
  fetch(url + 'hello')
    .then(async (response) => {
      const res = await response.json();
      console.log('Success:', res);
      if (res.message) {
        returnMessage(url, res.message);
      }
    })
    .catch((error) => {
      // this is a little hack to deal with potential URL differences in the output when running locally
      const fixed = url.split('.').toSpliced(2, 1).join('.');
      console.log('fixed the local url:', fixed + 'hello');
      fetch(fixed + 'hello', {
        method: 'GET',
        mode: 'cors',
        headers: {},
      })
        .then(async (response) => {
          const res = await response.json();
          if (res.message) {
            returnMessage(fixed, res.message);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
}

function returnMessage(url, message) {
  messageDiv.innerHTML = `<p>A response was received from the API at ${url}</p>
          <p>The message is: ${message}</p>`;
}
