var parameter;

chrome.windows.onCreated.addListener(async() => {
  parameter = load();
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab)  =>{
  if (changeInfo.status != "complete") return;
  if (parameter == undefined) return;

  try{
    for (const param of parameter){
      var p = JSON.parse(JSON.stringify(param));

      if(param.urlscheme == undefined) continue;
      const urlscheme = p.urlscheme.replace(/\//g, '\\\/');
      console.log(`urlscheme: ${urlscheme}`)

      if(RegExp(`^${urlscheme}`).test(tab.url)) return;

      if(param.url == undefined) continue;
      const url = p.url.replace(/\//g, '\\\/');
      //console.log(`url: ${url}`)
      
      if(RegExp(`^${url}`).test(tab.url)){
        const addr = `${param.urlscheme}${tab.url}`
        //console.log(`Open URL: ${addr}`);
        chrome.tabs.getSelected(null, async (tab) => {
          chrome.tabs.remove(tab.id)
        })
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
      console.log(parameter)
    });
  }
  catch(e){
  }
}