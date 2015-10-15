var content = ( function() {
  var c = {};

  var inventaireData;
  var correctBook;

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

  function showBooks( books ) {
    var keys = Object.keys( books );
    keys.sort( function() { return 0.5 - Math.random() } );

    for ( i = 0; i <= 5; i++ ) {
      if ( !keys[ i ] ) {
        continue;
      }

        title = books[ keys[ i ] ][ 0 ];
        image = books[ keys[ i ] ][ 1 ];
        $(".books").append(
          '<div id="book"><h3>' + title + '</h3><img src="' + image + '" alt="no bookcover found" height="200">'
        );
    }
  }

  function showQuote( books ) {
    var title,
        url;
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
        quote = WikiquoteApi.getRandomQuote(
          title,
          function( quote ) {
            $( ".quote" ).append( "<p>" + quote.quote + "</p>" );
            $( ".quote" ).append( '<a href="https://wikidata.org/wiki/' + correctBook + '">The book</a>'  );
          },
          function( msg ) {
            alert( msg );
          }
        );
      }
    });
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
  showBooks( books );
}

c.emptyPage = function() {
  $( ".quote" ).empty();
  $(".books").empty();
}

  return c;
}());
