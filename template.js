var Template = (function() {
  var errorMessage = function(id) {
    return 'An error occured, template "' + id + '" does not exist';;
  };
  var Template = function(id) {
    var htmlTemplate = errorMessage(id);
    if (typeof id === 'undefined') {
      var asTemplate = [];
      try {
        asTemplate = $('template:first, script[type="text/html-template"]:first, [data-type=template]:first');
      } catch(e) { console.error(e); }
      if (asTemplate.length > 0) {
        htmlTemplate = asTemplate.first().html();
      } 
    } else {
      var jquerySelector = [];
      try { jquerySelector = $(id); } catch(e) { console.error(e); }
      if (jquerySelector.length > 0) {
        htmlTemplate = jquerySelector.first().html();
      } else {
        var asTemplate = [];
        try {
          asTemplate = $('template#' + id + ', script[type="text/html-template"]#' + id + ', [data-type=template]#' + id);
        } catch(e) { console.error(e); }
        if (asTemplate.length > 0) {
          htmlTemplate = asTemplate.first().html();
        }
      }
    }
    return {
      renderWith: function(view, partials) {
        return Mustache.render(htmlTemplate, view, partials);
      }
    };
  };

  if (typeof jQuery !== 'undefined') {
    (function($) {
      $.fn.template = function(template, view, partials) {
        var current = $(this);
        var theTemplate = {
          renderWith: function() {
            return errorMessage(template);
          }
        };
        if (typeof template === 'undefined') {
          theTemplate = Template();
        } else if(typeof template === 'string') {
          theTemplate = Template(template);
        } else {
          theTemplate = template;
        }
        if (typeof view === 'undefined') {
          return {
            renderWith: function(view1, partials1) {
              return current.html(theTemplate.renderWith(view1, partials1));
            }
          };
        } else {
          return current.html(theTemplate.renderWith(view, partials));
        }
      };
    })(jQuery);
  }
  return Template;
})();