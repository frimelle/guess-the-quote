var content = ( function() {
  var c = {};

  var inventaireData;
  var correctBook;
  var quote;

  function getRandomTitleFromSitelinks( sitelinks ) {
    var keys = Object.keys( sitelinks );
    correctBook = keys[ Math.floor( keys.length * Math.random() ) ];
    return sitelinks[ correctBook ];
  }

  function getEnwikiTitle( data ) {
    var sitelinks = new Array();
    var quote;

    $.each( data, function(key, value) {
      if ( value.sitelinks.enwikiquote ) {
        sitelinks[key] = value.sitelinks.enwikiquote.title;
      }
    });
    return getRandomTitleFromSitelinks( sitelinks );
  }

  function parsePage( text ) {

  }

  function getRandomQuote( text ) {

  }

  function setQuote( title ) {
    var url = "https://en.wikiquote.org/w/api.php?action=parse&prop=text&page=" + title + "&format=json&disabletoc=true";
    $.ajax({
      dataType: "jsonp",
      url: url,
    }).done(function ( data ) {
      getRandomQuote( data.parse.text['*'] );
    });
  }

  function showQuote( books ) {
    var title;
    var url;
    if( books.length < 1 || books == undefined ) {
      return null;
    }

    url = "https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks&ids=" + books.join( '|' );
    $.ajax({
      dataType: "jsonp",
      url: url,
    }).done(function ( data ) {
      title = getEnwikiTitle( data.entities );
      if ( title ) {
        setQuote( title );
      }
    });
    //$( ".quote" ).append( "<p>" quote "</p>" );
  }

  c.init = function() {
    //the inventaire.io api call would go here
    $.getJSON( "./data/inventaire.json", function( data ) {
			inventaireData = data;
		});
  }

c.getBooks = function() {
  var entityId;
  var entityIds = new Array();
  var books = new Array();
  var quote;

  $( ".books" ).append( "<p>This are the books:</p>" );
  //inventaire api call would go here also:
  // @todo: eigene method!
  $.each( inventaireData, function( index, value ) {
    entityId = value.entity;
    books[ entityId ] = [ value.title, value.pictures ];
    if ( entityId.substring( 0, 2 ) === "wd" ) {
      entityIds.push( entityId.substring( 3 ) );
    }
  });
  showQuote( entityIds );
  //showBooks( books );
}




  return c;
}());
