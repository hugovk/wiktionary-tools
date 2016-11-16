function AND_value_validator(value, el, args) {
    var otherValue = $(args[0]).val();
    return !(value && otherValue);
}

function AND_OR_value_validator(value, el, args) {
    var value1 = $(args[0]).val();
    var value2 = $(args[1]).val();
    var value3 = $(args[2]).val();
    return !(value1 && (value2 || value3));
}

jQuery.validator.addMethod(
    'AND_with',
    AND_value_validator,
    jQuery.validator.format('{1}')
);

jQuery.validator.addMethod(
    'AND_OR_with',
    AND_OR_value_validator,
    jQuery.validator.format('{3}')
);

function valueOfName(name) {
  return $("input[name=" + name + "]").val()
}

function preg_quote(str) {
    // http://kevin.vanzonneveld.net
    // +   original by: booeyOH
    // +   improved by: Ates Goral (http://magnetiq.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // *     example 1: preg_quote("$40");
    // *     returns 1: '\$40'
    // *     example 2: preg_quote("*RRRING* Hello?");
    // *     returns 2: '\*RRRING\* Hello\?'
    // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
    // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'

    return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
}

function buildQuote(type) {

  var text = "#* {{" + type;

  error = "";
  if (valueOfName("author").length &&
      (valueOfName("last").length ||
       valueOfName("first").length)) {
    error += "Error: use either author, or last and first, not both.<br>";
  }
  if (valueOfName("date").length &&
      valueOfName("year").length ) {
    error += "Error: use either date, or year, not both.<br>";
  }

  if (error.length || !$('#frm1').valid()) {
    $("#error").html(error);
    $("#quotation").html("");
    return;
  }

  $("form#frm1 :input").each(function() {
    var input = $(this);
    if (input.attr('name') === "term") {
      return true; // go to next one
    }
    if (input.attr('name') === "passage") {
      var term = $("input[name=term]").val().trim();
      if (term.length) {
        var passage = input.val().trim();

        // Add three single quotes each side for bold format
        // Find case-insensitive, but retain case in replacements
        passage = passage.replace(
            new RegExp("(" + preg_quote(term) + ")", "ig"),
             "'''$1'''");

        text += "<br>|";
        text += input.attr('name') + "=";
        text += passage;
        return true; // go to next one
      }
    }
    if (input.val().length) {
      text += "<br>|";
      text += input.attr('name') + "=";
      text += input.val().trim();
    }

  });

  text += "<br>}}"
  $("#error").html("");
  $("#quotation").html(text);

  if ($("input[name=term]").val().length) {
    var url = "https://en.wiktionary.org/wiki/" + $("input[name=term]").val();
    var link = '<a target="wiktionary" href="' + url + '">' + url + '</a>';
    $("#linky").html(link);
  }
}

function copyToClipboard(element) {
  var $temp = $('<textarea>');
  $('body').append($temp);
  $temp.val($(element)[0].innerText).select();
  document.execCommand('copy');
  $temp.remove();
}
