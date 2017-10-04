# Simple API

Write the value of URL vars in an http request to STDOUT using a very simple node server. 

### Running

    node server.js > output.jsonl


Then any request you issue to port `4500` is written to output.jsonl

Therefore, going to:

    http://localhost:4500/write&id=123

will result in the contents of output.jsonl:

    {"id" : 123}

The subsequent request: `http://localhost:4500/write&id=456` will result in the contents of output.jsonl: 

    {"id" : 123}
    {"id" : 456}

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
