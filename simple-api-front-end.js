$(".sqlite-button").click(function(){
  var id     = this.dataset.id
  var detail = this.dataset.detail || ""

  console.log("Clicked button for image: "+id)

  var user   = $('#username').val().toLowerCase() || "no-user-set"
  var val = Number(this.dataset.val)
  var that = this;

  //If val is 0, save the tweet
  if (val==0){
    $.post("http://localhost:4501/sqlite",
    {
        tweet:  id,
        value:  val,
        user:   user,
        detail: detail,
    },
    function(data, status){
      if (status=="success"){
        //Set the data-val to 0
        $(that).attr("data-val","1"); //setter
        that.classList.add('btn-success')
        that.classList.remove("btn-light")
      }
    }).fail(function(xhr, status, error) {
      console.error(xhr, status, error)
      alert("Yikes! Somthing is wrong, likley the server is not running or reachable (Are you connected to the CU network?).")
    });
    //Else, tweet has been coded, so we remove the tweet and set it back to default
  }else if (val==1){
    $.post("http://localhost:4501/sqlite-remove",
    {
        tweet:  id,
        user:   user,
        detail: detail
    },
    function(data, status){
      if (status=="success"){
        //Set the data-val to 0
        $(that).attr("data-val","0"); //setter
        that.classList.remove("btn-success")
        that.classList.add("btn-light")
      }
    }).fail(function(xhr, status, error) {
      console.error(xhr, status, error)
      alert("Yikes! Somthing is wrong, likley the server is not running or reachable (are you connected to the CU network?).")
    });
  }
});

//Dropdown Example
$(".sqlite-dropdown-with-status").change(function(e){
  var id     = this.dataset.id
  var detail = this.value || ""

  console.log("Changed Dropdown for image: "+id)

  console.log(this.value)

  var user   = $('#username').val().toLowerCase() || "no-user-set"
  var val = Number(this.dataset.val)
  var that = this;

  if (val==0){
    $.post("http://localhost:4501/sqlite",
    {
        tweet:  id,
        value:  val,
        user:   user,
        detail: detail,
    },
    function(data, status){
      if (status=="success"){
        //Set the data-val to 0
        $(that).attr("data-val","1"); //setter
        that.classList.add('btn-success')
        that.classList.remove("btn-light")
      }
    }).fail(function(xhr, status, error) {
      console.error(xhr, status, error)
      alert("Yikes! Somthing is wrong, likley the server is not running or reachable (Are you connected to the CU network?).")
    });
    //Else, tweet has been coded, so we remove the tweet and set it back to default
  }else if (val==1){
    $.post("http://localhost:4501/sqlite-update",
    {
        tweet:  id,
        user:   user,
        detail: detail
    },
    function(data, status){
      if (status=="success"){
        //Set the data-val to 0
        $(that).attr("data-val","0"); //setter
        that.classList.remove("btn-success")
      }
    }).fail(function(xhr, status, error) {
      console.error(xhr, status, error)
      alert("Yikes! Somthing is wrong, likley the server is not running or reachable (are you connected to the CU network?).")
    });
  }
});

//When the page loads, lookup the status of each button and set as 1 or 0 (and class accordingly)
function persistCodes(){
  console.log("Page is loaded, looking up each tweet ID for persistence")

  $(".sqlite-button-with-status").each(function(){
    // console.log(this)
    var that = this;
    var id     = this.dataset.id

    $.post("http://localhost:4501/coded-tweet",
    {
        tweet:  id,
    },
    function(data, status){
      if (status=="success"){
        if(data){
          // console.log("Found tweet")
          // console.log(data)
          if (data.detail==that.dataset.detail){
            $(that).attr("data-val","1"); //setter
            that.classList.remove('btn-light')
            that.classList.add('btn-success')
          }
        }
      }
    }).fail(function(xhr, status, error) {
      console.error(xhr, status, error)
      console.log("tweet not found: WITH ERROR")
    });
  })
}

function persistCodesDropdown(){
  console.log("Looking up dropdowns")

  $(".sqlite-dropdown-with-status").each(function(){
    console.log(this)
    var that = this;
    var id     = this.dataset.id

    $.post("http://localhost:4501/coded-tweet",
    {
        tweet:  id,
    },
    function(data, status){
      if (status=="success"){
        if(data){
          console.log("Found tweet: " + id)
          console.log(data)
          if (data.detail){
            that.childNodes.forEach(function(e){
              console.log(e)
              if(e.value==data.detail){
                e.selected = "selected";
              }
            })
            $(that).attr("data-val","1"); //setter
            that.classList.add('btn-success')
          }
        }
      }
    }).fail(function(xhr, status, error) {
      console.error(xhr, status, error)
      console.log("tweet not found: WITH ERROR")
    });
  })
}

//Page runtime
$(document).ready(function(){
  persistCodes();
  persistCodesDropdown();
})
