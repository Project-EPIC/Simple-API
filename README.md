# Simple API

Log out the response of a GET request as JSON

### Running

    node server.js > output.txt


Then any request you issue to port `4500` is written to output.txt

Therefore, going to:

http://localhost:4500/write&id=123

will result in the contents of output.txt:

    {"id" : 123}

### Programatically:

    function logID(id){
      var URL = "http://epic-analytics.cs.colorado.edu:4500/write?id="+id;

      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", URL, false );
      xmlHttp.send( null );
      return xmlHttp.responseText;
    }

    button.addEventListener('click',function(e){
      logID(this.id) //Or whatever the ID is
    }
