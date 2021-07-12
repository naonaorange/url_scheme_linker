var parameter;

chrome.windows.onCreated.addListener(async() => {
  parameter = load();
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab)  =>{
  if (changeInfo.status != "complete"){
    return;
  }else{
    console.log('Complete Event');
  }

  if ((parameter == undefined) || (parameter == null)){
    console.log('ERROR: parameter is null');
    load();
    //return;
  }
  if (Array.isArray(parameter) == false){
    console.log(`ERROR: parameter is not array  ${parameter}`);
    return;
  }
  if (parameter.length == 0){
    console.log(`ERROR: parameter length is 0  ${parameter}`);
    return;
  }
  if ((parameter[0].urlscheme == undefined) || (parameter[0].urlscheme == "")){
    console.log(`ERROR: parameter[0].urlscheme is illegal  ${parameter[0].urlscheme}`);
    return;
  }
  if ((parameter[0].url == undefined) || (parameter[0].url == "")){
    console.log(`ERROR: parameter[0].url is illegal  ${parameter[0].url}`);
    return;
  }

  try{
    for (const param of parameter){
      if ((param.urlscheme == undefined) || (param.urlscheme == "")) return;
      if ((param.url == undefined) || (param.url == "")) return;

      var p = JSON.parse(JSON.stringify(param));
      const url = p.url.replace(/\//g, '\\\/');
      if(RegExp(`^${url}`).test(tab.url)){
        const addr = `${param.urlscheme}${tab.url}`
        console.log(`Open URL: ${addr}`);
        chrome.tabs.remove(tab.id)
        await chrome.tabs.create({url: addr});
      }
    }
  }
  catch(e){
  }
});

const load = () => {
  try{
    chrome.storage.local.get(['urlscheme0', 'urlscheme1', 'urlscheme2', 'url0', 'url1', 'url2'], (value) => {
      parameter = [
        { urlscheme: value.urlscheme0, url: value.url0},
        { urlscheme: value.urlscheme1, url: value.url1},
        { urlscheme: value.urlscheme2, url: value.url2}
      ];
      console.log(`Parameter: ${parameter}`);

    });
  }
  catch(e){
    console.log(`ERROR: Can't load parameter: ${parameter}`);
  }
}