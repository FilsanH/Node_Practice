// main.js
const update = document.querySelector('#update-button')

update.addEventListener('click', (_) => {
  console.log('here')
  // Send PUT Request here
  //use fetchapi for this
  //fetch(endpoint, options)
  fetch('/quotes', {
    method: 'put',
    headers: {
      'Content-Type': 'application/json', //sending a json file
    },
    body: JSON.stringify({
      name: 'Darth Vadar',
      quote: 'I find your lack of faith disturbing.',
    }),
  })
    .then((res) => {
      if (res.ok) return res.json()
    })
    .then((response) => {
      console.log(response)
    })
    .then((response) => {
      window.location.reload(true)
    })
})
