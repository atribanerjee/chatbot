const renderGoogleSearchResult = (json, searchImage) => {
    var gsResultBox = "";

    if (!searchImage) {
        gsResultBox += '<div class="gs-result-container">';
        for (var i = 0; i < json.items.length; i++) {
            var item = json.items[i];
            // in production code, item.htmlTitle should have the HTML entities escaped.
            gsResultBox += '<div class="gs-result-box">';
            gsResultBox += '<a style="text-decoration: none; color: inherit;" target="_blank" href=' + item.formattedUrl + ">";
            gsResultBox += "<h3>" + item.htmlTitle + "</h3>";
            gsResultBox += item.displayLink;
            gsResultBox += "<br>" + "<p>" + item.htmlSnippet + "</p>";
            gsResultBox += "</a>";
            gsResultBox += "</div>";
        }
        gsResultBox += "<br/>" + "<br/>";
        gsResultBox += "</div>";
    } else {
        gsResultBox += '<div class="gs-image-container">';
        for (var i = 0; i < json.items.length; i++) {
            var item = json.items[i];
            // in production code, item.htmlTitle should have the HTML entities escaped.
            gsResultBox += '<div class="gs-image-box">';
            gsResultBox += '<a style="text-decoration: none; color: inherit;" target="_blank" href=' + item.image.contextLink + ">";
            gsResultBox += '<img class="gs-image" src=' + item.link + ' style="width:100% !important;height:auto !importnat;">';
            // gsResultBox += "<b>" + item.htmlTitle + "</b>";
            // gsResultBox += item.displayLink;
            gsResultBox += "<br>" + '<p class="gs-image-text">' + item.displayLink + "</p>";
            gsResultBox += "</a>";
            gsResultBox += "</div>";
        }
        
        gsResultBox += "</div>";
        gsResultBox += "<br/>" + "<br/>";
    }
    var container = document.getElementById("gs-container");
    container.innerHTML =  gsResultBox;
  }

  const postToGoogle = (newMessage, searchImage) => {
    // var currentURL = window.location.protocol + '//' + window.location.host + window.location.pathname;
    // window.location.assign(currentURL + '?q=' + newMessage);

    var words = newMessage.split(" ");
    const API_key = 'AIzaSyCbFSWl19Os-yEiAVDDVCsjRhx3upg03Tw';
    const cx = '733234c43a3ba69a0';
    var url = 'https://www.googleapis.com/customsearch/v1?key=' + API_key + '&cx=' + cx + '&q='
    for (var word of words) {
      url += word + '+';
    }
    url = url.slice(0, -1);

    if (searchImage) url += "&searchType=image";

    console.log(url);

    fetch(url)
    .then(response => response.json()).then(json => {
      // json.items has the results 
      console.log(json.items);
      renderGoogleSearchResult(json, searchImage);
      }).catch(console.error)
  }
  export {renderGoogleSearchResult, postToGoogle}