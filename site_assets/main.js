const messageDiv = document.getElementById('response-message');
fetch('./config.json')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    if (data.api_url) {
      fetch(data.api_url + 'hello')
        .then((response) => {
          return response.json();
        })
        .catch((error) => {
          console.error('Error:', error);
          // this is a little hack to deal with potential URL differences in the output when running locally
          const fixed = data.api_url.split('.').toSpliced(2, 1).join('.');
          console.log('fixed the local url:', fixed + 'hello');
          fetch(fixed + 'hello', {
            method: 'GET',
            mode: 'cors',
            headers: {},
          })
            .then(async (response) => {
              const res = await response.json();
              console.log('Success:', res);
              if (res.message) {
                messageDiv.innerHTML = `<p>A response was received from the API at ${fixed}</p>
                <p>The message is: ${res.message}</p>`;
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        });
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
