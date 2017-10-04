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

### sample.html

    <script>

    function logID(button){
      var id = button.dataset.id
      var detail = button.dataset.something
      console.log("Clicked button for image: "+id)

      var URL = "http://localhost:4500/write?id="+id+"&other="+detail;

      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", URL, true );
      xmlHttp.send( null );

     return xmlHttp.responseText;

    }
    </script>

    <button class="button" data-id="123" data-something="fromtweet1" onClick="logID(this)">BUTTON 1</button>
