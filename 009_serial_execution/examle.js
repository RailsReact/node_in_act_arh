setTimeout(()=>{
  console.log('I execute first.');
  setTimeout(()=>{
    console.log('I execute next.');
    setTimeout(()=>{
      console.log('I execute last.');
    }, 100)
  }, 500)
}, 1000)