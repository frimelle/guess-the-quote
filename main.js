var content = ( function() {
  var c = {};

  var LIMIT_BOOKS = 6;
  var inventaireData;

  function getRandomTitleFromSitelinks( sitelinks ) {
    var keys = Object.keys( sitelinks );
    var correctBook = keys[ Math.floor( keys.length * Math.random() ) ];
    return [ correctBook, sitelinks[ correctBook ] ];
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

  function showBooks( books, correctBook ) {
    var keys = Object.keys( books ),
        correctBook = "wd:" + correctBook,
        book;

    keys.sort( function() { return 0.5 - Math.random() } );
    keys = keys.slice( 0, LIMIT_BOOKS );

    if ( $.inArray( correctBook, keys) == -1 ) {
      keys.pop();
      keys.push( correctBook );
      keys.sort( function() { return 0.5 - Math.random() } );
    }

    for ( i = 0; i <= keys.length; i++ ) {
      if ( !keys[ i ] ) {
        continue;
      }

      var title = books[ keys[ i ] ][ 0 ],
          correctTitle = books[ correctBook ][0],
          image = books[ keys[ i ] ][ 1 ],
          imageHtml;

      if ( image.length > 0 ) {
        imageHtml = $('<img/>', {
          src   : image,
          alt   : 'Bookcover',
          height: '200',
          class: 'img-rounded img-thumbnail',
          id    : title,
          on    : {
            click : function() {
              clickOnBook( this.id, correctTitle );
            }
          }
        });

      } else {
        imageHtml = $('<img/>', {
          src   : 'https://placekitten.com/g/150/200',
          alt   : 'Bookcover',
          height: '200',
          class: 'img-rounded img-thumbnail',
          id    : title,
          on    : {
            click : function() {
              clickOnBook( this.id, correctTitle );
            }
          }
        });
      }

      book = $( '<div class="col-sm-4 book"></div>' );
      var titleHtml = $( '<h3>' + title + '</h3>' );
      $('.books').append( book );
      book.append( titleHtml );
      book.append( imageHtml );
    }
  }

  clickOnBook = function( title, correctTitle ) {
    $('.alert').empty();
    if ( title === correctTitle ) {
      $('.alert').removeClass( 'alert-danger' ).addClass( 'alert-success' );
      $('.alert').append(
        '<Strong> You won! </Strong> It was really ' + title + '! You really guessed that quote! Who would have guessed!?'
      );
      c.emptyPage();
    } else {
        $('.alert').removeClass( 'alert-success' ).addClass( 'alert-danger' );
        $('.alert').append( '<Strong> Wrong answer! </Strong> Just try again!' );
    }
  }

  function showContent( entityIds, books ) {
    var title,
        url;
    if( entityIds.length < 1 || entityIds == undefined ) {
      return null;
    }

    url = "https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks&ids=" + entityIds.join( '|' );
    $.ajax({
      dataType: "jsonp",
      url: url,
    }).done(function ( data ) {
      correctBook = getEnwikiTitle( data.entities )[0];
      title = getEnwikiTitle( data.entities )[1];
      if ( title ) {
        quote = WikiquoteApi.getRandomQuote(
          title,
          function( quote ) {
            $( ".quote" ).append( "<blockquote>" + quote.quote + "</blockquote>" );
            $( ".quote" ).append( '<a href="https://wikidata.org/wiki/' + correctBook + '">The book</a>'  );
          },
          function( msg ) {
            alert( msg );
          }
        );
        showBooks( books, correctBook );
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
  showContent( entityIds, books );
  //showBooks( books );
}

c.emptyPage = function() {
  $( ".quote" ).empty();
  $(".books").empty();
}

  return c;
}());
